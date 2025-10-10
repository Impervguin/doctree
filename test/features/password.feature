Feature: Account lockout and password change scenarios

  Scenario: User account gets locked after multiple failed login attempts
    Given a test user "test_user_lockout" with password "P@ssw0rd"
    When I enter wrong password 3 times in a row
    Then the fourth login attempt should be blocked
    And the user account should be locked in database
    And login attempts counter should be 3

  Scenario: User account gets locked and then unlocked after password reset
    Given a test user "test_user_lockout_reset" with password "P@ssw0rd"
    When I enter wrong password 3 times to lock the account
    Then the account should be locked
    When I initiate password reset for the locked account
    And I retrieve the reset token from email
    And I reset the password using the token
    Then the account should be unlocked
    And login attempts should be reset to 0
    And I should be able to login with new password

  Scenario: User successfully changes password
    Given a test user "test_user_change_pass" with password "OriginalP@ssw0rd"
    And I am logged in with the original password
    When I initiate password reset
    And I retrieve the reset token from email
    And I reset the password using the token
    Then I should not be able to login with old password
    And I should be able to login with new password
    And login attempts should be 0 after successful login