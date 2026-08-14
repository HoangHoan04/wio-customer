import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { MessageSquareHeart, Send, Sparkles } from "lucide-react";
import { useState } from "react";

export const Guestbook = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const [messages, setMessages] = useState<any[]>(data?.guestbook || []);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const newMsg = {
      id: Date.now().toString(),
      senderName: author.trim(),
      message: content.trim(),
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setMessages([newMsg, ...messages]);
      setAuthor("");
      setContent("");
      setIsSubmitting(false);
      alert("Cảm ơn bạn đã gửi lời chúc sinh nhật!");
    }, 400);
  };

  return (
    <div className="w-full px-6 py-6 flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col items-center">
        <span
          className="text-xs uppercase tracking-widest font-bold text-orange-600 mb-1"
          style={{ fontFamily: config.fonts.body }}
        >
          LỜI CHÚC
        </span>
        <h2
          className="text-2xl font-extrabold text-orange-950 mb-4 flex items-center gap-2"
          style={{ fontFamily: config.fonts.heading }}
        >
          <MessageSquareHeart className="size-6 text-orange-500" />
          <span>Sổ Lời Chúc Sinh Nhật</span>
        </h2>

        {/* Input form */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white/95 p-5 rounded-3xl border border-orange-200 shadow-md flex flex-col gap-3 mb-6"
        >
          <input
            required
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Tên của bạn..."
            className="w-full px-3.5 py-2.5 bg-orange-50/50 border border-orange-200 rounded-xl outline-none text-xs text-orange-950 placeholder:text-orange-900/40 focus:border-orange-500"
          />
          <textarea
            required
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Gửi gắm lời chúc sinh nhật ý nghĩa..."
            className="w-full px-3.5 py-2.5 bg-orange-50/50 border border-orange-200 rounded-xl outline-none text-xs text-orange-950 placeholder:text-orange-900/40 focus:border-orange-500 resize-none"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60"
          >
            <Send className="size-3.5" />
            <span>{isSubmitting ? "Đang gửi..." : "Gửi Lời Chúc"}</span>
          </button>
        </form>

        {/* Wishes list */}
        {messages.length > 0 && (
          <div className="w-full space-y-3 max-h-72 overflow-y-auto pr-1">
            {messages.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/90 p-4 rounded-2xl border border-orange-200/80 shadow-xs text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-orange-950 flex items-center gap-1">
                    <Sparkles className="size-3 text-orange-500" />
                    {item.senderName || item.author || "Bạn bè"}
                  </span>
                  <span className="text-[10px] text-orange-900/50">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                      : ""}
                  </span>
                </div>
                <p className="text-xs text-orange-900/80 leading-relaxed">
                  {item.message || item.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
