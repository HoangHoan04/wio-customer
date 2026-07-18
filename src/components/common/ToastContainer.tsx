import { useToastStore } from "@/stores/useToastStore";
import React from "react";
import ToastCard from "./Toast";

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed top-4 right-4 z-999999 flex flex-col gap-3 pointer-events-none select-none max-w-full">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastCard toast={toast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
