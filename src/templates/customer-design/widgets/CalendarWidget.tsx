import { useMemo } from "react";

interface Props {
  targetDate?: string;
  displayMode?: "full" | "date-only";
  calendarStyle?: "classic" | "modern" | "romantic" | "minimal";
  color?: string;
  fontFamily?: string;
  width: number;
  height: number;
  scale: number;
}

const MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];
const DOW = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const PAD_H = 8;
const PAD_V = 8;
const HEADER_H = 22;
const DOW_H = 16;
const DIV_H = 5;
const CELL_GAP = 5;

function calcCellSize(width: number, height: number): number {
  const fromWidth = (width - 2 * PAD_H - 6 * CELL_GAP) / 7;
  const rowsArea = height - 2 * PAD_V - HEADER_H - DOW_H - DIV_H - 5 * CELL_GAP;
  const fromHeight = rowsArea / 6;
  return Math.floor(Math.min(fromWidth, fromHeight, 36));
}

export default function CalendarWidget({
  targetDate,
  displayMode = "full",
  calendarStyle = "classic",
  color = "#d4af37",
  fontFamily,
  width,
  height,
  scale,
}: Props) {
  const s = scale;

  const dateObj = useMemo(() => {
    if (!targetDate) return null;
    const d = new Date(targetDate);
    return isNaN(d.getTime()) ? null : d;
  }, [targetDate]);

  const calendarGrid = useMemo(() => {
    if (!dateObj) return [];
    const yr = dateObj.getFullYear();
    const mo = dateObj.getMonth();
    const firstDay = new Date(yr, mo, 1).getDay();
    const daysInMonth = new Date(yr, mo + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [dateObj]);

  const day = dateObj?.getDate() ?? null;
  const month = dateObj?.getMonth() ?? null;
  const year = dateObj?.getFullYear() ?? null;

  if (!dateObj) {
    return (
      <div
        style={{
          width: width * s,
          height: height * s,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 10 * s, color: "#9a7d52", letterSpacing: "0.08em" }}>
          Chưa chọn ngày
        </span>
      </div>
    );
  }

  if (displayMode === "date-only") {
    return (
      <DateOnly
        day={day!}
        month={month!}
        year={year!}
        color={color}
        calendarStyle={calendarStyle}
        s={s}
        width={width}
        height={height}
      />
    );
  }

  const styleFonts: Record<string, string> = {
    classic: "Cormorant Garamond, Georgia, serif",
    modern: "Montserrat, Helvetica Neue, sans-serif",
    romantic: "IM Fell English, Palatino Linotype, serif",
    minimal: "Montserrat, Helvetica Neue, sans-serif",
  };
  const font = fontFamily || styleFonts[calendarStyle] || styleFonts.classic;
  const cell = calcCellSize(width, height);

  const sharedProps = {
    day: day!,
    month: month!,
    year: year!,
    grid: calendarGrid,
    color,
    font,
    width,
    height,
    s,
    cell,
  };

  switch (calendarStyle) {
    case "modern":
      return <ModernCalendar {...sharedProps} />;
    case "romantic":
      return <RomanticCalendar {...sharedProps} />;
    case "minimal":
      return <MinimalCalendar {...sharedProps} />;
    default:
      return <ClassicCalendar {...sharedProps} />;
  }
}

interface CalProps {
  day: number;
  month: number;
  year: number;
  grid: (number | null)[];
  color: string;
  font: string;
  width: number;
  height: number;
  s: number;
  cell: number;
}

function ClassicCalendar({
  day,
  month,
  year,
  grid,
  color,
  font,
  width,
  height,
  s,
  cell,
}: CalProps) {
  const cs = cell * s;
  const gap = CELL_GAP * s;
  const fs = Math.max(7 * s, Math.min(10 * s, cs * 0.45));

  return (
    <div
      style={{
        width: width * s,
        height: height * s,
        fontFamily: font,
        background: "linear-gradient(160deg,#1e1608,#241b0a)",
        border: `1px solid ${color}44`,
        borderRadius: 10 * s,
        padding: `${PAD_V * s}px ${PAD_H * s}px`,
        boxShadow: `inset 0 1px 0 ${color}18`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5 * s,
          marginBottom: 6 * s,
          paddingBottom: 5 * s,
          borderBottom: `1px solid ${color}28`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 1,
            background: `linear-gradient(90deg,transparent,${color}50)`,
          }}
        />
        <span
          style={{
            fontSize: 9 * s,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color,
            whiteSpace: "nowrap",
          }}
        >
          {MONTHS[month]} {year}
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            background: `linear-gradient(90deg,${color}50,transparent)`,
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(7,${cs}px)`,
          gap: `${gap}px`,
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {DOW.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 7 * s,
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: `${color}80`,
              height: DOW_H * s,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div
        style={{
          height: 1,
          background: `${color}18`,
          margin: `${2 * s}px 0 ${3 * s}px`,
          flexShrink: 0,
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(7,${cs}px)`,
          gap: `${gap}px`,
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {grid.map((d, i) => {
          const isT = d === day;
          return (
            <div
              key={i}
              style={{
                width: cs,
                height: cs,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {d && (
                <div
                  style={{
                    width: cs - s,
                    height: cs - s,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...(isT
                      ? {
                          background: `radial-gradient(circle,${color},${color}cc)`,
                          boxShadow: `0 0 ${8 * s}px ${color}88`,
                        }
                      : {}),
                  }}
                >
                  <span
                    style={{
                      fontSize: fs,
                      fontWeight: isT ? 800 : 400,
                      color: isT ? "#1c1108" : "#dfc998",
                      lineHeight: 1,
                    }}
                  >
                    {d}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ModernCalendar({ day, month, year, grid, color, font, width, height, s, cell }: CalProps) {
  const cs = cell * s;
  const gap = CELL_GAP * s;
  const fs = Math.max(7 * s, Math.min(10 * s, cs * 0.45));

  return (
    <div
      style={{
        width: width * s,
        height: height * s,
        fontFamily: font,
        background: "#0f1221",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10 * s,
        padding: `${PAD_V * s}px ${PAD_H * s}px`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 6 * s,
          paddingBottom: 5 * s,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
        }}
      >
        <span
          style={{ fontSize: 11 * s, fontWeight: 300, color: "#c8d3f5", letterSpacing: "0.02em" }}
        >
          {MONTHS[month]}
        </span>
        <span style={{ fontSize: 11 * s, fontWeight: 700, color }}>{year}</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(7,${cs}px)`,
          gap: `${gap}px`,
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {DOW.map((d, i) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 7 * s,
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: i === 0 || i === 6 ? `${color}90` : "#4a5578",
              height: DOW_H * s,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.06)",
          margin: `${2 * s}px 0 ${3 * s}px`,
          flexShrink: 0,
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(7,${cs}px)`,
          gap: `${gap}px`,
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {grid.map((d, i) => {
          const isT = d === day;
          const col = i % 7;
          const isWE = col === 0 || col === 6;
          return (
            <div
              key={i}
              style={{
                width: cs,
                height: cs,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4 * s,
                ...(isT ? { background: color } : isWE && d ? { background: `${color}12` } : {}),
              }}
            >
              {d && (
                <span
                  style={{
                    fontSize: fs,
                    fontWeight: isT ? 700 : isWE ? 500 : 400,
                    color: isT ? "#0f1221" : isWE ? `${color}cc` : "#8892b0",
                    lineHeight: 1,
                  }}
                >
                  {d}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RomanticCalendar({
  day,
  month,
  year,
  grid,
  color,
  font,
  width,
  height,
  s,
  cell,
}: CalProps) {
  const cs = cell * s;
  const gap = CELL_GAP * s;
  const fs = Math.max(7 * s, Math.min(10 * s, cs * 0.45));

  return (
    <div
      style={{
        width: width * s,
        height: height * s,
        fontFamily: font,
        background: "linear-gradient(160deg,#1e0c12,#2b1219)",
        border: `1px solid ${color}28`,
        borderRadius: 10 * s,
        padding: `${PAD_V * s}px ${PAD_H * s}px`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -15 * s,
          right: -15 * s,
          width: 60 * s,
          height: 60 * s,
          borderRadius: "50%",
          background: `radial-gradient(circle,${color}15,transparent)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          textAlign: "center",
          marginBottom: 5 * s,
          paddingBottom: 5 * s,
          borderBottom: `1px solid ${color}18`,
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 9 * s, color: `${color}70`, lineHeight: 1, marginBottom: 2 * s }}>
          ♥
        </div>
        <span
          style={{
            fontSize: 9 * s,
            fontStyle: "italic",
            color: "#f0d0d8",
            letterSpacing: "0.06em",
          }}
        >
          {MONTHS[month]} {year}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(7,${cs}px)`,
          gap: `${gap}px`,
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {DOW.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 7 * s,
              fontStyle: "italic",
              color: `${color}70`,
              height: DOW_H * s,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg,transparent,${color}20,transparent)`,
          margin: `${2 * s}px 0 ${3 * s}px`,
          flexShrink: 0,
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(7,${cs}px)`,
          gap: `${gap}px`,
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {grid.map((d, i) => {
          const isT = d === day;
          return (
            <div
              key={i}
              style={{
                width: cs,
                height: cs,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                ...(isT
                  ? {
                      background: `linear-gradient(135deg,${color}ee,${color}88)`,
                      boxShadow: `0 0 ${7 * s}px ${color}55`,
                    }
                  : {}),
              }}
            >
              {d && (
                <span
                  style={{
                    fontSize: fs,
                    fontStyle: "italic",
                    fontWeight: isT ? 700 : 400,
                    color: isT ? "#fff" : "#e8c0cc",
                    lineHeight: 1,
                  }}
                >
                  {d}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MinimalCalendar({
  day,
  month,
  year,
  grid,
  color,
  font,
  width,
  height,
  s,
  cell,
}: CalProps) {
  const cs = cell * s;
  const gap = CELL_GAP * s;
  const fs = Math.max(7 * s, Math.min(10 * s, cs * 0.45));

  return (
    <div
      style={{
        width: width * s,
        height: height * s,
        fontFamily: font,
        padding: `${PAD_V * s}px ${PAD_H * s}px`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 5 * s,
          marginBottom: 5 * s,
          paddingBottom: 5 * s,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 8 * s,
            fontWeight: 300,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(200,190,170,0.5)",
          }}
        >
          {MONTHS[month].toUpperCase()}
        </span>
        <span style={{ fontSize: 8 * s, fontWeight: 600, letterSpacing: "0.08em", color }}>
          {year}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(7,${cs}px)`,
          gap: `${gap}px`,
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {DOW.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 7 * s,
              fontWeight: 400,
              letterSpacing: "0.08em",
              color: "rgba(160,148,128,0.4)",
              height: DOW_H * s,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div
        style={{
          height: 1,
          background: "rgba(180,160,120,0.13)",
          margin: `${2 * s}px 0 ${3 * s}px`,
          flexShrink: 0,
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(7,${cs}px)`,
          gap: `${gap}px`,
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {grid.map((d, i) => {
          const isT = d === day;
          return (
            <div
              key={i}
              style={{
                width: cs,
                height: cs,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderBottom: isT ? `1.5px solid ${color}` : "1.5px solid transparent",
              }}
            >
              {d && (
                <span
                  style={{
                    fontSize: fs,
                    fontWeight: isT ? 600 : 300,
                    color: isT ? color : "rgba(200,185,155,0.6)",
                    lineHeight: 1,
                  }}
                >
                  {d}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface DateOnlyProps {
  day: number;
  month: number;
  year: number;
  color: string;
  calendarStyle: "classic" | "modern" | "romantic" | "minimal" | string;
  s: number;
  width: number;
  height: number;
}

export function DateOnly({
  day,
  month,
  year,
  color,
  calendarStyle,
  s = 1,
  width,
  height,
}: DateOnlyProps) {
  const styleFonts: Record<string, string> = {
    classic: "'Cormorant Garamond', 'Georgia', serif",
    modern: "'Montserrat', 'Helvetica Neue', sans-serif",
    romantic: "'Playfair Display', 'Georgia', serif",
    minimal: "'Inter', 'System-ui', sans-serif",
  };

  const font = styleFonts[calendarStyle] || styleFonts.classic;

  const base: React.CSSProperties = {
    width: width * s,
    height: height * s,
    fontFamily: font,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    overflow: "hidden",
    position: "relative",
    containerType: "size",
  };

  if (calendarStyle === "classic") {
    return (
      <div style={{ ...base, justifyContent: "space-evenly", padding: "8% 5%" }}>
        <div
          style={{
            width: "70%",
            height: "2px",
            background: `linear-gradient(90deg, transparent, ${color} 20%, ${color} 80%, transparent)`,
          }}
        />

        <span
          style={{
            fontSize: "35cqh",
            fontWeight: 700,
            color: color,
            lineHeight: 1,
            letterSpacing: "-0.01em",
            textShadow: `1px 1px 0px ${color}20`,
          }}
        >
          {String(day).padStart(2, "0")}
        </span>

        <span
          style={{
            fontSize: "10cqh",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: color,
            opacity: 0.9,
          }}
        >
          {MONTHS[month]} {year}
        </span>

        <div
          style={{
            width: "70%",
            height: "2px",
            background: `linear-gradient(90deg, transparent, ${color} 20%, ${color} 80%, transparent)`,
          }}
        />
      </div>
    );
  }

  if (calendarStyle === "modern") {
    return (
      <div style={{ ...base, padding: "6%" }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "16%",
            border: `3px solid ${color}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: `${color}06`,
            boxShadow: `inset 0 0 20px ${color}10, 0 8px 24px ${color}15`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20%",
              right: "-20%",
              width: "50%",
              height: "50%",
              background: color,
              opacity: 0.1,
              borderRadius: "50%",
              filter: "blur(10px)",
            }}
          />

          <span
            style={{
              fontSize: "42cqh",
              fontWeight: 900,
              color: color,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
            }}
          >
            {day}
          </span>

          <span
            style={{
              fontSize: "9cqh",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: color,
              marginTop: "4%",
              padding: "2% 6%",
              background: `${color}15`,
              borderRadius: "4px",
            }}
          >
            {MONTHS[month]} · {year}
          </span>
        </div>
      </div>
    );
  }

  if (calendarStyle === "romantic") {
    return (
      <div style={{ ...base, justifyContent: "center", padding: "5%" }}>
        <style>{`
          @keyframes heartPulse {
            0% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 0.9; }
            100% { transform: scale(1); opacity: 0.5; }
          }
        `}</style>

        <span
          style={{
            fontSize: "14cqh",
            color: color,
            animation: "heartPulse 2.5s infinite ease-in-out",
            marginBottom: "2%",
          }}
        >
          ♥
        </span>

        <span
          style={{
            fontSize: "45cqh",
            fontStyle: "italic",
            fontWeight: 400,
            color: color,
            lineHeight: 0.9,
          }}
        >
          {day}
        </span>

        <span
          style={{
            fontSize: "10cqh",
            fontStyle: "italic",
            letterSpacing: "0.02em",
            color: color,
            opacity: 0.85,
            marginTop: "2%",
            borderTop: `1px dashed ${color}40`,
            paddingTop: "2%",
            width: "60%",
            textAlign: "center",
          }}
        >
          {MONTHS[month].toLowerCase()}, {year}
        </span>
      </div>
    );
  }

  return (
    <div style={{ ...base, justifyContent: "center", gap: "6%" }}>
      <span
        style={{
          fontSize: "48cqh",
          fontWeight: 200,
          color: color,
          lineHeight: 0.85,
          letterSpacing: "-0.05em",
        }}
      >
        {String(day).padStart(2, "0")}
      </span>

      <div
        style={{
          width: "20%",
          height: "2px",
          background: color,
          opacity: 0.3,
        }}
      />

      <span
        style={{
          fontSize: "9cqh",
          fontWeight: 500,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: color,
          opacity: 0.7,
          paddingLeft: "0.3em",
        }}
      >
        {MONTHS[month]} {year}
      </span>
    </div>
  );
}
