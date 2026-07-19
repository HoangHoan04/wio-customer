import { ChevronDown, ChevronUp } from "lucide-react";
import { forwardRef } from "react";

export interface InputNumberProps {
  label?: string;
  tooltip?: string;
  error?: string;
  wrapperClassName?: string;
  showButtons?: boolean;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  value?: number | string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      label,
      tooltip,
      error,
      wrapperClassName = "",
      className = "",
      id,
      showButtons = true,
      onValueChange,
      min,
      max,
      step = 1,
      value,
      onChange,
      disabled,
      ...rest
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value === "" ? null : parseFloat(e.target.value);
      onChange?.(e);
      onValueChange?.(val);
    };

    const increment = () => {
      if (disabled) return;
      const currentValue = value ? parseFloat(String(value)) : 0;
      const newValue = currentValue + step;
      if (max === undefined || newValue <= max) {
        const event = {
          target: { value: String(newValue) },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(event);
        onValueChange?.(newValue);
      }
    };

    const decrement = () => {
      if (disabled) return;
      const currentValue = value ? parseFloat(String(value)) : 0;
      const newValue = currentValue - step;
      if (min === undefined || newValue >= min) {
        const event = {
          target: { value: String(newValue) },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(event);
        onValueChange?.(newValue);
      }
    };

    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          input[type=number]::-webkit-inner-spin-button, 
          input[type=number]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
          }
          input[type=number] {
            -moz-appearance: textfield;
          }
        `,
          }}
        />

        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none"
          >
            {label}
          </label>
        )}

        <div
          className={`
            relative flex items-center rounded-lg border transition-all duration-200 group
            bg-white dark:bg-[#191919]
            ${disabled ? "bg-gray-50 dark:bg-gray-900/50 cursor-not-allowed" : ""}
            ${
              error
                ? "border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200"
                : "border-gray-300 dark:border-gray-700 focus-within:border-[#d4af37] focus-within:ring-2 focus-within:ring-[rgba(212,175,55,0.15)]"
            }
          `}
        >
          <input
            id={inputId}
            ref={ref}
            type="number"
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={`
              w-full pl-4 pr-10 py-2.5 rounded-lg bg-transparent
              text-gray-900 dark:text-gray-100 outline-none text-sm
              disabled:text-gray-400 disabled:cursor-not-allowed
              placeholder:text-gray-400
              ${className}
            `}
            {...rest}
          />

          {showButtons && !disabled && (
            <div className="absolute right-1 top-1 bottom-1 w-7 flex flex-col border-l border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
              <button
                type="button"
                onClick={increment}
                disabled={max !== undefined && Number(value) >= max}
                className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-[#d4af37] dark:hover:text-[#d4af37] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors rounded-tr-md"
              >
                <ChevronUp size={14} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={decrement}
                disabled={min !== undefined && Number(value) <= min}
                className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-[#d4af37] dark:hover:text-[#d4af37] disabled:opacity-30 disabled:hover:text-gray-400 border-t border-gray-150 dark:border-gray-700 transition-colors rounded-br-md"
              >
                <ChevronDown size={14} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        {error && <span className="text-xs text-red-500 font-medium pl-0.5">{error}</span>}
      </div>
    );
  }
);

InputNumber.displayName = "InputNumber";

export default InputNumber;
