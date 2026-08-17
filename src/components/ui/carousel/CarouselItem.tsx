"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

export interface CarouselItemColors {
  accent?: string;
  borderInactive?: string;
  shadowActive?: string;
  shadowInactive?: string;
}

export interface CarouselItemProps {
  children?: ReactNode;
  isActive?: boolean;
  index?: number;
  currentIndex?: number;
  totalItems?: number;
  accentColor?: string;
  colors?: CarouselItemColors;
  gradient?: string;
  borderRadius?: string;
  hoverEffect?: boolean;
  clickIndicator?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onItemClick?: () => void;
}

export default function CarouselItem({
  children,
  isActive = false,
  accentColor = "#2D231F",
  colors = {},
  gradient = "transparent",
  borderRadius = "16px",
  hoverEffect = true,
  className = "",
  style = {},
  onItemClick,
}: CarouselItemProps) {
  const accent = colors.accent ?? accentColor;
  const borderInactive = colors.borderInactive ?? "rgba(45, 35, 31, 0.15)";
  const shadowActive =
    colors.shadowActive ?? `0 20px 40px rgba(45, 35, 31, 0.16)`;
  const shadowInactive =
    colors.shadowInactive ?? "0 8px 24px rgba(45, 35, 31, 0.08)";

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`w-full ${className}`}
      style={style}
      onMouseEnter={() => hoverEffect && setIsHovered(true)}
      onMouseLeave={() => hoverEffect && setIsHovered(false)}
      onClick={onItemClick}
    >
      <div
        className="relative flex w-full flex-col overflow-hidden transition-all duration-400 ease-in-out"
        style={{
          background: gradient,
          border: `2px solid ${isActive ? accent : borderInactive}`,
          borderRadius,
          boxShadow: isActive ? shadowActive : shadowInactive,
          transform: isHovered && hoverEffect ? "scale(1.02)" : "scale(1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
