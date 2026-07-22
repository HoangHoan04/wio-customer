import fixedFlower from "@/assets/decorations/boho-floral-pink/fixed_flower.webp";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";

export const ThankYou = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  if (!data?.showThankYou || !data?.thankYouText) return null;

  return (
    <section className="py-16 px-6 flex flex-col items-center text-center relative overflow-hidden w-full select-none">
      <div 
        className="relative z-20 max-w-xl w-full p-8 md:p-12 rounded-2xl border relative backdrop-blur-xs"
        style={{
          background: "rgba(255, 255, 255, 0.35)",
          borderColor: `${config.colors.accent}33`,
          boxShadow: "0 15px 35px rgba(92, 28, 48, 0.05)",
        }}
      >
        {/* Inner Dashed Border */}
        <div 
          className="absolute inset-2 rounded-lg border border-dashed pointer-events-none"
          style={{ borderColor: `${config.colors.accent}22` }}
        />

        {/* Section Heading */}
        <h3
          className="text-lg md:text-xl uppercase tracking-[0.25em] font-semibold mb-6 text-center"
          style={{
            fontFamily: config.fonts.heading,
            color: config.colors.accent,
          }}
        >
          Trân Trọng Cảm Ơn
        </h3>

        {/* Thank You Text */}
        <p
          className="text-lg md:text-xl relative z-20 leading-relaxed font-medium text-center"
          style={{
            fontFamily: config.fonts.body,
            color: config.colors.textPrimary,
          }}
        >
          {data.thankYouText}
        </p>

        {/* Signature Names */}
        <div className="mt-8 flex flex-col items-center">
          <span 
            className="w-16 h-[1px] mb-4" 
            style={{ background: `linear-gradient(to right, transparent, ${config.colors.accent}, transparent)` }} 
          />
          <h4
            className="text-3xl md:text-4xl font-normal"
            style={{
              fontFamily: config.fonts.script,
              color: config.colors.textPrimary,
            }}
          >
            {data?.groom?.shortName || data?.groom?.name} &amp; {data?.bride?.shortName || data?.bride?.name}
          </h4>
        </div>
      </div>

      <img
        src={fixedFlower.src}
        alt="decor"
        className="absolute right-0 bottom-0 w-48 md:w-64 opacity-20 pointer-events-none translate-x-12 translate-y-8 select-none z-0 rotate-180"
      />
    </section>
  );
};
