import { defineFeature, loadFeature } from 'jest-cucumber';
import request = require('supertest');
import { TestUserManager } from '../utils/test-user-manager';
import * as dotenv from 'dotenv';

dotenv.config();

const feature = loadFeature('./test/features/login.feature');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

defineFeature(feature, (test) => {
    const userManager = new TestUserManager();
    let response: request.Response;
  
    beforeAll(async () => {
      await userManager.connect();
    });
  
    afterAll(async () => {
      await userManager.disconnect();
    });
  
    afterEach(async () => {
      await userManager.clearTempUsers();
    });
  
    test('Successful login with valid credentials', ({ given, when, then }) => {
      given(/^a test user "([^"]*)" with password "([^"]*)"$/, async (username, password) => {
        await userManager.createUser(username, password);
      });
  
      when(
        /^I send a POST request to "([^"]*)" with username "([^"]*)" and password "([^"]*)"$/,
        async (endpoint, username, password) => {
          response = await request(API_BASE_URL)
            .post(endpoint)
            .send({ username, password });
        },
      );
  
      then('the response status should be 201', () => {
        expect(response.status).toBe(201);
      });
  
      then('the response should contain a valid access token', () => {
        const cookies = response.get('set-cookie');
        expect(cookies).toBeDefined();
        expect(cookies![0]).toContain('access_token');
      });
  
      then('the user login attempts should be reset to 0', async () => {
        const attempts = await userManager.getLoginAttempts('test_user_login');
        expect(attempts).toBe(0);
      });
    });

  test('Login fails with incorrect password', ({ given, when, then }) => {
    let username: string;
    let loginAttemptsBefore = 0;
    given(/^a test user "([^"]*)" with password "([^"]*)"$/, async (u, p) => {
      username = u;
      await userManager.createUser(username, p);
      loginAttemptsBefore = await userManager.getLoginAttempts(username);
    });

    when(
      /^I send a POST request to "([^"]*)" with username "([^"]*)" and password "([^"]*)"$/,
      async (endpoint, u, password) => {
        response = await request(API_BASE_URL)
          .post(endpoint)
          .send({ username: u, password })
          .set('Accept', 'application/json');
      },
    );

    then('the response status should be 400', () => {
      expect(response.status).toBe(400);
    });

    then('the user login attempts should increase by 1', async () => {
      const attemptsAfter = await userManager.getLoginAttempts(username);
      expect(attemptsAfter).toBe(loginAttemptsBefore + 1);
    });
  });

  test('Login fails for nonexistent user', ({ when, then }) => {
    when(
      /^I send a POST request to "([^"]*)" with username "([^"]*)" and password "([^"]*)"$/,
      async (endpoint, username, password) => {
        response = await request(API_BASE_URL)
          .post(endpoint)
          .send({ username, password })
          .set('Accept', 'application/json');
      },
    );

    then('the response status should be 400', () => {
      expect(response.status).toBe(400);
    });
  });
});
