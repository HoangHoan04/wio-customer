import { Gift, X } from "lucide-react";
import { useState } from "react";

interface BankInfo {
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  qrUrl?: string;
}

interface Props {
  qrTarget?: "groom" | "bride" | "both";
  groom?: BankInfo;
  bride?: BankInfo;
  color?: string;
  fontFamily?: string;
  width: number;
  height: number;
  scale: number;
}

export default function QRWidget({
  qrTarget = "both",
  groom,
  bride,
  color = "#d4af37",
  fontFamily = "Quicksand",
  width,
  height,
  scale,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const showGroom = qrTarget === "groom" || qrTarget === "both";
  const showBride = qrTarget === "bride" || qrTarget === "both";

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        style={{
          width: width * scale,
          height: "auto",
          minHeight: height * scale,
          fontFamily,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${color}30`,
          borderRadius: 10 * scale,
          backgroundColor: `${color}08`,
          cursor: "pointer",
          position: "relative",
          transition: "transform 0.2s",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4 * scale,
          }}
        >
          <div
            style={{
              width: 44 * scale,
              height: 44 * scale,
              borderRadius: "50%",
              backgroundColor: `${color}15`,
              border: `2px solid ${color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 ${2 * scale}px ${8 * scale}px ${color}30`,
            }}
          >
            <Gift size={20 * scale} color={color} />
          </div>
          <span style={{ fontSize: 8 * scale, color: "#f5e6d3", opacity: 0.7 }}>
            Mừng cưới
          </span>
        </div>
      </div>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#202020",
              border: `1px solid ${color}50`,
              borderRadius: 14 * scale,
              padding: 20 * scale,
              maxWidth: 280 * scale,
              width: "90vw",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: 10 * scale,
                right: 10 * scale,
                background: "none",
                border: "none",
                color: "#999",
                cursor: "pointer",
                padding: 4 * scale,
              }}
            >
              <X size={16 * scale} />
            </button>
            <h3
              style={{
                fontSize: 14 * scale,
                fontWeight: 700,
                color: "#f5e6d3",
                textAlign: "center",
                marginBottom: 12 * scale,
                fontFamily,
              }}
            >
              Thông tin mừng cưới
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 * scale }}>
              {showGroom && groom?.accountName && (
                <BankCard data={groom} label="Chú rể" color={color} scale={scale} fontFamily={fontFamily} />
              )}
              {showBride && bride?.accountName && (
                <BankCard data={bride} label="Cô dâu" color={color} scale={scale} fontFamily={fontFamily} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function getBankId(bankName: string): string {
  const name = (bankName || "").toLowerCase().replace(/\s+/g, "");
  if (name.includes("vietcombank")) return "vietcombank";
  if (name.includes("bidv")) return "bidv";
  if (name.includes("vietinbank")) return "vietinbank";
  if (name.includes("agribank")) return "agribank";
  if (name.includes("mbbank") || name === "mb") return "mb";
  if (name.includes("techcombank")) return "techcombank";
  if (name.includes("acb")) return "acb";
  if (name.includes("vpbank")) return "vpbank";
  if (name.includes("tpbank")) return "tpbank";
  if (name.includes("sacombank")) return "sacombank";
  if (name.includes("vib")) return "vib";
  if (name.includes("shb")) return "shb";
  if (name.includes("hdbank")) return "hdb";
  return "";
}

function BankCard({
  data,
  label,
  color,
  scale,
  fontFamily,
}: {
  data: BankInfo;
  label: string;
  color: string;
  scale: number;
  fontFamily: string;
}) {
  let qrUrl = data.qrUrl;
  if (!qrUrl && data.bankName && data.accountNumber) {
    const bankId = getBankId(data.bankName);
    if (bankId) {
      const cleanAcc = data.accountNumber.replace(/\s+/g, "");
      const cleanName = encodeURIComponent(data.accountName || "");
      qrUrl = `https://img.vietqr.io/image/${bankId}-${cleanAcc}-compact2.jpg?accountName=${cleanName}`;
    }
  }

  return (
    <div
      style={{
        padding: 10 * scale,
        borderRadius: 10 * scale,
        border: `1px solid ${color}30`,
        backgroundColor: `${color}08`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4 * scale,
      }}
    >
      <span style={{ fontSize: 9 * scale, color: `${color}99`, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 * scale }}>
        {label}
      </span>
      <span style={{ fontSize: 12 * scale, fontWeight: 700, color: "#f5e6d3", fontFamily }}>
        {data.accountName}
      </span>
      <span style={{ fontSize: 11 * scale, color, fontWeight: 600, letterSpacing: 1 * scale }}>
        {data.accountNumber}
      </span>
      <span style={{ fontSize: 9 * scale, color: "#999" }}>
        {data.bankName}
      </span>
      {qrUrl && (
        <img
          src={qrUrl}
          alt={`QR ${label}`}
          style={{
            width: 160 * scale,
            height: 160 * scale,
            marginTop: 6 * scale,
            borderRadius: 6 * scale,
            objectFit: "contain",
            backgroundColor: "#ffffff",
            padding: 6 * scale,
          }}
        />
      )}
    </div>
  );
}
