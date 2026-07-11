"use client";

import { type ReactNode, useEffect, useState } from "react";

const C = {
  bg: "#0f0608",
  bgCard: "#1a0a0f",
  gold: "#d4af37",
  goldLight: "#f5c842",
};

interface IPhoneMockupProps {
  className?: string;
  position?: {
    left?: string;
    right?: string;
    top?: string;
    marginLeft?: string;
  };
  transform?: string;
  children?: ReactNode;
  size?: "small" | "medium" | "large";
}

export default function IPhoneMockup({
  className = "",
  position = {},
  transform = "rotateY(-5deg) rotateX(3deg) translateZ(40px)",
  children,
  size = "medium",
}: IPhoneMockupProps) {
  const [currentTime, setCurrentTime] = useState<string>("11:19");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const dimensions = {
    small: { width: "220px", height: "440px" },
    medium: { width: "250px", height: "500px" },
    large: { width: "280px", height: "560px" },
  };

  const buttonSizes = {
    small: { gap: "1.5", height: "26px", power: "42px" },
    medium: { gap: "1.5", height: "30px", power: "50px" },
    large: { gap: "2", height: "35px", power: "60px" },
  };

  const sizeConfig = dimensions[size];
  const buttonConfig = buttonSizes[size];

  return (
    <div
      className={`absolute ${className}`}
      style={{
        ...position,
        zIndex: size === "medium" ? 3 : 1,
        transformStyle: "preserve-3d",
        transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        opacity: 0,
        transform,
      }}
    >
      <div
        className="relative rounded-[36px] sm:rounded-[40px]"
        style={{
          ...sizeConfig,
          background: `linear-gradient(145deg, ${C.bgCard} 0%, #0a0506 30%, #050303 60%, ${C.bg} 100%)`,
          boxShadow:
            size === "small"
              ? `inset 0 0 0 1.5px ${C.gold}40, inset 0 0 0 3px ${C.gold}20, -6px 10px 40px rgba(0,0,0,0.6), -2px 4px 12px rgba(0,0,0,0.4)`
              : size === "medium"
                ? `inset 0 0 0 1.5px ${C.gold}40, inset 0 0 0 3px ${C.gold}20, 12px 20px 60px rgba(0,0,0,0.7), 4px 8px 20px rgba(0,0,0,0.4)`
                : `inset 0 0 0 1.5px ${C.gold}40, inset 0 0 0 3px ${C.gold}20, 6px 10px 40px rgba(0,0,0,0.6), 2px 4px 12px rgba(0,0,0,0.4)`,
        }}
      >
        <div
          className="absolute flex flex-col"
          style={{
            left: "-3px",
            top:
              size === "small" ? "70px" : size === "medium" ? "75px" : "80px",
            gap: `${buttonConfig.gap}px`,
          }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-[2px_0_0_2px]"
              style={{
                width: "3px",
                height: buttonConfig.height,
                background: `linear-gradient(180deg, ${C.goldLight}, ${C.gold})`,
              }}
            />
          ))}
        </div>

        <div
          className="absolute rounded-[0_2px_2px_0]"
          style={{
            right: "-3px",
            top:
              size === "small"
                ? "100px"
                : size === "medium"
                  ? "120px"
                  : "140px",
            width: "3px",
            height: buttonConfig.power,
            background: `linear-gradient(180deg, ${C.goldLight}, ${C.gold})`,
          }}
        />

        <div
          className="absolute rounded-[30px] overflow-hidden"
          style={{ top: "5px", left: "5px", right: "5px", bottom: "5px" }}
        >
          <div
            className="relative z-10 flex justify-between items-center font-semibold"
            style={{
              padding: "12px 14px 7px",
              fontSize: "8px",
              color: "rgba(255,255,255,0.9)",
              fontFamily: "sans-serif",
            }}
          >
            <span>{currentTime} Viettel</span>
            <div className="flex items-center gap-0.75">
              <div
                className="flex items-end gap-px"
                style={{ width: "10px", height: "7px" }}
              >
                {[3, 5, 7, 7].map((h, i) => (
                  <div
                    key={i}
                    className="rounded-[0.5px]"
                    style={{
                      width: "2px",
                      height: `${h}px`,
                      background: "rgba(255,255,255,0.9)",
                      opacity: i === 3 ? 0.35 : 1,
                    }}
                  />
                ))}
              </div>
              <svg width="12" height="9" viewBox="0 0 16 12" fill="none">
                <path
                  d="M1 4a10 10 0 0114 0M3.5 6.5a6.5 6.5 0 019 0M6 9a3 3 0 014 0"
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <svg width="18" height="9" viewBox="0 0 18 9" fill="none">
                <rect
                  x="0.5"
                  y="0.5"
                  width="15"
                  height="8"
                  rx="2"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1"
                />
                <rect
                  x="1.5"
                  y="1.5"
                  width="11"
                  height="6"
                  rx="1"
                  fill="rgba(255,255,255,0.9)"
                />
                <path
                  d="M16.5 3v3a1.5 1.5 0 000-3z"
                  fill="rgba(255,255,255,0.4)"
                />
              </svg>
            </div>
          </div>
          <div
            className="absolute rounded-lg z-10"
            style={{
              top: "9px",
              left: "50%",
              transform: "translateX(-50%)",
              width:
                size === "small" ? "44px" : size === "medium" ? "44px" : "52px",
              height:
                size === "small" ? "13px" : size === "medium" ? "13px" : "16px",
              background: "#000",
            }}
          />

          <div
            className="tct-screen-in w-full h-full flex flex-col overflow-hidden"
            style={{
              opacity: 0,
              background:
                "linear-gradient(170deg, #1a0a0e 0%, #2d1018 40%, #1a0a0e 100%)",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
