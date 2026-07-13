import decorFlower from "@/assets/decorations/royal-green/flower.webp";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";

export const CoupleNames = ({ data, config }: { data?: any; config: ThemeTemplateConfig }) => {
  if (!data) return null;
  const isGroomFirst = data?.displayOrder !== "bride_first";

  const renderPerson = (person: any) => (
    <>
      <h1
        className="text-4xl md:text-5xl font-light"
        style={{ fontFamily: config.fonts.script, color: config.colors.textPrimary }}
      >
        {person?.fullName || person?.name}
      </h1>
      <p
        className="text-xs uppercase tracking-[0.2em] mt-3"
        style={{ fontFamily: config.fonts.body, color: config.colors.textSecondary }}
      >
        {person?.title}
      </p>
    </>
  );
  return (
    <div className=" px-4 flex flex-col items-center text-center relative z-10 overflow-hidden">
      <img src={decorFlower.src} alt="" aria-hidden="true" className="absolute right-0 top-1/2 -translate-y-1/2 w-24 md:w-48 opacity-10 pointer-events-none translate-x-8 select-none z-0" />
      {data?.showIntro && (
        <p
          className="text-sm md:text-base uppercase font-bold py-5 whitespace-pre-line leading-relaxed min-h-6"
          style={{ fontFamily: config.fonts.body, color: config.colors.textSecondary }}
        >
          {data?.introText}
        </p>
      )}

      <div className="flex flex-col items-center w-full py-6">
        {isGroomFirst ? (
          <>
            {renderPerson(data?.groom)}
            <div className="my-6">
              <span
                className="text-4xl"
                style={{ fontFamily: config.fonts.script, color: config.colors.textPrimary }}
              >
                &
              </span>
            </div>
            {renderPerson(data?.bride)}
          </>
        ) : (
          <>
            {renderPerson(data?.bride)}
            <div className="my-6">
              <span
                className="text-4xl"
                style={{ fontFamily: config.fonts.script, color: config.colors.textPrimary }}
              >
                &
              </span>
            </div>
            {renderPerson(data?.groom)}
          </>
        )}
      </div>
    </div>
  );
};
