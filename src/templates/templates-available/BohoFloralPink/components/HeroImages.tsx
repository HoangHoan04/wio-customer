import flowerCornerFloral from "@/assets/decorations/boho-floral-pink/flower_top.webp";
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
    <div className="relative flex justify-start pl-6">
      <div
        className="relative w-48 h-64 md:w-56 md:h-80 bg-white p-3 pb-12 shadow-[0_15px_35px_rgba(92,28,48,0.1)] rotate-[3deg] z-10 shrink-0 rounded-sm border border-[#f7e2e8]/60"
      >
        <img
          src={person?.photo || "https://placehold.co/300x400"}
          alt={person?.name}
          className="w-full h-full object-cover rounded-sm"
          style={{ height: "82%" }}
        />
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <span
            className="text-[9px] tracking-[0.2em] uppercase block opacity-70 font-semibold mb-0.5"
            style={{
              fontFamily: config.fonts.body,
              color: config.colors.textSecondary,
            }}
          >
            {person?.title}
          </span>
          <h2
            className="text-2xl md:text-3xl font-normal leading-none mt-1"
            style={{
              fontFamily: config.fonts.script,
              color: config.colors.accent,
            }}
          >
            {person?.shortName || person?.name}
          </h2>
        </div>
      </div>
    </div>
  );

  const renderBottomPerson = (person: any) => (
    <div className="relative flex justify-end pr-6 -mt-16 md:-mt-20">
      <div
        className="relative w-48 h-64 md:w-56 md:h-80 bg-white p-3 pb-12 shadow-[0_15px_35px_rgba(92,28,48,0.1)] rotate-[-4deg] z-10 shrink-0 rounded-sm border border-[#f7e2e8]/60"
      >
        <img
          src={person?.photo || "https://placehold.co/300x400"}
          alt={person?.name}
          className="w-full h-full object-cover rounded-sm"
          style={{ height: "82%" }}
        />
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <span
            className="text-[9px] tracking-[0.2em] uppercase block opacity-70 font-semibold mb-0.5"
            style={{
              fontFamily: config.fonts.body,
              color: config.colors.textSecondary,
            }}
          >
            {person?.title}
          </span>
          <h2
            className="text-2xl md:text-3xl font-normal leading-none mt-1"
            style={{
              fontFamily: config.fonts.script,
              color: config.colors.accent,
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
