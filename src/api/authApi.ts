import { httpClient } from './httpClient';
import type { User } from '../types/user';

export const authApi = {
  register: async (data: any) => {
    const res = await httpClient.post<{ user: User; accessToken: string }>('/auth/register', data);
    return res.data;
  },
  login: async (data: any) => {
    const res = await httpClient.post<{ user: User; accessToken: string }>('/auth/login', data);
    return res.data;
  },
  getMe: async () => {
    const res = await httpClient.get<User>('/auth/me');
    return res.data;
  },
  kakaoLogin: async (code: string) => {
    const res = await httpClient.post<{ user: User; accessToken: string; needsProfileSetup: boolean }>('/auth/kakao', { code });
    return res.data;
  },
  naverLogin: async (payload: { code: string; state: string }) => {
    const res = await httpClient.post<{ user: User; accessToken: string; needsProfileSetup: boolean }>('/auth/naver', payload);
    return res.data;
  }
};
