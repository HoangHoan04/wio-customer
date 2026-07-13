import dragonLeftImg from "@/assets/decorations/dragon_phoenix_green/dragon_left.webp";
import dragonRightImg from "@/assets/decorations/dragon_phoenix_green/dragon_right.webp";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";

export const ThankYou = ({ data, config }: { data?: any; config: ThemeTemplateConfig }) => {
  if (!data?.showThankYou || !data?.thankYouText) return null;

  return (
    <section className="py-12 mb-5 px-6 flex flex-col items-center text-center relative overflow-hidden w-full min-h-40 select-none">
      <p
        className="text-xl md:text-2xl relative z-20 max-w-xl leading-relaxed"
        style={{
          fontFamily: config.fonts.heading,
          color: config.colors.textPrimary,
          textShadow: `0.5px 0 0 ${config.colors.textPrimary}, -0.5px 0 0 ${config.colors.textPrimary}`,
        }}
      >
        {data.thankYouText}
      </p>
      <img
        src={dragonLeftImg.src}
        alt=""
        aria-hidden="true"
        className="absolute left-6 bottom-0 w-24 md:w-32 object-contain pointer-events-none z-10 opacity-30 filter drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
      />
      <img
        src={dragonRightImg.src}
        alt=""
        aria-hidden="true"
        className="absolute right-6 bottom-0 w-24 md:w-32 object-contain pointer-events-none z-10 opacity-30 filter drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
      />
    </section>
  );
};
