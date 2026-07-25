import { forwardRef } from "react";

export interface InputSwitchProps {
  label?: string;
  description?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  wrapperClassName?: string;
  switchSize?: "sm" | "md" | "lg";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  disabled?: boolean;
}

const sizeMap = {
  sm: { 
    wrapper: "w-9 h-5", 
    thumb: "w-4 h-4", 
    translate: "translate-x-4",
    label: "text-xs",
    desc: "text-[10px]"
  },
  md: { 
    wrapper: "w-11 h-6", 
    thumb: "w-5 h-5", 
    translate: "translate-x-5",
    label: "text-sm",
    desc: "text-xs"
  },
  lg: { 
    wrapper: "w-14 h-7", 
    thumb: "w-6 h-6", 
    translate: "translate-x-7",
    label: "text-base",
    desc: "text-sm"
  },
};

const InputSwitch = forwardRef<HTMLInputElement, InputSwitchProps>(
  (
    {
      label,
      description,
      checked,
      onCheckedChange,
      wrapperClassName = "",
      switchSize = "md",
      onChange,
      id,
      disabled,
      ...rest
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const sizes = sizeMap[switchSize];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <div className={`flex items-center gap-3 ${wrapperClassName}`}>
        <label
          htmlFor={inputId}
          className={`
            relative inline-flex shrink-0 ${sizes.wrapper} cursor-pointer rounded-full transition-all duration-200
            ${checked ? "bg-[#d4af37]" : "bg-gray-300 dark:bg-gray-600"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only peer"
            {...rest}
          />
          <span
            className={`
              absolute top-0.5 left-0.5 ${sizes.thumb} rounded-full bg-white shadow-md
              transition-transform duration-200
              ${checked ? sizes.translate : "translate-x-0"}
            `}
          />
        </label>
        
        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <label
                htmlFor={inputId}
                className={`font-medium text-gray-700 dark:text-gray-300 ${sizes.label} ${
                  disabled ? "opacity-50" : "cursor-pointer"
                }`}
              >
                {label}
              </label>
            )}
            {description && (
              <span className={`text-gray-500 ${sizes.desc} ${disabled ? "opacity-50" : ""}`}>
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

InputSwitch.displayName = "InputSwitch";

export default InputSwitch;