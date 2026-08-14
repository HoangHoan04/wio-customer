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
    ref,
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
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#2D231F]"
          >
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
            bg-[#F3EDE3] border-[#D9CDBE] text-[#2D231F]
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : "focus:border-[#2D231F] focus:ring-2 focus:ring-[rgba(45,35,31,0.1)]"
            }
            placeholder:text-[#7A6A5C]/50
            disabled:bg-[#EDE4D5] disabled:text-[#7A6A5C] disabled:cursor-not-allowed
            outline-none
            ${autoResize ? "resize-none overflow-hidden" : "resize-y"}
            ${className}
          `}
          {...rest}
        />
        <div className="flex items-center justify-between">
          {error && <span className="text-xs text-red-500">{error}</span>}
          {showCount && (
            <span
              className={`text-xs ${error ? "ml-auto" : ""} text-[#7A6A5C]`}
            >
              {currentCount}
              {maxCount && ` / ${maxCount}`}
            </span>
          )}
        </div>
      </div>
    );
  },
);

InputTextarea.displayName = "InputTextarea";

export default InputTextarea;
