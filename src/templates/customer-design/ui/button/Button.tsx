import { forwardRef, type ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "gold";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: ButtonVariant;
  buttonSize?: ButtonSize;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  children?: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
}
const variantBase: Record<ButtonVariant, string> = {
  primary:
    "bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#1a0a0f] hover:opacity-90 shadow-lg shadow-[#d4af37]/30",
  secondary:
    "bg-[#d4af37]/15 text-[#f5c842] border border-[#d4af37]/40 hover:bg-[#d4af37]/25",
  outline:
    "bg-transparent text-[#d4af37] border border-[#d4af37] hover:bg-[#d4af37]/10",
  success: "bg-green-500 text-white hover:bg-green-600",
  error: "bg-red-500 text-white hover:bg-red-600",
  warning: "bg-yellow-500 text-[#1a0a0f] hover:bg-yellow-600",
  info: "bg-blue-500 text-white hover:bg-blue-600",
  gold: "bg-[#d4af37] text-[#1a0a0f] hover:bg-[#f5c842] shadow-md",
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      children,
      leftIcon,
      rightIcon,
      variant = "primary",
      buttonSize = "md",
      loading = false,
      className = "",
      disabled,
      onClick,
      type,
      style,
      ...rest
    },
    ref,
  ) => {
    const baseButton = [
      "inline-flex items-center justify-center gap-2 rounded-md cursor-pointer",
      "transition-all duration-300 outline-none focus:ring-2 focus:ring-[#d4af37]/50 focus:ring-offset-2 focus:ring-offset-[#1a0a0f]",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
      variantBase[variant],
      sizeMap[buttonSize],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={baseButton}
        disabled={disabled || loading}
        onClick={onClick}
        type={type}
        style={style}
        {...rest}
      >
        {loading && <i className="pi pi-spin pi-spinner text-lg"></i>}
        {!loading && leftIcon && <span>{leftIcon}</span>}
        {children || label}
        {!loading && rightIcon && <span>{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
