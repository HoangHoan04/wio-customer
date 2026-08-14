import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Calendar, Clock, MapPin } from "lucide-react";

export const PartyInfo = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const party = data?.party || data?.events?.[0];
  if (!party) return null;

  const eventDate = party.eventDate ? new Date(party.eventDate) : null;
  const dateFormatted = eventDate
    ? eventDate.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="w-full px-6 py-6 flex flex-col items-center">
      <div className="w-full max-w-sm bg-white/95 rounded-3xl p-6 shadow-md border border-orange-200/80 flex flex-col items-center text-center relative overflow-hidden">
        <div className="size-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
          <Calendar className="size-6" />
        </div>

        <span
          className="text-xs uppercase tracking-widest font-bold text-orange-600 mb-1"
          style={{ fontFamily: config.fonts.body }}
        >
          {party.name || "BỮA TIỆC SINH NHẬT"}
        </span>

        {dateFormatted && (
          <p
            className="text-lg font-extrabold text-orange-950 capitalize my-1"
            style={{ fontFamily: config.fonts.heading }}
          >
            {dateFormatted}
          </p>
        )}

        {party.eventTime && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-800 bg-orange-50 px-3 py-1 rounded-full my-2">
            <Clock className="size-3.5 text-orange-600" />
            <span>{party.eventTime}</span>
          </div>
        )}

        <div className="w-full border-t border-dashed border-orange-200 my-4" />

        {party.venueName && (
          <p
            className="text-base font-bold text-orange-950"
            style={{ fontFamily: config.fonts.heading }}
          >
            {party.venueName}
          </p>
        )}

        {party.address && (
          <p className="text-xs text-orange-900/70 mt-1 flex items-center justify-center gap-1 leading-relaxed">
            <MapPin className="size-3.5 shrink-0 text-orange-500" />
            <span>{party.address}</span>
          </p>
        )}
      </div>
    </div>
  );
};
