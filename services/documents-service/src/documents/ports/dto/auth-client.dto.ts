export interface VerifyAccessTokenResponse {
  valid: boolean;
  user?: {
    id: string;
    username: string;
  };
}

export interface GetUserPermissionsResponse {
  permissions: string[];
}