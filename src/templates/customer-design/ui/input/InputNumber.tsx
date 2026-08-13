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
            className="text-sm font-medium text-[#2D231F] select-none"
          >
            {label}
          </label>
        )}

        <div
          className={`
            relative flex items-center rounded-lg border transition-all duration-200 group
            bg-[#F3EDE3]
            ${disabled ? "bg-[#EDE4D5] cursor-not-allowed" : ""}
            ${
              error
                ? "border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200"
                : "border-[#D9CDBE] focus-within:border-[#2D231F] focus-within:ring-2 focus-within:ring-[rgba(45,35,31,0.1)]"
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
              text-[#2D231F] outline-none text-sm
              disabled:text-[#7A6A5C] disabled:cursor-not-allowed
              placeholder:text-[#7A6A5C]/50
              ${className}
            `}
            {...rest}
          />

          {showButtons && !disabled && (
            <div className="absolute right-1 top-1 bottom-1 w-7 flex flex-col border-l border-[#D9CDBE] opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
              <button
                type="button"
                onClick={increment}
                disabled={max !== undefined && Number(value) >= max}
                className="flex-1 flex items-center justify-center text-[#7A6A5C] hover:text-[#2D231F] disabled:opacity-30 disabled:hover:text-[#7A6A5C] transition-colors rounded-tr-md"
              >
                <ChevronUp size={14} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={decrement}
                disabled={min !== undefined && Number(value) <= min}
                className="flex-1 flex items-center justify-center text-[#7A6A5C] hover:text-[#2D231F] disabled:opacity-30 disabled:hover:text-[#7A6A5C] border-t border-[#D9CDBE] transition-colors rounded-br-md"
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
