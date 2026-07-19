import { useToastStore, type ToastType } from "@/stores/useToastStore";

interface ToastOptions {
  title?: string;
  message?: string;
  type?: ToastType;
  timeout?: number;
}

export function useToast() {
  const showToastStore = useToastStore((s) => s.showToast);

  const showToast = ({ title, message, type = "info", timeout }: ToastOptions) => {
    const msg = message || title || "";
    const ttl = message ? title : undefined;
    showToastStore({
      type,
      title: ttl,
      message: msg,
      timeout,
    });
  };

  return { showToast };
}
