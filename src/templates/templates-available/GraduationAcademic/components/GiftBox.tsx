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
          className="text-xs uppercase tracking-widest font-bold text-blue-800 mb-1"
          style={{ fontFamily: config.fonts.body }}
        >
          {data?.giftsTitle || "HỘP QUÀ TỐT NGHIỆP"}
        </span>
        <h2
          className="text-2xl font-extrabold text-slate-900 mb-4 flex items-center gap-2"
          style={{ fontFamily: config.fonts.heading }}
        >
          <Gift className="size-6 text-amber-500" />
          <span>Gửi Quà Chúc Mừng</span>
        </h2>

        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 hover:from-slate-800 hover:to-blue-900 text-white p-5 rounded-3xl shadow-xl border border-amber-400/40 flex items-center justify-between group transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center gap-3.5 text-left">
            <div className="size-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Gift className="size-6 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="font-bold text-sm text-amber-200">
                {data?.giftsSubtitle || "Thông tin gửi quà tân khoa"}
              </p>
              <p className="text-xs text-slate-300">
                Chuyển khoản hoặc quét mã QR
              </p>
            </div>
          </div>
          <QrCode className="size-6 text-amber-300" />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-sm bg-white p-6 rounded-3xl shadow-2xl border border-slate-200 flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 size-8 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center hover:bg-slate-200"
            >
              <X className="size-4" />
            </button>

            <div className="size-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mb-2">
              <Gift className="size-6 text-blue-800" />
            </div>

            <h3
              className="text-lg font-extrabold text-slate-900 mb-1"
              style={{ fontFamily: config.fonts.heading }}
            >
              {data?.giftsSubtitle || "Thông Tin Gửi Quà Mừng"}
            </h3>

            <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 my-3 flex flex-col items-center">
              {bankAccount.bankName && (
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                  {bankAccount.bankName}
                </p>
              )}

              {bankAccount.accountNumber && (
                <div className="flex items-center gap-2 my-1">
                  <span className="text-base font-black font-mono text-slate-900">
                    {bankAccount.accountNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(bankAccount.accountNumber)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-xs cursor-pointer"
                    title="Sao chép số tài khoản"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </div>
              )}

              {bankAccount.accountName && (
                <p className="text-xs font-semibold text-slate-800 uppercase">
                  {bankAccount.accountName}
                </p>
              )}

              {bankAccount.qrUrl && (
                <div className="mt-3 p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <img
                    src={bankAccount.qrUrl}
                    alt="Mã QR chúc mừng tốt nghiệp"
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
