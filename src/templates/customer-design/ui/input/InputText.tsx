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
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-4 flex items-center justify-center pointer-events-none text-gray-400 dark:text-gray-500">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            type={type}
            className={`
              w-full h-12 rounded-lg border transition-all duration-200
              bg-white dark:bg-[#191919]
              ${leftIcon ? "pl-11!" : "px-4!"} 
              ${rightIcon ? "pr-11!" : "px-4!"}
              ${
                error
                  ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 dark:border-gray-600 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
              }
              text-gray-900 dark:text-gray-100
              placeholder:text-gray-400
              disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
              outline-none
              ${className}
            `}
            {...rest}
          />

          {rightIcon && (
            <div className="absolute right-4 flex items-center justify-center text-gray-400 dark:text-gray-500">
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
