import { MessageCircle, Phone } from "lucide-react";

interface Props {
  phoneEnabled?: boolean;
  phoneLabel?: string;
  phoneNumber?: string;
  messengerEnabled?: boolean;
  messengerLabel?: string;
  messengerUrl?: string;
  zaloEnabled?: boolean;
  zaloLabel?: string;
  zaloPhone?: string;
  color?: string;
  fontFamily?: string;
  width: number;
  height: number;
  scale: number;
}

function ZaloIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <text x="12" y="16" textAnchor="middle" fontSize="13" fontWeight="700" fill={color}>
        Z
      </text>
    </svg>
  );
}

export default function CallWidget({
  phoneEnabled,
  phoneLabel = "Gọi điện",
  phoneNumber,
  messengerEnabled,
  messengerLabel = "Messenger",
  messengerUrl,
  zaloEnabled,
  zaloLabel = "Zalo",
  zaloPhone,
  color = "#d4af37",
  fontFamily = "Quicksand",
  width,
  height,
  scale,
}: Props) {
  const cw = width * scale;
  const ch = height * scale;
  const iconSize = Math.min(cw * 0.1, ch * 0.28, 22 * scale);
  const fSize = Math.max(8, iconSize * 0.5);
  const btnSize = iconSize * 2;

  const contacts: {
    enabled?: boolean;
    label: string;
    icon: React.ReactNode;
    action: () => void;
  }[] = [
    {
      enabled: phoneEnabled,
      label: phoneLabel,
      icon: <Phone size={iconSize} />,
      action: () => phoneNumber && window.open(`tel:${phoneNumber}`, "_self"),
    },
    {
      enabled: messengerEnabled,
      label: messengerLabel,
      icon: <MessageCircle size={iconSize} />,
      action: () => {
        if (!messengerUrl) return;
        try {
          const u = new URL(
            messengerUrl.includes("://") ? messengerUrl : `https://${messengerUrl}`
          );
          const username = u.pathname.replace(/\/+$/, "").split("/").pop();
          if (
            u.hostname.includes("facebook") ||
            u.hostname === "fb.com" ||
            u.hostname === "fb.me"
          ) {
            window.open(`https://m.me/${username}`, "_blank", "noopener");
          } else {
            window.open(messengerUrl, "_blank", "noopener");
          }
        } catch {
          window.open(messengerUrl, "_blank", "noopener");
        }
      },
    },
    {
      enabled: zaloEnabled,
      label: zaloLabel,
      icon: <ZaloIcon size={iconSize} color="#fff" />,
      action: () => zaloPhone && window.open(`https://zalo.me/${zaloPhone}`, "_blank", "noopener"),
    },
  ].filter((c) => c.enabled);

  if (contacts.length === 0) return null;

  return (
    <div
      style={{
        width: cw,
        height: ch,
        fontFamily,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: Math.max(4 * scale, (cw - contacts.length * btnSize * 1.6) / (contacts.length + 1)),
        padding: 4 * scale,
      }}
    >
      {contacts.map((c, i) => (
        <div
          key={i}
          onClick={c.action}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2 * scale,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <div
            style={{
              width: btnSize,
              height: btnSize,
              borderRadius: "50%",
              backgroundColor: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            {c.icon}
          </div>
          <span
            style={{
              fontSize: fSize,
              color: "#fff",
              whiteSpace: "nowrap",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
}
