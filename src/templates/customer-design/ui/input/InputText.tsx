import { forwardRef, type ComponentPropsWithRef, type ReactNode } from "react";

export interface InputTextProps extends ComponentPropsWithRef<"input"> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  className?: string;
  id?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  (
    {
      label,
      error,
      wrapperClassName = "",
      className = "",
      id,
      type = "text",
      leftIcon,
      rightIcon,
      ...rest
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#2D231F]">
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-4 flex items-center justify-center pointer-events-none text-[#7A6A5C]">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            className={`
              w-full h-12 rounded-lg border transition-all duration-200
              bg-[#F3EDE3] border-[#D9CDBE] text-[#2D231F]
              ${leftIcon ? "pl-11!" : "px-4!"}
              ${rightIcon ? "pr-11!" : "px-4!"}
              ${
                error
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "focus:border-[#2D231F] focus:ring-2 focus:ring-[rgba(45,35,31,0.1)]"
              }
              placeholder:text-[#7A6A5C]/50
              disabled:bg-[#EDE4D5] disabled:text-[#7A6A5C] disabled:cursor-not-allowed
              outline-none
              ${className}
            `}
            {...rest}
          />

          {rightIcon && (
            <div className="absolute right-4 flex items-center justify-center text-[#7A6A5C]">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
      </div>
    );
  }
);

InputText.displayName = "InputText";

export default InputText;
