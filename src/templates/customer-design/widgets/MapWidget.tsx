import { ExternalLink, MapPin } from "lucide-react";
import { useMemo } from "react";

interface Props {
  locationAddress?: string;
  mapEmbedUrl?: string;
  mapType?: "normal" | "satellite" | "terrain" | "hybrid";
  color?: string;
  fontFamily?: string;
  width: number;
  height: number;
  scale: number;
}

const extractAddressFromMapUrl = (url: string): string => {
  if (!url) return "";
  try {
    let targetUrl = url.trim();
    if (targetUrl.includes("<iframe")) {
      const match = targetUrl.match(/src=["']([^"']+)["']/);
      if (match) {
        targetUrl = match[1];
      }
    }

    if (targetUrl.startsWith("//")) {
      targetUrl = "https:" + targetUrl;
    }

    const urlObj = new URL(targetUrl);
    const q = urlObj.searchParams.get("q");
    if (q) return decodeURIComponent(q).replace(/\+/g, " ");

    const placeMatch = urlObj.pathname.match(/\/place\/([^/]+)/);
    if (placeMatch) {
      return decodeURIComponent(placeMatch[1]).replace(/\+/g, " ");
    }
  } catch {
    //! ignore parse error
  }
  return "";
};

export default function MapWidget({
  locationAddress,
  mapEmbedUrl,
  mapType = "normal",
  color = "#b6cc61",
  fontFamily = "Quicksand",
  width,
  height,
  scale,
}: Props) {
  const embedUrl = useMemo(() => {
    let url = mapEmbedUrl?.trim() || "";

    const extractCoords = (u: string): string | null => {
      const m = u.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      return m ? `${m[1]},${m[2]}` : null;
    };

    const mapT =
      mapType === "satellite"
        ? "k"
        : mapType === "terrain"
          ? "p"
          : mapType === "hybrid"
            ? "h"
            : "m";
    const buildEmbed = (q: string) =>
      `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=${mapT}&output=embed`;

    if (!url) {
      if (!locationAddress?.trim()) return "";
      return buildEmbed(locationAddress.trim());
    }

    if (url.includes("<iframe")) {
      const match = url.match(/src=["']([^"']+)["']/);
      if (match) url = match[1];
    }

    if (url.startsWith("//")) url = "https:" + url;

    if (url.includes("output=embed") || url.includes("/maps/embed?"))
      return url;

    if (url.startsWith("http")) {
      try {
        const host = new URL(url).hostname;
        if (host.includes("google") || host.includes("goo.gl")) {
          const coords = extractCoords(url);
          if (coords) return buildEmbed(coords);
          const extracted = extractAddressFromMapUrl(url);
          if (extracted) return buildEmbed(extracted);
          if (locationAddress?.trim())
            return buildEmbed(locationAddress.trim());
          return "";
        }
      } catch {
        //! ignore parse error
      }
    }

    if (locationAddress?.trim()) return buildEmbed(locationAddress.trim());
    return "";
  }, [mapEmbedUrl, locationAddress, mapType]);

  const directionsUrl = useMemo(() => {
    const url = mapEmbedUrl?.trim() || "";
    if (url && !url.includes("<iframe") && !url.includes("output=embed")) {
      return url;
    }
    const finalAddress = locationAddress || extractAddressFromMapUrl(url);
    if (!finalAddress) return "#";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(finalAddress.trim())}`;
  }, [mapEmbedUrl, locationAddress]);

  const displayText = useMemo(() => {
    if (locationAddress) return locationAddress;
    const extracted = extractAddressFromMapUrl(mapEmbedUrl || "");
    return extracted || "Xem chỉ đường trên Google Maps";
  }, [locationAddress, mapEmbedUrl]);

  const displayHeight = Math.max(280, height);

  if (!embedUrl) {
    return (
      <div
        style={{
          width: width * scale,
          height: displayHeight * scale,
          fontFamily,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6 * scale,
          border: `1px solid ${color}30`,
          borderRadius: 10 * scale,
          backgroundColor: `${color}08`,
          color: "#f5e6d3",
        }}
      >
        <MapPin size={20 * scale} color={color} />
        <span style={{ fontSize: 10 * scale, opacity: 0.6 }}>
          Chưa cấu hình bản đồ
        </span>
      </div>
    );
  }

  const isIframe = mapEmbedUrl?.trim().includes("<iframe");

  return (
    <div
      style={{
        width: width * scale,
        height: displayHeight * scale,
        borderRadius: 12 * scale,
        overflow: "hidden",
        border: `1.5px solid ${color}40`,
        position: "relative",
        backgroundColor: "#121214",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {isIframe ? (
          <div
            dangerouslySetInnerHTML={{ __html: mapEmbedUrl || "" }}
            style={{
              width: "100%",
              height: "100%",
              border: 0,
              overflow: "hidden",
              position: "absolute",
              inset: 0,
            }}
            className="[&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0 [&>iframe]:absolute [&>iframe]:inset-0"
          />
        ) : (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{
              border: 0,
              position: "absolute",
              inset: 0,
            }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          />
        )}
      </div>

      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          bottom: 10 * scale,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5 * scale,
          padding: `${6 * scale}px ${14 * scale}px`,
          backgroundColor: color,
          color: "#000000",
          fontSize: 9 * scale,
          fontFamily,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          textDecoration: "none",
          borderRadius: 20 * scale,
          boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
          whiteSpace: "nowrap",
          zIndex: 10,
        }}
      >
        <MapPin size={10 * scale} style={{ flexShrink: 0 }} />
        <span>Chỉ đường bằng Google Maps</span>
        <ExternalLink size={8 * scale} style={{ flexShrink: 0 }} />
      </a>
    </div>
  );
}
