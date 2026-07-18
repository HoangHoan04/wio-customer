import tokenCache from "@/utils/token-cache";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  customer?: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  hydrate: () => void;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  updateUser: (user: User) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,
  hydrate: () => {
    const user = tokenCache.getUser();
    const isAuthenticated = tokenCache.isAuthenticated();
    set({ user, isAuthenticated, isHydrated: true });
  },
  setAuth: (user, accessToken, refreshToken) => {
    tokenCache.setAuthData(accessToken, refreshToken, user);
    document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
    set({ user, isAuthenticated: true, isHydrated: true });
  },
  updateUser: (user) => {
    tokenCache.updateUser(user);
    set({ user });
  },
  clearAuth: () => {
    tokenCache.clear();
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    set({ user: null, isAuthenticated: false });
  },
  setLoading: (isLoading) => set({ isLoading }),
  updateTokens: (accessToken, refreshToken) => {
    tokenCache.updateTokens(accessToken, refreshToken);
    document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
  },
}));
