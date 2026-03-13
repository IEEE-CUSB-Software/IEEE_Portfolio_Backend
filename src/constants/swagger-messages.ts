export const ERROR_MESSAGES = {
  // auth
  WRONG_CREDENTIALS: 'Invalid credentials',
  WRONG_PASSWORD: 'Wrong password',
  PASSWORD_CONFIRMATION_MISMATCH: 'Confirmation password must match password',
  NEW_PASSWORD_SAME_AS_OLD:
    'New password must be different from the old password',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_NOT_VERIFIED: 'Email not verified yet. Please check your inbox',
  ACCOUNT_ALREADY_VERIFIED: 'Account was already verified',
  EMAIL_NOT_FOUND: 'Email not found',
  USERNAME_NOT_FOUND: 'Username not found',
  USERNAME_ALREADY_TAKEN: 'Username is already taken',

  // OAuth completion
  OAUTH_PASSWORD_NOT_SET:
    'OAuth users must set a password to enable email/password login',
  INVALID_OAUTH_SESSION_TOKEN: 'Invalid OAuth session token',
  USER_NOT_FOUND_OAUTH_COMPLETION_REQUIRED:
    'User not found, OAuth completion required',
  GOOGLE_TOKEN_INVALID: 'Invalid Google access token',
  GITHUB_TOKEN_INVALID: 'Invalid GitHub access token',
  GITHUB_CODE_INVALID:
    'GitHub authorization code is invalid or expired. Please try signing in again',
  GITHUB_CODE_VERIFIER_REQUIRED:
    'GitHub authorization failed. Please ensure you include the code_verifier if using PKCE',
  GITHUB_OAUTH_FAILED: 'Failed to authenticate with GitHub. Please try again',
  EMAIL_NOT_PROVIDED_BY_OAUTH_GOOGLE:
    'Unable to retrieve user email from Google',
  EMAIL_NOT_PROVIDED_BY_OAUTH_GITHUB:
    'Unable to retrieve user email from GitHub',

  // user
  USER_NOT_FOUND: 'User not found',
  USER_OR_MORE_USERS_NOT_FOUND: 'One or more users not found',
  FORBIDDEN_ACTION: 'You do not have permission to perform this action',

  // role
  ROLE_NOT_FOUND: 'Role not found',
  ROLE_ALREADY_EXISTS: 'Role name already exists',

  // events
  EVENT_NOT_FOUND: 'Event not found',
  EVENT_REGISTRATION_NOT_FOUND: 'Event registration not found',
  EVENT_REGISTRATION_CLOSED: 'Event registration deadline has passed',
  EVENT_ALREADY_REGISTERED: 'You are already registered for this event',
  EVENT_FULL: 'Event capacity is full',
  EVENT_INVALID_TIME_RANGE: 'Invalid event time range',

  // board
  BOARD_MEMBER_NOT_FOUND: 'Board member not found',

  // categories
  CATEGORY_NOT_FOUND: 'Category not found',
  CATEGORY_ALREADY_EXISTS: 'Category name already exists',
  CATEGORY_HAS_COMMITTEES:
    'Cannot delete category with existing committees',

  // committees
  COMMITTEE_NOT_FOUND: 'Committee not found',
  COMMITTEE_MEMBER_NOT_FOUND: 'Committee member not found',

  // communication
  FAILED_TO_SEND_OTP_EMAIL: 'Failed to send OTP email',
  OTP_REQUEST_WAIT: 'Please wait a minute before requesting a new code',

  // database
  FAILED_TO_SAVE_IN_DB: 'Failed to save the data to database',
  FAILED_TO_UPDATE_IN_DB: 'Failed to update the data in database',
  FAILED_TO_FETCH_FROM_DB: 'Failed to fetch data from database',
  FAILED_TO_DELETE_FROM_DB: 'Failed to delete data from database',

  // links & Tokens
  INVALID_OR_EXPIRED_TOKEN: 'Invalid or expired token',
  INVALID_OR_EXPIRED_LINK: 'Invalid or expired link',
  NO_REFRESH_TOKEN_PROVIDED: 'No refresh token provided',

  // server
  INTERNAL_SERVER_ERROR: 'Internal server error',

  // request interception
  PHONE_NUMBER_REQUIRED: 'Phone number is required. Please update your profile with a valid phone number.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  // auth
  USER_REGISTERED: 'User successfully registered. Check email for verification',
  LOGGED_IN: 'Logged in Successfully!',
  EMAIL_VERIFIED: 'Email verified successfully',
  OTP_GENERATED: 'OTP generated and sent successfully',
  OTP_VERIFIED: 'OTP verified successfully, you can now reset your password',
  NEW_ACCESS_TOKEN: 'New access token generated',
  PASSWORD_CHANGED: 'Password changed successfully',
  PASSWORD_RESET_OTP_SENT: 'Password reset OTP sent to your email',
  PASSWORD_RESET: 'Password reset successfully',
  LOGGED_OUT: 'Successfully logged out from this device',
  ACCOUNT_REMOVED:
    'Account successfully removed due to unauthorized access report',
  IDENTIFIER_AVAILABLE: 'Identifier is available',
  USERNAME_UPDATED: 'Username updated successfully',
  EMAIL_UPDATE_INITIATED:
    'Email update process initiated. Check your new email for verification',
  EMAIL_UPDATED: 'Email updated successfully',
  PASSWORD_CONFIRMED: 'Password confirmed successfully',
  USER_UPDATED: 'User Data Updated Successfully',
  AUTH_ME: 'Current user retrieved successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  // OAuth completion
  BIRTH_DATE_SET: 'Birth date set successfully',
  OAUTH_USER_REGISTERED: 'OAuth user registered successfully',
  TOKEN_EXCHANGE_SUCCESS: 'Token exchanged successfully',
  // roles
  ROLE_CREATED: 'Role created successfully',
  ROLE_UPDATED: 'Role updated successfully',
  ROLE_DELETED: 'Role deleted successfully',

  // events
  EVENT_CREATED: 'Event created successfully',
  EVENT_UPDATED: 'Event updated successfully',
  EVENT_DELETED: 'Event deleted successfully',
  EVENT_REGISTERED: 'Event registration created successfully',
  EVENT_REGISTRATION_CANCELLED: 'Event registration cancelled successfully',
  EVENT_REGISTRATION_STATUS_UPDATED:
    'Event registration status updated successfully',

  // board
  BOARD_MEMBER_CREATED: 'Board member created successfully',
  BOARD_MEMBER_UPDATED: 'Board member updated successfully',
  BOARD_MEMBER_DELETED: 'Board member deleted successfully',

  // categories
  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_UPDATED: 'Category updated successfully',
  CATEGORY_DELETED: 'Category deleted successfully',

  // committees
  COMMITTEE_CREATED: 'Committee created successfully',
  COMMITTEE_UPDATED: 'Committee updated successfully',
  COMMITTEE_DELETED: 'Committee deleted successfully',
  COMMITTEE_MEMBER_CREATED: 'Committee member created successfully',
  COMMITTEE_MEMBER_UPDATED: 'Committee member updated successfully',
  COMMITTEE_MEMBER_DELETED: 'Committee member deleted successfully',
} as const;
