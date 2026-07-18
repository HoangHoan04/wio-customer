import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToastStore, type ToastItem } from "@/stores/useToastStore";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

const toastConfig = {
  success: {
    icon: CheckCircle2,
    barColor: "bg-emerald-500",
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-500/30",
    bgAccent: "bg-emerald-500/8",
  },
  info: {
    icon: Info,
    barColor: "bg-blue-500",
    iconColor: "text-blue-500",
    borderColor: "border-blue-500/30",
    bgAccent: "bg-blue-500/8",
  },
  warning: {
    icon: AlertTriangle,
    barColor: "bg-amber-500",
    iconColor: "text-amber-500",
    borderColor: "border-amber-500/30",
    bgAccent: "bg-amber-500/8",
  },
  error: {
    icon: XCircle,
    barColor: "bg-red-500",
    iconColor: "text-red-500",
    borderColor: "border-red-500/30",
    bgAccent: "bg-red-500/8",
  },
} as const;

interface ToastProps {
  toast: ToastItem;
}

const ToastCard: React.FC<ToastProps> = ({ toast }) => {
  const dismissToast = useToastStore((s) => s.dismissToast);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number | null>(null);
  const remainingRef = useRef<number>(toast.timeout);

  const cfg = toastConfig[toast.type];
  const Icon = cfg.icon;

  const defaultTitles = {
    success: "Thành công",
    error: "Lỗi",
    warning: "Cảnh báo",
    info: "Thông báo",
  };
  const displayTitle = toast.title || defaultTitles[toast.type];

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleDismiss = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLeaving(true);
    setTimeout(() => dismissToast(toast.id), 320);
  }, [dismissToast, toast.id]);

  const startProgress = useCallback(() => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.max(0, 100 - (elapsed / remainingRef.current) * 100);
      setProgress(pct);
      if (pct <= 0) handleDismiss();
    }, 16);
  }, [handleDismiss]);

  const pauseProgress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const elapsed = Date.now() - startTimeRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    pausedAtRef.current = Date.now();
  };

  useEffect(() => {
    startProgress();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startProgress]);

  return (
    <div
      onMouseEnter={pauseProgress}
      onMouseLeave={startProgress}
      style={{
        transform:
          visible && !leaving
            ? "translateX(0)"
            : "translateX(calc(100% + 24px))",
        opacity: leaving ? 0 : visible ? 1 : 0,
        transition: leaving
          ? "transform 0.3s cubic-bezier(0.4,0,1,1), opacity 0.3s ease"
          : "transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.3s ease",
        maxWidth: "380px",
        minWidth: "300px",
        willChange: "transform, opacity",
      }}
      className={cn(
        "relative w-full rounded-xl border shadow-lg overflow-hidden",
        "bg-background/95 backdrop-blur-md",
        cfg.borderColor,
      )}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl",
          cfg.barColor,
        )}
      />

      <div
        className={cn("flex items-start gap-3 px-4 py-3.5 pl-5", cfg.bgAccent)}
      >
        <div className="mt-0.5 shrink-0">
          <Icon className={cn("size-5", cfg.iconColor)} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          {displayTitle && (
            <p
              className={cn(
                "text-sm font-bold leading-tight mb-0.5",
                cfg.iconColor,
              )}
            >
              {displayTitle}
            </p>
          )}
          <p
            className={cn(
              "text-xs leading-snug font-medium opacity-85",
              cfg.iconColor,
            )}
          >
            {toast.message}
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="shrink-0 mt-0.5 rounded-md p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-150"
          aria-label="Dismiss"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <Progress
        value={progress}
        className="h-1 rounded-none bg-muted/40"
        indicatorClassName={cn(
          toast.type === "success" && "bg-emerald-500",
          toast.type === "info" && "bg-blue-500",
          toast.type === "warning" && "bg-amber-500",
          toast.type === "error" && "bg-red-500",
        )}
      />
    </div>
  );
};

export default ToastCard;
