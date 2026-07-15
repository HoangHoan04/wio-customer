"use client";

import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Chọn ngày",
  className,
}: DatePickerProps) {
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    const parts = value.split("-");
    if (parts.length !== 3) return undefined;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    return isNaN(d.getTime()) ? undefined : d;
  }, [value]);

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-start text-left font-normal bg-white/5! border-[#d4af37]/10! text-[#f5e6d3] hover:bg-white/10 hover:text-white",
          !value && "text-muted-foreground",
          className,
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-[#d4af37]" />
        {dateValue ? (
          format(dateValue, "dd/MM/yyyy")
        ) : (
          <span>{placeholder}</span>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-[#0f0608] border border-[#d4af37]/20"
        align="start"
      >
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={(date) => {
            if (date) {
              onChange(format(date, "yyyy-MM-dd"));
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
