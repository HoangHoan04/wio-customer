import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import InputDate from "./InputDate";
import InputTime from "./InputTime";

interface InputDateTimeProps {
  label?: string;
  value?: string;
  onChange?: (val: string) => void;
  required?: boolean;
  className?: string;
}

export default function InputDateTime({
  label,
  value = "",
  onChange,
  required = false,
  className = "",
}: InputDateTimeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [datePart, timePart] = value.includes("T") ? value.split("T") : value.split(" ");
  const displayDate = datePart || "";
  const displayTime = timePart || "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateTimeLabel = (dVal: string, tVal: string) => {
    if (!dVal) return "Chọn ngày & giờ...";
    const d = new Date(dVal);
    if (isNaN(d.getTime())) return dVal;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year} ${tVal || "00:00"}`;
  };

  const handleDateChange = (newDate: string) => {
    const nextTime = displayTime || "12:00";
    onChange?.(`${newDate}T${nextTime}`);
  };

  const handleTimeChange = (newTime: string) => {
    const nextDate = displayDate || new Date().toISOString().split("T")[0];
    onChange?.(`${nextDate}T${newTime}`);
  };

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
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 bg-[#F3EDE3] border border-[#D9CDBE] hover:border-[#2D231F]/45 text-[#2D231F] px-3.5 flex items-center justify-between rounded-lg text-sm cursor-pointer select-none transition-colors"
      >
        <span className={value ? "text-[#2D231F]" : "text-[#2D231F]/40"}>
          {formatDateTimeLabel(displayDate, displayTime)}
        </span>
        <CalendarIcon size={16} className="text-[#2D231F]/65" />
      </div>

      {isOpen && (
        <div className="absolute top-18.5 left-0 z-50 w-full bg-[#F3EDE3]/95 border border-[#2D231F]/35 rounded-xl p-4 shadow-2xl backdrop-blur-md flex flex-col gap-4">
          <div className="text-xs font-bold text-[#2D231F] border-b border-[#2D231F]/15 pb-2 uppercase tracking-wide">
            Cấu hình thời gian
          </div>

          <InputDate label="1. Chọn ngày" value={displayDate} onChange={handleDateChange} />
          <InputTime label="2. Chọn giờ" value={displayTime} onChange={handleTimeChange} />
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full h-8 bg-[#2D231F] text-[#F3EDE3] font-bold text-xs rounded-lg border-none cursor-pointer hover:bg-[#C4B09A] transition-colors mt-1"
          >
            Xác nhận
          </button>
        </div>
      )}
    </div>
  );
}
