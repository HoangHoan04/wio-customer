import { ImageIcon } from "lucide-react";

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
  color = "#d4af37",
  fontFamily = "Quicksand",
  width,
  height,
  scale,
}: Props) {
  const cw = width * scale;
  const ch = height * scale;

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
    const cols = Math.min(images.length, 3);
    const gap = 3 * scale;
    const displayImages = images.slice(0, 6);

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap,
          padding: 4 * scale,
          width: cw,
          height: ch,
          overflow: "hidden",
        }}
      >
        {displayImages.map((src, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 4 * scale,
              backgroundColor: `${color}10`,
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
            {i === 5 && images.length > 6 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10 * scale,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                +{images.length - 6}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderCollage = () => {
    const gap = 2 * scale;
    const p = 4 * scale;
    const displayImages = images.slice(0, 5);

    if (displayImages.length === 1) {
      return (
        <div style={{ padding: p, width: cw, height: ch }}>
          <img src={displayImages[0]} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 * scale }} />
        </div>
      );
    }

    return (
      <div style={{ padding: p, width: cw, height: ch, display: "flex", flexDirection: "column", gap }}>
        <div style={{ display: "flex", gap, flex: 1 }}>
          {displayImages.slice(0, 2).map((src, i) => (
            <div key={i} style={{ flex: 1, overflow: "hidden", borderRadius: 4 * scale, backgroundColor: `${color}10` }}>
              <img src={src} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap, flex: 1 }}>
          {displayImages.slice(2, 5).map((src, i) => {
            const isLast = i === 2 && images.length > 5;
            return (
              <div key={i} style={{ flex: 1, overflow: "hidden", borderRadius: 4 * scale, backgroundColor: `${color}10`, position: "relative" }}>
                <img src={src} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {isLast && (
                  <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 * scale, color: "#fff", fontWeight: 700 }}>
                    +{images.length - 5}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const render3d = () => {
    const displayImages = images.slice(0, 5);
    return (
      <div
        style={{
          width: cw,
          height: ch,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 3 * scale,
          padding: 8 * scale,
          perspective: "200px",
        }}
      >
        {displayImages.map((src, i) => {
          const offset = (i - Math.floor(displayImages.length / 2)) * 15 * scale;
          const zOffset = -Math.abs(i - Math.floor(displayImages.length / 2)) * 10 * scale;
          const scale3d = 1 - Math.abs(i - Math.floor(displayImages.length / 2)) * 0.1;
          return (
            <div
              key={i}
              style={{
                width: `${50 / displayImages.length}%`,
                height: "100%",
                transform: `translateX(${offset}px) translateZ(${zOffset}px) scale(${scale3d})`,
                transformStyle: "preserve-3d",
                transition: "transform 0.3s",
                overflow: "hidden",
                borderRadius: 6 * scale,
                boxShadow: `${-2 * scale}px ${2 * scale}px ${6 * scale}px rgba(0,0,0,0.3)`,
              }}
            >
              <img src={src} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        width: cw,
        height: ch,
        fontFamily,
        border: `1px solid ${color}30`,
        borderRadius: 10 * scale,
        overflow: "hidden",
        backgroundColor: `${color}05`,
      }}
    >
      {layout === "collage" ? renderCollage() : layout === "3d" ? render3d() : renderGrid()}
    </div>
  );
}
