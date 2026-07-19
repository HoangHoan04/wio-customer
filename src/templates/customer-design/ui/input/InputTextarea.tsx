import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export interface InputTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  showCount?: boolean;
  maxCount?: number;
  value?: string;
  autoResize?: boolean;
}

const InputTextarea = forwardRef<HTMLTextAreaElement, InputTextareaProps>(
  (
    {
      label,
      error,
      wrapperClassName = "",
      className = "",
      id,
      showCount = false,
      maxCount,
      value,
      autoResize = true,
      onChange,
      ...rest
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const currentCount = value ? String(value).length : 0;
    const localRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => localRef.current!);
    const adjustHeight = () => {
      const ta = localRef.current;
      if (ta && autoResize) {
        ta.style.height = "auto";
        ta.style.height = `${ta.scrollHeight}px`;
      }
    };
    useEffect(() => {
      adjustHeight();
    }, [value, autoResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      adjustHeight();
    };

    return (
      <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={localRef}
          value={value}
          maxLength={maxCount}
          onChange={handleChange}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-all duration-200
            bg-white dark:bg-gray-800
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 dark:border-gray-600 focus:border-[#d4af37] focus:ring-2 focus:ring-[rgba(212,175,55,0.2)]"
            }
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            outline-none
            ${autoResize ? "resize-none overflow-hidden" : "resize-y"} 
            ${className}
          `}
          {...rest}
        />
        <div className="flex items-center justify-between">
          {error && <span className="text-xs text-red-500">{error}</span>}
          {showCount && (
            <span className={`text-xs ${error ? "ml-auto" : ""} text-gray-500`}>
              {currentCount}
              {maxCount && ` / ${maxCount}`}
            </span>
          )}
        </div>
      </div>
    );
  }
);

InputTextarea.displayName = "InputTextarea";

export default InputTextarea;
