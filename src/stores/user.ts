import { reactive } from "vue";
import TwitchAuth from "@/services/twitch-auth";
import TwitchChat from "@/services/twitch-chat";
import type { User } from "@/interfaces/users";

const user = reactive<User>({
  isLoggedIn: false,
  accessToken: null,
  idToken: null,
  username: null,
});

function login(): void {
  TwitchAuth.redirectToLogin();
}

function loginWithTwitchAuth(aToken: string, idToken: string, preferredUsername: string | null): void {
  if (user.accessToken != aToken || user.username != preferredUsername) {
    TwitchChat.disconnect();
    user.accessToken = aToken;
    user.idToken = idToken;
    user.username = preferredUsername;
    user.isLoggedIn = true;
    TwitchChat.connect(user.username as string, user.accessToken);
  }
}

async function logout(): Promise<void> {
  TwitchChat.disconnect();
  const token = user.accessToken;
  user.idToken = null;
  user.accessToken = null;
  user.username = null;
  user.isLoggedIn = false;

  if (token) {
    TwitchAuth.logout(token);
  }
}

export const userStore = {
  user,
  login,
  loginWithTwitchAuth,
  logout,
};
