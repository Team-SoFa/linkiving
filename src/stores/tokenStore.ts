// src/stores/tokenStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  clearTokens: () => void;
}

export const useTokenStore = create<TokenState>()(
  persist(
    set => ({
      accessToken: null,
      refreshToken: null,
      setAccessToken: token => set({ accessToken: token }),
      setRefreshToken: token => set({ refreshToken: token }),
      clearTokens: () =>
        set({
          accessToken: null,
          refreshToken: null,
        }),
    }),
    {
      name: 'tokens',
      storage: createJSONStorage(() => localStorage), // ← 여기에서 createJSONStorage 사용
    }
  )
);

export const getAccessToken = () => useTokenStore.getState().accessToken;
export const getRefreshToken = () => useTokenStore.getState().refreshToken;
export const setAccessToken = (token: string) => useTokenStore.getState().setAccessToken(token);
export const setRefreshToken = (token: string) => useTokenStore.getState().setRefreshToken(token);
export const clearTokens = () => useTokenStore.getState().clearTokens();
