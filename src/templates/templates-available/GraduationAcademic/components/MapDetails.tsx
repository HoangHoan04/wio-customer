import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { ExternalLink, MapPin, Navigation } from "lucide-react";

export const MapDetails = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const ceremony = data?.ceremony || data?.eventsCeremony?.[0] || data?.events?.[0];
  const party = data?.party || data?.eventsParty?.[0];

  const mapUrl =
    ceremony?.mapUrl ||
    ceremony?.googleMapUrl ||
    party?.mapUrl ||
    party?.googleMapUrl ||
    data?.mapUrl;

  const address = ceremony?.address || party?.address || data?.address;
  const venue = ceremony?.venueName || party?.venueName || data?.venueName;

  if (!mapUrl && !address) return null;

  return (
    <div className="w-full px-6 py-4 flex flex-col items-center">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-md border border-slate-200 flex flex-col items-center text-center">
        <div className="size-10 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mb-2">
          <MapPin className="size-5 text-blue-700" />
        </div>

        <span
          className="text-xs uppercase tracking-widest font-bold text-blue-800 mb-1"
          style={{ fontFamily: config.fonts.body }}
        >
          ĐỊA ĐIỂM & BẢN ĐỒ
        </span>

        {venue && (
          <p
            className="text-base font-extrabold text-slate-900"
            style={{ fontFamily: config.fonts.heading }}
          >
            {venue}
          </p>
        )}

        {address && (
          <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
            {address}
          </p>
        )}

        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer border border-amber-400/30"
          >
            <Navigation className="size-3.5" />
            <span>Mở Google Maps</span>
            <ExternalLink className="size-3 opacity-80" />
          </a>
        )}
      </div>
    </div>
  );
};
