import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { submitRsvpAction } from "@/services/rsvp-helper";
import { Check, CheckCircle2, HeartHandshake, Send, XCircle } from "lucide-react";
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
      <div className="w-full bg-white/95 p-6 rounded-3xl shadow-xl text-left max-w-sm mx-auto border border-orange-200 backdrop-blur-md">
        <div className="text-center mb-5">
          <div className="size-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-2">
            <HeartHandshake className="size-6" />
          </div>
          <h3
            className="text-xl font-extrabold text-orange-950 mb-1"
            style={{ fontFamily: config.fonts.heading }}
          >
            {data?.rsvpCta || "Xác Nhận Tham Dự"}
          </h3>
          <p className="text-orange-900/70 text-xs leading-relaxed">
            {data?.rsvpIntro ||
              "Hãy cho chúng mình biết bạn sẽ đến chung vui sinh nhật nhé!"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-orange-950 block mb-1">
              Tên của bạn
            </label>
            <input
              required
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              disabled={!!data?.guestName}
              placeholder="Nhập họ và tên..."
              className="w-full px-3.5 py-2.5 bg-orange-50/50 border border-orange-200 rounded-xl outline-none text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-orange-950 placeholder:text-orange-900/40"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-orange-950 block mb-1.5">
              Bạn sẽ đến chứ?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAttending("yes")}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer ${
                  attending === "yes"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs"
                    : "border-orange-200/80 bg-white hover:bg-orange-50/50 text-orange-900"
                }`}
              >
                <CheckCircle2
                  className={`size-5 ${
                    attending === "yes" ? "text-emerald-600" : "text-gray-400"
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
                    : "border-orange-200/80 bg-white hover:bg-orange-50/50 text-orange-900"
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
            <div className="flex items-center justify-between bg-orange-50 p-2.5 rounded-2xl border border-orange-200">
              <label className="text-xs font-bold text-orange-950">
                Số người tham dự
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={guestCount <= 1}
                  className="size-7 rounded-full bg-white shadow-xs flex items-center justify-center font-bold text-orange-900 disabled:opacity-40"
                >
                  -
                </button>
                <span className="font-bold text-sm text-orange-950 w-4 text-center">
                  {guestCount}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={guestCount >= 10}
                  className="size-7 rounded-full bg-white shadow-xs flex items-center justify-center font-bold text-orange-900 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-orange-950 block mb-1">
              Lời nhắn gửi chủ tiệc (tuỳ chọn)
            </label>
            <textarea
              rows={2}
              value={wishes}
              onChange={(e) => setWishes(e.target.value)}
              placeholder="Chúc bạn sinh nhật vui vẻ..."
              className="w-full px-3.5 py-2 bg-orange-50/50 border border-orange-200 rounded-xl outline-none text-xs text-orange-950 placeholder:text-orange-900/40 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold tracking-wider text-xs uppercase transition-all shadow-md active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
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
          <HeartHandshake className="size-4" />
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
              className="absolute -top-3 -right-3 size-8 rounded-full bg-white text-orange-950 font-bold shadow-md flex items-center justify-center z-10 hover:bg-orange-100"
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
