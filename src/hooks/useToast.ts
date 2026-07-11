import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  title?: string;
  message?: string;
  type?: ToastType;
}

export function useToast() {
  const showToast = ({ title, message, type = "info" }: ToastOptions) => {
    const content = [title, message].filter(Boolean).join(" — ");
    switch (type) {
      case "success":
        toast.success(content || title || message);
        break;
      case "error":
        toast.error(content || title || message);
        break;
      case "warning":
        toast.warning(content || title || message);
        break;
      default:
        toast.info(content || title || message);
    }
  };

  return { showToast };
}
