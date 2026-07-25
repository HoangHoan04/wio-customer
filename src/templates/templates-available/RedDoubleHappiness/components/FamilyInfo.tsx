import chineseHappiness from "@/assets/decorations/red_double_happiness/chinese_happiness_red.webp";
import cloudBig from "@/assets/decorations/red_double_happiness/cloud_big.webp";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import cornerFrame from "@/assets/decorations/common/frame-corner-top-left.webp";
import frameMiddle from "@/assets/decorations/common/frame-middle-horizontal.webp";

export const FamilyInfo = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  if (!data) return null;
  const isGroomFirst = data?.displayOrder !== "bride_first";

  const renderFamily = (title: string, person: any) => (
    <div className="flex flex-col items-center flex-1">
      <p
        className="text-xs uppercase tracking-widest mb-1"
        style={{
          fontFamily: config.fonts.body,
          color: config.colors.textSecondary,
        }}
      >
        {title}
      </p>
      <p
        className="text-xs uppercase tracking-wider mb-2 font-bold"
        style={{
          fontFamily: config.fonts.body,
          color: config.colors.textSecondary,
        }}
      >
        {person?.familyTitle}
      </p>

      <div className="flex flex-col justify-center min-h-14 mb-3 w-full">
        {person?.father && (
          <p
            className="font-extrabold text-md mb-1"
            style={{
              fontFamily: config.fonts.heading,
              color: config.colors.textPrimary,
            }}
          >
            {person.father}
          </p>
        )}
        {person?.mother ? (
          <p
            className="font-extrabold text-md"
            style={{
              fontFamily: config.fonts.heading,
              color: config.colors.textPrimary,
            }}
          >
            {person.mother}
          </p>
        ) : (
          <p className="text-md invisible" aria-hidden="true">
            Empty
          </p>
        )}
      </div>

      <p
        className="text-xs font-semibold leading-relaxed max-w-60 border-t pt-1 w-full"
        style={{
          fontFamily: config.fonts.body,
          color: config.colors.textSecondary,
          borderColor: config.colors.background === "#FAF6F0" ? "rgba(138, 11, 19, 0.2)" : "rgba(232, 213, 163, 0.15)",
        }}
      >
        {person?.address || "—"}
      </p>
    </div>
  );

  return (
    <div className="py-2 px-4 flex flex-col items-center text-center relative overflow-hidden z-10 w-full">
      <div className="flex items-center justify-center gap-4 mb-6 mt-4 w-full select-none">
        <img
          src={cloudBig.src}
          alt=""
          aria-hidden="true"
          className="w-16 md:w-20 object-contain opacity-80 filter drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
        />

        <img
          src={chineseHappiness.src}
          alt="Chữ Hỷ"
          className="w-12 h-12 md:w-14 md:h-14 object-contain filter drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
          }}
        />

        <img
          src={cloudBig.src}
          alt=""
          aria-hidden="true"
          className="w-16 md:w-20 object-contain opacity-80 filter drop-shadow(0 1px 2px rgba(0,0,0,0.1)) -scale-x-100"
        />
      </div>
      <h2
        className="text-xl md:text-2xl uppercase font-black mb-3"
        style={{
          fontFamily: config.fonts.heading,
          color: config.colors.textPrimary,
          textShadow: config.colors.background === "#FAF6F0" ? "none" : `0.5px 0 0 ${config.colors.textPrimary}, -0.5px 0 0 ${config.colors.textPrimary}`,
        }}
      >
        THÔNG TIN LỄ CƯỚI
      </h2>
      <img
        src={frameMiddle.src}
        alt=""
        aria-hidden="true"
        className="w-36 h-auto opacity-80 mb-10 object-contain"
      />

      <div 
        className="relative grid grid-cols-2 gap-8 md:gap-16 w-full max-w-2xl mx-auto items-start p-8 rounded-2xl border"
        style={{ 
          borderColor: `${config.colors.accent}44`,
          background: config.colors.background === "#FAF6F0" ? "rgba(138, 11, 19, 0.04)" : "rgba(42, 3, 3, 0.25)",
          backdropFilter: "blur(2px)"
        }}
      >
        <img src={cornerFrame.src} alt="" className="absolute top-2 left-2 w-7 h-7 pointer-events-none opacity-50" />
        <img src={cornerFrame.src} alt="" className="absolute top-2 right-2 w-7 h-7 pointer-events-none opacity-50 rotate-90" />
        <img src={cornerFrame.src} alt="" className="absolute bottom-2 left-2 w-7 h-7 pointer-events-none opacity-50 -rotate-90" />
        <img src={cornerFrame.src} alt="" className="absolute bottom-2 right-2 w-7 h-7 pointer-events-none opacity-50 rotate-180" />

        {isGroomFirst ? (
          <>
            {renderFamily("Nhà Trai", data?.groom)}
            {renderFamily("Nhà Gái", data?.bride)}
          </>
        ) : (
          <>
            {renderFamily("Nhà Gái", data?.bride)}
            {renderFamily("Nhà Trai", data?.groom)}
          </>
        )}
      </div>
    </div>
  );
};
