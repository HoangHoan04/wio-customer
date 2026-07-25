import flowerImg from "@/assets/decorations/royal-red/flower.webp";
import cornerFrame from "@/assets/decorations/common/frame-corner-top-left.webp";
import { WelcomeIcon } from "@/assets/icons";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { useState } from "react";

export const Welcome = ({
  data,
  config,
  onOpen,
}: {
  data?: any;
  config: ThemeTemplateConfig;
  onOpen: () => void;
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(() => onOpen(), 900);
  };

  const eventDate = data?.eventDetails?.date
    ? new Date(data.eventDetails.date).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "10 tháng 5, 2026";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at center, #6b0c0c 0%, #2a0303 70%, #0c0000 100%)",
        transition: "opacity 0.6s ease",
        opacity: isOpening ? 0 : 1,
        pointerEvents: isOpening ? "none" : undefined,
        fontFamily: config.fonts.heading,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {SPARKLES.map((sparkle, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${sparkle.left}%`,
              top: "-20px",
              width: sparkle.size,
              height: sparkle.size,
              background: sparkle.color,
              borderRadius: "50%",
              opacity: 0,
              animation: `sparkleFall ${sparkle.dur}s ${sparkle.delay}s linear infinite`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          width: "92%",
          maxWidth: 450,
          background: "linear-gradient(160deg, #470a0d 0%, #1a0205 100%)",
          borderRadius: 20,
          boxShadow: "0 30px 100px rgba(0,0,0,0.85), inset 0 0 30px rgba(212,175,55,0.15)",
          border: `3px double ${config.colors.accent}`,
          textAlign: "center",
          padding: "45px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          backdropFilter: "blur(8px)",
          animation: isOpening ? "cardScaleOut 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards" : undefined
        }}
      >
        <img src={cornerFrame.src} alt="" className="absolute top-2.5 left-2.5 w-7 h-7 pointer-events-none opacity-60" />
        <img src={cornerFrame.src} alt="" className="absolute top-2.5 right-2.5 w-7 h-7 pointer-events-none opacity-60 rotate-90" />
        <img src={cornerFrame.src} alt="" className="absolute bottom-2.5 left-2.5 w-7 h-7 pointer-events-none opacity-60 -rotate-90" />
        <img src={cornerFrame.src} alt="" className="absolute bottom-2.5 right-2.5 w-7 h-7 pointer-events-none opacity-60 rotate-180" />

        <img
          src={flowerImg.src}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -15,
            right: -15,
            width: 90,
            opacity: 0.8,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 2,
          }}
        />
        <img
          src={flowerImg.src}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: -15,
            left: -15,
            width: 90,
            opacity: 0.8,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 2,
            transform: "rotate(180deg)",
          }}
        />

        <div style={{ position: "relative", zIndex: 3, width: "100%" }}>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <WelcomeIcon
              style={{
                width: 80,
                height: 80,
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
              }}
            />
          </div>

          <p
            style={{
              fontSize: 13,
              color: config.colors.accent,
              fontFamily: config.fonts.body,
              marginBottom: 8,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            LỄ THÀNH HÔN
          </p>

          <div className="flex flex-col items-center mb-5">
            <h1
              style={{
                fontFamily: config.fonts.script,
                fontSize: "clamp(2rem, 10vw, 3rem)",
                color: config.colors.textPrimary,
                lineHeight: 1.1,
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {data?.displayOrder === "bride_first"
                ? data?.bride?.fullName || data?.bride?.name
                : data?.groom?.fullName || data?.groom?.name}
            </h1>
            
            <span
              style={{
                fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
                color: config.colors.accent,
                fontFamily: config.fonts.script,
                margin: "4px 0",
              }}
            >
              &amp;
            </span>

            <h1
              style={{
                fontFamily: config.fonts.script,
                fontSize: "clamp(2rem, 10vw, 3rem)",
                color: config.colors.textPrimary,
                lineHeight: 1.1,
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {data?.displayOrder === "bride_first"
                ? data?.groom?.fullName || data?.groom?.name
                : data?.bride?.fullName || data?.bride?.name}
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              margin: "0 0 16px",
            }}
          >
            <div style={{ width: 50, height: 1, background: `linear-gradient(to left, ${config.colors.accent}, transparent)` }} />
            <i className="pi pi-heart-fill animate-pulse" style={{ color: config.colors.accent, fontSize: 10 }}></i>
            <div style={{ width: 50, height: 1, background: `linear-gradient(to right, ${config.colors.accent}, transparent)` }} />
          </div>

          <p
            style={{
              fontSize: 14,
              color: config.colors.textSecondary,
              fontFamily: config.fonts.body,
              marginBottom: 16,
              letterSpacing: "0.05em",
              fontWeight: 500,
            }}
          >
            {eventDate}
          </p>

          <p
            style={{
              fontSize: 13,
              color: config.colors.accent,
              fontFamily: config.fonts.body,
              marginBottom: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {data?.salutation || "Trân Trọng Kính Mời"}
          </p>

          {data?.guestName && (
            <div
              style={{
                display: "inline-block",
                padding: "8px 24px",
                background: "rgba(212, 175, 55, 0.12)",
                border: `1px solid ${config.colors.accent}66`,
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                color: config.colors.textPrimary,
                fontFamily: config.fonts.heading,
                marginBottom: 12,
                backdropFilter: "blur(4px)",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
              }}
            >
              {data.guestName}
            </div>
          )}

          <p
            style={{
              fontSize: 13,
              color: config.colors.textSecondary,
              fontFamily: config.fonts.body,
              marginBottom: 30,
              fontStyle: "italic",
              opacity: 0.9,
            }}
          >
            đến dự buổi tiệc chung vui cùng gia đình chúng tôi
          </p>

          <button
            onClick={handleOpen}
            style={{
              padding: "14px 44px",
              color: config.colors.buttonText,
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: config.fonts.body,
              letterSpacing: "0.15em",
              cursor: "pointer",
              background: `linear-gradient(135deg, #f5e6b3 0%, ${config.colors.accent} 50%, #b8922f 100%)`,
              border: "1px solid #f5e6b3",
              boxShadow: "0 6px 20px rgba(212, 175, 55, 0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
              transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              target.style.transform = "translateY(-3px)";
              target.style.boxShadow = "0 10px 25px rgba(212, 175, 55, 0.5), inset 0 1px 0 rgba(255,255,255,0.5)";
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              target.style.transform = "translateY(0)";
              target.style.boxShadow = "0 6px 20px rgba(212, 175, 55, 0.35), inset 0 1px 0 rgba(255,255,255,0.4)";
            }}
          >
            MỞ THIỆP
          </button>
        </div>
      </div>

      <style>{`
        @keyframes sparkleFall {
          0% { transform: translateY(-50px) rotate(0deg) scale(0.6); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.6; }
          100% { transform: translateY(105vh) rotate(360deg) scale(1.1); opacity: 0; }
        }
        @keyframes cardScaleOut {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const SPARKLES = [
  { left: 5, size: 6, dur: 10, delay: 0, color: "#d4af37" },
  { left: 15, size: 4, dur: 8, delay: 1.5, color: "#f5e6b3" },
  { left: 25, size: 5, dur: 11, delay: 0.5, color: "#d4af37" },
  { left: 35, size: 3, dur: 7, delay: 2.2, color: "#b8922f" },
  { left: 45, size: 6, dur: 9, delay: 1, color: "#d4af37" },
  { left: 55, size: 4, dur: 8.5, delay: 3, color: "#f5e6b3" },
  { left: 65, size: 5, dur: 10.5, delay: 0.2, color: "#d4af37" },
  { left: 75, size: 3, dur: 7.5, delay: 1.8, color: "#b8922f" },
  { left: 85, size: 6, dur: 9.5, delay: 2.5, color: "#d4af37" },
  { left: 95, size: 4, dur: 8.2, delay: 0.8, color: "#f5e6b3" },
];
