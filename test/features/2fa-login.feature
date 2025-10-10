Feature: User login with Two-Factor Authentication using JWT tokens

  Scenario: Successful login with 2FA using JWT token
    Given a test user "test_user_2fa" with password "P@ssw0rd" and 2FA enabled
    When I send a POST request to "/api/v2/auth/login" with username "test_user_2fa" and password "P@ssw0rd"
    Then the response status should be 202
    And I receive a 2FA challenge
    When I retrieve the JWT token from 2FA email
    And I send the JWT token to 2FA verification endpoint
    Then the 2FA verification response status should be 201
    And the response should contain a valid access token