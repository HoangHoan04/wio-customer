import flowerCornerFloral from "@/assets/decorations/royal-red/flower.webp";
import cornerFrame from "@/assets/decorations/royal-red/frame-corner-top-left.webp";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";

export const HeroImages = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  if (!data?.showHeroImage) return null;
  const isGroomFirst = data?.displayOrder !== "bride_first";

  const renderTopPerson = (person: any) => (
    <div className="relative flex justify-start pl-8">
      <div
        className="relative w-44 h-64 md:w-56 md:h-80 p-2 shadow-2xl rotate-[5deg] z-10 shrink-0 border-4 rounded-xl"
        style={{ 
          borderColor: config.colors.accent || "#d4af37",
          background: "rgba(71, 7, 18, 0.45)",
          backdropFilter: "blur(4px)"
        }}
      >
        <img src={cornerFrame.src} alt="" className="absolute top-1.5 left-1.5 w-4 h-4 pointer-events-none opacity-60 z-30" />
        <img src={cornerFrame.src} alt="" className="absolute top-1.5 right-1.5 w-4 h-4 pointer-events-none opacity-60 z-30 rotate-90" />
        <img src={cornerFrame.src} alt="" className="absolute bottom-1.5 left-1.5 w-4 h-4 pointer-events-none opacity-60 z-30 -rotate-90" />
        <img src={cornerFrame.src} alt="" className="absolute bottom-1.5 right-1.5 w-4 h-4 pointer-events-none opacity-60 z-30 rotate-180" />

        <img
          src={person?.photo || "https://placehold.co/300x400"}
          alt="Person"
          className="w-full h-full object-cover rounded-lg"
        />

        <div
          className="absolute top-0 -right-12 h-full flex flex-col items-start justify-start pt-1 gap-1 z-20"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          <span
            className="text-[9px] tracking-[0.2em] uppercase font-bold"
            style={{
              fontFamily: config.fonts.body,
              color: config.colors.textSecondary,
            }}
          >
            {person?.title}
          </span>
          <h2
            className="text-lg md:text-xl font-normal uppercase tracking-widest"
            style={{
              fontFamily: config.fonts.heading,
              color: config.colors.textPrimary,
            }}
          >
            {person?.shortName || person?.name}
          </h2>
        </div>
      </div>
    </div>
  );

  const renderBottomPerson = (person: any) => (
    <div className="relative flex justify-end pr-8 -mt-20 md:-mt-24">
      <div
        className="relative w-44 h-64 md:w-56 md:h-80 p-2 shadow-2xl rotate-[-4deg] z-10 shrink-0 border-4 rounded-xl"
        style={{ 
          borderColor: config.colors.accent || "#d4af37",
          background: "rgba(71, 7, 18, 0.45)",
          backdropFilter: "blur(4px)"
        }}
      >
        <img src={cornerFrame.src} alt="" className="absolute top-1.5 left-1.5 w-4 h-4 pointer-events-none opacity-60 z-30" />
        <img src={cornerFrame.src} alt="" className="absolute top-1.5 right-1.5 w-4 h-4 pointer-events-none opacity-60 z-30 rotate-90" />
        <img src={cornerFrame.src} alt="" className="absolute bottom-1.5 left-1.5 w-4 h-4 pointer-events-none opacity-60 z-30 -rotate-90" />
        <img src={cornerFrame.src} alt="" className="absolute bottom-1.5 right-1.5 w-4 h-4 pointer-events-none opacity-60 z-30 rotate-180" />

        <img
          src={person?.photo || "https://placehold.co/300x400"}
          alt="Person"
          className="w-full h-full object-cover rounded-lg"
        />

        <div
          className="absolute top-0 -left-12 h-full flex flex-col items-start justify-start pt-1 gap-1 z-20"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: "rotate(180deg)",
          }}
        >
          <span
            className="text-[9px] tracking-[0.2em] uppercase font-bold"
            style={{
              fontFamily: config.fonts.body,
              color: config.colors.textSecondary,
            }}
          >
            {person?.title}
          </span>
          <h2
            className="text-lg md:text-xl uppercase tracking-widest font-bold"
            style={{
              fontFamily: config.fonts.heading,
              color: config.colors.textPrimary,
            }}
          >
            {person?.shortName || person?.name}
          </h2>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative pt-12 pb-16 flex flex-col items-center justify-center overflow-hidden px-4">
      <img
        src={flowerCornerFloral.src}
        alt="floral"
        className="absolute top-0 left-0 w-72 md:w-96 -translate-x-1/4 -translate-y-1/4 opacity-90 pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-sm md:max-w-md mx-auto mt-16">
        {isGroomFirst ? (
          <>
            {renderTopPerson(data?.groom)}
            {renderBottomPerson(data?.bride)}
          </>
        ) : (
          <>
            {renderTopPerson(data?.bride)}
            {renderBottomPerson(data?.groom)}
          </>
        )}
      </div>

      <img
        src={flowerCornerFloral.src}
        alt="floral"
        className="absolute bottom-0 left-0 w-72 md:w-96 -translate-x-1/3 translate-y-1/4 opacity-90 pointer-events-none scale-y-[-1]"
      />
    </div>
  );
};
