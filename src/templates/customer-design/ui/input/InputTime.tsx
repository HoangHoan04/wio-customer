import { Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface InputTimeProps {
  label?: string;
  value?: string;
  onChange?: (val: string) => void;
  required?: boolean;
  className?: string;
}

export default function InputTime({
  label,
  value = "",
  onChange,
  required = false,
  className = "",
}: InputTimeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

  const [selectedHour, selectedMinute] = value ? value.split(":") : ["12", "00"];

  const handleSelectHour = (h: string) => {
    const nextVal = `${h}:${selectedMinute}`;
    if (onChange) onChange(nextVal);
  };

  const handleSelectMinute = (m: string) => {
    const nextVal = `${selectedHour}:${m}`;
    if (onChange) onChange(nextVal);
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
          {value || "Chọn giờ..."}
        </span>
        <Clock size={16} className="text-[#2D231F]/65" />
      </div>

      {isOpen && (
        <div className="absolute top-18.5 left-0 z-50 w-50 h-60 bg-[#F3EDE3]/95 border border-[#2D231F]/35 rounded-xl p-3 shadow-2xl backdrop-blur-md flex gap-2">
          <div
            className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1 border-r border-[#2D231F]/10"
            style={{ scrollbarWidth: "none" }}
          >
            <span className="text-[10px] text-center font-bold text-[#2D231F] pb-1 uppercase tracking-wider sticky top-0 bg-[#F3EDE3] z-10">
              Giờ
            </span>
            {hours.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => handleSelectHour(h)}
                className={`py-1 rounded text-xs border-none cursor-pointer text-center font-medium transition-all
                  ${
                    selectedHour === h
                      ? "bg-[#2D231F] text-[#F3EDE3] font-bold"
                      : "bg-transparent text-[#2D231F] hover:bg-white/5"
                  }`}
              >
                {h}
              </button>
            ))}
          </div>

          <div
            className="flex-1 flex flex-col gap-1 overflow-y-auto pl-1"
            style={{ scrollbarWidth: "none" }}
          >
            <span className="text-[10px] text-center font-bold text-[#2D231F] pb-1 uppercase tracking-wider sticky top-0 bg-[#F3EDE3] z-10">
              Phút
            </span>
            {minutes.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleSelectMinute(m)}
                className={`py-1 rounded text-xs border-none cursor-pointer text-center font-medium transition-all
                  ${
                    selectedMinute === m
                      ? "bg-[#2D231F] text-[#F3EDE3] font-bold"
                      : "bg-transparent text-[#2D231F] hover:bg-white/5"
                  }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
