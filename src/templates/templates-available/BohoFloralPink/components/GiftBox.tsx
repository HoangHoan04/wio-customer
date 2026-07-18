import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Gift, X } from "lucide-react";
import { useState } from "react";

export const GiftBox = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!data) return null;

  return (
    <div
      className="relative py-5 px-4 flex flex-col items-center text-center overflow-hidden justify-center"
      style={{ backgroundColor: config.colors.background }}
    >
      <div className="flex flex-col items-center z-20">
        <h2
          className="text-xl md:text-2xl uppercase font-black"
          style={{
            fontFamily: config.fonts.heading,
            color: config.colors.textPrimary,
            textShadow: `0.5px 0 0 ${config.colors.textPrimary}, -0.5px 0 0 ${config.colors.textPrimary}`,
          }}
        >
          HỘP MỪNG CƯỚI
        </h2>
      </div>

      <div className="relative w-full max-w-xl h-105 flex items-center justify-center overflow-visible select-none">
        <div className="absolute top-8 left-16 animate-bounce duration-4000 opacity-80 pointer-events-none text-[#d4af37]">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
          </svg>
        </div>
        <div className="absolute bottom-16 left-20 animate-pulse duration-3000 opacity-60 pointer-events-none text-amber-500/80">
          <svg
            className="w-4 h-4 fill-current transform rotate-12"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
          </svg>
        </div>
        <div className="absolute top-16 right-16 animate-bounce duration-5000 opacity-80 pointer-events-none text-amber-300">
          <svg
            className="w-5 h-5 fill-current transform -rotate-12"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
          </svg>
        </div>

        <div
          className="relative z-10 transform transition-all duration-500 ease-out group cursor-pointer flex flex-col items-center"
          onClick={() => setIsOpen(true)}
        >
          <div className="relative w-80 h-72 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-black/30 rounded-full filter blur-md transition-all duration-500 group-hover:scale-95 group-hover:opacity-75" />
            <div className="absolute inset-0 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)]">
              <svg viewBox="0 0 320 280" className="w-full h-full">
                <defs>
                  <radialGradient
                    id="velvetGrad"
                    cx="50%"
                    cy="40%"
                    r="60%"
                    fx="30%"
                    fy="30%"
                  >
                    <stop offset="0%" stopColor="#e61e3b" />
                    <stop offset="40%" stopColor="#b30c26" />
                    <stop offset="85%" stopColor="#7a0316" />
                    <stop offset="100%" stopColor="#47000b" />
                  </radialGradient>
                  <linearGradient
                    id="goldMetallic"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#ffe699" />
                    <stop offset="30%" stopColor="#d4af37" />
                    <stop offset="55%" stopColor="#aa7c11" />
                    <stop offset="75%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#fff2cc" />
                  </linearGradient>
                </defs>
                <path
                  d="M160,260 C160,260 20,170 20,90 C20,40 60,15 105,15 C135,15 150,35 160,45 C170,35 185,15 215,15 C260,15 300,40 300,90 C300,170 160,260 160,260 Z"
                  fill="none"
                  stroke="url(#goldMetallic)"
                  strokeWidth="8"
                  strokeLinejoin="round"
                />
                <path
                  d="M160,256 C160,256 24,168 24,90 C24,42 62,18 105,18 C134,18 148,36 160,46 C172,36 186,18 215,18 C258,18 296,42 296,90 C296,168 160,256 160,256 Z"
                  fill="url(#velvetGrad)"
                  stroke="#3d0007"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M160,238 C160,238 38,154 38,90 C38,50 72,30 105,30 C128,30 143,45 160,54 C177,45 192,30 215,30 C248,30 282,50 282,90 C282,154 160,238 160,238 Z"
                  fill="none"
                  stroke="url(#goldMetallic)"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  className="opacity-90"
                />
              </svg>
            </div>
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center -translate-y-2">
              <div className="relative my-5 w-36 h-3 bg-[#47000b] rounded-full border border-amber-300/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center">
                <div className="w-32 h-0.5 bg-black/60 rounded-full" />
              </div>
              <div className="relative bg-linear-to-tr from-amber-400 via-yellow-100 to-amber-500 p-4 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-amber-300">
                <Gift className="text-[#6b0917]" size={36} strokeWidth={1.5} />
                <div className="absolute inset-1.5 border border-[#6b0917]/25 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl flex flex-col items-center max-h-[90vh] overflow-y-auto custom-scrollbar"
            style={{ backgroundColor: config.colors.background }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 opacity-60 hover:opacity-100"
              style={{ color: config.colors.textPrimary }}
            >
              <X size={24} />
            </button>

            <h3
              className="text-2xl mb-6 font-semibold"
              style={{
                fontFamily: config.fonts.heading,
                color: config.colors.textPrimary,
              }}
            >
              Thông tin mừng cưới
            </h3>

            <div className="w-full space-y-4">
              {data.groom?.bankAccount?.accountName && (
                <div
                  className="p-4 rounded-xl border flex flex-col items-center w-full"
                  style={{
                    borderColor: `${config.colors.textPrimary}20`,
                    backgroundColor: `${config.colors.envelope}10`,
                  }}
                >
                  <p
                    className="text-sm uppercase tracking-widest mb-2 opacity-80"
                    style={{
                      fontFamily: config.fonts.body,
                      color: config.colors.textSecondary,
                    }}
                  >
                    Chú rể
                  </p>
                  <p
                    className="font-bold text-lg text-center"
                    style={{ color: config.colors.textPrimary }}
                  >
                    {data.groom.bankAccount.accountName}
                  </p>
                  <p
                    className="text-lg tracking-wider text-center"
                    style={{ color: config.colors.textPrimary }}
                  >
                    {data.groom.bankAccount.accountNumber}
                  </p>
                  <p
                    className="text-sm opacity-80 text-center"
                    style={{ color: config.colors.textSecondary }}
                  >
                    {data.groom.bankAccount.bankName}
                  </p>
                  {data.groom.bankAccount.qrUrl && (
                    <img
                      src={data.groom.bankAccount.qrUrl}
                      alt="QR Chú rể"
                      className="w-40 h-40 mt-4 rounded-lg object-contain border border-dashed border-gray-300 p-1 bg-white"
                    />
                  )}
                </div>
              )}
              {data.bride?.bankAccount?.accountName && (
                <div
                  className="p-4 rounded-xl border flex flex-col items-center w-full"
                  style={{
                    borderColor: `${config.colors.textPrimary}20`,
                    backgroundColor: `${config.colors.envelope}10`,
                  }}
                >
                  <p
                    className="text-sm uppercase tracking-widest mb-2 opacity-80"
                    style={{
                      fontFamily: config.fonts.body,
                      color: config.colors.textSecondary,
                    }}
                  >
                    Cô dâu
                  </p>
                  <p
                    className="font-bold text-lg text-center"
                    style={{ color: config.colors.textPrimary }}
                  >
                    {data.bride.bankAccount.accountName}
                  </p>
                  <p
                    className="text-lg tracking-wider text-center"
                    style={{ color: config.colors.textPrimary }}
                  >
                    {data.bride.bankAccount.accountNumber}
                  </p>
                  <p
                    className="text-sm opacity-80 text-center"
                    style={{ color: config.colors.textSecondary }}
                  >
                    {data.bride.bankAccount.bankName}
                  </p>
                  {data.bride.bankAccount.qrUrl && (
                    <img
                      src={data.bride.bankAccount.qrUrl}
                      alt="QR Cô dâu"
                      className="w-40 h-40 mt-4 rounded-lg object-contain border border-dashed border-gray-300 p-1 bg-white"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
