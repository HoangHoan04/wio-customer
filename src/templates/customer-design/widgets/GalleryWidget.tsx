import Carousel3D from "@/components/ui/Carousel3D";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import { useState } from "react";

const CarouselImage = ({ src, alt, scale, onImageClick, ...props }: any) => {
  const { isActive, index, currentIndex, totalItems, ...domProps } = props;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 12 * scale,
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        position: "relative",
        cursor: isActive ? "zoom-in" : "pointer",
      }}
      onClick={(e) => {
        if (isActive && onImageClick) {
          e.stopPropagation();
          onImageClick(index);
        }
      }}
      {...domProps}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        loading="lazy"
      />
    </div>
  );
};

interface Props {
  images?: string[];
  layout?: "grid" | "collage" | "3d";
  color?: string;
  fontFamily?: string;
  width: number;
  height: number;
  scale: number;
}

export default function GalleryWidget({
  images = [],
  layout = "grid",
  color = "#b6cc61",
  fontFamily = "Quicksand",
  width,
  height,
  scale,
}: Props) {
  const cw = width * scale;
  const ch = height * scale;

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) setSelectedIdx((selectedIdx + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null)
      setSelectedIdx((selectedIdx - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div
        style={{
          width: cw,
          height: ch,
          fontFamily,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4 * scale,
          border: `1px dashed ${color}40`,
          borderRadius: 10 * scale,
          backgroundColor: `${color}05`,
          color: "#f5e6d3",
        }}
      >
        <ImageIcon size={20 * scale} color={color} opacity={0.5} />
        <span style={{ fontSize: 9 * scale, opacity: 0.5 }}>Chưa có ảnh</span>
      </div>
    );
  }

  const renderGrid = () => {
    const gap = 4 * scale;
    const displayImages = images.slice(0, 2);

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap,
          padding: 6 * scale,
          width: "100%",
        }}
      >
        {displayImages.map((src, i) => (
          <div
            key={i}
            onClick={() => setSelectedIdx(i)}
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 8 * scale,
              backgroundColor: `${color}10`,
              aspectRatio: "1/1",
              cursor: "zoom-in",
            }}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            {i === 1 && images.length > 2 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14 * scale,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                +{images.length - 2}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderCollage = () => {
    const gap = 4 * scale;
    const total = images.length;
    const displayImages = images.slice(0, total >= 6 ? 6 : total);

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap,
          padding: 6 * scale,
          width: "100%",
        }}
      >
        {displayImages.map((src, idx) => {
          let gridColumn = "span 1";
          let gridRow = "auto";
          let aspectRatio = "1/1";

          if (total === 1) {
            gridColumn = "span 3";
            aspectRatio = "3/2";
          } else if (total === 2) {
            if (idx === 0) {
              gridColumn = "span 2";
              aspectRatio = "4/3";
            } else {
              gridColumn = "span 1";
              aspectRatio = "1/1";
            }
          } else if (total === 3) {
            if (idx === 0) {
              gridColumn = "span 2";
              gridRow = "span 2";
              aspectRatio = "1/1";
            } else {
              gridColumn = "span 1";
              aspectRatio = "1/1";
            }
          } else if (total === 4) {
            if (idx === 0 || idx === 2) {
              gridColumn = "span 2";
              aspectRatio = "16/10";
            } else {
              gridColumn = "span 1";
              aspectRatio = "1/1";
            }
          } else if (total === 5) {
            if (idx === 0) {
              gridColumn = "span 2";
              aspectRatio = "1/1";
            } else {
              gridColumn = "span 1";
              aspectRatio = "1/1";
            }
          } else {
            if (idx === 0) {
              gridColumn = "span 2";
              gridRow = "span 2";
              aspectRatio = "1/1";
            } else {
              gridColumn = "span 1";
              aspectRatio = "1/1";
            }
          }

          return (
            <div
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 8 * scale,
                backgroundColor: `${color}10`,
                gridColumn,
                gridRow,
                aspectRatio,
                cursor: "zoom-in",
              }}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {idx === 5 && total > 6 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14 * scale,
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  +{total - 6}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const render3d = () => {
    return (
      <div style={{ width: "100%", overflow: "hidden" }}>
        <Carousel3D
          accentColor={color}
          itemWidth={`${180 * scale}px`}
          itemHeight={`${240 * scale}px`}
          height={`${260 * scale}px`}
          minHeight={`${280 * scale}px`}
          showControls={true}
        >
          {images.map((img: string, idx: number) => (
            <CarouselImage
              key={idx}
              src={img}
              alt={`Wedding ${idx}`}
              scale={scale}
              onImageClick={setSelectedIdx}
            />
          ))}
        </Carousel3D>
      </div>
    );
  };

  return (
    <>
      <div
        style={{
          width: cw,
          height: "auto",
          minHeight: ch,
          fontFamily,
          border: `1px solid ${color}30`,
          borderRadius: 10 * scale,
          overflow: "hidden",
          backgroundColor: `${color}05`,
        }}
      >
        {layout === "collage" ? renderCollage() : layout === "3d" ? render3d() : renderGrid()}
      </div>

      {selectedIdx !== null && (
        <div
          onClick={() => setSelectedIdx(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            backgroundColor: "rgba(0,0,0,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            backdropFilter: "blur(4px)",
          }}
        >
          <button
            onClick={() => setSelectedIdx(null)}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "rgba(255,255,255,0.7)",
              background: "rgba(0,0,0,0.5)",
              border: "none",
              borderRadius: "50%",
              padding: 6,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>

          <button
            onClick={handlePrev}
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255,255,255,0.7)",
              background: "rgba(0,0,0,0.5)",
              border: "none",
              borderRadius: "50%",
              padding: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={20} />
          </button>

          <img
            src={images[selectedIdx]}
            alt={`Wedding ${selectedIdx}`}
            style={{
              maxWidth: "100%",
              maxHeight: "85vh",
              objectFit: "contain",
              borderRadius: 8,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={handleNext}
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              color: "rgba(255,255,255,0.7)",
              background: "rgba(0,0,0,0.5)",
              border: "none",
              borderRadius: "50%",
              padding: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronRight size={20} />
          </button>

          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              color: "rgba(255,255,255,0.6)",
              fontSize: 14,
              fontFamily,
              fontWeight: 500,
            }}
          >
            {selectedIdx + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
