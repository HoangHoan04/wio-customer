"use client";

import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import * as React from "react";

interface TimePickerProps {
  value?: string; // "HH:MM"
  onChange: (value: string) => void;
  className?: string;
}

export function TimePicker({ value = "12:00", onChange, className }: TimePickerProps) {
  const [inputValue, setInputValue] = React.useState(value);
  const [isOpen, setIsOpen] = React.useState(false);

  // Sync state with prop value
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const [hour, minute] = React.useMemo(() => {
    const parts = value.split(":");
    return [parts[0] || "12", parts[1] || "00"];
  }, [value]);

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  // Handle manual input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // Validate HH:MM format
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val)) {
      onChange(val);
    }
  };

  const handleHourSelect = (h: string) => {
    const newVal = `${h}:${minute}`;
    setInputValue(newVal);
    onChange(newVal);
  };

  const handleMinuteSelect = (m: string) => {
    const newVal = `${hour}:${m}`;
    setInputValue(newVal);
    onChange(newVal);
  };

  // Scroll active elements into view when popover opens
  const hourRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const minuteRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>({});

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        hourRefs.current[hour]?.scrollIntoView({ block: "nearest" });
        minuteRefs.current[minute]?.scrollIntoView({ block: "nearest" });
      }, 50);
    }
  }, [isOpen, hour, minute]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger nativeButton={false} render={<div className={cn("relative w-full cursor-pointer", className)} />}>
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="12:00"
          className="w-full bg-white/5! border-[#d4af37]/10! text-[#f5e6d3] pr-10"
          onFocus={() => setIsOpen(true)}
        />
        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#d4af37] pointer-events-none" />
      </PopoverTrigger>
      <PopoverContent className="w-[var(--anchor-width)]! min-w-44 p-2 bg-[#0f0608] border border-[#d4af37]/20 flex-row! gap-2" align="start">
        {/* Hours list */}
        <div className="flex-1 flex flex-col overflow-y-auto max-h-48 custom-scrollbar">
          <div className="text-[10px] text-center font-bold text-[#d4af37] mb-1 select-none border-b border-[#d4af37]/10 pb-1">Giờ</div>
          {hours.map((h) => {
            const isSelected = h === hour;
            return (
              <button
                key={h}
                ref={(el) => { hourRefs.current[h] = el; }}
                onClick={() => handleHourSelect(h)}
                className={cn(
                  "py-1 text-xs text-[#f5e6d3] rounded-md transition-all select-none cursor-pointer",
                  isSelected ? "bg-[#d4af37] text-black font-bold" : "hover:bg-white/5"
                )}
              >
                {h}
              </button>
            );
          })}
        </div>
        
        {/* Divider */}
        <div className="w-[1px] bg-[#d4af37]/20 self-stretch" />

        {/* Minutes list */}
        <div className="flex-1 flex flex-col overflow-y-auto max-h-48 custom-scrollbar">
          <div className="text-[10px] text-center font-bold text-[#d4af37] mb-1 select-none border-b border-[#d4af37]/10 pb-1">Phút</div>
          {minutes.map((m) => {
            const isSelected = m === minute;
            return (
              <button
                key={m}
                ref={(el) => { minuteRefs.current[m] = el; }}
                onClick={() => handleMinuteSelect(m)}
                className={cn(
                  "py-1 text-xs text-[#f5e6d3] rounded-md transition-all select-none cursor-pointer",
                  isSelected ? "bg-[#d4af37] text-black font-bold" : "hover:bg-white/5"
                )}
              >
                {m}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
