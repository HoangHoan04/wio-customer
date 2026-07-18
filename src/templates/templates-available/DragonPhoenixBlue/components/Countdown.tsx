import cloudSmall from "@/assets/decorations/dragon_phoenix_blue/cloud_small.webp";
import type { ThemeTemplateConfig } from '@/dto/theme.dto';
import { useEffect, useState } from 'react';

export const Countdown = ({ data, config }: { data?: any, config: ThemeTemplateConfig }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!data?.partyDate) return;

    const targetTimeStr = `${data.partyDate}T${data.partyWelcomeTime || "00:00"}:00`;
    const targetDate = new Date(targetTimeStr).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.partyDate, data?.partyWelcomeTime]);

  if (!data?.showParty || !data?.showCountdown || !data?.partyDate) return null;

  const TimeBox = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center justify-center bg-white/5 border rounded-xl w-16 h-20 md:w-20 md:h-24 shadow-sm" style={{ borderColor: config.colors.accent }}>
      <span className="text-2xl md:text-3xl font-light mb-1" style={{ fontFamily: config.fonts.heading, color: config.colors.textPrimary }}>
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] md:text-xs uppercase tracking-widest opacity-80" style={{ fontFamily: config.fonts.body, color: config.colors.textSecondary }}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="relative flex flex-col items-center justify-center text-center w-full overflow-hidden">
      <img src={cloudSmall.src} alt="" aria-hidden="true" className="absolute left-0 top-1/2 -translate-y-1/2 w-20 md:w-36 opacity-15 pointer-events-none -translate-x-6 select-none z-0" />
      <h3 className="text-lg tracking-widest mb-6" style={{ fontFamily: config.fonts.body, color: config.colors.textPrimary }}>
        Cùng đếm ngược
      </h3>
      <div className="flex gap-3 md:gap-6 justify-center">
        <TimeBox value={timeLeft.days} label="Ngày" />
        <TimeBox value={timeLeft.hours} label="Giờ" />
        <TimeBox value={timeLeft.minutes} label="Phút" />
        <TimeBox value={timeLeft.seconds} label="Giây" />
      </div>
    </div>
  );
};
