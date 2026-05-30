import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RegisterDraft {
  name: string;
  email: string;
  isEmailVerified: boolean;
  passwordConfirm: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
}

interface RegisterDraftState {
  draft: RegisterDraft;
  passwordVal: string; // 비밀번호는 메모리에만 임시 저장
  setField: <K extends keyof RegisterDraft>(key: K, value: RegisterDraft[K]) => void;
  setPassword: (password: string) => void;
  clearDraft: () => void;
}

const initialDraft: RegisterDraft = {
  name: '',
  email: '',
  isEmailVerified: false,
  passwordConfirm: '',
  termsAgreed: false,
  privacyAgreed: false,
  marketingAgreed: false,
};

export const useRegisterDraftStore = create<RegisterDraftState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      passwordVal: '',
      setField: (key, value) =>
        set((state) => ({
          draft: { ...state.draft, [key]: value },
        })),
      setPassword: (password) => set({ passwordVal: password }),
      clearDraft: () => set({ draft: initialDraft, passwordVal: '' }),
    }),
    {
      name: 'chaengim_register_draft',
      partialize: (state) => ({ draft: state.draft }), // sessionStorage에 draft만 보관
      storage: {
        getItem: (name) => {
          const val = sessionStorage.getItem(name);
          return val ? JSON.parse(val) : null;
        },
        setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);
