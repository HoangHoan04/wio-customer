import { create } from "zustand";

export type ToastType = "success" | "info" | "warning" | "error";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  timeout: number;
}

export interface ToastPayload {
  type: ToastType;
  title?: string;
  message: string;
  timeout?: number;
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (payload: ToastPayload) => void;
  dismissToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  showToast: (payload) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const item: ToastItem = {
      id,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      timeout: payload.timeout ?? 4000,
    };
    set((state) => ({ toasts: [...state.toasts, item] }));
  },

  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const useToast = () => {
  const showToast = useToastStore((s) => s.showToast);
  return { showToast };
};

export default useToastStore;
