import { forwardRef, type ReactNode } from "react";

type InputVariant = "default" | "filled" | "ghost";
type InputSize = "sm" | "md" | "lg";

export interface InputProps {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  hint?: string;
  variant?: InputVariant;
  inputSize?: InputSize;
  wrapperClassName?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
  type: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const variantBase: Record<InputVariant, string> = {
  default:
    "bg-[#F3EDE3] border border-[#D9CDBE] focus:border-[#2D231F] focus:ring-2 focus:ring-[rgba(45,35,31,0.1)]",
  filled:
    "bg-[#EDE4D5] border border-[#D9CDBE] focus:border-[#2D231F] focus:ring-2 focus:ring-[rgba(45,35,31,0.1)]",
  ghost:
    "bg-transparent border-0 border-b border-[#D9CDBE] rounded-none focus:border-b-[#2D231F] focus:ring-0",
};

const sizeMap: Record<
  InputSize,
  { input: string; icon: string; text: string }
> = {
  sm: { input: "h-9 px-3 text-sm", icon: "px-2.5", text: "text-xs" },
  md: { input: "h-11 px-4 text-sm", icon: "px-3", text: "text-sm" },
  lg: { input: "h-13 px-5 text-base", icon: "px-4", text: "text-sm" },
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      leftIcon,
      rightIcon,
      error,
      hint,
      variant = "default",
      inputSize = "md",
      wrapperClassName = "",
      className = "",
      id,
      disabled,
      type,
      value,
      onChange,
      placeholder,
      style,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const inputId =
      id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const sizes = sizeMap[inputSize];

    const baseInput = [
      "w-full rounded-md outline-none transition-all duration-200",
      "text-[#2D231F] placeholder:text-[#7A6A5C]/50",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      variantBase[variant],
      sizes.input,
      leftIcon ? "pl-10" : "",
      rightIcon ? "pr-10" : "",
      error
        ? "!border-red-500/70 focus:!border-red-500 focus:!ring-red-500/20"
        : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-semibold tracking-[2px] uppercase text-[#7A6A5C] select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span
              className={`absolute left-0 flex items-center justify-center text-[#7A6A5C] pointer-events-none h-full ${sizes.icon}`}
            >
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={baseInput}
            type={type}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            style={style}
            {...rest}
          />
          {rightIcon && (
            <span
              className={`absolute right-0 flex items-center justify-center text-[#7A6A5C] h-full ${sizes.icon}`}
            >
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p className={`${sizes.text} text-red-400 flex items-center gap-1`}>
            <span>⚠</span> {error}
          </p>
        )}

        {!error && hint && (
          <p className={`${sizes.text} text-[#7A6A5C]`}>{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
