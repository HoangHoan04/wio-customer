import { forwardRef, type InputHTMLAttributes } from "react";

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  value: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  orientation?: "horizontal" | "vertical";
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      orientation = "horizontal",
      showValue = false,
      valueFormatter,
      className = "",
      onChange,
      ...rest
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      onValueChange?.(newValue);
      onChange?.(e);
    };

    const percentage = ((value - min) / (max - min)) * 100;
    const displayValue = valueFormatter ? valueFormatter(value) : value.toString();

    const isVertical = orientation === "vertical";

    return (
      <div
        className={`slider-container ${className}`}
        style={{
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          alignItems: "center",
          gap: isVertical ? "8px" : "12px",
          width: isVertical ? "auto" : "100%",
        }}
      >
        {showValue && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: "bold",
              color: "#1a0a0f",
              minWidth: "40px",
              textAlign: "center",
            }}
          >
            {displayValue}
          </span>
        )}

        <div
          className="slider-wrapper"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: isVertical ? "auto" : "100%",
            height: isVertical ? "100px" : "auto",
          }}
        >
          <div
            className="slider-track"
            style={{
              position: "absolute",
              background: "rgba(26, 10, 15, 0.15)",
              borderRadius: "4px",
              ...(isVertical
                ? {
                    width: "4px",
                    height: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }
                : {
                    height: "4px",
                    width: "100%",
                  }),
            }}
          />

          <div
            className="slider-progress"
            style={{
              position: "absolute",
              background: "linear-gradient(135deg, #d4af37 0%, #f5c842 100%)",
              borderRadius: "4px",
              transition: "all 0.15s ease",
              ...(isVertical
                ? {
                    width: "4px",
                    height: `${percentage}%`,
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }
                : {
                    height: "4px",
                    width: `${percentage}%`,
                  }),
            }}
          />

          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            className="slider-input"
            style={{
              position: "relative",
              appearance: "none",
              background: "transparent",
              cursor: "pointer",
              zIndex: 2,
              margin: 0,
              ...(isVertical
                ? {
                    width: "24px",
                    height: "100%",
                    writingMode: "bt-lr" as any,
                    WebkitAppearance: "slider-vertical",
                  }
                : {
                    width: "100%",
                    height: "24px",
                  }),
            }}
            {...rest}
          />
        </div>

        <style>{`
          .slider-input::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: linear-gradient(135deg, #d4af37 0%, #f5c842 100%);
            border: 2px solid #1a0a0f;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
          }

          .slider-input::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.6);
          }

          .slider-input::-webkit-slider-thumb:active {
            transform: scale(1.05);
          }

          .slider-input::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: linear-gradient(135deg, #d4af37 0%, #f5c842 100%);
            border: 2px solid #1a0a0f;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
          }

          .slider-input::-moz-range-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.6);
          }

          .slider-input::-moz-range-thumb:active {
            transform: scale(1.05);
          }

          .slider-input::-webkit-slider-runnable-track {
            background: transparent;
          }

          .slider-input::-moz-range-track {
            background: transparent;
          }

          .slider-input:focus {
            outline: none;
          }

          .slider-input:focus-visible::-webkit-slider-thumb {
            box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
          }

          .slider-input:focus-visible::-moz-range-thumb {
            box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
          }

          .slider-input:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .slider-input:disabled::-webkit-slider-thumb {
            cursor: not-allowed;
          }

          .slider-input:disabled::-moz-range-thumb {
            cursor: not-allowed;
          }
        `}</style>
      </div>
    );
  }
);

Slider.displayName = "Slider";
export default Slider;
