import chineseHappiness from "@/assets/decorations/dragon_phoenix_green/chinese_happiness.webp";
import cloudSmall from "@/assets/decorations/dragon_phoenix_green/cloud_small.webp";
import dragonStandingImg from "@/assets/decorations/dragon_phoenix_green/dragon.webp";
import dragonLeftImg from "@/assets/decorations/dragon_phoenix_green/dragon_left.webp";
import dragonRightImg from "@/assets/decorations/dragon_phoenix_green/dragon_right.webp";
import phoenixImg from "@/assets/decorations/dragon_phoenix_green/phoenix.webp";
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
    setTimeout(() => onOpen(), 600);
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
        background: "radial-gradient(ellipse at center, #162542 0%, #0f2a1d 60%, #060b14 100%)",
        transition: "opacity 0.6s ease",
        opacity: isOpening ? 0 : 1,
        pointerEvents: isOpening ? "none" : undefined,
        fontFamily: config.fonts.heading,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
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
                "radial-gradient(ellipse at center, rgba(232,213,163,0.12) 0%, rgba(232,213,163,0.03) 60%, transparent 100%)",
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
          boxShadow: "0 30px 100px rgba(0,0,0,0.7), inset 0 0 20px rgba(139,94,22,0.2)",
          border: "3px solid #d4af37",
          textAlign: "center",
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
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
            opacity: 0.18,
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
            opacity: 0.15,
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
            opacity: 0.25,
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
            opacity: 0.25,
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
            opacity: 0.15,
            mixBlendMode: "darken",
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
            opacity: 0.15,
            mixBlendMode: "darken",
          }}
        />
        <div style={{ position: "relative", zIndex: 3, width: "100%" }}>
          <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
            <WelcomeIcon
              style={{ width: 85, height: 85, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
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
                  fontSize: "clamp(1.2rem, 7vw, 3rem)",
                  color: "#b08b33",
                  lineHeight: 1.1,
                  fontWeight: 400,
                }}
              >
                {data?.displayOrder === "bride_first"
                  ? data?.bride?.shortName || data?.bride?.name
                  : data?.groom?.shortName || data?.groom?.name}
              </span>

              <span
                style={{
                  fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
                  color: "#b08b33",
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
                  fontSize: "clamp(1.2rem, 7vw, 3rem)",
                  color: "#b08b33",
                  lineHeight: 1.1,
                  fontWeight: 400,
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
                background: "linear-gradient(to left, #b08b33, transparent)",
              }}
            />
            <i className="pi pi-star-fill" style={{ color: "#b08b33", fontSize: 10 }}></i>
            <div
              style={{
                width: 50,
                height: 1,
                background: "linear-gradient(to right, #b08b33, transparent)",
              }}
            />
          </div>
          <p
            style={{
              fontSize: 14,
              color: "#6b531e",
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
              color: "#b08b33",
              fontFamily: config.fonts.body,
              marginBottom: 12,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Trân Trọng Kính Mời
          </p>
          {data?.guestName && (
            <div
              style={{
                display: "inline-block",
                padding: "8px 28px",
                background: "rgba(176, 139, 51, 0.1)",
                border: "1px solid rgba(176, 139, 51, 0.4)",
                borderRadius: 4,
                fontSize: 16,
                fontWeight: 600,
                color: "#b08b33",
                fontFamily: config.fonts.heading,
                marginBottom: 12,
                backdropFilter: "blur(4px)",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              {data.guestName || "Quý Khách"}
            </div>
          )}

          <p
            style={{
              fontSize: 13,
              color: "#6b531e",
              fontFamily: config.fonts.body,
              marginBottom: 35,
              fontStyle: "italic",
              opacity: 0.9,
            }}
          >
            đến dự buổi tiệc chung vui cùng gia đình chúng tôi
          </p>
          <button
            onClick={handleOpen}
            style={{
              padding: "14px 48px",
              color: "#e2ce97",
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 600,
              fontFamily: config.fonts.body,
              letterSpacing: "0.1em",
              cursor: "pointer",
              background: "transparent",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              target.style.transform = "translateY(0)";
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
