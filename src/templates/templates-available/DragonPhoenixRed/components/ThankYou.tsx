import dragonLeftImg from "@/assets/decorations/dragon_phoenix_red/dragon_left.webp";
import dragonRightImg from "@/assets/decorations/dragon_phoenix_red/dragon_right.webp";
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
    <section className="py-16 pb-24 px-6 flex flex-col items-center text-center relative overflow-hidden w-full select-none">
      <div 
        className="relative z-20 max-w-xl w-full p-8 md:p-12 rounded-2xl border-4 backdrop-blur-xs"
        style={{
          background: "transparent",
          borderColor: config.colors.accent,
          boxShadow: "0 15px 35px rgba(0,0,0,0.25), inset 0 0 15px rgba(212,175,55,0.05)",
        }}
      >
        <div 
          className="absolute inset-2 rounded-lg border border-dashed pointer-events-none"
          style={{ borderColor: `${config.colors.accent}33` }}
        />

        <h3
          className="text-lg md:text-xl uppercase tracking-[0.3em] font-semibold mb-6 text-center"
          style={{
            fontFamily: config.fonts.heading,
            color: config.colors.accent,
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Trân Trọng Cảm Ơn
        </h3>

        <p
          className="text-lg md:text-xl relative z-20 leading-relaxed font-medium text-center"
          style={{
            fontFamily: config.fonts.body,
            color: config.colors.textPrimary,
            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        >
          {data.thankYouText}
        </p>

        <div className="mt-8 flex flex-col items-center">
          <span 
            className="w-16 h-px mb-4" 
            style={{ background: `linear-gradient(to right, transparent, ${config.colors.accent}, transparent)` }} 
          />
          <h4
            className="text-3xl md:text-4xl font-normal text-[#f3e5ab]"
            style={{
              fontFamily: config.fonts.script,
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            {data?.groom?.shortName || data?.groom?.name} &amp; {data?.bride?.shortName || data?.bride?.name}
          </h4>
        </div>
      </div>

      <img
        src={dragonLeftImg.src}
        alt=""
        aria-hidden="true"
        className="absolute left-2 bottom-0 w-24 md:w-32 object-contain pointer-events-none z-10 opacity-40 filter drop-shadow(0 4px 8px rgba(0,0,0,0.4))"
      />
      <img
        src={dragonRightImg.src}
        alt=""
        aria-hidden="true"
        className="absolute right-2 bottom-0 w-24 md:w-32 object-contain pointer-events-none z-10 opacity-40 filter drop-shadow(0 4px 8px rgba(0,0,0,0.4))"
      />
    </section>
  );
};
