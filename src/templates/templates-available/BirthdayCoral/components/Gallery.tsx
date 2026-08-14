import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Images } from "lucide-react";
import { useState } from "react";

export const Gallery = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const photos = data?.photos || [];
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="w-full px-6 py-6 flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col items-center">
        <span
          className="text-xs uppercase tracking-widest font-bold text-orange-600 mb-1"
          style={{ fontFamily: config.fonts.body }}
        >
          KỶ NIỆM
        </span>
        <h2
          className="text-2xl font-extrabold text-orange-950 mb-6 flex items-center gap-2"
          style={{ fontFamily: config.fonts.heading }}
        >
          <Images className="size-6 text-orange-500" />
          <span>Album Ảnh Kỷ Niệm</span>
        </h2>

        <div className="grid grid-cols-2 gap-3 w-full">
          {photos.map((photo: any, idx: number) => {
            const url = typeof photo === "string" ? photo : photo.url;
            return (
              <div
                key={idx}
                onClick={() => setSelectedPhoto(url)}
                className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-orange-200/80 cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={url}
                  alt={`Kỷ niệm ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-md w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={selectedPhoto}
              alt="Xem ảnh lớn"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 size-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
