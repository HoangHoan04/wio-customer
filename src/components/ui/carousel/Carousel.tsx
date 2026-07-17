"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselColors {
  accent?: string;
  buttonBg?: string;
  buttonHoverBg?: string;
  dotInactive?: string;
}

export interface CarouselSizes {
  minHeight?: string;
  trackHeight?: string;
  itemWidth?: string;
  itemHeight?: string;
}

export interface CarouselProps {
  children: ReactElement | ReactElement[];
  colors?: CarouselColors;
  sizes?: CarouselSizes;
  initialIndex?: number;
  showControls?: boolean;
  showDots?: boolean;
  prevIcon?: ReactNode;
  nextIcon?: ReactNode;
  className?: string;
}

export default function Carousel({
  children,
  colors = {},
  sizes = {},
  initialIndex = 0,
  showControls = true,
  showDots = true,
  prevIcon,
  nextIcon,
  className = "",
}: CarouselProps) {
  const accent = colors.accent ?? "#d4af37";
  const buttonBg = colors.buttonBg ?? "rgba(26, 10, 15, 0.9)";
  const buttonHoverBg = colors.buttonHoverBg ?? `${accent}22`;
  const dotInactive = colors.dotInactive ?? `${accent}40`;

  const minHeight = sizes.minHeight ?? "600px";
  const trackHeight = sizes.trackHeight ?? "500px";
  const itemWidth = sizes.itemWidth ?? "500px";
  const itemHeight = sizes.itemHeight ?? "480px";

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [hoveredBtn, setHoveredBtn] = useState<"prev" | "next" | null>(null);

  const childrenArray = Children.toArray(children).filter(isValidElement);
  const totalItems = childrenArray.length;

  const handleNext = () => setCurrentIndex((p) => (p + 1) % totalItems);
  const handlePrev = () =>
    setCurrentIndex((p) => (p - 1 + totalItems) % totalItems);

  const getItemStyle = (index: number): CSSProperties => {
    const diff = index - currentIndex;
    let norm = diff;
    if (norm > totalItems / 2) norm -= totalItems;
    else if (norm < -totalItems / 2) norm += totalItems;

    if (norm === 0) {
      return {
        transform: "translateX(-50%) translateZ(0px) scale(1)",
        opacity: 1,
        zIndex: 100,
        left: "50%",
      };
    }

    const abs = Math.abs(norm);
    const side = norm > 0 ? 1 : -1;
    const xOffset = side * (300 + (abs - 1) * 120);
    const zOffset = -abs * 200;

    return {
      transform: `translateX(calc(-50% + ${xOffset}px)) translateZ(${zOffset}px) scale(${Math.max(0.5, 1 - abs * 0.15)})`,
      opacity: abs <= 2 ? Math.max(0.3, 1 - abs * 0.25) : 0,
      zIndex: 100 - abs * 10,
      left: "50%",
      pointerEvents: abs > 2 ? "none" : "auto",
    };
  };

  return (
    <div
      className={`relative w-full overflow-hidden py-10 ${className}`}
      style={{ minHeight, perspective: "3000px" }}
    >
      <div
        className="relative w-full flex justify-center items-center"
        style={{ height: trackHeight, transformStyle: "preserve-3d" }}
      >
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className="absolute cursor-pointer transition-all duration-600 ease-in-out flex justify-center items-center"
            style={{
              width: itemWidth,
              height: itemHeight,
              ...getItemStyle(index),
            }}
            onClick={() => setCurrentIndex(index)}
          >
            {cloneElement(child as ReactElement<any>, {
              isActive: index === currentIndex,
              index,
              currentIndex,
              totalItems,
              accentColor: accent,
            })}
          </div>
        ))}
      </div>

      {showControls &&
        (["prev", "next"] as const).map((side) => (
          <button
            key={side}
            onClick={side === "prev" ? handlePrev : handleNext}
            aria-label={side === "prev" ? "Previous" : "Next"}
            className={`absolute ${side === "prev" ? "left-2 sm:left-5" : "right-2 sm:right-5"} top-1/2 z-200 flex h-10 w-10 sm:h-14 sm:w-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 backdrop-blur-[10px] transition-all duration-300 hover:scale-110`}
            style={{
              borderColor: accent,
              background: hoveredBtn === side ? buttonHoverBg : buttonBg,
            }}
            onMouseEnter={() => setHoveredBtn(side)}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            {side === "prev"
              ? (prevIcon ?? <ChevronLeft size={20} style={{ color: accent }} />)
              : (nextIcon ?? <ChevronRight size={20} style={{ color: accent }} />)}
          </button>
        ))}

      {showDots && (
        <div className="absolute bottom-0 justify-center items-center left-1/2 z-200 flex -translate-x-1/2 gap-2.5">
          {childrenArray.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Slide ${index + 1}`}
              className="h-3 w-3 cursor-pointer rounded-full border-none transition-all duration-300"
              style={{
                width: currentIndex === index ? "22px" : "12px",
                height: currentIndex === index ? "22px" : "12px",
                background: currentIndex === index ? accent : dotInactive,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
