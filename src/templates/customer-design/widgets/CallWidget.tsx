import { MessengerIcon, PhoneIcon, ZaloIcon } from "@/assets/icons";

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
  width: number;
  height: number;
  scale: number;
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
  width,
  height,
  scale,
}: Props) {
  const iconSize = 32 * scale;

  const contacts: {
    enabled?: boolean;
    label: string;
    icon: React.ReactNode;
    action: () => void;
  }[] = [
    {
      enabled: phoneEnabled,
      label: phoneLabel,
      icon: <PhoneIcon width={iconSize} height={iconSize} />,
      action: () => phoneNumber && window.open(`tel:${phoneNumber}`, "_self"),
    },
    {
      enabled: messengerEnabled,
      label: messengerLabel,
      icon: <MessengerIcon width={iconSize} height={iconSize} />,
      action: () => {
        if (!messengerUrl) return;
        const trimmed = messengerUrl.trim();
        if (
          trimmed.includes("facebook.com") ||
          trimmed.includes("messenger.com") ||
          trimmed.includes("m.me") ||
          trimmed.includes("fb.com")
        ) {
          try {
            const urlString = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
            const u = new URL(urlString);
            const username = u.pathname.replace(/\/+$/, "").split("/").pop();
            window.open(`https://m.me/${username}`, "_blank", "noopener");
          } catch {
            window.open(`https://m.me/${trimmed}`, "_blank", "noopener");
          }
        } else if (trimmed.startsWith("http")) {
          window.open(trimmed, "_blank", "noopener");
        } else {
          window.open(`https://m.me/${trimmed}`, "_blank", "noopener");
        }
      },
    },
    {
      enabled: zaloEnabled,
      label: zaloLabel,
      icon: <ZaloIcon width={iconSize} height={iconSize} />,
      action: () => {
        if (!zaloPhone) return;
        const cleanPhone = zaloPhone.replace(/[^0-9]/g, "");
        window.open(`https://zalo.me/${cleanPhone}`, "_blank", "noopener");
      },
    },
  ].filter((c) => c.enabled);

  if (contacts.length === 0) return null;

  return (
    <div
      style={{
        width: width * scale,
        height: height * scale,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10 * scale,
        padding: 0,
        boxSizing: "border-box",
        background: "transparent",
      }}
    >
      {contacts.map((c, i) => (
        <div
          key={i}
          onClick={c.action}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            userSelect: "none",
            width: "100%",
            height: "auto",
          }}
        >
          {c.icon}
        </div>
      ))}
    </div>
  );
}
