export interface IDToken {
  aud: string;
  azp: string;
  exp: string;
  iat: string;
  iss: string;
  sub: string;
  preferred_username: string;
}

export interface AuthInfo {
  access_token: string;
  id_token: string;
  token_type: string;
  scope: string;
  decodedIdToken: IDToken;
}
