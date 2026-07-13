import { Countdown } from "./Countdown";

import cloudBig from "@/assets/decorations/dragon_phoenix_blue/cloud_big.webp";
import {
  getDayStr,
  getLunarDateStr,
  getMonthStr,
  getStartEmptyDays,
  getWeekday,
  getYearStr,
} from "@/common/helpers";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";

export const PartyInfo = ({ data, config }: { data?: any; config: ThemeTemplateConfig }) => {
  if (!data) return null;

  const partyLunarDateStr = data?.partyLunarDate || getLunarDateStr(data?.partyDate);
  const startEmptyDays = getStartEmptyDays();
  const totalDaysInMonth = data?.partyDate
    ? new Date(
        new Date(data.partyDate).getFullYear(),
        new Date(data.partyDate).getMonth() + 1,
        0
      ).getDate()
    : 0;

  return (
    <div
      className="relative py-12 px-4 flex flex-col items-center text-center overflow-hidden z-10 w-full"
      style={{ backgroundColor: config.colors.background }}
    >
      <img
        src={cloudBig.src}
        alt="cloud"
        className="absolute right-0 top-1/2 -translate-y-1/2 w-40 md:w-56 opacity-20 pointer-events-none translate-x-12 select-none z-0"
      />

      <div className="w-full max-w-xl h-px bg-linear-to-r from-transparent via-[#c9a84c] to-transparent opacity-20 mb-12"></div>
      <h2
        className="text-xl md:text-2xl uppercase font-black mb-5"
        style={{
          fontFamily: config.fonts.heading,
          color: config.colors.textPrimary,
          textShadow: `0.5px 0 0 ${config.colors.textPrimary}, -0.5px 0 0 ${config.colors.textPrimary}`,
        }}
      >
        THÔNG TIN {data?.partyType === "engagement" ? "TIỆC BÁO HỶ" : "TIỆC CƯỚI"}
      </h2>

      <p
        className="text-md md:text-md uppercase tracking-widest font-bold mb-5"
        style={{ fontFamily: config.fonts.body, color: config.colors.textSecondary }}
      >
        {data?.partyType === "engagement" ? "TIỆC BÁO HỶ" : "TIỆC CƯỚI"} sẽ diễn ra vào lúc:
      </p>

      <div className="flex flex-col items-center mb-5 w-full max-w-md mx-auto">
        <p
          className="text-3xl md:text-4xl tracking-wide font-light mb-4"
          style={{ fontFamily: config.fonts.heading, color: config.colors.textPrimary }}
        >
          {data?.partyStartTime || "11:30 AM"}
        </p>

        <div
          className="flex flex-row items-center justify-center gap-4 w-full text-xs md:text-sm uppercase tracking-[0.15em] font-medium py-3 border-y border-gray-200/40"
          style={{ fontFamily: config.fonts.body, color: config.colors.textSecondary }}
        >
          <div className="flex-1 text-right pr-2">{getWeekday(data?.partyDate)}</div>
          <span className="h-5 w-px bg-gray-300"></span>
          <div
            className="text-4xl md:text-5xl font-light mx-2 px-1 min-w-15"
            style={{ fontFamily: config.fonts.heading, color: config.colors.textPrimary }}
          >
            {getDayStr(data?.partyDate)}
          </div>

          <span className="h-5 w-px bg-gray-300"></span>

          <div className="flex-1 text-left pl-2">Tháng {getMonthStr(data?.partyDate)}</div>
        </div>
        <p
          className="text-sm tracking-[0.2em] font-medium mt-4 mb-2 opacity-80"
          style={{ fontFamily: config.fonts.body, color: config.colors.textSecondary }}
        >
          NĂM {getYearStr(data?.partyDate)}
        </p>

        {partyLunarDateStr && (
          <p
            className="text-xs italic tracking-wide"
            style={{ fontFamily: config.fonts.body, color: config.colors.textSecondary }}
          >
            ({partyLunarDateStr})
          </p>
        )}
      </div>
      {data.showCountdown && (
        <div className="w-full mb-12">
          <Countdown data={data} config={config} />
        </div>
      )}
      <div
        className="w-full max-w-[320px] mb-6 bg-white/2 border rounded-xl p-5 shadow-sm relative z-10"
        style={{ borderColor: `${config.colors.accent}40` }}
      >
        <p
          className="text-sm font-bold tracking-widest uppercase mb-4"
          style={{ fontFamily: config.fonts.heading, color: config.colors.textPrimary }}
        >
          Tháng {getMonthStr(data?.partyDate)} / {getYearStr(data?.partyDate)}
        </p>
        <div
          className="grid grid-cols-7 gap-1 text-[10px] font-bold text-center mb-3 opacity-50"
          style={{ color: config.colors.textSecondary }}
        >
          <div>T2</div>
          <div>T3</div>
          <div>T4</div>
          <div>T5</div>
          <div>T6</div>
          <div>T7</div>
          <div className="text-red-700/80">CN</div>
        </div>
        <div
          className="grid grid-cols-7 gap-y-2 gap-x-1 text-xs text-center items-center justify-items-center"
          style={{ color: config.colors.textPrimary }}
        >
          {Array.from({ length: startEmptyDays }).map((_, i) => (
            <div key={`empty-${i}`} className="w-7 h-7"></div>
          ))}

          {Array.from({ length: totalDaysInMonth }).map((_, i) => {
            const day = i + 1;
            const isEventDay = day === (data?.partyDate ? Number(getDayStr(data.partyDate)) : null);

            return (
              <div
                key={day}
                className="relative flex items-center justify-center w-7 h-7 text-center rounded-full text-xs font-medium"
                style={{
                  backgroundColor: isEventDay ? config.colors.textPrimary : "transparent",
                  color: isEventDay ? "#ffffff" : "inherit",
                }}
              >
                <span className="relative z-10">{day}</span>
                {isEventDay && (
                  <span
                    className="absolute -bottom-2 text-[10px] leading-none select-none opacity-80"
                    style={{ color: config.colors.textPrimary }}
                  >
                    ♥
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <a
        href="#"
        className="text-xs uppercase tracking-[0.15em] font-medium border-b pb-0.5 hover:opacity-100 transition-opacity duration-200"
        style={{
          color: config.colors.textSecondary,
          borderColor: `${config.colors.textSecondary}60`,
        }}
      >
        Thêm vào lịch
      </a>
    </div>
  );
};
