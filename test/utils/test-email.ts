// test/utils/email-client.ts
import * as Imap from 'imap';
import { simpleParser } from 'mailparser';
import { EventEmitter } from 'events';

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  tls: boolean;
}

export interface EmailMessage {
  subject: string;
  from: string;
  to: string;
  date: Date;
  text: string;
  html: string;
}

export class EmailClient extends EventEmitter {
  private imap: Imap;
  private isConnected: boolean = false;

  constructor(private config: EmailConfig) {
    super();
    this.imap = new Imap({
      user: config.user,
      password: config.password,
      host: config.host,
      port: config.port,
      tls: config.tls,
      tlsOptions: { rejectUnauthorized: false }
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.imap.once('ready', () => {
      this.isConnected = true;
      this.emit('connected');
    });

    this.imap.once('error', (err: Error) => {
      this.emit('error', err);
    });

    this.imap.once('end', () => {
      this.isConnected = false;
      this.emit('disconnected');
    });
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve();
        return;
      }

      const onConnected = () => {
        this.imap.removeListener('error', onError);
        resolve();
      };

      const onError = (err: Error) => {
        this.imap.removeListener('ready', onConnected);
        reject(err);
      };

      this.imap.once('ready', onConnected);
      this.imap.once('error', onError);

      this.imap.connect();
    });
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isConnected) {
        resolve();
        return;
      }

      this.imap.once('end', () => {
        resolve();
      });

      this.imap.end();
    });
  }

  async getLatest2FAToken(recipientEmail: string, timeoutMs: number = 60000): Promise<string> {
    await this.connect();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout while waiting for 2FA email (${timeoutMs}ms)`));
      }, timeoutMs);

      this.imap.openBox('INBOX', false, (err) => {
        if (err) {
          clearTimeout(timeout);
          reject(err);
          return;
        }

        const since = new Date();
        since.setMinutes(since.getMinutes() - 10);

        this.imap.search([
          ['SINCE', since],
          ['SUBJECT', 'Doctree 2FA'],
          ['TO', recipientEmail]
        ], (searchErr, results) => {
          if (searchErr) {
            clearTimeout(timeout);
            reject(searchErr);
            return;
          }

          if (results.length === 0) {
            clearTimeout(timeout);
            reject(new Error('No 2FA emails found'));
            return;
          }

          const latestMessageId = results[results.length - 1];
          const fetch = this.imap.fetch([latestMessageId], { bodies: '' });

          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (parseErr, parsed) => {
                if (parseErr) {
                  clearTimeout(timeout);
                  reject(parseErr);
                  return;
                }

                const token = this.extractJWTToken(parsed);
                if (token) {
                  clearTimeout(timeout);
                  resolve(token);
                } else {
                  clearTimeout(timeout);
                  reject(new Error('JWT token not found in email'));
                }
              });
            });
          });

          fetch.once('error', (fetchErr) => {
            clearTimeout(timeout);
            reject(fetchErr);
          });
        });
      });
    });
  }

  async getLatestResetPasswordToken(recipientEmail: string, timeoutMs: number = 60000): Promise<string> {
    await this.connect();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout while waiting for reset password email (${timeoutMs}ms)`));
      }, timeoutMs);

      this.imap.openBox('INBOX', false, (err) => {
        if (err) {
          clearTimeout(timeout);
          reject(err);
          return;
        }

        const since = new Date();
        since.setMinutes(since.getMinutes() - 10);

        this.imap.search([
          ['SINCE', since],
          ['SUBJECT', 'Doctree Reset Password'],
          ['TO', recipientEmail]
        ], (searchErr, results) => {
          if (searchErr) {
            clearTimeout(timeout);
            reject(searchErr);
            return;
          }

          if (results.length === 0) {
            clearTimeout(timeout);
            reject(new Error('No reset password emails found'));
            return;
          }

          const latestMessageId = results[results.length - 1];
          const fetch = this.imap.fetch([latestMessageId], { bodies: '' });

          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (parseErr, parsed) => {
                if (parseErr) {
                  clearTimeout(timeout);
                  reject(parseErr);
                  return;
                }

                const token = this.extractJWTToken(parsed);
                if (token) {
                  clearTimeout(timeout);
                  resolve(token);
                } else {
                  clearTimeout(timeout);
                  reject(new Error('JWT token not found in reset password email'));
                }
              });
            });
          });

          fetch.once('error', (fetchErr) => {
            clearTimeout(timeout);
            reject(fetchErr);
          });
        });
      });
    });
  }

  async waitFor2FAEmail(recipientEmail: string, maxWaitMs: number = 120000): Promise<string> {
    const startTime = Date.now();
    const checkInterval = 5000;

    while (Date.now() - startTime < maxWaitMs) {
      try {
        const token = await this.getLatest2FAToken(recipientEmail, 10000);
        return token;
      } catch (error) {
        if (error.message.includes('No 2FA emails found') || 
            error.message.includes('Timeout')) {
          await new Promise(resolve => setTimeout(resolve, checkInterval));
          continue;
        }
        throw error;
      }
    }

    throw new Error(`2FA email not received within ${maxWaitMs}ms`);
  }

  async waitForResetPasswordEmail(recipientEmail: string, maxWaitMs: number = 120000): Promise<string> {
    const startTime = Date.now();
    const checkInterval = 5000;

    while (Date.now() - startTime < maxWaitMs) {
      try {
        const token = await this.getLatestResetPasswordToken(recipientEmail, 10000);
        return token;
      } catch (error) {
        if (error.message.includes('No reset password emails found') || 
            error.message.includes('Timeout')) {
          await new Promise(resolve => setTimeout(resolve, checkInterval));
          continue;
        }
        throw error;
      }
    }

    throw new Error(`Reset password email not received within ${maxWaitMs}ms`);
  }

  private extractJWTToken(parsedEmail: any): string | null {
    const jwtPattern = /[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/;
    
    const textContent = parsedEmail.text || '';
    const textMatch = textContent.match(jwtPattern);
    if (textMatch && this.isValidJWTFormat(textMatch[0])) {
      return textMatch[0];
    }

    const htmlContent = parsedEmail.html || '';
    const htmlMatch = htmlContent.match(jwtPattern);
    if (htmlMatch && this.isValidJWTFormat(htmlMatch[0])) {
      return htmlMatch[0];
    }

    return null;
  }

  private isValidJWTFormat(token: string): boolean {
    // Базовая проверка формата JWT: три части разделенные точками
    const parts = token.split('.');
    return parts.length === 3 && 
           parts.every(part => part.length > 0);
  }

  async markAsRead(recipientEmail: string): Promise<void> {
    await this.connect();

    return new Promise((resolve, reject) => {
      this.imap.openBox('INBOX', false, (err) => {
        if (err) {
          reject(err);
          return;
        }

        const since = new Date();
        since.setMinutes(since.getMinutes() - 10);

        this.imap.search([
          ['SINCE', since],
          ['SUBJECT', 'Doctree 2FA'],
          ['TO', recipientEmail]
        ], (searchErr, results) => {
          if (searchErr) {
            reject(searchErr);
            return;
          }

          if (results.length === 0) {
            resolve();
            return;
          }

          this.imap.addFlags(results, ['\\Seen'], (flagsErr) => {
            if (flagsErr) {
              reject(flagsErr);
              return;
            }
            resolve();
          });
        });
      });
    });
  }
}
import * as dotenv from 'dotenv';

dotenv.config();

export class EmailClientFactory {
  static createFromEnv(): EmailClient {
    const config: EmailConfig = {
      host: process.env.TEST_EMAIL_HOST || 'imap.gmail.com',
      port: parseInt(process.env.TEST_EMAIL_PORT || '993'),
      user: process.env.TEST_EMAIL_USER!,
      password: process.env.TEST_EMAIL_PASSWORD!,
      tls: true
    };

    if (!config.user || !config.password) {
      throw new Error('TEST_EMAIL_USER and TEST_EMAIL_PASSWORD must be set in environment variables');
    }

    return new EmailClient(config);
  }
}