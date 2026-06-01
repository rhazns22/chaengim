import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/authApi';
import { normalizeErrorMessage } from '../utils/error';
import type { User } from '../types/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;
  
  register: (data: any) => Promise<void>;
  login: (data: any) => Promise<void>;
  loginWithKakao: (code: string) => Promise<{ needsProfileSetup: boolean } | undefined>;
  loginWithNaver: (payload: { code: string; state: string }) => Promise<{ needsProfileSetup: boolean } | undefined>;
  fetchMe: () => Promise<void>;
  guestLogin: () => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoggedIn: false,
      isGuest: false,
      isLoading: false,
      error: null,

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.register(data);
          set({ 
            user: res.user, 
            accessToken: res.accessToken, 
            isLoggedIn: true, 
            isGuest: false, 
            isLoading: false 
          });
        } catch (e: unknown) {
          set({ error: normalizeErrorMessage(e), isLoading: false });
        }
      },

      login: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.login(data);
          set({ 
            user: res.user, 
            accessToken: res.accessToken, 
            isLoggedIn: true, 
            isGuest: false, 
            isLoading: false 
          });
        } catch (e: unknown) {
          set({ error: normalizeErrorMessage(e), isLoading: false });
        }
      },

      loginWithKakao: async (code) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.kakaoLogin(code);
          set({ 
            user: res.user, 
            accessToken: res.accessToken, 
            isLoggedIn: true, 
            isGuest: false, 
            isLoading: false 
          });
          return { needsProfileSetup: res.needsProfileSetup };
        } catch (e: unknown) {
          set({ error: normalizeErrorMessage(e), isLoading: false });
          throw e;
        }
      },

      loginWithNaver: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authApi.naverLogin(payload);
          set({ 
            user: res.user, 
            accessToken: res.accessToken, 
            isLoggedIn: true, 
            isGuest: false, 
            isLoading: false 
          });
          return { needsProfileSetup: res.needsProfileSetup };
        } catch (e: unknown) {
          set({ error: normalizeErrorMessage(e), isLoading: false });
          throw e;
        }
      },

      fetchMe: async () => {
        const { accessToken, isGuest } = get();
        if (!accessToken || isGuest) return;
        
        try {
          const user = await authApi.getMe();
          set({ user, isLoggedIn: true, isGuest: false });
        } catch (e: unknown) {
          // fetchMe는 백그라운드 갱신이므로 에러 시 조용히 로그아웃 상태로 전환
          set({ user: null, accessToken: null, isLoggedIn: false });
        }
      },

      guestLogin: () => {
        set({ 
          user: null, 
          accessToken: null, 
          isLoggedIn: false, 
          isGuest: true 
        });
      },

      logout: () => {
        set({ user: null, accessToken: null, isLoggedIn: false, isGuest: false });
      },

      clearError: () => set({ error: null })
    }),
    { 
      name: 'chaengim_access_token',
      partialize: (state) => ({ accessToken: state.accessToken, isGuest: state.isGuest })
    }
  )
);