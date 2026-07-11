import cloudSmall from "@/assets/decorations/dragon_phoenix_blue/cloud_small.webp";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { useState } from "react";

export const RSVP = ({ data, config }: { data?: any; config: ThemeTemplateConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!data?.showRsvp) return null;

  const isFormInline = data.rsvpType === "form";

  const FormContent = () => {
    const [attending, setAttending] = useState<"yes" | "no" | null>(null);
    const [guestCount, setGuestCount] = useState(1);

    const handleDecrement = () => {
      if (guestCount > 1) setGuestCount((prev) => prev - 1);
    };

    const handleIncrement = () => {
      if (guestCount < 10) setGuestCount((prev) => prev + 1);
    };

    return (
      <div className="w-full bg-white/95 p-5 sm:p-7 my-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] text-left max-w-75 mx-auto border border-white/40 backdrop-blur-md">
        <div className="text-center mb-5">
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-1.5">Xác nhận tham dự</h2>
          <p className="text-gray-400 text-xs leading-relaxed px-2">
            Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng tôi. <br />
            Xin xác nhận để chúng tôi chuẩn bị chu đáo nhất cho bạn.
          </p>
        </div>

        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={(e) => {
            e.preventDefault();
            if (!attending) {
              alert("Vui lòng xác nhận bạn có thể đến được không nhé!");
              return;
            }
            setIsSubmitting(true);
            setTimeout(() => {
              setIsSubmitting(false);
              setIsOpen(false);
              alert("Cảm ơn bạn đã phản hồi!");
            }, 1000);
          }}
        >
          <div>
            <label className="text-xs font-bold text-[#2d3748] block mb-1.5">Tên của bạn</label>
            <input
              required
              type="text"
              placeholder="Nhập tên của bạn"
              className="w-full px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-xl outline-none placeholder-gray-400 text-sm focus:border-[#4a3728] focus:ring-1 focus:ring-[#4a3728] transition-all text-[#1a1a1a]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#2d3748] block mb-1.5">Bạn sẽ đến chứ?</label>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setAttending("yes")}
                className={`w-full p-3 rounded-[14px] border flex items-center gap-3 text-left transition-all ${
                  attending === "yes"
                    ? "border-[#10b981] bg-[#f0fdf4] text-[#111827] font-semibold"
                    : "border-[#f3f4f6] bg-[#f9fafb] text-[#4b5563] hover:border-gray-200"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    attending === "yes" ? "bg-[#10b981] text-white" : "bg-gray-200 text-transparent"
                  }`}
                >
                  <i className="pi pi-check" style={{ fontSize: "0.6rem" }}></i>
                </div>
                <span className="text-xs">Tôi sẽ đến</span>
              </button>

              <button
                type="button"
                onClick={() => setAttending("no")}
                className={`w-full p-3 rounded-[14px] border flex items-center gap-3 text-left transition-all ${
                  attending === "no"
                    ? "border-gray-400 bg-gray-50 text-[#111827] font-semibold"
                    : "border-[#f3f4f6] bg-[#f9fafb] text-[#4b5563] hover:border-gray-200"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    attending === "no" ? "bg-gray-400 text-white" : "bg-gray-200 text-transparent"
                  }`}
                >
                  <i className="pi pi-times-circle" style={{ fontSize: "0.6rem" }}></i>
                </div>
                <span className="text-xs">Rất tiếc, tôi không thể đến</span>
              </button>
            </div>
          </div>

          {attending === "yes" && (
            <div className="flex items-center justify-between mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="text-xs font-bold text-[#2d3748]">
                Số lượng khách (bao gồm bạn)
              </label>
              <div className="flex items-center gap-3.5 bg-[#f9fafb] p-1 rounded-full border border-gray-100">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={guestCount <= 1}
                  className="w-7 h-7 rounded-full bg-white shadow-sm flex justify-center items-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-white"
                >
                  <i className="pi pi-minus" style={{ fontSize: "0.6rem" }}></i>
                </button>

                <span className="font-bold text-sm text-gray-800 w-3 text-center select-none">
                  {guestCount}
                </span>

                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={guestCount >= 10}
                  className="w-7 h-7 rounded-full bg-white shadow-sm flex justify-center items-center text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:hover:bg-white"
                >
                  <i className="pi pi-plus" style={{ fontSize: "0.6rem" }}></i>
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-1 rounded-xl bg-[#422214] hover:bg-[#32190f] text-white font-bold tracking-wider text-xs uppercase transition-all shadow-md active:scale-[0.99] disabled:opacity-70"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi xác nhận"}
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col items-center text-center w-full my-5 overflow-hidden">
      <img src={cloudSmall} alt="" aria-hidden="true" className="absolute -top-8 -right-8 w-32 md:w-52 opacity-15 pointer-events-none select-none z-0" />
      {isFormInline ? (
        <FormContent />
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase shadow-xl hover:scale-105 transition-transform"
          style={{ backgroundColor: config.colors.buttonBg, color: config.colors.buttonText }}
        >
          Xác Nhận Tham Dự
        </button>
      )}

      {isOpen && !isFormInline && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-full max-w-97.5" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-12 right-9 text-red-400 hover:text-black text-lg z-10000"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <FormContent />
          </div>
        </div>
      )}
    </div>
  );
};
