export interface User {
  isLoggedIn: boolean;
  accessToken: string | null;
  idToken: string | null;
  username: string | null;
}
