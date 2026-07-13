import Carousel3D from "@/components/ui/Carousel3D";
import decorFlower from "@/assets/decorations/boho-floral-pink/flower_top.webp";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";

const CarouselImage = ({ src, alt, onImageClick, ...props }: any) => {
  const { isActive, index, currentIndex, totalItems, ...domProps } = props;
  return (
    <div
      className="w-full h-full rounded-xl overflow-hidden shadow-2xl relative group"
      onClick={(e) => {
        if (isActive && onImageClick) {
          e.stopPropagation();
          onImageClick(index);
        }
      }}
      {...domProps}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      {isActive && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center cursor-zoom-in">
          <div className="bg-white/20 p-2 rounded-full opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-opacity">
            <i className="pi pi-search-plus" style={{ color: "#fff" }}></i>
          </div>
        </div>
      )}
    </div>
  );
};

export const Gallery = ({ data, config }: { data?: any; config: ThemeTemplateConfig }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (!data || !data.showGallery || !data.gallery) return null;

  const images = (data.gallery as string[]).filter(Boolean);
  if (images.length === 0) return null;

  const layout = data.galleryLayout || "grid";

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) setSelectedIdx((selectedIdx + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) setSelectedIdx((selectedIdx - 1 + images.length) % images.length);
  };

  return (
    <section className="relative py-1 overflow-hidden" style={{ backgroundColor: config.colors.background }}>
      <img src={decorFlower.src} alt="" aria-hidden="true" className="absolute top-0 right-0 w-32 md:w-56 opacity-10 pointer-events-none translate-x-12 -translate-y-8 select-none z-0" />
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2
            className="text-xl md:text-2xl uppercase font-black mb-10"
            style={{
              fontFamily: config.fonts.heading,
              color: config.colors.textPrimary,
              textShadow: `0.5px 0 0 ${config.colors.textPrimary}, -0.5px 0 0 ${config.colors.textPrimary}`,
            }}
          >
            ALBUM ẢNH CƯỚI
          </h2>
        </div>

        {layout === "grid" && (
          <div className="grid grid-cols-2 gap-2 md:gap-4 max-w-2xl mx-auto">
            {images.slice(0, 4).map((img: string, idx: number) => (
              <div
                key={idx}
                className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
                onClick={() => setSelectedIdx(idx)}
              >
                <img
                  src={img}
                  alt={`Wedding ${idx}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {idx === 3 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity hover:bg-black/60">
                    <span className="text-white text-3xl font-heading font-semibold">
                      +{images.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {layout === "collage" && (
          <div className="grid grid-cols-3 gap-2 max-w-3xl mx-auto">
            {images
              .slice(0, images.length >= 6 ? 6 : images.length)
              .map((img: string, idx: number) => {
                const total = images.length;
                let spanClass = "col-span-1 aspect-square";

                if (total === 1) {
                  spanClass = "col-span-3 aspect-[3/2]";
                } else if (total === 2) {
                  if (idx === 0) spanClass = "col-span-2 aspect-[4/3]";
                  else spanClass = "col-span-1 aspect-square";
                } else if (total === 3) {
                  if (idx === 0) spanClass = "col-span-2 row-span-2 aspect-square";
                  else spanClass = "col-span-1 aspect-square";
                } else if (total === 4) {
                  if (idx === 0 || idx === 2) spanClass = "col-span-2 aspect-[16/10]";
                  else spanClass = "col-span-1 aspect-square";
                } else if (total === 5) {
                  if (idx === 0) spanClass = "col-span-2 aspect-square";
                  else spanClass = "col-span-1 aspect-square";
                } else {
                  if (idx === 0) spanClass = "col-span-2 row-span-2 aspect-square";
                  else spanClass = "col-span-1 aspect-square";
                }

                return (
                  <div
                    key={idx}
                    className={`relative overflow-hidden cursor-pointer group rounded-lg ${spanClass}`}
                    onClick={() => setSelectedIdx(idx)}
                  >
                    <img
                      src={img}
                      alt={`Wedding ${idx}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {idx === 5 && total > 6 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity hover:bg-black/60">
                        <span className="text-white text-2xl font-heading font-semibold">
                          +{total - 6}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {layout === "3d" && (
          <Carousel3D
            accentColor={config.colors.accent}
            itemWidth="260px"
            itemHeight="360px"
            height="400px"
            minHeight="450px"
          >
            {images.map((img: string, idx: number) => (
              <CarouselImage
                key={idx}
                src={img}
                alt={`Wedding ${idx}`}
                onImageClick={() => setSelectedIdx(idx)}
              />
            ))}
          </Carousel3D>
        )}
      </div>

      {selectedIdx !== null && (
        <div
          className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedIdx(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 p-2 rounded-full"
            onClick={() => setSelectedIdx(null)}
          >
            <X size={28} />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 p-3 rounded-full"
            onClick={handlePrev}
          >
            <ChevronLeft size={32} />
          </button>
          <img
            src={images[selectedIdx]}
            alt={`Wedding ${selectedIdx}`}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 p-3 rounded-full"
            onClick={handleNext}
          >
            <ChevronRight size={32} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-body">
            {selectedIdx + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
};
