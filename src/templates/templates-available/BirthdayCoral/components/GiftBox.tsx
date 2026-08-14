import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Copy, Gift, QrCode, X } from "lucide-react";
import { useState } from "react";

export const GiftBox = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const bankAccount =
    data?.groom?.bankAccount ||
    data?.primaryHost?.bankAccount ||
    data?.gifts?.[0];

  if (!bankAccount?.accountNumber && !bankAccount?.accountName) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full px-6 py-6 flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col items-center">
        <span
          className="text-xs uppercase tracking-widest font-bold text-orange-600 mb-1"
          style={{ fontFamily: config.fonts.body }}
        >
          {data?.giftsTitle || "HỘP QUÀ SINH NHẬT"}
        </span>
        <h2
          className="text-2xl font-extrabold text-orange-950 mb-4 flex items-center gap-2"
          style={{ fontFamily: config.fonts.heading }}
        >
          <Gift className="size-6 text-orange-500" />
          <span>Gửi Quà Mừng Tuổi Mới</span>
        </h2>

        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white p-5 rounded-3xl shadow-lg border border-orange-400/40 flex items-center justify-between group transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center gap-3.5 text-left">
            <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Gift className="size-6 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="font-bold text-sm">
                {data?.giftsSubtitle || "Thông tin gửi quà mừng"}
              </p>
              <p className="text-xs text-white/80">
                Chuyển khoản hoặc quét mã QR
              </p>
            </div>
          </div>
          <QrCode className="size-6 text-white/90" />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-sm bg-white p-6 rounded-3xl shadow-2xl border border-orange-200 flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 size-8 rounded-full bg-orange-100 text-orange-950 flex items-center justify-center hover:bg-orange-200"
            >
              <X className="size-4" />
            </button>

            <div className="size-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2">
              <Gift className="size-6" />
            </div>

            <h3
              className="text-lg font-extrabold text-orange-950 mb-1"
              style={{ fontFamily: config.fonts.heading }}
            >
              {data?.giftsSubtitle || "Thông Tin Gửi Quà Mừng"}
            </h3>

            <div className="w-full bg-orange-50/80 p-4 rounded-2xl border border-orange-200/80 my-3 flex flex-col items-center">
              {bankAccount.bankName && (
                <p className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">
                  {bankAccount.bankName}
                </p>
              )}

              {bankAccount.accountNumber && (
                <div className="flex items-center gap-2 my-1">
                  <span className="text-base font-black font-mono text-orange-950">
                    {bankAccount.accountNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(bankAccount.accountNumber)}
                    className="p-1.5 rounded-lg bg-white border border-orange-200 hover:bg-orange-100 text-orange-700 shadow-xs cursor-pointer"
                    title="Sao chép số tài khoản"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              )}

              {bankAccount.accountName && (
                <p className="text-xs font-semibold text-orange-900 uppercase">
                  {bankAccount.accountName}
                </p>
              )}

              {bankAccount.qrUrl && (
                <div className="mt-3 p-2 bg-white rounded-xl border border-orange-200 shadow-xs">
                  <img
                    src={bankAccount.qrUrl}
                    alt="Mã QR mừng sinh nhật"
                    className="size-40 object-contain rounded-lg"
                  />
                </div>
              )}
            </div>

            {copied && (
              <span className="text-xs text-emerald-600 font-bold animate-in fade-in">
                Đã sao chép số tài khoản!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
