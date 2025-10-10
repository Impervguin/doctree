// test/utils/test-user-manager.ts
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { EmailClient, EmailClientFactory } from './test-email';

dotenv.config();

export interface TestDBConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export class TestUserManager {
  private db: Client;
  private emailClient: EmailClient;

  constructor() {
    const config: TestDBConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5432),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'app_db',
    };
    this.db = new Client(config);
    this.emailClient = EmailClientFactory.createFromEnv();
  }

  async connect() {
    await this.db.connect();
    await this.emailClient.connect();
  }

  async disconnect() {
    await this.emailClient.disconnect();
    await this.db.end();
  }

  async createUser(username: string, password: string, enable2FA: boolean = false): Promise<{id: string, email: string}> {
    const email = process.env.TEST_EMAIL_USER || `${username}@test.com`;
    const hash = await bcrypt.hash(password, 10);
    
    const result = await this.db.query(
      `INSERT INTO app_user (username, email, hash_password, is_temp_user, is_two_factor_enabled)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [username, email, hash, true, enable2FA],
    );
    
    return { id: result.rows[0].id, email };
  }

  async clearTempUsers() {
    await this.db.query(`DELETE FROM app_user WHERE is_temp_user = true`);
  }

  async getLoginAttempts(username: string): Promise<number> {
    const res = await this.db.query(
      `SELECT login_attempts FROM app_user WHERE username = $1`,
      [username],
    );
    return res.rows.length ? res.rows[0].login_attempts : 0;
  }

  async isLocked(username: string): Promise<boolean> {
    const res = await this.db.query(
      `SELECT is_locked FROM app_user WHERE username = $1`,
      [username],
    );
    return res.rows.length ? res.rows[0].is_locked : false;
  }

  async enable2FA(username: string): Promise<void> {
    await this.db.query(
      `UPDATE app_user SET is_two_factor_enabled = true WHERE username = $1`,
      [username]
    );
  }

  async disable2FA(username: string): Promise<void> {
    await this.db.query(
      `UPDATE app_user SET is_two_factor_enabled = false WHERE username = $1`,
      [username]
    );
  }

  async is2FAEnabled(username: string): Promise<boolean> {
    const res = await this.db.query(
      `SELECT is_two_factor_enabled FROM app_user WHERE username = $1`,
      [username],
    );
    return res.rows.length ? res.rows[0].is_two_factor_enabled : false;
  }

  async get2FATokenFromEmail(userEmail: string): Promise<string> {
    return await this.emailClient.waitFor2FAEmail(userEmail);
  }

  async getResetPasswordTokenFromEmail(userEmail: string): Promise<string> {
    return await this.emailClient.waitForResetPasswordEmail(userEmail);
  }

  async markEmailsAsRead(userEmail: string): Promise<void> {
    await this.emailClient.markAsRead(userEmail);
  }
}