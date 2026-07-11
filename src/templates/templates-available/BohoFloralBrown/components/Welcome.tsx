import flowerBottom from "@/assets/decorations/boho-floral-brown/flower_bottom.webp";
import flowerTop from "@/assets/decorations/boho-floral-brown/flower_top.webp";
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
    setTimeout(() => onOpen(), 600);
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
        background: "radial-gradient(ellipse at center, #4a2010 0%, #2a0e06 60%, #1a0804 100%)",
        transition: "opacity 0.6s ease",
        opacity: isOpening ? 0 : 1,
        pointerEvents: isOpening ? "none" : undefined,
        fontFamily: config.fonts.heading,
      }}
    >
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {LEAVES.map((leaf, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${leaf.left}%`,
              top: "-20px",
              width: leaf.size,
              height: leaf.size * 1.6,
              background: "#8B6547",
              borderRadius: "50% 10% 50% 10%",
              opacity: 0,
              animation: `leafFall ${leaf.dur}s ${leaf.delay}s linear infinite`,
              transform: `rotate(${leaf.rot}deg)`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          width: "90%",
          maxWidth: 480,
          background: "linear-gradient(160deg, #fdf4ec 0%, #f5e8d8 100%)",
          borderRadius: 16,
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          overflow: "hidden",
          textAlign: "center",
          padding: "0 0 40px",
        }}
      >
        <img
          src={flowerTop}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            width: 200,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 2,
            opacity: 0.5,
          }}
        />

        <img
          src={flowerBottom}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: -10,
            left: -10,
            width: 160,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 2,
            transform: "rotate(270deg) scaleX(-1)",
            opacity: 0.5,
          }}
        />

        <div style={{ position: "relative", zIndex: 3, marginTop: 40, marginBottom: 16 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
            }}
          >
            <WelcomeIcon
              style={{
                width: 100,
                height: 100,
              }}
            />
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 3,
          }}
        >
          <div className="flex flex-col items-center justify-center mb-6">
            <div
              className="flex items-center justify-center flex-wrap"
              style={{
                gap: "clamp(1.5rem, 2vw, 1rem)",
              }}
            >
              <span
                style={{
                  fontFamily: config.fonts.script,
                  fontSize: "clamp(2rem, 6.5vw, 2.8rem)",
                  color: "#3d1a0d",
                  lineHeight: 1,
                  fontWeight: 400,
                  whiteSpace: "nowrap",
                }}
              >
                {data?.displayOrder === "bride_first"
                  ? data?.bride?.shortName || data?.bride?.name
                  : data?.groom?.shortName || data?.groom?.name}
              </span>

              <span
                style={{
                  fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
                  color: "#7a5030",
                  fontFamily: config.fonts.heading,
                  lineHeight: 1,
                  paddingBottom: "4px",
                }}
              >
                &amp;
              </span>

              <span
                style={{
                  fontFamily: config.fonts.script,
                  fontSize: "clamp(2rem, 6.5vw, 2.8rem)",
                  color: "#3d1a0d",
                  lineHeight: 1,
                  fontWeight: 400,
                  whiteSpace: "nowrap",
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
              gap: 8,
              margin: "0 0 14px",
            }}
          >
            <div style={{ width: 40, height: 0.5, background: "#7a5030", opacity: 0.5 }} />
            <i className="pi pi-star-fill" style={{ color: "#7a5030" }}></i>
            <div style={{ width: 40, height: 0.5, background: "#7a5030", opacity: 0.5 }} />
          </div>

          <p
            style={{
              fontSize: 14,
              color: "#5a3520",
              fontFamily: config.fonts.body,
              marginBottom: 14,
              letterSpacing: "0.02em",
            }}
          >
            {eventDate}
          </p>

          <p
            style={{
              fontSize: 13,
              color: "#7a5030",
              fontFamily: config.fonts.body,
              marginBottom: 10,
              letterSpacing: "0.05em",
            }}
          >
            Kính Mời
          </p>

          {data?.guestName && (
            <div
              style={{
                display: "inline-block",
                padding: "8px 24px",
                background: "rgba(255,255,255,0.6)",
                border: "0.5px solid #c8a882",
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 500,
                color: "#3d1a0d",
                fontFamily: config.fonts.heading,
                marginBottom: 10,
                backdropFilter: "blur(4px)",
              }}
            >
              {data.guestName}
            </div>
          )}

          <p
            style={{
              fontSize: 12,
              color: "#7a5030",
              fontFamily: config.fonts.body,
              marginBottom: 28,
              opacity: 0.85,
            }}
          >
            đến dự buổi tiệc chung vui cùng gia đình
          </p>

          <button
            onClick={handleOpen}
            style={{
              padding: "13px 44px",
              background: "#3d1a0d",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 500,
              fontFamily: config.fonts.body,
              letterSpacing: "0.05em",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(61,26,13,0.4)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.transform = "scale(1.04)";
              (e.target as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(61,26,13,0.55)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = "scale(1)";
              (e.target as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(61,26,13,0.4)";
            }}
          >
            Mở thiệp
          </button>
        </div>
      </div>

      <style>{`
        @keyframes leafFall {
          0%   { opacity: 0;   transform: translateY(0)    rotate(0deg)   scale(0.7); }
          8%   { opacity: 0.6; }
          90%  { opacity: 0.4; }
          100% { opacity: 0;   transform: translateY(105vh) rotate(540deg) scale(0.4); }
        }
      `}</style>
    </div>
  );
};

const LEAVES = [
  { left: 8, size: 7, dur: 9, delay: 0, rot: 20 },
  { left: 22, size: 5, dur: 7, delay: 2.5, rot: -15 },
  { left: 35, size: 6, dur: 11, delay: 1, rot: 40 },
  { left: 48, size: 8, dur: 8, delay: 4, rot: -30 },
  { left: 60, size: 5, dur: 10, delay: 0.5, rot: 15 },
  { left: 72, size: 7, dur: 7, delay: 3, rot: -45 },
  { left: 83, size: 6, dur: 9, delay: 1.5, rot: 60 },
  { left: 91, size: 5, dur: 12, delay: 2, rot: -20 },
  { left: 15, size: 6, dur: 8, delay: 5, rot: 30 },
  { left: 55, size: 8, dur: 10, delay: 3.5, rot: -10 },
  { left: 78, size: 5, dur: 7, delay: 6, rot: 50 },
  { left: 42, size: 7, dur: 9, delay: 7, rot: -35 },
];
