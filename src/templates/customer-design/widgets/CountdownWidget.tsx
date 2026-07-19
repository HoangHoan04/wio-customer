import { useEffect, useMemo, useState } from "react";

interface Props {
  targetDate?: string;
  countdownType?: "hours-min-sec" | "days-hours-min-sec";
  color?: string;
  fontFamily?: string;
  width: number;
  height: number;
  scale: number;
}

export default function CountdownWidget({
  targetDate,
  countdownType = "days-hours-min-sec",
  color = "#d4af37",
  fontFamily = "Quicksand",
  width,
  height,
  scale,
}: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  const boxSize = Math.min(
    (width * scale - (boxes.length + 1) * 6 * scale) / boxes.length,
    height * scale * 0.7
  );
  const fontSize = Math.max(10, boxSize * 0.38);
  const labelSize = Math.max(7, fontSize * 0.5);

  return (
    <div
      style={{
        width: width * scale,
        height: height * scale,
        fontFamily,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6 * scale,
        border: `1px solid ${color}30`,
        borderRadius: 10 * scale,
        backgroundColor: `${color}08`,
        padding: `0 ${8 * scale}px`,
      }}
    >
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
            backgroundColor: `${color}18`,
            borderRadius: 8 * scale,
            border: `1px solid ${color}30`,
            gap: 2 * scale,
          }}
        >
          <span
            style={{
              fontSize,
              fontWeight: 700,
              color,
              lineHeight: 1,
              fontFamily,
            }}
          >
            {box.value}
          </span>
          <span
            style={{
              fontSize: labelSize,
              color: `${color}99`,
              fontWeight: 500,
              fontFamily,
            }}
          >
            {box.label}
          </span>
        </div>
      ))}
    </div>
  );
}
