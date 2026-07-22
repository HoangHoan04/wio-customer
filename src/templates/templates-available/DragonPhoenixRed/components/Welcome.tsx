import chineseHappiness from "@/assets/decorations/dragon_phoenix_red/chinese_happiness.webp";
import cloudSmall from "@/assets/decorations/dragon_phoenix_red/cloud_small.webp";
import dragonStandingImg from "@/assets/decorations/dragon_phoenix_red/dragon.webp";
import dragonLeftImg from "@/assets/decorations/dragon_phoenix_red/dragon_left.webp";
import dragonRightImg from "@/assets/decorations/dragon_phoenix_red/dragon_right.webp";
import phoenixImg from "@/assets/decorations/dragon_phoenix_red/phoenix.webp";
import { WelcomeIcon } from "@/assets/icons";
import { formatDateToVietnamese } from "@/common/helpers";
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

  const eventDate = formatDateToVietnamese(data?.eventDetails?.date);

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
        {CLOUDS.map((cloud, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${cloud.left}%`,
              top: `${cloud.top}%`,
              width: cloud.size,
              height: cloud.size * 0.6,
              background:
                "radial-gradient(ellipse at center, rgba(243,229,171,0.15) 0%, rgba(243,229,171,0.04) 60%, transparent 100%)",
              borderRadius: "50%",
              opacity: 0,
              animation: `cloudFloat ${cloud.dur}s ${cloud.delay}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          width: "92%",
          maxWidth: 450,
          minHeight: 480,
          borderRadius: 20,
          boxShadow:
            "0 30px 100px rgba(0,0,0,0.85), inset 0 0 30px rgba(212,175,55,0.15)",
          border: `3px double ${config.colors.accent}`,
          textAlign: "center",
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          background: "rgba(42, 3, 3, 0.45)",
          backdropFilter: "blur(8px)",
        }}
      >
        <img
          src={dragonStandingImg.src}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 5,
            top: 5,
            height: "75%",
            maxHeight: 200,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 1,
            opacity: 0.22,
            animation: isOpening ? "dragonStandingSpinOut 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards" : undefined
          }}
        />
        <img
          src={phoenixImg.src}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 5,
            top: 5,
            height: "75%",
            maxHeight: 200,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 1,
            opacity: 0.18,
            animation: isOpening ? "phoenixStandingSpinOut 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards" : undefined
          }}
        />
        <img
          src={dragonLeftImg.src}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 10,
            bottom: 15,
            width: 90,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 1,
            opacity: 0.3,
            animation: isOpening ? "dragonLeftCircleOut 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards" : undefined
          }}
        />
        <img
          src={dragonRightImg.src}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 10,
            bottom: 15,
            width: 90,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 1,
            opacity: 0.3,
            animation: isOpening ? "dragonRightCircleOut 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards" : undefined
          }}
        />
        <img
          src={chineseHappiness.src}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 20,
            right: 25,
            width: 45,
            pointerEvents: "none",
            zIndex: 2,
            opacity: 0.25,
          }}
        />

        <img
          src={cloudSmall.src}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 25,
            left: 25,
            width: 55,
            pointerEvents: "none",
            zIndex: 2,
            opacity: 0.25,
          }}
        />
        <div style={{ position: "relative", zIndex: 3, width: "100%" }}>
          <div
            style={{
              marginBottom: 20,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <WelcomeIcon
              style={{
                width: 85,
                height: 85,
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
              }}
            />
          </div>
          <div className="flex flex-col items-center justify-center mb-5">
            <div
              className="flex items-center justify-center flex-wrap"
              style={{ gap: "clamp(0.6rem, 2vw, 1.2rem)" }}
            >
              <span
                style={{
                  fontFamily: config.fonts.heading,
                  fontSize: "clamp(1.4rem, 8vw, 2.6rem)",
                  color: config.colors.textPrimary,
                  lineHeight: 1.1,
                  fontWeight: 600,
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {data?.displayOrder === "bride_first"
                  ? data?.bride?.shortName || data?.bride?.name
                  : data?.groom?.shortName || data?.groom?.name}
              </span>

              <span
                style={{
                  fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
                  color: config.colors.accent,
                  fontFamily: config.fonts.heading,
                  lineHeight: 1,
                  transform: "translateY(4px)",
                }}
              >
                &amp;
              </span>

              <span
                style={{
                  fontFamily: config.fonts.heading,
                  fontSize: "clamp(1.4rem, 8vw, 2.6rem)",
                  color: config.colors.textPrimary,
                  lineHeight: 1.1,
                  fontWeight: 600,
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {data?.displayOrder === "bride_first"
                  ? data?.groom?.shortName || data?.groom?.name
                  : data?.bride?.shortName || data?.bride?.name}
              </span>
            </div>
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
            <div
              style={{
                width: 50,
                height: 1,
                background: `linear-gradient(to left, ${config.colors.accent}, transparent)`,
              }}
            />
            <i
              className="pi pi-star-fill"
              style={{ color: config.colors.accent, fontSize: 10 }}
            ></i>
            <div
              style={{
                width: 50,
                height: 1,
                background: `linear-gradient(to right, ${config.colors.accent}, transparent)`,
              }}
            />
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
              marginBottom: 12,
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
                padding: "8px 28px",
                background: "rgba(212, 175, 55, 0.12)",
                border: `1px solid ${config.colors.accent}66`,
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                color: config.colors.textPrimary,
                fontFamily: config.fonts.heading,
                marginBottom: 12,
                backdropFilter: "blur(4px)",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
              }}
            >
              {data.guestName || "Quý Khách"}
            </div>
          )}

          <p
            style={{
              fontSize: 13,
              color: config.colors.textSecondary,
              fontFamily: config.fonts.body,
              marginBottom: 35,
              fontStyle: "italic",
              opacity: 0.95,
            }}
          >
            đến dự buổi tiệc chung vui cùng gia đình chúng tôi
          </p>
          <button
            onClick={handleOpen}
            style={{
              padding: "14px 48px",
              color: config.colors.buttonText,
              borderRadius: 999,
              fontSize: 15,
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
        @keyframes cloudFloat {
          0%   { opacity: 0;   transform: translateX(-30px) scale(0.8); }
          20%  { opacity: 0.4; }
          80%  { opacity: 0.3; }
          100% { opacity: 0;   transform: translateX(30px) scale(1.1); }
        }
        @keyframes dragonStandingSpinOut {
          0% { transform: scale(1) rotate(0deg); opacity: 0.22; }
          100% { transform: scale(2.2) rotate(180deg); opacity: 0; }
        }
        @keyframes phoenixStandingSpinOut {
          0% { transform: scale(1) rotate(0deg); opacity: 0.18; }
          100% { transform: scale(2.2) rotate(-180deg); opacity: 0; }
        }
        @keyframes dragonLeftCircleOut {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 0.3; }
          40% { transform: translate(60px, -40px) rotate(120deg) scale(1.4); opacity: 0.6; }
          100% { transform: translate(250px, -200px) rotate(360deg) scale(0.1); opacity: 0; }
        }
        @keyframes dragonRightCircleOut {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 0.3; }
          40% { transform: translate(-60px, -40px) rotate(-120deg) scale(1.4); opacity: 0.6; }
          100% { transform: translate(-250px, -200px) rotate(-360deg) scale(0.1); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const CLOUDS = [
  { left: 5, top: 10, size: 60, dur: 8, delay: 0 },
  { left: 20, top: 30, size: 40, dur: 6, delay: 1.5 },
  { left: 40, top: 15, size: 50, dur: 7, delay: 0.5 },
  { left: 55, top: 35, size: 35, dur: 9, delay: 2 },
  { left: 70, top: 20, size: 45, dur: 6.5, delay: 1 },
  { left: 85, top: 40, size: 30, dur: 8, delay: 3 },
];
