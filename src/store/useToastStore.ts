import { create } from 'zustand';

interface ToastState {
  message: string | null;
  isVisible: boolean;
  showToast: (msg: string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  isVisible: false,
  showToast: (msg) => {
    set({ message: msg, isVisible: true });
    setTimeout(() => {
      set({ isVisible: false });
    }, 2200);
  },
  hideToast: () => set({ isVisible: false }),
}));