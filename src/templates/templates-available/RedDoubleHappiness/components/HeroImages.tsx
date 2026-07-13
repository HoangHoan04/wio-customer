import chineseHappinessBig from "@/assets/decorations/red_double_happiness/chinese_happiness_big.webp";
import dragon from "@/assets/decorations/red_double_happiness/dragon.webp";
import phoenix from "@/assets/decorations/red_double_happiness/phoenix.webp";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";

export const HeroImages = ({ data, config }: { data?: any; config: ThemeTemplateConfig }) => {
  if (!data?.showHeroImage) return null;

  const mainImageSrc = data?.heroImageMain || "https://placehold.co/400x533";

  return (
    <div className="relative pt-24 pb-5 flex flex-col items-center justify-center overflow-hidden px-6 select-none">
      <div className="relative z-10 w-full max-w-xs md:max-w-sm mx-auto mt-12 aspect-3/4">
        <img
          src={dragon.src}
          alt=""
          aria-hidden="true"
          className="absolute -left-5 -top-25 w-25 md:w-32 object-contain pointer-events-none z-30 opacity-75 filter drop-shadow(0 4px 12px rgba(0,0,0,0.5))"
        />
        <div className="absolute left-1/2 -top-23 -translate-x-1/2 z-40 select-none pointer-events-none">
          <img
            src={chineseHappinessBig.src}
            alt="Chữ Hỷ"
            className="w-14 h-14 md:w-16 md:h-16 object-contain filter drop-shadow(0 2px 6px rgba(0,0,0,0.3))"
          />
        </div>
        <img
          src={phoenix.src}
          alt=""
          aria-hidden="true"
          className="absolute -right-5 -top-25 w-25 md:w-32 object-contain pointer-events-none z-30 opacity-70 filter drop-shadow(0 4px 12px rgba(0,0,0,0.4))"
        />
        <img
          src={phoenix.src}
          alt=""
          aria-hidden="true"
          className="absolute -left-5 -bottom-25 w-25 md:w-32 object-contain pointer-events-none z-10 opacity-65 filter drop-shadow(0 4px 12px rgba(0,0,0,0.4)) -scale-x-100"
        />
        <img
          src={dragon.src}
          alt=""
          aria-hidden="true"
          className="absolute -right-5 -bottom-25 w-25 md:w-32 object-contain pointer-events-none z-10 opacity-70 filter drop-shadow(0 4px 12px rgba(0,0,0,0.5)) -scale-x-100"
        />
        <div
          className="absolute inset-0 rounded-xl p-1.5 border-2 opacity-40 transform -rotate-6 scale-105 pointer-events-none z-20 overflow-hidden shadow-lg transition-transform duration-500"
          style={{
            borderColor: "rgba(212, 175, 55, 0.4)",
            background: "linear-gradient(135deg, #112239 0%, #070e1a 100%)",
          }}
        >
          <img
            src={mainImageSrc}
            alt="Couple Background"
            className="w-full h-full object-cover rounded-lg filter blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-black/30 pointer-events-none rounded-lg" />
        </div>
        <div className="relative z-30 w-full h-full transform rotate-0 scale-95">
          <div
            className="absolute -inset-1.5 rounded-2xl opacity-25 blur-md pointer-events-none"
            style={{ backgroundColor: config.colors.accent || "#d4af37" }}
          />
          <div
            className="w-full h-full rounded-xl p-2 shadow-[0_25px_60px_rgba(0,0,0,0.7)] border-4 overflow-hidden"
            style={{
              borderColor: config.colors.accent || "#d4af37",
              background: "linear-gradient(135deg, #112239 0%, #070e1a 100%)",
            }}
          >
            <img
              src={mainImageSrc}
              alt="Couple Main"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10 pointer-events-none rounded-lg" />
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-16 text-center px-4 w-full">
        <h1
          className="text-2xl md:text-3xl font-normal tracking-wider"
          style={{
            fontFamily: config.fonts.heading,
            color: config.colors.textPrimary || "#470a0d",
            textShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          {data?.groom?.shortName || data?.groom?.name || ""}
          <span
            className="mx-4 text-xl inline-block"
            style={{
              fontFamily: config.fonts.heading,
              color: config.colors.accent || "#b08b33",
            }}
          >
            &amp;
          </span>
          {data?.bride?.shortName || data?.bride?.name || ""}
        </h1>
      </div>
    </div>
  );
};
