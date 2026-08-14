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
      alert("Cảm ơn bạn đã gửi lời chúc tốt nghiệp!");
    }, 400);
  };

  return (
    <div className="w-full px-6 py-6 flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col items-center">
        <span
          className="text-xs uppercase tracking-widest font-bold text-blue-800 mb-1"
          style={{ fontFamily: config.fonts.body }}
        >
          LỜI CHÚC TỐT NGHIỆP
        </span>
        <h2
          className="text-2xl font-extrabold text-slate-900 mb-4 flex items-center gap-2"
          style={{ fontFamily: config.fonts.heading }}
        >
          <MessageSquareHeart className="size-6 text-blue-800" />
          <span>Sổ Lưu Niệm Tân Khoa</span>
        </h2>

        {/* Input form */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white p-5 rounded-3xl border border-slate-200 shadow-md flex flex-col gap-3 mb-6"
        >
          <input
            required
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Tên của bạn..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-700"
          />
          <textarea
            required
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Gửi lời chúc mừng tốt nghiệp và thành công..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-700 resize-none"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60 border border-amber-400/30"
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
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1">
                    <Sparkles className="size-3 text-amber-500" />
                    {item.senderName || item.author || "Bạn bè"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                      : ""}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
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
