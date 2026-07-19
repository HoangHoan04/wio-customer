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
    // ignore parse error
  }
  return "";
};

export default function MapWidget({
  locationAddress,
  mapEmbedUrl,
  mapType = "normal",
  color = "#d4af37",
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

    if (url.includes("output=embed") || url.includes("/maps/embed?")) return url;

    if (url.startsWith("http")) {
      try {
        const host = new URL(url).hostname;
        if (host.includes("google") || host.includes("goo.gl")) {
          const coords = extractCoords(url);
          if (coords) return buildEmbed(coords);
          const extracted = extractAddressFromMapUrl(url);
          if (extracted) return buildEmbed(extracted);
          if (locationAddress?.trim()) return buildEmbed(locationAddress.trim());
          return "";
        }
      } catch {
        // ignore parse error
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

  if (!embedUrl) {
    return (
      <div
        style={{
          width: width * scale,
          height: height * scale,
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
        <span style={{ fontSize: 10 * scale, opacity: 0.6 }}>Chưa cấu hình bản đồ</span>
      </div>
    );
  }

  return (
    <div
      style={{
        width: width * scale,
        height: height * scale,
        borderRadius: 10 * scale,
        overflow: "hidden",
        border: `1px solid ${color}30`,
        position: "relative",
        backgroundColor: "#111",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <iframe
        src={embedUrl}
        width="100%"
        height={height * scale - 28 * scale}
        style={{ border: 0, flexShrink: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps"
      />
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4 * scale,
          height: 28 * scale,
          padding: `0 ${8 * scale}px`,
          backgroundColor: color,
          color: "#fff",
          fontSize: 9 * scale,
          fontFamily,
          fontWeight: 600,
          textDecoration: "none",
          flexShrink: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <MapPin size={10 * scale} style={{ flexShrink: 0 }} />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{displayText}</span>
        <ExternalLink size={8 * scale} style={{ marginLeft: 2 * scale, flexShrink: 0 }} />
      </a>
    </div>
  );
}
