import type { ThemeTemplateConfig } from "@/dto/theme.dto";

export const CoupleNames = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  if (!data) return null;
  const isGroomFirst = data?.displayOrder !== "bride_first";

  const renderPerson = (person: any) => (
    <div className="flex flex-col items-center">
      <h1
        className="text-5xl md:text-6xl font-normal leading-tight px-4"
        style={{
          fontFamily: config.fonts.script,
          color: config.colors.accent,
          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        {person?.fullName || person?.name}
      </h1>
      <p
        className="text-xs uppercase tracking-[0.25em] mt-2 font-semibold"
        style={{
          fontFamily: config.fonts.body,
          color: config.colors.textSecondary,
        }}
      >
        {person?.title}
      </p>
    </div>
  );
  return (
    <div className="px-6 py-8 flex flex-col items-center text-center relative z-10 overflow-hidden max-w-xl mx-auto">
      {data?.showIntro && (
        <p
          className="text-sm md:text-base uppercase tracking-widest font-semibold py-4 whitespace-pre-line leading-relaxed min-h-6"
          style={{
            fontFamily: config.fonts.body,
            color: config.colors.textSecondary,
            opacity: 0.9,
          }}
        >
          {data?.introText}
        </p>
      )}

      <div className="flex flex-col items-center w-full py-6 my-4 border-y border-dashed" style={{ borderColor: `${config.colors.accent}44` }}>
        {isGroomFirst ? (
          <>
            {renderPerson(data?.groom)}
            <div className="my-4 flex items-center justify-center gap-3">
              <span className="w-8 h-[1px]" style={{ background: `linear-gradient(to left, ${config.colors.accent}, transparent)` }} />
              <span
                className="text-3xl"
                style={{
                  fontFamily: config.fonts.script,
                  color: config.colors.textPrimary,
                }}
              >
                &
              </span>
              <span className="w-8 h-[1px]" style={{ background: `linear-gradient(to right, ${config.colors.accent}, transparent)` }} />
            </div>
            {renderPerson(data?.bride)}
          </>
        ) : (
          <>
            {renderPerson(data?.bride)}
            <div className="my-4 flex items-center justify-center gap-3">
              <span className="w-8 h-[1px]" style={{ background: `linear-gradient(to left, ${config.colors.accent}, transparent)` }} />
              <span
                className="text-3xl"
                style={{
                  fontFamily: config.fonts.script,
                  color: config.colors.textPrimary,
                }}
              >
                &
              </span>
              <span className="w-8 h-[1px]" style={{ background: `linear-gradient(to right, ${config.colors.accent}, transparent)` }} />
            </div>
            {renderPerson(data?.groom)}
          </>
        )}
      </div>
    </div>
  );
};
