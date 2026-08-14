import { useEffect, useMemo, useState } from "react";

interface Props {
  targetDate?: string;
  countdownType?: "hours-min-sec" | "days-hours-min-sec";
  color?: string;
  fontFamily?: string;
  width: number;
  height: number;
  scale: number;
  styleType?: "classic" | "modern" | "romantic" | "luxury-navy";
  orientation?: "horizontal" | "vertical";
}

export default function CountdownWidget({
  targetDate,
  countdownType = "days-hours-min-sec",
  color = "#b6cc61",
  fontFamily,
  width,
  height,
  scale,
  styleType = "classic",
  orientation = "horizontal",
}: Props) {
  const s = scale;
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate).getTime();
    if (isNaN(target)) return;

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const boxes = useMemo(() => {
    if (countdownType === "hours-min-sec") {
      const totalHours = timeLeft.days * 24 + timeLeft.hours;
      return [
        { value: String(totalHours).padStart(2, "0"), label: "Giờ" },
        { value: String(timeLeft.minutes).padStart(2, "0"), label: "Phút" },
        { value: String(timeLeft.seconds).padStart(2, "0"), label: "Giây" },
      ];
    }
    return [
      { value: String(timeLeft.days).padStart(2, "0"), label: "Ngày" },
      { value: String(timeLeft.hours).padStart(2, "0"), label: "Giờ" },
      { value: String(timeLeft.minutes).padStart(2, "0"), label: "Phút" },
      { value: String(timeLeft.seconds).padStart(2, "0"), label: "Giây" },
    ];
  }, [timeLeft, countdownType]);

  const isCol = orientation === "vertical";

  const boxSize = useMemo(() => {
    if (isCol) {
      return Math.min(
        (height * s - (boxes.length - 1) * 8 * s) / boxes.length,
        width * s,
      );
    }
    return Math.min(
      (width * s - (boxes.length - 1) * 8 * s) / boxes.length,
      height * s,
    );
  }, [width, height, s, boxes.length, isCol]);

  const numFontSize = Math.max(12, boxSize * 0.38);
  const labelFontSize = Math.max(8, numFontSize * 0.45);

  const styleFonts: Record<string, string> = {
    classic: "'Playfair Display', 'Cormorant Garamond', serif",
    modern: "'Montserrat', 'Inter', sans-serif",
    romantic: "'Cormorant Garamond', 'Playfair Display', serif",
    "luxury-navy": "'Cinzel', 'Playfair Display', serif",
  };
  const font = fontFamily || styleFonts[styleType] || styleFonts.classic;

  if (!targetDate) {
    return (
      <div
        style={{
          width: width * s,
          height: height * s,
          fontFamily: font,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.05)",
          borderRadius: 8 * s,
          border: "1px dashed rgba(0,0,0,0.15)",
        }}
      >
        <span style={{ fontSize: 12 * s, color: "#999" }}>
          Chưa chọn thời gian
        </span>
      </div>
    );
  }

  const containerStyle: React.CSSProperties = {
    width: width * s,
    height: height * s,
    fontFamily: font,
    display: "flex",
    flexDirection: isCol ? "column" : "row",
    alignItems: "center",
    justifyContent: "center",
    gap: isCol ? 8 * s : 10 * s,
    boxSizing: "border-box",
    background: "transparent",
    border: "none",
    boxShadow: "none",
  };

  if (styleType === "classic") {
    return (
      <div style={containerStyle}>
        {boxes.map((box, i) => (
          <div
            key={i}
            style={{
              width: boxSize,
              height: boxSize,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #2b080c 0%, #140204 100%)",
              borderRadius: 8 * s,
              border: `1px solid ${color}44`,
              gap: 3 * s,
              boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
            }}
          >
            <span
              style={{
                fontSize: numFontSize,
                fontWeight: 700,
                color,
                lineHeight: 1,
                textShadow: `0 0 6px ${color}33`,
              }}
            >
              {box.value}
            </span>
            <span
              style={{
                fontSize: labelFontSize,
                color: `${color}cc`,
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {box.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (styleType === "modern") {
    return (
      <div style={containerStyle}>
        {boxes.map((box, i) => (
          <div
            key={i}
            style={{
              width: boxSize,
              height: boxSize,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(248,249,250,0.85) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.7)",
              borderRadius: 10 * s,
              gap: 3 * s,
              boxShadow: "0 6px 16px rgba(170, 140, 150, 0.08)",
            }}
          >
            <span
              style={{
                fontSize: numFontSize,
                fontWeight: 800,
                color: "#1e293b",
                lineHeight: 1,
              }}
            >
              {box.value}
            </span>
            <span
              style={{
                fontSize: labelFontSize,
                color: "#64748b",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              {box.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (styleType === "romantic") {
    return (
      <div style={containerStyle}>
        {boxes.map((box, i) => (
          <div
            key={i}
            style={{
              width: boxSize,
              height: boxSize,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#d6c5af",
              borderRadius: 8 * s,
              border: "1px solid #c2b099",
              gap: 3 * s,
              boxShadow: "0 6px 14px rgba(90, 75, 56, 0.12)",
            }}
          >
            <span
              style={{
                fontSize: numFontSize,
                fontWeight: 700,
                color: "#423525",
                lineHeight: 1,
              }}
            >
              {box.value}
            </span>
            <span
              style={{
                fontSize: labelFontSize,
                color: "#6e5d47",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              {box.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {boxes.map((box, i) => (
        <div
          key={i}
          style={{
            width: boxSize,
            height: boxSize,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0f1b29",
            borderRadius: 6 * s,
            border: "1px solid #c5a86a",
            gap: 3 * s,
            boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 3 * s,
              left: 3 * s,
              right: 3 * s,
              bottom: 3 * s,
              border: "1px solid rgba(197,168,106,0.15)",
              pointerEvents: "none",
              borderRadius: 4 * s,
            }}
          />

          <span
            style={{
              fontSize: numFontSize,
              fontWeight: 700,
              color: "#ffd685",
              lineHeight: 1,
              zIndex: 1,
            }}
          >
            {box.value}
          </span>
          <span
            style={{
              fontSize: labelFontSize,
              color: "#c5a86a",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              zIndex: 1,
            }}
          >
            {box.label}
          </span>
        </div>
      ))}
    </div>
  );
}
