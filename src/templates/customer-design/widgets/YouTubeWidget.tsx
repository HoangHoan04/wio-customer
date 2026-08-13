import { useEffect, useRef, useState } from "react";

interface Props {
  youtubeUrl?: string;
  color?: string;
  fontFamily?: string;
  width: number;
  height: number;
  scale: number;
}

function extractVideoId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function YouTubeWidget({
  youtubeUrl,
  color = "#b6cc61",
  fontFamily = "Quicksand",
  width,
  height,
  scale,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const videoId = extractVideoId(youtubeUrl || "");

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !videoId) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasInteracted) {
          setShouldPlay(true);
          setHasInteracted(true);
        }
      },
      { threshold: 0.3, rootMargin: "50px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [videoId, hasInteracted]);

  const handleManualPlay = () => {
    setShouldPlay(true);
    setHasInteracted(true);
  };

  if (!videoId) {
    return (
      <div
        style={{
          width: width * scale,
          height: height * scale,
          fontFamily,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px dashed ${color}40`,
          borderRadius: 10 * scale,
          backgroundColor: `${color}05`,
          color: "#f5e6d3",
          fontSize: 10 * scale,
        }}
      >
        Chưa nhập link YouTube
      </div>
    );
  }

  const iframeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${shouldPlay ? 1 : 0}&mute=1&playsinline=1&rel=0`;

  return (
    <div
      ref={containerRef}
      style={{
        width: width * scale,
        height: height * scale,
        borderRadius: 12 * scale,
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        position: "relative",
        backgroundColor: "#000",
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
      }}
    >
      {shouldPlay ? (
        <iframe
          src={iframeUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          title="YouTube"
        />
      ) : (
        <div
          onClick={handleManualPlay}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            background: `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg) center/cover no-repeat`,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          />
          <div
            style={{
              width: 48 * scale,
              height: 48 * scale,
              borderRadius: "50%",
              backgroundColor: "rgba(255,0,0,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${14 * scale}px solid white`,
                borderTop: `${10 * scale}px solid transparent`,
                borderBottom: `${10 * scale}px solid transparent`,
                marginLeft: 3 * scale,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
