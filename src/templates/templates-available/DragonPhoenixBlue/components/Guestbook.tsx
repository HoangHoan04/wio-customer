import cloudSmall from "@/assets/decorations/dragon_phoenix_blue/cloud_small.webp";
import dragon from "@/assets/decorations/dragon_phoenix_blue/dragon.webp";
import phoenix from "@/assets/decorations/dragon_phoenix_blue/phoenix.webp";
import { formatDateTime } from "@/common/helpers";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { useEffect, useState } from "react";

export const Guestbook = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const realMessages = data?.guestbook || data?.messages || [];
  const [activeFloaters, setActiveFloaters] = useState<any[]>([]);

  useEffect(() => {
    if (!data?.guestbookFloating || realMessages.length === 0) {
      setActiveFloaters([]);
      return;
    }

    const interval = setInterval(() => {
      const randomMsg =
        realMessages[Math.floor(Math.random() * realMessages.length)];
      if (!randomMsg) return;

      const newFloater = {
        id: Math.random().toString(),
        name: randomMsg.name || randomMsg.guestName,
        content: randomMsg.content || randomMsg.message,
        left:
          Math.random() > 0.5
            ? Math.random() * 20 + 5
            : Math.random() * 20 + 75,
        duration: Math.random() * 5 + 10,
      };

      setActiveFloaters((prev) => [...prev, newFloater]);

      setTimeout(() => {
        setActiveFloaters((prev) => prev.filter((f) => f.id !== newFloater.id));
      }, newFloater.duration * 1000);
    }, 3500);

    return () => clearInterval(interval);
  }, [data?.guestbookFloating, data?.guestbook, data?.messages]);

  if (!data?.showGuestbook) return null;

  return (
    <section
      className="py-16 px-4 md:px-12 lg:px-24 relative overflow-hidden select-none"
      style={{ backgroundColor: config.colors.background }}
    >
      <img
        src={phoenix.src}
        alt=""
        aria-hidden="true"
        className="absolute -left-12 lg:-left-6 xl:left-4 top-0 w-24 md:w-36 lg:w-44 opacity-10 lg:opacity-15 pointer-events-none z-0 filter drop-shadow(0 2px 4px rgba(0,0,0,0.2)) -scale-x-100 transition-all duration-300"
      />

      <img
        src={dragon.src}
        alt=""
        aria-hidden="true"
        className="absolute -right-14 lg:-right-4 xl:right-8 -bottom-14 lg:-bottom-6 w-28 md:w-40 lg:w-48 opacity-10 lg:opacity-20 pointer-events-none z-0 -scale-x-100 filter drop-shadow(0 2px 4px rgba(0,0,0,0.2)) transition-all duration-300"
      />

      <img
        src={cloudSmall.src}
        alt=""
        aria-hidden="true"
        className="absolute right-12 top-1/3 w-20 md:w-32 opacity-5 lg:opacity-10 pointer-events-none select-none z-0 hidden md:block"
      />
      <img
        src={cloudSmall.src}
        alt=""
        aria-hidden="true"
        className="absolute left-16 bottom-1/4 w-16 md:w-24 opacity-5 lg:opacity-10 pointer-events-none select-none z-0 hidden md:block"
      />

      {data?.guestbookFloating && realMessages.length > 0 && (
        <style>{`
          @keyframes floatUpCircle {
            0% { transform: translateY(35vh) translateX(0) scale(0.85); opacity: 0; }
            15% { opacity: 0.95; }
            85% { opacity: 0.95; }
            100% { transform: translateY(-5vh) translateX(15px) scale(0.9); opacity: 0; }
          }
        `}</style>
      )}
      {data?.guestbookFloating && realMessages.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full h-[35vh] overflow-hidden pointer-events-none z-40">
          {activeFloaters.map((f) => (
            <div
              key={f.id}
              className="absolute p-3 rounded-xl border shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex flex-col gap-0.5 max-w-45 md:max-w-55 backdrop-blur-[3px] transition-opacity duration-300"
              style={{
                left: `${f.left}%`,
                borderColor: `${config.colors.accent}30`,
                backgroundColor: config.colors.background
                  ? `${config.colors.background}f2`
                  : "rgba(255,255,255,0.95)",
                animation: `floatUpCircle ${f.duration}s linear forwards`,
              }}
            >
              <span
                className="text-[10px] font-black uppercase tracking-wider"
                style={{ color: config.colors.accent }}
              >
                {f.name}
              </span>
              <span
                className="text-[10px] font-bold leading-tight line-clamp-3"
                style={{ color: config.colors.textPrimary }}
              >
                {f.content}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-5xl mx-auto flex flex-col items-center relative z-10 w-full">
        <div className="text-center mb-6">
          <h2
            className="text-xl md:text-2xl uppercase font-black mb-2"
            style={{
              fontFamily: config.fonts.heading,
              color: config.colors.textPrimary,
              textShadow: `0.5px 0 0 ${config.colors.textPrimary}, -0.5px 0 0 ${config.colors.textPrimary}`,
            }}
          >
            SỔ LƯU BÚT
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full justify-center items-start mt-4">
          <div className="w-full lg:col-span-1 flex flex-col gap-4 bg-white/5 p-5 md:p-6 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl relative z-20">
            <input
              type="text"
              placeholder="Tên của bạn"
              className="w-full px-4 py-3 bg-white/5 border rounded-lg outline-none focus:border-opacity-100 transition-colors"
              style={{
                borderColor: `${config.colors.textPrimary}25`,
                color: config.colors.textPrimary,
              }}
            />
            <textarea
              placeholder="Lời chúc"
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border rounded-lg outline-none focus:border-opacity-100 resize-none transition-colors"
              style={{
                borderColor: `${config.colors.textPrimary}25`,
                color: config.colors.textPrimary,
              }}
            ></textarea>
            <button
              className="w-full py-3 rounded-lg font-bold tracking-widest uppercase shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              style={{
                backgroundColor: config.colors.buttonBg,
                color: config.colors.buttonText,
              }}
            >
              Gửi Lời Chúc
            </button>
          </div>

          {data?.guestbookStatic && (
            <div className="w-full lg:col-span-2 h-100 lg:h-90 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4 relative z-20">
              {realMessages.length > 0 ? (
                realMessages.map((msg: any, index: number) => (
                  <div
                    key={msg.id || index}
                    className="p-4 rounded-xl border bg-white/5 shadow-sm backdrop-blur-[2px] transition-all hover:bg-white/10"
                    style={{ borderColor: `${config.colors.textPrimary}10` }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4
                        className="font-bold text-sm md:text-base"
                        style={{
                          fontFamily: config.fonts.heading,
                          color: config.colors.accent,
                        }}
                      >
                        {msg.name || msg.guestName}
                      </h4>
                      {msg.createdAt && (
                        <span
                          className="text-[10px] opacity-40 font-medium"
                          style={{
                            fontFamily: config.fonts.body,
                            color: config.colors.textPrimary,
                          }}
                        >
                          {formatDateTime(msg.createdAt)}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-sm opacity-90 text-left leading-relaxed"
                      style={{
                        fontFamily: config.fonts.body,
                        color: config.colors.textPrimary,
                      }}
                    >
                      {msg.content || msg.message}
                    </p>
                  </div>
                ))
              ) : (
                <div
                  className="h-full flex items-center justify-center text-sm opacity-50 italic"
                  style={{
                    fontFamily: config.fonts.body,
                    color: config.colors.textPrimary,
                  }}
                >
                  Hãy là người đầu tiên gửi lời chúc hạnh phúc...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
