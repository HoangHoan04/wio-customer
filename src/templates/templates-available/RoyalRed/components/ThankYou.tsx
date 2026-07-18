import fixedFlower from "@/assets/decorations/royal-red/flower.webp";
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
    <section className="py-2 mb-5 px-6 flex flex-col items-center text-center relative overflow-hidden w-full">
      <img
        src={fixedFlower.src}
        alt="decor"
        className="absolute right-0 bottom-0 w-48 md:w-64 opacity-25 pointer-events-none translate-x-12 translate-y-8 select-none z-0 rotate-180"
      />
      <p
        className="text-xl md:text-2xl mb-5 relative z-10"
        style={{
          fontFamily: config.fonts.heading,
          color: config.colors.textPrimary,
          textShadow: `0.5px 0 0 ${config.colors.textPrimary}, -0.5px 0 0 ${config.colors.textPrimary}`,
        }}
      >
        {data.thankYouText}
      </p>
    </section>
  );
};
