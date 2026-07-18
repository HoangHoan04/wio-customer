import type { ThemeTemplateConfig } from "@/dto/theme.dto";

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
        className="text-xs font-semibold leading-relaxed max-w-60 border-t pt-1 w-full border-gray-200/30"
        style={{
          fontFamily: config.fonts.body,
          color: config.colors.textSecondary,
        }}
      >
        {person?.address || "—"}
      </p>
    </div>
  );

  return (
    <div className="py-2 px-4 flex flex-col items-center text-center relative overflow-hidden z-10 w-full">
      <h2
        className="text-xl md:text-2xl uppercase font-black mb-10"
        style={{
          fontFamily: config.fonts.heading,
          color: config.colors.textPrimary,
          textShadow: `0.5px 0 0 ${config.colors.textPrimary}, -0.5px 0 0 ${config.colors.textPrimary}`,
        }}
      >
        THÔNG TIN LỄ CƯỚI
      </h2>

      <div className="grid grid-cols-2 gap-8 md:gap-16 w-full max-w-2xl mx-auto items-start">
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
