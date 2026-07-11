import { useState, type CSSProperties, type ReactNode } from "react";

interface Carousel3DItemProps {
  children?: ReactNode;
  isActive?: boolean;
  index?: number;
  currentIndex?: number;
  totalItems?: number;
  accentColor?: string;
  className?: string;
  style?: CSSProperties;
  onItemClick?: () => void;
  hoverEffect?: boolean;
  gradient?: string;
  clickIndicator?: ReactNode | string;
}

export default function Carousel3DItem({
  children,
  isActive = false,
  accentColor = "#d4af37",
  className = "",
  style = {},
  onItemClick,
  hoverEffect = true,
  gradient = "linear-gradient(160deg, #2d1219 0%, #3d1a24 50%, #1a0a0f 100%)",
  clickIndicator,
}: Carousel3DItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        ...style,
      }}
      onMouseEnter={() => hoverEffect && setIsHovered(true)}
      onMouseLeave={() => hoverEffect && setIsHovered(false)}
      onClick={handleClick}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: gradient,
          border: `2px solid ${isActive ? accentColor : "rgba(212,175,55,0.2)"}`,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: isActive
            ? `0 25px 50px rgba(0,0,0,0.5), 0 0 80px rgba(212,175,55,0.3)`
            : "0 15px 35px rgba(0,0,0,0.4)",
          transition: "all 0.4s ease",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          transform: isHovered && hoverEffect ? "scale(1.02)" : "scale(1)",
        }}
      >
        {children}

        {isActive && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: accentColor,
              boxShadow: `0 0 20px ${accentColor}`,
              animation: "pulse 2s infinite",
            }}
          />
        )}

        {!isHovered && isActive && clickIndicator && (
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "11px",
              color: accentColor,
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              animation: "pulse 2s ease-in-out infinite",
              pointerEvents: "none",
            }}
          >
            {clickIndicator}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
