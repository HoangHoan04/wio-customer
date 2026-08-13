import React, { useMemo } from "react";

interface Props {
  targetDate?: string;
  displayMode?: "full" | "date-only";
  calendarStyle?: "classic" | "modern" | "romantic" | "luxury-navy";
  color?: string;
  fontFamily?: string;
  width: number;
  height: number;
  scale: number;
}

const MONTHS = [
  "THÁNG 1", "THÁNG 2", "THÁNG 3", "THÁNG 4", "THÁNG 5", "THÁNG 6",
  "THÁNG 7", "THÁNG 8", "THÁNG 9", "THÁNG 10", "THÁNG 11", "THÁNG 12",
];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DOW_NAVY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PAD_H = 14;
const PAD_V = 16;
const HEADER_H = 26;
const HEADER_GAP = 12;
const DOW_H = 16;
const DOW_GAP = 8;
const DIVIDER_H = 1;
const DIVIDER_GAP = 10;
const COL_GAP = 5;
const ROW_GAP = 8;
const MAX_CELL = 32;
const MIN_CELL = 18;

function calcCellSize(width: number, height: number, hasLeftBlock = false): number {
  const availableWidth = hasLeftBlock ? width * 0.55 : width;
  const fromWidth = (availableWidth - 2 * PAD_H - 6 * COL_GAP) / 7;
  const usedVertical = 2 * PAD_V + HEADER_H + HEADER_GAP + DOW_H + DOW_GAP + 5 * ROW_GAP;
  const fromHeight = (height - usedVertical) / 6;
  const raw = Math.min(fromWidth, fromHeight > 0 ? fromHeight : fromWidth, MAX_CELL);
  return Math.max(MIN_CELL, Math.floor(raw));
}

export default function CalendarWidget({
  targetDate,
  displayMode = "full",
  calendarStyle = "classic",
  color = "#b6cc61",
  fontFamily,
  width,
  height,
  scale,
}: Props) {
  const s = scale;

  const dateObj = useMemo(() => {
    const defaultDate = targetDate || new Date().toISOString().split("T")[0];
    const d = new Date(defaultDate);
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
      <div style={{ width: width * s, height: height * s, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.05)", borderRadius: 8 * s }}>
        <span style={{ fontSize: 12 * s, color: "#999" }}>Chưa chọn ngày</span>
      </div>
    );
  }

  const styleFonts: Record<string, string> = {
    classic: "'Playfair Display', 'Cormorant Garamond', serif",
    modern: "'Montserrat', 'Inter', sans-serif",
    romantic: "'Cormorant Garamond', 'Playfair Display', serif",
    "luxury-navy": "'Cinzel', 'Playfair Display', serif",
  };

  const font = fontFamily || styleFonts[calendarStyle] || styleFonts.classic;

  const cell = calcCellSize(width, height, true);

  const sharedProps = { day: day!, month: month!, year: year!, grid: calendarGrid, color, font, width, height, s, cell };

  if (displayMode === "date-only") {
    return <DateOnlyView {...sharedProps} calendarStyle={calendarStyle} />;
  }

  switch (calendarStyle) {
    case "modern":
      return <ModernStyle {...sharedProps} />;
    case "romantic":
      return <RomanticStyle {...sharedProps} />;
    case "luxury-navy":
      return <LuxuryNavyStyle {...sharedProps} />;
    default:
      return <ClassicStyle {...sharedProps} />;
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

const makeGridStyle = (cs: number, colGap: number, rowGap: number): React.CSSProperties => ({
  display: "grid",
  gridTemplateColumns: `repeat(7, ${cs}px)`,
  gap: `${rowGap}px ${colGap}px`,
  justifyContent: "center",
});

function ClassicStyle({ day, month, year, grid, color, font, width, height, s, cell }: CalProps) {
  const cs = cell * s;
  const fs = Math.max(9 * s, cs * 0.4);

  return (
    <div style={{
      width: width * s, height: height * s, fontFamily: font, boxSizing: "border-box",
      background: "#fbf8f5", padding: `${PAD_V * s}px ${PAD_H * s}px`,
      display: "flex", alignItems: "center", position: "relative", overflow: "hidden",
      border: "1px solid #efebd8"
    }}>
      <div style={{ width: "42%", height: "85%", border: "1px solid #d9cbb3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 6 * s, boxSizing: "border-box", marginRight: "3%" }}>
        <span style={{ fontSize: 10 * s, letterSpacing: "0.1em", color: "#666", textTransform: "uppercase" }}>SATURDAY</span>
        <div style={{ display: "flex", alignItems: "center", margin: `${4 * s}px 0`, borderTop: "1px solid #d9cbb3", borderBottom: "1px solid #d9cbb3", padding: `${2 * s}px 8 * s` }}>
          <span style={{ fontSize: 12 * s, fontStyle: "italic", color: "#888", marginRight: 6 * s }}>May</span>
          <span style={{ fontSize: 22 * s, fontWeight: 700, color: "#333" }}>{day}</span>
        </div>
        <span style={{ fontSize: 9 * s, color: "#999" }}>THỨ BẢY</span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ textAlign: "center", marginBottom: HEADER_GAP * s }}>
          <div style={{ fontSize: 9 * s, fontWeight: 600, color: "#555", letterSpacing: "0.08em" }}>NGÀY VUI ĐÔI TA</div>
          <div style={{ fontSize: 11 * s, fontWeight: 700, color: "#222", marginTop: 2 * s }}>{MONTHS[month]}, {year}</div>
        </div>

        <div style={{ ...makeGridStyle(cs, COL_GAP * s, ROW_GAP * s), marginBottom: DOW_GAP * s }}>
          {DOW.map((d) => <div key={d} style={{ fontSize: 9 * s, color: "#777", textAlign: "center", fontWeight: 600 }}>{d}</div>)}
        </div>

        <div style={makeGridStyle(cs, COL_GAP * s, ROW_GAP * s)}>
          {grid.map((d, i) => {
            const isT = d === day;
            return (
              <div key={i} style={{ width: cs, height: cs, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {d && (
                  <div style={{
                    width: cs - 2 * s, height: cs - 2 * s, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    ...(isT ? { border: "1px dashed #c9a054", background: "#f5eeda" } : {})
                  }}>
                    <span style={{ fontSize: fs, fontWeight: isT ? 700 : 400, color: isT ? "#b28731" : "#444" }}>{d}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ModernStyle({ day, month, year, grid, color, font, width, height, s, cell }: CalProps) {
  const cs = cell * s;
  const fs = Math.max(9 * s, cs * 0.4);

  return (
    <div style={{
      width: width * s, height: height * s, fontFamily: font, boxSizing: "border-box",
      background: "#ffffff", padding: `${PAD_V * s}px ${PAD_H * s}px`,
      display: "flex", alignItems: "center", border: "1px solid #eee"
    }}>
      <div style={{ width: "42%", borderRight: "1px solid #eaeaea", paddingRight: "4%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 8 * s, fontWeight: 700, color: "#a5a5a5", letterSpacing: "0.05em" }}>MỜI TIỆC VÀO LÚC</div>
        <div style={{ fontSize: 24 * s, fontWeight: 800, color: "#111", margin: `${2 * s}px 0` }}>{day}.{(month + 1).toString().padStart(2, '0')}.{year}</div>
        <div style={{ fontSize: 9 * s, fontWeight: 600, color: "#444" }}>THÁNG TÁM NĂM {year}</div>
      </div>

      <div style={{ flex: 1, paddingLeft: "4%", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 11 * s, fontWeight: 700, color: "#111", marginBottom: HEADER_GAP * s, letterSpacing: "0.02em" }}>
          {MONTHS[month]} {year}
        </div>

        <div style={{ ...makeGridStyle(cs, COL_GAP * s, ROW_GAP * s), marginBottom: DOW_GAP * s }}>
          {DOW.map((d) => <div key={d} style={{ fontSize: 9 * s, color: "#999", textAlign: "center", fontWeight: 600 }}>{d}</div>)}
        </div>

        <div style={makeGridStyle(cs, COL_GAP * s, ROW_GAP * s)}>
          {grid.map((d, i) => {
            const isT = d === day;
            return (
              <div key={i} style={{ width: cs, height: cs, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {d && (
                  <div style={{
                    width: cs - 2 * s, height: cs - 2 * s, display: "flex", alignItems: "center", justifyContent: "center",
                    ...(isT ? { background: "#111", borderRadius: "50%" } : {})
                  }}>
                    <span style={{ fontSize: fs, fontWeight: isT ? 700 : 500, color: isT ? "#fff" : "#333" }}>{d}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RomanticStyle({ day, month, year, grid, color, font, width, height, s, cell }: CalProps) {
  const cs = cell * s;
  const fs = Math.max(9 * s, cs * 0.4);

  return (
    <div style={{
      width: width * s, height: height * s, fontFamily: font, boxSizing: "border-box",
      background: "#d6c5af", padding: `${PAD_V * s}px ${PAD_H * s}px`,
      display: "flex", alignItems: "center", border: "1px solid #c2b099"
    }}>
      <div style={{
        width: "42%", height: "85%", marginRight: "4%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        border: "2px solid #dfba6b", borderRadius: "20% 0 20% 0", position: "relative", boxSizing: "border-box"
      }}>
        <span style={{ fontSize: 9 * s, fontWeight: 600, color: "#5a4b38", letterSpacing: "0.08em" }}>THURSDAY</span>
        <div style={{ display: "flex", alignItems: "baseline", margin: `${2 * s}px 0` }}>
          <span style={{ fontSize: 11 * s, color: "#dfba6b", fontWeight: 700, marginRight: 3 * s }}>OCT</span>
          <span style={{ fontSize: 26 * s, fontWeight: 700, color: "#dfba6b" }}>{day}</span>
        </div>
        <span style={{ fontSize: 9 * s, fontWeight: 600, color: "#5a4b38" }}>THÁNG MƯỜI</span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ textAlign: "center", marginBottom: HEADER_GAP * s }}>
          <span style={{ fontSize: 11 * s, fontWeight: 700, color: "#423525", letterSpacing: "0.04em" }}>{MONTHS[month]} {year}</span>
        </div>

        <div style={{ ...makeGridStyle(cs, COL_GAP * s, ROW_GAP * s), marginBottom: DOW_GAP * s }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} style={{ fontSize: 8.5 * s, color: "#6e5d47", textAlign: "center", fontWeight: 600 }}>{d}</div>
          ))}
        </div>

        <div style={makeGridStyle(cs, COL_GAP * s, ROW_GAP * s)}>
          {grid.map((d, i) => {
            const isT = d === day;
            return (
              <div key={i} style={{ width: cs, height: cs, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {d && (
                  <div style={{
                    width: cs - 2 * s, height: cs - 2 * s, display: "flex", alignItems: "center", justifyContent: "center",
                    ...(isT ? { border: "1.5px solid #dfba6b", borderRadius: "50%" } : {})
                  }}>
                    {isT && <span style={{ position: "absolute", fontSize: 14 * s, color: "rgba(223,186,107,0.25)", top: "25%" }}>✿</span>}
                    <span style={{ fontSize: fs, fontWeight: isT ? 700 : 400, color: isT ? "#dfba6b" : "#423525", zIndex: 1 }}>{d}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LuxuryNavyStyle({ day, month, year, grid, color, font, width, height, s, cell }: CalProps) {
  const cs = cell * s;
  const fs = Math.max(9 * s, cs * 0.4);

  return (
    <div style={{
      width: width * s, height: height * s, fontFamily: font, boxSizing: "border-box",
      background: "#0f1b29", padding: `${PAD_V * s}px ${PAD_H * s}px`,
      display: "flex", alignItems: "center", border: "1px solid #1a2e44", position: "relative"
    }}>
      <div style={{ position: "absolute", top: 6 * s, left: 6 * s, right: 6 * s, bottom: 6 * s, border: "1px solid #c5a86a", opacity: 0.35, pointerEvents: "none" }} />

      <div style={{ width: "42%", marginRight: "2%", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRight: "1px solid rgba(197,168,106,0.2)", paddingRight: "2%" }}>
        <span style={{ fontSize: 8 * s, color: "#c5a86a", letterSpacing: "0.12em", textTransform: "uppercase" }}>SUNDAY</span>
        <span style={{ fontSize: 24 * s, fontWeight: 700, color: "#c5a86a", margin: `${2 * s}px 0` }}>{day}</span>
        <span style={{ fontSize: 8 * s, color: "#c5a86a", letterSpacing: "0.05em" }}>THÁNG MƯỜI HAI</span>
      </div>

      <div style={{ flex: 1, zIndex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ textAlign: "center", marginBottom: HEADER_GAP * s }}>
          <span style={{ fontSize: 10 * s, fontWeight: 600, color: "#c5a86a", letterSpacing: "0.1em" }}>{MONTHS[month]} {year}</span>
        </div>

        <div style={{ ...makeGridStyle(cs, COL_GAP * s, ROW_GAP * s), marginBottom: DOW_GAP * s }}>
          {DOW_NAVY.map((d) => <div key={d} style={{ fontSize: 8.5 * s, color: "rgba(197,168,106,0.7)", textAlign: "center" }}>{d}</div>)}
        </div>

        <div style={makeGridStyle(cs, COL_GAP * s, ROW_GAP * s)}>
          {grid.map((d, i) => {
            const isT = d === day;
            return (
              <div key={i} style={{ width: cs, height: cs, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {d && (
                  <div style={{
                    width: cs - 1 * s, height: cs - 1 * s, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4 * s,
                    ...(isT ? { border: "1px solid #c5a86a", backgroundColor: "rgba(197,168,106,0.15)" } : {})
                  }}>
                    <span style={{ fontSize: fs, fontWeight: isT ? 700 : 400, color: isT ? "#ffd685" : "#e2ecf7" }}>{d}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DateOnlyView({ day, month, year, color, font, width, height, s, calendarStyle }: CalProps & { calendarStyle: string }) {
  const bgMap: Record<string, string> = {
    classic: "#fbf8f5",
    modern: "#ffffff",
    romantic: "#d6c5af",
    "luxury-navy": "#0f1b29",
  };
  const txtMap: Record<string, string> = {
    classic: "#333333",
    modern: "#111111",
    romantic: "#423525",
    "luxury-navy": "#c5a86a",
  };

  return (
    <div style={{
      width: width * s, height: height * s, fontFamily: font, boxSizing: "border-box",
      background: bgMap[calendarStyle] || "#fff", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.05)"
    }}>
      <span style={{ fontSize: 36 * s, fontWeight: 800, color: txtMap[calendarStyle], lineHeight: 1 }}>
        {String(day).padStart(2, "0")}
      </span>
      <span style={{ fontSize: 11 * s, fontWeight: 600, color: txtMap[calendarStyle], letterSpacing: "0.1em", marginTop: 8 * s }}>
        {MONTHS[month]} {year}
      </span>
    </div>
  );
}