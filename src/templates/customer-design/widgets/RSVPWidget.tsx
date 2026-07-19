import { Mail, Minus, Plus, Send, X } from "lucide-react";
import { useCallback, useState } from "react";

interface Props {
  rsvpType?: "button" | "full-form";
  color?: string;
  fontFamily?: string;
  width: number;
  height: number;
  scale: number;
}

function FormFields({
  color,
  fontFamily,
  fSize,
  scale,
  submitting,
  onSubmit,
}: {
  color: string;
  fontFamily: string;
  fSize: number;
  scale: number;
  submitting: boolean;
  onSubmit: () => void;
}) {
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [guestCount, setGuestCount] = useState(1);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!attending) return;
        onSubmit();
      }}
      style={{ display: "flex", flexDirection: "column", gap: 6 * scale }}
    >
      <input
        required
        placeholder="Họ và tên của bạn"
        style={{
          padding: `${6 * scale}px ${8 * scale}px`,
          borderRadius: 6 * scale,
          border: `1px solid ${color}40`,
          backgroundColor: `${color}10`,
          color: "#f5e6d3",
          fontSize: fSize,
          fontFamily,
          outline: "none",
        }}
      />
      <div style={{ display: "flex", gap: 6 * scale }}>
        {["Có", "Không"].map((opt) => (
          <label
            key={opt}
            onClick={() => setAttending(opt === "Có" ? "yes" : "no")}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4 * scale,
              padding: `${5 * scale}px`,
              borderRadius: 6 * scale,
              border: `1px solid ${attending === (opt === "Có" ? "yes" : "no") ? color : `${color}30`}`,
              backgroundColor: attending === (opt === "Có" ? "yes" : "no") ? `${color}20` : "transparent",
              fontSize: fSize,
              color: "#f5e6d3",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <input
              type="radio"
              name="attending"
              value={opt}
              checked={attending === (opt === "Có" ? "yes" : "no")}
              onChange={() => setAttending(opt === "Có" ? "yes" : "no")}
              style={{ accentColor: color, display: "none" }}
            />
            {opt}
          </label>
        ))}
      </div>
      {attending === "yes" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8 * scale,
            padding: `${4 * scale}px 0`,
          }}
        >
          <span style={{ fontSize: fSize, color: "#f5e6d3" }}>Số người:</span>
          <button
            type="button"
            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
            disabled={guestCount <= 1}
            style={{
              width: 24 * scale,
              height: 24 * scale,
              borderRadius: "50%",
              border: `1px solid ${color}50`,
              backgroundColor: "transparent",
              color: "#f5e6d3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: guestCount <= 1 ? "not-allowed" : "pointer",
              opacity: guestCount <= 1 ? 0.3 : 1,
              padding: 0,
            }}
          >
            <Minus size={12 * scale} />
          </button>
          <span
            style={{
              fontSize: fSize * 1.2,
              fontWeight: 700,
              color,
              minWidth: 20 * scale,
              textAlign: "center",
            }}
          >
            {guestCount}
          </span>
          <button
            type="button"
            onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
            disabled={guestCount >= 10}
            style={{
              width: 24 * scale,
              height: 24 * scale,
              borderRadius: "50%",
              border: `1px solid ${color}50`,
              backgroundColor: "transparent",
              color: "#f5e6d3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: guestCount >= 10 ? "not-allowed" : "pointer",
              opacity: guestCount >= 10 ? 0.3 : 1,
              padding: 0,
            }}
          >
            <Plus size={12 * scale} />
          </button>
        </div>
      )}
      <button
        type="submit"
        disabled={submitting || !attending}
        style={{
          padding: `${8 * scale}px`,
          borderRadius: 6 * scale,
          backgroundColor: attending ? color : `${color}50`,
          color: "#fff",
          fontSize: fSize,
          fontWeight: 600,
          border: "none",
          cursor: attending && !submitting ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4 * scale,
        }}
      >
        {submitting ? "Đang gửi..." : <><Send size={fSize} /> Gửi xác nhận</>}
      </button>
    </form>
  );
}

export default function RSVPWidget({
  rsvpType = "button",
  color = "#d4af37",
  fontFamily = "Quicksand",
  width,
  height,
  scale,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fSize = Math.max(9, Math.min(11, 14 * scale));

  const handleSubmit = useCallback(() => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setShowModal(false);
        setSubmitted(false);
      }, 2000);
    }, 1000);
  }, []);

  if (rsvpType === "full-form") {
    return (
      <div
        style={{
          width: width * scale,
          height: height * scale,
          fontFamily,
          display: "flex",
          flexDirection: "column",
          gap: 6 * scale,
          padding: 10 * scale,
          border: `1px solid ${color}30`,
          borderRadius: 10 * scale,
          backgroundColor: `${color}08`,
          overflow: "auto",
          position: "relative",
        }}
      >
        <div style={{ fontSize: 11 * scale, color: "#f5e6d3", fontWeight: 600, textAlign: "center", marginBottom: 2 * scale }}>
          Xác nhận tham dự
        </div>
        <FormFields color={color} fontFamily={fontFamily} fSize={fSize} scale={scale} submitting={submitting} onSubmit={handleSubmit} />
        {submitted && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.7)",
              borderRadius: 10 * scale,
              fontSize: fSize * 1.1,
              color,
              fontWeight: 600,
              zIndex: 10,
            }}
          >
            Cảm ơn bạn đã phản hồi!
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        style={{
          width: width * scale,
          height: height * scale,
          fontFamily,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${color}30`,
          borderRadius: 10 * scale,
          backgroundColor: `${color}08`,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6 * scale,
            padding: `${8 * scale}px ${18 * scale}px`,
            borderRadius: 8 * scale,
            backgroundColor: color,
            color: "#fff",
            fontSize: fSize,
            fontWeight: 600,
          }}
        >
          <Mail size={fSize * 1.3} />
          Xác nhận tham dự
        </div>
      </div>
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#202020",
              border: `1px solid ${color}50`,
              borderRadius: 12 * scale,
              padding: 20 * scale,
              minWidth: 240 * scale,
              maxWidth: 320 * scale,
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: 8 * scale,
                right: 8 * scale,
                background: "none",
                border: "none",
                color: "#999",
                cursor: "pointer",
                padding: 4 * scale,
              }}
            >
              <X size={14 * scale} />
            </button>
            <div style={{ fontSize: 12 * scale, color: "#f5e6d3", fontWeight: 600, textAlign: "center", marginBottom: 8 * scale, marginTop: 4 * scale }}>
              Xác nhận tham dự
            </div>
            <FormFields color={color} fontFamily={fontFamily} fSize={fSize} scale={scale} submitting={submitting} onSubmit={handleSubmit} />
            {submitted && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.7)",
                  borderRadius: 12 * scale,
                  fontSize: fSize * 1.2,
                  color,
                  fontWeight: 600,
                  zIndex: 10,
                }}
              >
                Cảm ơn bạn đã phản hồi!
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
