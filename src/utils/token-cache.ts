interface TokenData {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
}

const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user_data",
};

class TokenCache {
  private cache: TokenData = {
    accessToken: null,
    refreshToken: null,
    user: null,
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === "undefined") return;
    try {
      this.cache.accessToken = sessionStorage.getItem(
        STORAGE_KEYS.ACCESS_TOKEN,
      );
      this.cache.refreshToken = sessionStorage.getItem(
        STORAGE_KEYS.REFRESH_TOKEN,
      );
      const userStr = sessionStorage.getItem(STORAGE_KEYS.USER);
      this.cache.user = userStr ? JSON.parse(userStr) : null;
    } catch {
      this.clear();
    }
  }

  setAuthData(accessToken: string, refreshToken: string, user: any): void {
    try {
      this.cache.accessToken = accessToken;
      this.cache.refreshToken = refreshToken;
      this.cache.user = user;
      sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error("Failed to set auth data in storage:", error);
    }
  }

  updateUser(user: any): void {
    this.cache.user = user;
    sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  clear(): void {
    this.cache.accessToken = null;
    this.cache.refreshToken = null;
    this.cache.user = null;
    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
  }

  getAccessToken() {
    return this.cache.accessToken;
  }
  getRefreshToken() {
    return this.cache.refreshToken;
  }
  getUser() {
    return this.cache.user;
  }
  isAuthenticated() {
    return !!this.cache.accessToken;
  }
  updateAccessToken(accessToken: string): void {
    this.cache.accessToken = accessToken;
    sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  }
  updateTokens(accessToken: string, refreshToken: string): void {
    this.updateAccessToken(accessToken);
    this.cache.refreshToken = refreshToken;
    sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
}

export const tokenCache = new TokenCache();
export default tokenCache;
