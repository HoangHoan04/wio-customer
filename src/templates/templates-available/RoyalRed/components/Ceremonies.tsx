import fixedFlower2 from "@/assets/decorations/royal-red/flower.webp";
import cornerFrame from "@/assets/decorations/royal-red/frame-corner-top-left.webp";
import {
  getDayStr,
  getLunarDateStr,
  getMonthStr,
  getWeekday,
  getYearStr,
} from "@/common/helpers";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";

export const Ceremonies = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  if (!data || !data.events || data.events.length === 0) return null;

  return (
    <div className="relative py-12 px-4 flex flex-col items-center text-center overflow-hidden z-10 w-full">
      <img
        src={fixedFlower2.src}
        alt="decor"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-40 md:w-56 opacity-10 pointer-events-none -translate-x-12 select-none z-0"
      />
      <div className="flex flex-col items-center w-full mb-2 relative z-10">
        <div className="flex flex-col gap-12 w-full px-4">
          {data.events.map((event: any, index: number) => {
            const eventLunarDateStr =
              event.lunarDate || getLunarDateStr(event.date);

            return (
              <div 
                key={index} 
                className="relative flex flex-col items-center w-full max-w-md mx-auto p-6 md:p-8 rounded-2xl border"
                style={{ 
                  borderColor: `${config.colors.accent}44`,
                  background: "rgba(88, 5, 18, 0.25)",
                  backdropFilter: "blur(2px)"
                }}
              >
                <img src={cornerFrame.src} alt="" className="absolute top-2 left-2 w-6 h-6 pointer-events-none opacity-50" />
                <img src={cornerFrame.src} alt="" className="absolute top-2 right-2 w-6 h-6 pointer-events-none opacity-50 rotate-90" />
                <img src={cornerFrame.src} alt="" className="absolute bottom-2 left-2 w-6 h-6 pointer-events-none opacity-50 -rotate-90" />
                <img src={cornerFrame.src} alt="" className="absolute bottom-2 right-2 w-6 h-6 pointer-events-none opacity-50 rotate-180" />

                <h3
                  className="text-base md:text-lg font-bold uppercase text-center whitespace-normal max-w-xs"
                  style={{
                    fontFamily: config.fonts.heading,
                    color: config.colors.textPrimary,
                  }}
                >
                  {event.title}
                </h3>
                <h3
                  className="text-sm md:text-base uppercase mb-4 text-center text-[#e8d5a3cc]"
                  style={{
                    fontFamily: config.fonts.body,
                  }}
                >
                  {event.address}
                </h3>
                <h3
                  className="text-xs uppercase tracking-widest mb-4 text-center"
                  style={{
                    fontFamily: config.fonts.body,
                    color: config.colors.accent,
                  }}
                >
                  VÀO LÚC
                </h3>

                <div className="flex flex-col items-center">
                  <p
                    className="text-3xl font-light mb-6"
                    style={{
                      fontFamily: config.fonts.heading,
                      color: config.colors.textPrimary,
                    }}
                  >
                    {event.time}
                  </p>

                  <div
                    className="flex items-center gap-4 text-sm md:text-base uppercase tracking-widest mb-4"
                    style={{
                      fontFamily: config.fonts.body,
                      color: config.colors.textSecondary,
                    }}
                  >
                    <span className="font-bold">{getWeekday(event.date)}</span>
                    <span 
                      className="h-6 w-px opacity-30"
                      style={{ backgroundColor: config.colors.textPrimary }}
                    />
                    <span
                      className="text-4xl mx-2 font-bold"
                      style={{
                        fontFamily: config.fonts.heading,
                        color: config.colors.textPrimary,
                      }}
                    >
                      {getDayStr(event.date)}
                    </span>
                    <span 
                      className="h-6 w-px opacity-30"
                      style={{ backgroundColor: config.colors.textPrimary }}
                    />
                    <span className="font-bold">
                      THÁNG {getMonthStr(event.date)}
                    </span>
                  </div>

                  <p
                    className="text-xl tracking-widest mb-4"
                    style={{
                      fontFamily: config.fonts.body,
                      color: config.colors.textSecondary,
                    }}
                  >
                    {getYearStr(event.date)}
                  </p>
                  {eventLunarDateStr && (
                    <p
                      className="text-xs md:text-sm uppercase tracking-widest font-bold"
                      style={{
                        fontFamily: config.fonts.body,
                        color: config.colors.textSecondary,
                      }}
                    >
                      ({eventLunarDateStr})
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
