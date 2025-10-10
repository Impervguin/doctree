import { defineFeature, loadFeature } from 'jest-cucumber';
import request = require('supertest');
import { TestUserManager } from '../utils/test-user-manager';

const feature = loadFeature('./test/features/password.feature');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Увеличиваем общий таймаут для всех тестов
jest.setTimeout(120000);

defineFeature(feature, (test) => {
  const userManager = new TestUserManager();
  let response: request.Response;
  let userEmail: string;
  let resetToken: string;

  beforeAll(async () => {
    await userManager.connect();
  }, 30000);

  afterAll(async () => {
    await userManager.disconnect();
  }, 30000);

  afterEach(async () => {
    await userManager.clearTempUsers();
    if (userEmail) {
      await userManager.markEmailsAsRead(userEmail);
    }
  }, 30000);

  test('User account gets locked after multiple failed login attempts', 
    ({ given, when, then, and }) => {
    
    let username: string;

    given(/^a test user "([^"]*)" with password "([^"]*)"$/, 
      async (user, password) => {
        username = user;
        const userData = await userManager.createUser(username, password, false);
        userEmail = userData.email;
      });

    when('I enter wrong password 3 times in a row', async () => {
      response = await request(API_BASE_URL)
        .post('/api/v2/auth/login')
        .send({ username, password: 'WrongPassword1' });
      expect(response.status).toBe(400);

      response = await request(API_BASE_URL)
        .post('/api/v2/auth/login')
        .send({ username, password: 'WrongPassword2' });
      expect(response.status).toBe(400);

      response = await request(API_BASE_URL)
        .post('/api/v2/auth/login')
        .send({ username, password: 'WrongPassword3' });
      
        response = await request(API_BASE_URL)
        .post('/api/v2/auth/login')
        .send({ username, password: 'WrongPassword4' });
    });

    then('the fourth login attempt should be blocked', () => {
        
      expect(response.status).toBe(406); // Not Acceptable - аккаунт заблокирован
    });

    and('the user account should be locked in database', async () => {
      const isLocked = await userManager.isLocked(username);
      expect(isLocked).toBe(true);
    });

    and('login attempts counter should be 3', async () => {
      const attempts = await userManager.getLoginAttempts(username);
      expect(attempts).toBe(3);
    });
  });

  test('User account gets locked and then unlocked after password reset', 
    ({ given, when, then, and }) => {
    
    let username: string;
    const newPassword = 'NewP@ssw0rd123';

    given(/^a test user "([^"]*)" with password "([^"]*)"$/, 
      async (user, password) => {
        username = user;
        const userData = await userManager.createUser(username, password, false);
        userEmail = userData.email;
      });

    when('I enter wrong password 3 times to lock the account', async () => {
      for (let i = 0; i < 3; i++) {
        response = await request(API_BASE_URL)
          .post('/api/v2/auth/login')
          .send({ username, password: 'WrongPassword' });
        
        if (i < 2) {
          expect(response.status).toBe(400);
        }
      }
    });

    then('the account should be locked', async () => {
      const isLocked = await userManager.isLocked(username);
      expect(isLocked).toBe(true);
    });

    when(' When I initiate password reset for the locked account', async () => {
        response = await request(API_BASE_URL)
          .post('/api/v2/auth/initreset')
          .send({ username });
        expect(response.status).toBe(201);
      });
  
      and('I retrieve the reset token from email', async () => {
        resetToken = await userManager.getResetPasswordTokenFromEmail(userEmail);
        expect(resetToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/);
      });
  
      and('I reset the password using the token', async () => {
        response = await request(API_BASE_URL)
          .post('/api/v2/auth/reset')
          .send({ 
            token: resetToken,
            newPassword: newPassword
          });
        expect(response.status).toBe(201);
      });
  

    then('the account should be unlocked', async () => {
      const isLocked = await userManager.isLocked(username);
      expect(isLocked).toBe(false);
    });

    and('login attempts should be reset to 0', async () => {
      const attempts = await userManager.getLoginAttempts(username);
      expect(attempts).toBe(0);
    });

    and('I should be able to login with new password', async () => {
      response = await request(API_BASE_URL)
        .post('/api/v2/auth/login')
        .send({ 
          username, 
          password: newPassword 
        });
      expect(response.status).toBe(201);
    });
  });

  test('User successfully changes password', 
    ({ given, when, then, and }) => {
    
    let username: string;
    const originalPassword = 'OriginalP@ssw0rd';
    const newPassword = 'NewP@ssw0rd123';
    let accessToken: string;

    given(/^a test user "([^"]*)" with password "([^"]*)"$/, 
      async (user, password) => {
        username = user;
        const userData = await userManager.createUser(username, password, false);
        userEmail = userData.email;
      });

    and('I am logged in with the original password', async () => {
      response = await request(API_BASE_URL)
        .post('/api/v2/auth/login')
        .send({ 
          username, 
          password: originalPassword 
        });
      expect(response.status).toBe(201);
      
      const cookies = response.get('set-cookie');
      expect(cookies).toBeDefined();
    });

    when('I initiate password reset', async () => {
      response = await request(API_BASE_URL)
        .post('/api/v2/auth/initreset')
        .send({ username });
      expect(response.status).toBe(201);
    });

    and('I retrieve the reset token from email', async () => {
      resetToken = await userManager.getResetPasswordTokenFromEmail(userEmail);
      expect(resetToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/);
    });

    and('I reset the password using the token', async () => {
      response = await request(API_BASE_URL)
        .post('/api/v2/auth/reset')
        .send({ 
          token: resetToken,
          newPassword: newPassword
        });
      expect(response.status).toBe(201);
    });

    then('I should not be able to login with old password', async () => {
      response = await request(API_BASE_URL)
        .post('/api/v2/auth/login')
        .send({ 
          username, 
          password: originalPassword 
        });
      expect(response.status).toBe(400);
    });

    and('I should be able to login with new password', async () => {
      response = await request(API_BASE_URL)
        .post('/api/v2/auth/login')
        .send({ 
          username, 
          password: newPassword 
        });
      expect(response.status).toBe(201);
    });

    and('login attempts should be 0 after successful login', async () => {
      const attempts = await userManager.getLoginAttempts(username);
      expect(attempts).toBe(0);
    });
  });
});