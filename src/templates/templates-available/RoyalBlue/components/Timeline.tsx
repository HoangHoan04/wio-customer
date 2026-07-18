import bohoFloralGreen from "@/assets/decorations/royal-blue/flower.webp";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";

export const Timeline = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  if (!data?.showTimeline || !data?.timeline || data.timeline.length === 0)
    return null;

  return (
    <section
      className="py-10 px-10 flex flex-col items-center relative overflow-hidden z-10 w-full"
      style={{ backgroundColor: config.colors.background }}
    >
      <img
        src={bohoFloralGreen.src}
        alt="decor"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-48 md:w-64 opacity-20 pointer-events-none -translate-x-16 select-none z-0"
      />
      <div className="text-center mb-10 w-full">
        <h2
          className="text-xl md:text-2xl uppercase font-black mb-5"
          style={{
            fontFamily: config.fonts.heading,
            color: config.colors.textPrimary,
            textShadow: `0.5px 0 0 ${config.colors.textPrimary}, -0.5px 0 0 ${config.colors.textPrimary}`,
          }}
        >
          {data.timelineTitle || "LỊCH TRÌNH NGÀY CƯỚI"}
        </h2>
        <div
          className="w-48 h-px mx-auto opacity-20"
          style={{ backgroundColor: config.colors.textPrimary }}
        ></div>
      </div>

      <div className="relative w-full max-w-2xl mx-auto">
        <div
          className="absolute left-0 md:left-1/2 top-4 bottom-4 w-px transform md:-translate-x-1/2 translate-x-9 opacity-30"
          style={{ backgroundColor: config.colors.accent }}
        />
        <div className="space-y-8 md:space-y-10 relative">
          {data.timeline.map((item: any, index: number) => (
            <div
              key={item.id || index}
              className="flex flex-row items-center w-full relative"
            >
              <div className="hidden md:block md:w-1/2 md:pr-12" />
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 z-20 w-18 flex flex-col items-center justify-center">
                <div
                  className="w-18 h-18 rounded-full flex items-center justify-center bg-transparent border transition-transform duration-300 hover:scale-105"
                  style={{
                    borderColor: config.colors.accent,
                    backgroundColor: config.colors.background || "#fdfbf7",
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex flex-col items-center justify-center border border-dashed"
                    style={{ borderColor: `${config.colors.accent}80` }}
                  >
                    <span
                      className="text-[8px] leading-none mb-0.5"
                      style={{ color: config.colors.accent }}
                    >
                      ★
                    </span>

                    <span
                      className="text-xs md:text-sm font-bold tracking-tight text-center leading-tight"
                      style={{
                        fontFamily: config.fonts.body,
                        color: config.colors.textPrimary,
                      }}
                    >
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 pl-24 md:pl-12 pr-4 text-left flex flex-col justify-center min-h-18">
                <h3
                  className="text-base md:text-lg tracking-wide font-bold"
                  style={{
                    fontFamily: config.fonts.body,
                    color: config.colors.textPrimary,
                  }}
                >
                  {item.title}
                </h3>
                {item.description && (
                  <p
                    className="text-xs md:text-sm opacity-70 mt-0.5 max-w-xs md:max-w-sm leading-relaxed"
                    style={{
                      fontFamily: config.fonts.body,
                      color: config.colors.textSecondary,
                    }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
