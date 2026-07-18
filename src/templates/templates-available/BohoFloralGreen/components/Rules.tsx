import decorFlower from "@/assets/decorations/boho-floral-green/flower_bottom.webp";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";
export const Rules = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  if (!data?.showDressCode || !data?.dressCodes || data.dressCodes.length === 0)
    return null;

  return (
    <section
      className="relative py-10 px-4 flex flex-col items-center overflow-hidden"
      style={{ backgroundColor: config.colors.background }}
    >
      <img
        src={decorFlower.src}
        alt=""
        aria-hidden="true"
        className="absolute top-0 right-0 w-28 md:w-48 opacity-10 pointer-events-none translate-x-8 -translate-y-4 select-none z-0"
      />
      <img
        src={decorFlower.src}
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-24 md:w-40 opacity-10 pointer-events-none -translate-x-6 translate-y-4 select-none z-0 rotate-180"
      />
      <div className="text-center mb-12">
        <h2
          className="text-xl md:text-2xl uppercase font-black mb-5"
          style={{
            fontFamily: config.fonts.heading,
            color: config.colors.textPrimary,
            textShadow: `0.5px 0 0 ${config.colors.textPrimary}, -0.5px 0 0 ${config.colors.textPrimary}`,
          }}
        >
          Dress Code
        </h2>
        <p
          className="text-sm md:text-base font-semibold"
          style={{
            fontFamily: config.fonts.body,
            color: config.colors.textSecondary,
          }}
        >
          Trang phục khuyến nghị để chúng ta có những bức hình thật đẹp
        </p>
      </div>

      <div
        className="flex flex-wrap justify-center gap-4 max-w-lg mx-auto p-8 rounded-2xl border"
        style={{
          borderColor: `${config.colors.textPrimary}20`,
          backgroundColor: `${config.colors.envelope}05`,
        }}
      >
        {data.dressCodes.map((color: string, idx: number) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg border-4 border-white/50"
              style={{ backgroundColor: color }}
            />
            <span
              className="text-xs uppercase tracking-widest font-mono"
              style={{ color: config.colors.textSecondary }}
            >
              {color}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
