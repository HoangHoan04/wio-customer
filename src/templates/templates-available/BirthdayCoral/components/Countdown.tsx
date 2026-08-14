import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export const Countdown = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const eventDateStr =
    data?.party?.eventDate ||
    data?.ceremony?.eventDate ||
    data?.events?.[0]?.eventDate;

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!eventDateStr) return;
    const target = new Date(eventDateStr).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [eventDateStr]);

  if (!eventDateStr) return null;

  const units = [
    { label: "Ngày", val: timeLeft.days },
    { label: "Giờ", val: timeLeft.hours },
    { label: "Phút", val: timeLeft.minutes },
    { label: "Giây", val: timeLeft.seconds },
  ];

  return (
    <div className="w-full px-6 py-4 flex flex-col items-center">
      <div className="w-full max-w-sm bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-300/60 rounded-3xl p-5 shadow-xs backdrop-blur-xs flex flex-col items-center">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 mb-3">
          <Clock className="size-3.5 text-orange-600 animate-pulse" />
          <span>Đếm ngược tới ngày sinh nhật</span>
        </div>

        <div className="grid grid-cols-4 gap-2 w-full">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="bg-white/90 rounded-2xl py-2.5 px-1 border border-orange-200/60 shadow-xs flex flex-col items-center justify-center"
            >
              <span
                className="text-xl sm:text-2xl font-black text-orange-950 font-mono"
                style={{ fontFamily: config.fonts.heading }}
              >
                {String(unit.val).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-semibold text-orange-700/80 uppercase">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
