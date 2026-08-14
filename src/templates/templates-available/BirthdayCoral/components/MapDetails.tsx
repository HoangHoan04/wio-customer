import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { ExternalLink, MapPin, Navigation } from "lucide-react";

export const MapDetails = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const party = data?.party || data?.events?.[0];
  const mapUrl = party?.mapUrl || party?.googleMapUrl || data?.mapUrl;
  const address = party?.address || data?.address;
  const venue = party?.venueName || data?.venueName;

  if (!mapUrl && !address) return null;

  return (
    <div className="w-full px-6 py-4 flex flex-col items-center">
      <div className="w-full max-w-sm bg-white/95 rounded-3xl p-5 shadow-md border border-orange-200 flex flex-col items-center text-center">
        <div className="size-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2">
          <MapPin className="size-5" />
        </div>

        <span
          className="text-xs uppercase tracking-widest font-bold text-orange-600 mb-1"
          style={{ fontFamily: config.fonts.body }}
        >
          CHỈ ĐƯỜNG
        </span>

        {venue && (
          <p
            className="text-base font-extrabold text-orange-950"
            style={{ fontFamily: config.fonts.heading }}
          >
            {venue}
          </p>
        )}

        {address && (
          <p className="text-xs text-orange-900/70 mt-1 mb-4 leading-relaxed">
            {address}
          </p>
        )}

        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Navigation className="size-3.5" />
            <span>Xem Trên Google Maps</span>
            <ExternalLink className="size-3 opacity-80" />
          </a>
        )}
      </div>
    </div>
  );
};
