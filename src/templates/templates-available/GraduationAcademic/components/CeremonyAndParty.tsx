import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Award, Calendar, Clock, MapPin, PartyPopper } from "lucide-react";

export const CeremonyAndParty = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const ceremony = data?.ceremony || data?.eventsCeremony?.[0] || data?.events?.[0];
  const party = data?.party || data?.eventsParty?.[0] || (data?.events?.length > 1 ? data.events[1] : null);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="w-full px-6 py-6 flex flex-col items-center space-y-4">
      {/* Lễ trao bằng tốt nghiệp */}
      {ceremony && (
        <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-md border border-slate-200 flex flex-col items-center text-center relative overflow-hidden">
          <div className="size-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mb-3">
            <Award className="size-6 text-blue-800" />
          </div>

          <span
            className="text-xs uppercase tracking-widest font-bold text-blue-800 mb-1"
            style={{ fontFamily: config.fonts.body }}
          >
            {ceremony.name || "LỄ TRAO BẰNG TỐT NGHIỆP"}
          </span>

          {ceremony.eventDate && (
            <p
              className="text-lg font-extrabold text-slate-900 capitalize my-1"
              style={{ fontFamily: config.fonts.heading }}
            >
              {formatDate(ceremony.eventDate)}
            </p>
          )}

          {ceremony.eventTime && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900 bg-blue-50 px-3 py-1 rounded-full my-2">
              <Clock className="size-3.5 text-blue-700" />
              <span>{ceremony.eventTime}</span>
            </div>
          )}

          <div className="w-full border-t border-slate-200 my-3" />

          {ceremony.venueName && (
            <p
              className="text-base font-bold text-slate-900"
              style={{ fontFamily: config.fonts.heading }}
            >
              {ceremony.venueName}
            </p>
          )}

          {ceremony.address && (
            <p className="text-xs text-slate-600 mt-1 flex items-center justify-center gap-1 leading-relaxed">
              <MapPin className="size-3.5 shrink-0 text-blue-600" />
              <span>{ceremony.address}</span>
            </p>
          )}
        </div>
      )}

      {/* Tiệc mừng tốt nghiệp */}
      {party && (
        <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-md border border-amber-200/80 flex flex-col items-center text-center relative overflow-hidden">
          <div className="size-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <PartyPopper className="size-6" />
          </div>

          <span
            className="text-xs uppercase tracking-widest font-bold text-amber-700 mb-1"
            style={{ fontFamily: config.fonts.body }}
          >
            {party.name || "TIỆC MỪNG TỐT NGHIỆP"}
          </span>

          {party.eventDate && (
            <p
              className="text-lg font-extrabold text-slate-900 capitalize my-1"
              style={{ fontFamily: config.fonts.heading }}
            >
              {formatDate(party.eventDate)}
            </p>
          )}

          {party.eventTime && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-50 px-3 py-1 rounded-full my-2">
              <Clock className="size-3.5 text-amber-600" />
              <span>{party.eventTime}</span>
            </div>
          )}

          <div className="w-full border-t border-slate-200 my-3" />

          {party.venueName && (
            <p
              className="text-base font-bold text-slate-900"
              style={{ fontFamily: config.fonts.heading }}
            >
              {party.venueName}
            </p>
          )}

          {party.address && (
            <p className="text-xs text-slate-600 mt-1 flex items-center justify-center gap-1 leading-relaxed">
              <MapPin className="size-3.5 shrink-0 text-amber-600" />
              <span>{party.address}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};
