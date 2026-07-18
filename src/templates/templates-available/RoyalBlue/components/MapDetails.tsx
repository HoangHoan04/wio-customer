import decorFlower from "@/assets/decorations/royal-blue/flower.webp";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";

export const MapDetails = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  if (!data || (!data.showMap && !data.partyAddress)) return null;

  return (
    <div
      className="relative py-5 px-4 flex flex-col items-center text-center overflow-hidden"
      style={{ backgroundColor: config.colors.background }}
    >
      <img
        src={decorFlower.src}
        alt=""
        aria-hidden="true"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-24 md:w-44 opacity-10 pointer-events-none -translate-x-8 select-none z-0"
      />
      <h2
        className="text-xl md:text-2xl uppercase font-black mb-5"
        style={{
          fontFamily: config.fonts.heading,
          color: config.colors.textPrimary,
          textShadow: `0.5px 0 0 ${config.colors.textPrimary}, -0.5px 0 0 ${config.colors.textPrimary}`,
        }}
      >
        {data?.partyType === "engagement" ? "TIỆC BÁO HỶ" : "TIỆC CƯỚI"} SẼ TỔ
        CHỨC TẠI
      </h2>
      <p
        className="text-sm md:text-base leading-relaxed max-w-md mb-8 font-bold"
        style={{
          fontFamily: config.fonts.body,
          color: config.colors.textSecondary,
        }}
      >
        {data?.partyAddress}
      </p>

      {data.showMap && (
        <div
          className="w-full max-w-2xl overflow-hidden rounded-xl shadow-lg border-2 mb-6"
          style={{ borderColor: config.colors.textPrimary + "40" }}
        >
          {data.partyMapUrl?.includes("<iframe") ? (
            <div
              dangerouslySetInnerHTML={{ __html: data.partyMapUrl }}
              className="w-full h-75 [&>iframe]:w-full [&>iframe]:h-full"
            />
          ) : (
            <iframe
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${encodeURIComponent(data?.partyAddress || data?.partyMapUrl || "")}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
          )}
        </div>
      )}

      {data.partyAddress && (
        <a
          href={
            data.partyMapUrl &&
            !data.partyMapUrl.includes("<iframe") &&
            data.partyMapUrl.startsWith("http")
              ? data.partyMapUrl
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data?.partyAddress || "")}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 shadow-md"
          style={{
            backgroundColor: config.colors.textPrimary,
            color: config.colors.background || "#ffffff",
          }}
        >
          <i className="pi pi-map" />
          Chỉ đường bằng Google Maps
        </a>
      )}
    </div>
  );
};
