import decorFlower from "@/assets/decorations/boho-floral-pink/flower_mid.webp";
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
  const [messages] = useState([
    {
      id: 1,
      name: "Minh Tuấn",
      content: "Chúc hai bạn trăm năm hạnh phúc nhé!",
      createdAt: "2026-06-05T14:30:00.000Z",
    },
    {
      id: 2,
      name: "Ngọc Lan",
      content: "Chúc mừng hạnh phúc hai em. Sớm có quý tử nha!",
      createdAt: "2026-06-05T12:15:00.000Z",
    },
    {
      id: 3,
      name: "Hoàng Phong",
      content: "Happy Wedding! Chúc hai bạn răng long đầu bạc.",
      createdAt: "2026-06-05T08:00:00.000Z",
    },
  ]);

  const [activeFloaters, setActiveFloaters] = useState<any[]>([]);

  useEffect(() => {
    if (!data?.guestbookFloating) {
      setActiveFloaters([]);
      return;
    }

    const interval = setInterval(() => {
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      if (!randomMsg) return;

      const newFloater = {
        id: Math.random().toString(),
        name: randomMsg.name,
        content: randomMsg.content,
        left: Math.random() * 70 + 5,
        duration: Math.random() * 5 + 10,
      };

      setActiveFloaters((prev) => [...prev, newFloater]);

      setTimeout(() => {
        setActiveFloaters((prev) => prev.filter((f) => f.id !== newFloater.id));
      }, newFloater.duration * 1000);
    }, 3500);

    return () => clearInterval(interval);
  }, [data?.guestbookFloating, messages]);

  if (!data?.showGuestbook) return null;

  return (
    <section
      className="py-10 px-4 relative overflow-hidden"
      style={{ backgroundColor: config.colors.background }}
    >
      <img
        src={decorFlower.src}
        alt=""
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 w-24 md:w-44 opacity-10 pointer-events-none translate-x-8 select-none z-0"
      />
      <img
        src={decorFlower.src}
        alt=""
        aria-hidden="true"
        className="absolute left-0 bottom-0 w-20 md:w-36 opacity-10 pointer-events-none -translate-x-6 translate-y-4 select-none z-0 scale-x-[-1]"
      />
      {data?.guestbookFloating && (
        <style>{`
          @keyframes floatUpCircle {
            0% {
              transform: translateY(33.3vh) translateX(0) scale(0.85);
              opacity: 0;
            }
            15% {
              opacity: 0.95;
            }
            50% {
              transform: translateY(16.6vh) translateX(25px) scale(1);
            }
            100% {
              transform: translateY(0) translateX(-25px) scale(0.9);
              opacity: 0;
            }
          }
        `}</style>
      )}

      {data?.guestbookFloating && (
        <div className="fixed bottom-0 left-0 w-full h-[33.3vh] overflow-hidden pointer-events-none z-9999">
          {activeFloaters.map((f) => (
            <div
              key={f.id}
              className="absolute p-3 rounded-xl border shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col gap-0.5 max-w-50"
              style={{
                left: `${f.left}%`,
                borderColor: `${config.colors.accent}40`,
                backgroundColor: config.colors.background || "#ffffff",
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
                className="text-[10px] font-bold leading-tight"
                style={{ color: config.colors.textPrimary }}
              >
                {f.content}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="text-center mb-3">
          <h2
            className="text-xl md:text-2xl uppercase font-black mb-5"
            style={{
              fontFamily: config.fonts.heading,
              color: config.colors.textPrimary,
              textShadow: `0.5px 0 0 ${config.colors.textPrimary}, -0.5px 0 0 ${config.colors.textPrimary}`,
            }}
          >
            SỔ LƯU BÚT
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Tên của bạn"
              className="w-full px-4 py-3 bg-white/5 border rounded-lg outline-none focus:border-opacity-100"
              style={{
                borderColor: `${config.colors.textPrimary}30`,
                color: config.colors.textPrimary,
              }}
            />
            <textarea
              placeholder="Lời chúc"
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border rounded-lg outline-none focus:border-opacity-100 resize-none"
              style={{
                borderColor: `${config.colors.textPrimary}30`,
                color: config.colors.textPrimary,
              }}
            ></textarea>
            <button
              className="w-full py-3 rounded-lg font-bold tracking-widest uppercase shadow-lg hover:-translate-y-1 transition-transform"
              style={{
                backgroundColor: config.colors.buttonBg,
                color: config.colors.buttonText,
              }}
            >
              Gửi Lời Chúc
            </button>
          </div>

          {data?.guestbookStatic && (
            <div className="w-full md:w-2/3 h-80 overflow-y-auto pr-4 custom-scrollbar flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-xl border bg-white/5 shadow-sm"
                  style={{ borderColor: `${config.colors.textPrimary}10` }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4
                      className="font-bold"
                      style={{
                        fontFamily: config.fonts.heading,
                        color: config.colors.accent,
                      }}
                    >
                      {msg.name}
                    </h4>
                    <span
                      className="text-[10px] opacity-40 font-medium"
                      style={{
                        fontFamily: config.fonts.body,
                        color: config.colors.textPrimary,
                      }}
                    >
                      {formatDateTime(msg.createdAt)}
                    </span>
                  </div>
                  <p
                    className="text-sm opacity-90 text-left"
                    style={{
                      fontFamily: config.fonts.body,
                      color: config.colors.textPrimary,
                    }}
                  >
                    {msg.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
