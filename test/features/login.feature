Feature: User login via /auth/login without 2fa

  @createUser
  Scenario: Successful login with valid credentials
    Given a test user "test_user_login" with password "P@ssw0rd"
    When I send a POST request to "/api/v2/auth/login" with username "test_user_login" and password "P@ssw0rd"
    Then the response status should be 201
    And the response should contain a valid access token
    And the user login attempts should be reset to 0

  @createUser
  Scenario: Login fails with incorrect password
    Given a test user "test_user_wrong_password" with password "P@ssw0rd"
    When I send a POST request to "/api/v2/auth/login" with username "test_user_wrong_password" and password "Wrong123"
    Then the response status should be 400
    And the user login attempts should increase by 1

  @createUser
  Scenario: Login fails for nonexistent user
    When I send a POST request to "/api/v2/auth/login" with username "unknown_user" and password "anypass"
    Then the response status should be 400
