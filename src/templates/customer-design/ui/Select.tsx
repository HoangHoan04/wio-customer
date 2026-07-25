import { Check, ChevronDown, X } from "lucide-react";
import type { ReactNode } from "react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface SelectOption {
  label: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  onValueChange?: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  wrapperClassName?: string;
  className?: string;
  popupClassName?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-9 text-xs",
  md: "h-11 text-base",
  lg: "h-13 text-lg",
};

const menuTextSizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      options,
      value,
      defaultValue,
      onValueChange,
      placeholder = "Chọn một tùy chọn...",
      error,
      disabled = false,
      clearable = false,
      searchable = false,
      wrapperClassName = "",
      className = "",
      popupClassName = "",
      size = "md",
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [popupPos, setPopupPos] = useState<{ top: number; left: number; width: number } | null>(null);

    const currentValue =
      value !== undefined && value !== null && value !== "" ? value : defaultValue;
    const selectedOption = options.find((opt) => String(opt.value) === String(currentValue));

    const filteredOptions = searchable
      ? options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : options;

    const updatePopupPos = useCallback(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPopupPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
      }
    }, []);

    useEffect(() => {
      if (isOpen) {
        updatePopupPos();
      } else {
        setPopupPos(null);
        setSearchQuery("");
      }
    }, [isOpen, updatePopupPos]);

    useEffect(() => {
      if (!isOpen) return;
      const handle = () => updatePopupPos();
      window.addEventListener("scroll", handle, true);
      window.addEventListener("resize", handle);
      return () => {
        window.removeEventListener("scroll", handle, true);
        window.removeEventListener("resize", handle);
      };
    }, [isOpen, updatePopupPos]);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        const isInsideContainer = containerRef.current?.contains(target);
        const isInsidePopup = popupRef.current?.contains(target);
        if (!isInsideContainer && !isInsidePopup) {
          setIsOpen(false);
          setSearchQuery("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      if (isOpen && searchable && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpen, searchable]);

    const handleSelect = (optionValue: string | number) => {
      if (disabled) return;
      onValueChange?.(optionValue);
      setIsOpen(false);
      setSearchQuery("");
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange?.("" as any);
    };

    const handleToggle = () => {
      if (disabled) return;
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchQuery("");
      }
    };

    return (
      <div ref={ref} className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        )}

        <div ref={containerRef} className="relative">
          <div ref={triggerRef}
            onClick={handleToggle}
            className={`
              ${sizeMap[size]} w-full px-4 rounded-lg border transition-all duration-200
              flex items-center justify-between gap-2
              bg-white dark:bg-[#191919]
              ${
                error
                  ? "border-red-400"
                  : isOpen
                    ? "border-[#d4af37] ring-2 ring-[rgba(212,175,55,0.2)]"
                    : "border-gray-300 dark:border-gray-600"
              }
              ${
                disabled
                  ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:border-[#d4af37]"
              }
              ${className}
            `}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
              <span
                className={`truncate ${
                  selectedOption ? "text-gray-900 dark:text-gray-100" : "text-gray-400"
                }`}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {clearable && selectedOption && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <X size={14} className="text-gray-500" />
                </button>
              )}
              <ChevronDown
                size={18}
                className={`text-gray-500 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
          {isOpen && popupPos && createPortal(
            <div
              ref={popupRef}
              style={{
                position: "fixed",
                top: popupPos.top,
                left: popupPos.left,
                width: popupPos.width,
                zIndex: 9999,
              }}
              className="py-1 bg-white dark:bg-[#191919] border border-[#d4af37] rounded-lg shadow-lg max-h-60 overflow-auto animate-dropdown-in"
            >
              {searchable && (
                <div className="px-2 pb-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm..."
                    className={`
                      w-full px-3 py-2 ${menuTextSizeMap[size]}
                      border border-gray-300 dark:border-gray-600 rounded
                      bg-white dark:bg-[#191919]
                      text-gray-900 dark:text-gray-100
                      placeholder:text-gray-400
                      focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[rgba(212,175,55,0.2)]
                    `}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              <div>
                {filteredOptions.length === 0 ? (
                  <div className={`px-4 py-3 ${menuTextSizeMap[size]} text-gray-500 text-center`}>
                    Không tìm thấy kết quả
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = String(option.value) === String(currentValue);
                    const isDisabled = option.disabled;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => !isDisabled && handleSelect(option.value)}
                        disabled={isDisabled}
                        className={`
                          w-full px-4 py-2.5 text-left
                          flex items-center justify-between gap-2
                          transition-colors duration-150
                          ${menuTextSizeMap[size]}
                          ${
                            isSelected
                              ? "bg-[rgba(212,175,55,0.1)] text-[#d4af37]"
                              : "text-gray-900 dark:text-gray-100"
                          }
                          ${
                            isDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-[rgba(212,175,55,0.08)] cursor-pointer"
                          }
                        `}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {option.icon && <span className="shrink-0">{option.icon}</span>}
                          <div className="flex-1 min-w-0">
                            <div className="truncate font-medium">{option.label}</div>
                            {option.description && (
                              <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                {option.description}
                              </div>
                            )}
                          </div>
                        </div>
                        {isSelected && <Check size={16} className="shrink-0 text-[#d4af37]" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>,
            document.body
          )}
        </div>

        {error && <span className="text-xs text-red-500">{error}</span>}

        <style>{`
          @keyframes dropdown-in {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-dropdown-in {
            animation: dropdown-in 0.15s ease-out;
          }
        `}</style>
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
