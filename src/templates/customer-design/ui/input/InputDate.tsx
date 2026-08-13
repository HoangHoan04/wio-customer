import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface InputDateProps {
  label?: string;
  value?: string;
  onChange?: (val: string) => void;
  required?: boolean;
  className?: string;
}

export default function InputDate({
  label,
  value = "",
  onChange,
  required = false,
  className = "",
}: InputDateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);

  const parsedDate = value ? new Date(value) : new Date();
  const [currentYear, setCurrentYear] = useState(parsedDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(parsedDate.getMonth());

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setCurrentYear(d.getFullYear());
        setCurrentMonth(d.getMonth());
      }
    }
  }, [value]);

  const updatePopupPos = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPopupPos({ top: rect.bottom + 4, left: rect.left });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePopupPos();
    } else {
      setPopupPos(null);
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
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideContainer = containerRef.current?.contains(target);
      const isInsidePopup = popupRef.current?.contains(target);
      if (!isInsideContainer && !isInsidePopup) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateLabel = (val: string) => {
    if (!val) return "";
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    const formatted = `${y}-${m}-${d}`;
    if (onChange) {
      onChange(formatted);
    }
    setIsOpen(false);
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-1.5 relative w-full text-left ${className}`}
    >
      {label && (
        <label className="text-xs font-semibold text-[#2D231F]/85">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 bg-[#F3EDE3] border border-[#D9CDBE] hover:border-[#2D231F]/45 text-[#2D231F] px-3.5 flex items-center justify-between rounded-lg text-sm cursor-pointer select-none transition-colors"
      >
        <span className={value ? "text-[#2D231F]" : "text-[#2D231F]/40"}>
          {value ? formatDateLabel(value) : "Chọn ngày..."}
        </span>
        <CalendarIcon size={16} className="text-[#2D231F]/65" />
      </div>

      {isOpen && (
        <div className="absolute top-18.5 left-0 z-50 w-full  bg-[#F3EDE3]/95 border border-[#2D231F]/35 rounded-xl p-4 shadow-2xl backdrop-blur-md flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#2D231F]/15 pb-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 text-[#2D231F]/60 hover:text-[#2D231F] hover:bg-white/5 rounded-md cursor-pointer border-none bg-transparent transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-[#2D231F]">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 text-[#2D231F]/60 hover:text-[#2D231F] hover:bg-white/5 rounded-md cursor-pointer border-none bg-transparent transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[#2D231F]/40">
            {weekdays.map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={idx} className="h-7 w-7" />;
              }

              const isSelected =
                value &&
                parsedDate.getDate() === day &&
                parsedDate.getMonth() === currentMonth &&
                parsedDate.getFullYear() === currentYear;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-7 w-7 rounded-full flex items-center justify-center cursor-pointer transition-all border-none font-medium
                    ${
                      isSelected
                        ? "bg-linear-to-r from-[#2D231F] to-[#C4B09A] text-[#F3EDE3]"
                        : "bg-transparent text-[#2D231F] hover:bg-[#2D231F]/15"
                    }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
