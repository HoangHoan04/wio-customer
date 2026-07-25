import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  useState,
} from "react";

interface Carousel3DProps {
  children: ReactElement | ReactElement[];
  accentColor?: string;
  initialIndex?: number;
  minHeight?: string;
  height?: string;
  itemWidth?: string;
  itemHeight?: string;
  showControls?: boolean;
  className?: string;
}

export default function Carousel3D({
  children,
  accentColor = "#d4af37",
  initialIndex = 0,
  minHeight = "600px",
  height = "500px",
  itemWidth = "380px",
  itemHeight = "480px",
  showControls = true,
  className = "",
}: Carousel3DProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const childrenArray = Children.toArray(children).filter(isValidElement);
  const totalItems = childrenArray.length;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleItemClick = (index: number) => {
    setCurrentIndex(index);
  };

  const getItemStyle = (index: number) => {
    const diff = index - currentIndex;

    let normalizedDiff = diff;
    if (normalizedDiff > totalItems / 2) {
      normalizedDiff -= totalItems;
    } else if (normalizedDiff < -totalItems / 2) {
      normalizedDiff += totalItems;
    }

    if (normalizedDiff === 0) {
      return {
        transform: "translateX(-50%) translateZ(0px) scale(1)",
        opacity: 1,
        zIndex: 100,
        left: "50%",
      };
    }

    const absPosition = Math.abs(normalizedDiff);
    const side = normalizedDiff > 0 ? 1 : -1;

    const xOffset = side * (300 + (absPosition - 1) * 120);
    const zOffset = -absPosition * 200;
    const scale = Math.max(0.5, 1 - absPosition * 0.15);
    const opacity = Math.max(0.3, 1 - absPosition * 0.25);

    return {
      transform: `translateX(calc(-50% + ${xOffset}px)) translateZ(${zOffset}px) scale(${scale})`,
      opacity: absPosition <= 2 ? opacity : 0,
      zIndex: 100 - absPosition * 10,
      left: "50%",
      pointerEvents: absPosition > 2 ? ("none" as const) : ("auto" as const),
    };
  };

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        minHeight,
        perspective: "2000px",
        overflow: "hidden",
        padding: "60px 0",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height,
          transformStyle: "preserve-3d",
        }}
      >
        {childrenArray.map((child, index) => {
          const isActive = index === currentIndex;
          const style = getItemStyle(index);

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                width: itemWidth,
                height: itemHeight,
                transition: "all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)",
                cursor: "pointer",
                ...style,
              }}
              onClick={() => handleItemClick(index)}
            >
              {cloneElement(child as ReactElement<any>, {
                isActive,
                index,
                currentIndex,
                totalItems,
              })}
            </div>
          );
        })}
      </div>

      {showControls && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: `2px solid ${accentColor}`,
              background: "rgba(26, 10, 15, 0.9)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              zIndex: 200,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              e.currentTarget.style.background = `${accentColor}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              e.currentTarget.style.background = "rgba(26, 10, 15, 0.9)";
            }}
          >
            <ChevronLeft
              style={{ color: accentColor, width: "20px", height: "20px" }}
            />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next"
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: `2px solid ${accentColor}`,
              background: "rgba(26, 10, 15, 0.9)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              zIndex: 200,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
              e.currentTarget.style.background = `${accentColor}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              e.currentTarget.style.background = "rgba(26, 10, 15, 0.9)";
            }}
          >
            <ChevronRight
              style={{ color: accentColor, width: "20px", height: "20px" }}
            />
          </button>
        </>
      )}

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          zIndex: 200,
        }}
      >
        {childrenArray.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            style={{
              width: currentIndex === index ? "32px" : "10px",
              height: "10px",
              borderRadius: "5px",
              border: "none",
              background:
                currentIndex === index ? accentColor : `${accentColor}40`,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
}
