import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { submitRsvpAction } from "@/services/rsvp-helper";
import { CheckCircle2, GraduationCap, Send, XCircle } from "lucide-react";
import { useState } from "react";

export const RSVP = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!data?.showRsvp) return null;
  const isFormInline = data.rsvpType === "form";

  const FormContent = () => {
    const [attending, setAttending] = useState<"yes" | "no" | null>(null);
    const [guestCount, setGuestCount] = useState(1);
    const [guestName, setGuestName] = useState(data?.guestName || "");
    const [wishes, setWishes] = useState("");

    const handleDecrement = () => {
      if (guestCount > 1) setGuestCount((prev) => prev - 1);
    };

    const handleIncrement = () => {
      if (guestCount < 10) setGuestCount((prev) => prev + 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!attending) {
        alert("Vui lòng xác nhận bạn có thể đến được không nhé!");
        return;
      }
      setIsSubmitting(true);
      try {
        await submitRsvpAction(attending, guestCount);
        alert("Cảm ơn bạn đã phản hồi!");
        setIsOpen(false);
      } catch (err: any) {
        console.error(err);
        alert(err?.message || "Gửi phản hồi thất bại, vui lòng thử lại sau.");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="w-full bg-white p-6 rounded-3xl shadow-2xl text-left max-w-sm mx-auto border border-slate-200">
        <div className="text-center mb-5">
          <div className="size-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mx-auto mb-2">
            <GraduationCap className="size-6 text-blue-800" />
          </div>
          <h3
            className="text-xl font-extrabold text-slate-900 mb-1"
            style={{ fontFamily: config.fonts.heading }}
          >
            {data?.rsvpCta || "Xác Nhận Tham Dự"}
          </h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            {data?.rsvpIntro ||
              "Sự hiện diện của bạn làm ngày tốt nghiệp thêm trọn vẹn!"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1">
              Tên của bạn
            </label>
            <input
              required
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              disabled={!!data?.guestName}
              placeholder="Nhập họ và tên..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1.5">
              Bạn sẽ đến chứ?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAttending("yes")}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer ${
                  attending === "yes"
                    ? "border-blue-700 bg-blue-50 text-blue-950 font-bold shadow-xs"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                }`}
              >
                <CheckCircle2
                  className={`size-5 ${
                    attending === "yes" ? "text-blue-700" : "text-gray-400"
                  }`}
                />
                <span className="text-xs">Sẽ tham dự</span>
              </button>

              <button
                type="button"
                onClick={() => setAttending("no")}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer ${
                  attending === "no"
                    ? "border-rose-500 bg-rose-50 text-rose-950 font-bold shadow-xs"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                }`}
              >
                <XCircle
                  className={`size-5 ${
                    attending === "no" ? "text-rose-600" : "text-gray-400"
                  }`}
                />
                <span className="text-xs">Không thể đến</span>
              </button>
            </div>
          </div>

          {attending === "yes" && (
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
              <label className="text-xs font-bold text-slate-900">
                Số người tham dự
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={guestCount <= 1}
                  className="size-7 rounded-full bg-white shadow-xs flex items-center justify-center font-bold text-slate-900 disabled:opacity-40"
                >
                  -
                </button>
                <span className="font-bold text-sm text-slate-900 w-4 text-center">
                  {guestCount}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={guestCount >= 10}
                  className="size-7 rounded-full bg-white shadow-xs flex items-center justify-center font-bold text-slate-900 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-900 block mb-1">
              Lời nhắn gửi tân khoa (tuỳ chọn)
            </label>
            <textarea
              rows={2}
              value={wishes}
              onChange={(e) => setWishes(e.target.value)}
              placeholder="Chúc bạn luôn thành công trên chặng đường mới..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs text-slate-900 placeholder:text-slate-400 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold tracking-wider text-xs uppercase transition-all shadow-md active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer border border-amber-400/40"
          >
            <Send className="size-4" />
            <span>{isSubmitting ? "Đang gửi..." : "Gửi Xác Nhận"}</span>
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="w-full px-6 py-6 flex flex-col items-center">
      {isFormInline ? (
        <FormContent />
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="px-8 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-xl hover:scale-105 transition-transform cursor-pointer flex items-center gap-2"
          style={{
            backgroundColor: config.colors.buttonBg,
            color: config.colors.buttonText,
          }}
        >
          <GraduationCap className="size-4" />
          <span>{data?.rsvpCta || "Xác Nhận Tham Dự"}</span>
        </button>
      )}

      {isOpen && !isFormInline && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-3 -right-3 size-8 rounded-full bg-white text-slate-900 font-bold shadow-md flex items-center justify-center z-10 hover:bg-slate-100"
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
