import fixedFlower2 from "@/assets/decorations/royal-green/flower.webp";
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
    <div className="relative py-2 px-4 flex flex-col items-center text-center overflow-hidden z-10 w-full">
      <img
        src={fixedFlower2.src}
        alt="decor"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-40 md:w-56 opacity-20 pointer-events-none -translate-x-12 select-none z-0"
      />
      <div className="flex flex-col items-center w-full mb-2 relative z-10">
        <div className="flex flex-col gap-12 w-full px-4">
          {data.events.map((event: any, index: number) => {
            const eventLunarDateStr =
              event.lunarDate || getLunarDateStr(event.date);

            return (
              <div key={index} className="flex flex-col items-center w-full">
                <h3
                  className="text-base md:text-lg font-bold uppercase text-center whitespace-nowrap"
                  style={{
                    fontFamily: config.fonts.heading,
                    color: config.colors.textPrimary,
                  }}
                >
                  {event.title}
                </h3>
                <h3
                  className="text-base md:text-lg font-bold uppercase mb-2 text-center whitespace-nowrap"
                  style={{
                    fontFamily: config.fonts.heading,
                    color: config.colors.textPrimary,
                  }}
                >
                  {event.address}
                </h3>
                <h3
                  className="text-base md:text-lg font-bold uppercase mb-2 text-center whitespace-nowrap"
                  style={{
                    fontFamily: config.fonts.heading,
                    color: config.colors.textPrimary,
                  }}
                >
                  VÀO LÚC
                </h3>

                <div className="flex flex-col items-center mb-8">
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
                    <span className="h-6 w-px bg-[#5d4037] opacity-30"></span>
                    <span
                      className="text-4xl mx-2 font-bold"
                      style={{
                        fontFamily: config.fonts.heading,
                        color: config.colors.textPrimary,
                      }}
                    >
                      {getDayStr(event.date)}
                    </span>
                    <span className="h-6 w-px bg-[#5d4037] opacity-30"></span>
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
