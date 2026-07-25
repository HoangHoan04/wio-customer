import chineseHappinessBig from "@/assets/decorations/red_double_happiness/chinese_happiness_big.webp";
import dragon from "@/assets/decorations/red_double_happiness/dragon.webp";
import phoenix from "@/assets/decorations/red_double_happiness/phoenix.webp";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";

export const HeroImages = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  if (!data?.showHeroImage) return null;

  const mainImageSrc = data?.heroImageMain || "https://placehold.co/400x533";

  return (
    <div className="relative w-full min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center select-none overflow-hidden py-16 px-6">
      <img
        src={mainImageSrc}
        alt="Couple Main"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />
      
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.65) 0%, rgba(42, 3, 3, 0.5) 50%, #2a0303 100%)",
        }}
      />

      <img
        src={dragon.src}
        alt=""
        aria-hidden="true"
        className="absolute object-contain pointer-events-none z-20 opacity-40 filter drop-shadow(0 4px 10px rgba(0,0,0,0.5))"
        style={{
          width: "120px",
          left: "-10px",
          top: "80px",
        }}
      />
      <img
        src={phoenix.src}
        alt=""
        aria-hidden="true"
        className="absolute object-contain pointer-events-none z-20 opacity-40 filter drop-shadow(0 4px 10px rgba(0,0,0,0.5))"
        style={{
          width: "120px",
          right: "-10px",
          top: "80px",
        }}
      />

      <div className="relative z-20 flex flex-col items-center justify-center max-w-lg w-full text-center px-4 mt-auto mb-10">
        <img
          src={chineseHappinessBig.src}
          alt="Chữ Hỷ"
          className="w-16 h-16 md:w-20 md:h-20 object-contain mb-8 filter drop-shadow(0 4px 10px rgba(0,0,0,0.8)) animate-pulse"
          style={{ animationDuration: "3s" }}
        />

        <p
          className="text-xs uppercase tracking-[0.25em] mb-4 text-[#dfd0a3]/90 font-semibold"
          style={{
            fontFamily: config.fonts.body,
            textShadow: "0 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          LỄ THÀNH HÔN
        </p>

        <div className="flex flex-col items-center gap-1 w-full">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-normal leading-tight text-[#f3e5ab] px-2"
            style={{
              fontFamily: config.fonts.script,
              textShadow: "0 4px 15px rgba(0,0,0,0.95), 0 0 8px rgba(212,175,55,0.6)",
            }}
          >
            {data?.groom?.fullName || data?.groom?.name}
          </h1>

          <div className="my-2 flex items-center justify-center gap-4">
            <span className="w-12 h-px" style={{ background: "linear-gradient(to left, #d4af37, transparent)" }} />
            <span
              className="text-2xl text-[#f3e5ab]"
              style={{
                fontFamily: config.fonts.script,
                textShadow: "0 2px 5px rgba(0,0,0,0.9)",
              }}
            >
              &amp;
            </span>
            <span className="w-12 h-px" style={{ background: "linear-gradient(to right, #d4af37, transparent)" }} />
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-normal leading-tight text-[#f3e5ab] px-2"
            style={{
              fontFamily: config.fonts.script,
              textShadow: "0 4px 15px rgba(0,0,0,0.95), 0 0 8px rgba(212,175,55,0.6)",
            }}
          >
            {data?.bride?.fullName || data?.bride?.name}
          </h1>
        </div>
      </div>
    </div>
  );
};
