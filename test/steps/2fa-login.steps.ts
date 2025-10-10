// test/features/2fa-login.test.ts
import { defineFeature, loadFeature } from 'jest-cucumber';
import request = require('supertest');
import { TestUserManager } from '../utils/test-user-manager';

const feature = loadFeature('./test/features/2fa-login.feature');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

jest.setTimeout(120000);

defineFeature(feature, (test) => {
  const userManager = new TestUserManager();
  let response: request.Response;
  let userEmail: string;
  let jwtToken: string;

  beforeAll(async () => {
    await userManager.connect();
  });

  afterAll(async () => {
    await userManager.disconnect();
  });

  afterEach(async () => {
    await userManager.clearTempUsers();
    if (userEmail) {
      await userManager.markEmailsAsRead(userEmail);
    }
  });

  test('Successful login with 2FA using JWT token', ({ given, when, then, and }) => {
    given(/^a test user "([^"]*)" with password "([^"]*)" and 2FA enabled$/, 
      async (username, password) => {
        const user = await userManager.createUser(username, password, true);
        userEmail = user.email;
      });

    when(/^I send a POST request to "([^"]*)" with username "([^"]*)" and password "([^"]*)"$/, 
      async (endpoint, username, password) => {
        response = await request(API_BASE_URL)
          .post(endpoint)
          .send({ username, password });
      });

    then('the response status should be 202', () => {
      expect(response.status).toBe(202);
    });

    and('I receive a 2FA challenge', () => {
      expect(response.body).toBeDefined();
    });

    when('I retrieve the JWT token from 2FA email', async () => {
      jwtToken = await userManager.get2FATokenFromEmail(userEmail);
      expect(jwtToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/);
    });

    when('I send the JWT token to 2FA verification endpoint', async () => {
      response = await request(API_BASE_URL)
        .post('/api/v2/auth/login2fa')
        .send({ 
          username: 'test_user_2fa', 
          token: jwtToken 
        });
    });

    then('the 2FA verification response status should be 201', () => {
      expect(response.status).toBe(201);
    });

    and('the response should contain a valid access token', () => {
      const cookies = response.get('set-cookie');
      expect(cookies).toBeDefined();
      expect(cookies![0]).toContain('access_token');
    });
  });
});