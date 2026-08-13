"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import contactService from "@/services/contact.service";
import { ChevronDown, MessageSquare, Send, Sparkles } from "lucide-react";
import { useState } from "react";

const SOCIAL_CHANNELS = [
  {
    name: "Facebook",
    actionText: "Theo dõi Fanpage",
    icon: "/icons/facebook.svg",
    href: "https://facebook.com",
  },
  {
    name: "Instagram",
    actionText: "Ngắm mẫu thiệp đẹp",
    icon: "/icons/instagram.svg",
    href: "https://instagram.com",
  },
  {
    name: "TikTok",
    actionText: "Xem video review",
    icon: "/icons/tiktok.svg",
    href: "https://tiktok.com",
  },
  {
    name: "Email",
    actionText: "tiemcuoitanthoi@gmail.com",
    icon: "/icons/gmail.svg",
    href: "mailto:tiemcuoitanthoi@gmail.com",
  },
];

const FAQS = [
  {
    id: 1,
    q: "Tôi đã tạo thiệp nhưng quên mật khẩu đăng nhập, phải làm sao?",
    a: "Bạn đừng lo lắng, hãy nhấn vào nút 'Quên mật khẩu' tại màn hình đăng nhập và nhập địa chỉ email đã đăng ký của bạn. Hệ thống sẽ ngay lập tức gửi một đường link thiết lập lại mật khẩu bảo mật vào hộp thư của bạn.",
  },
  {
    id: 2,
    q: "Tôi có thể sửa lại nội dung thiệp sau khi đã gửi link cho bạn bè không?",
    a: "Hoàn toàn được. Bạn chỉ cần đăng nhập vào mục 'Thiệp đã tạo', thực hiện các thay đổi mong muốn và lưu lại. Nội dung trên đường link bạn đã gửi đi sẽ được cập nhật tự động ngay lập tức.",
  },
  {
    id: 3,
    q: "Tôi gặp lỗi khi thanh toán nâng cấp gói, tôi cần liên hệ ai?",
    a: "Nếu tài khoản ngân hàng của bạn đã bị trừ tiền nhưng gói dịch vụ vẫn chưa được kích hoạt, vui lòng chụp lại màn hình giao dịch chuyển khoản thành công và gửi qua Fanpage Facebook của InviGo. Đội ngũ kỹ thuật hỗ trợ sẽ kích hoạt thủ công cho bạn trong vòng tối đa 15 phút.",
  },
  {
    id: 4,
    q: "Khách mời phản hồi không gửi được lời chúc hoặc xác nhận tham dự?",
    a: "Vui lòng truy cập trình chỉnh sửa thiệp và kiểm tra xem bạn đã kích hoạt Form xác nhận tham dự (RSVP) chưa. Nếu form đã được bật mà vẫn gặp hiện tượng lỗi, hãy gửi ngay liên kết thiệp của bạn qua kênh chat hỗ trợ để chuyên viên kỹ thuật kiểm tra giúp bạn.",
  },
  {
    id: 5,
    q: "InviGo có nhận thiết kế riêng theo yêu cầu không?",
    a: "Hiện tại chúng tôi tập trung phát triển kho mẫu có sẵn đa dạng để các cặp đôi tự do cá nhân hóa. Tuy nhiên, nếu bạn có nhu cầu thiết kế một template độc quyền hoàn toàn theo ý muốn, vui lòng gửi tin nhắn yêu cầu chi tiết cho chúng tôi qua Form bên cạnh.",
  },
];

export default function ContactPage() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleFaq = (id: number) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await contactService.sendContact({
        name: formState.name,
        email: formState.email,
        message: formState.message,
      });
      setSuccess(true);
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu liên hệ:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-35 bg-[#F3EDE3] text-[#2D231F] overflow-x-hidden relative">
      <div className="absolute top-[10%] left-1/4 w-150 h-150 bg-[radial-gradient(circle,rgba(45, 35, 31,0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-[20%] right-1/4 w-125 h-125 bg-[radial-gradient(circle,rgba(45, 35, 31,0.02)_0%,transparent_70%)] pointer-events-none" />

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[6px] uppercase text-[#7A6A5C] mb-4 font-semibold font-cormorant">
            Hỗ trợ & Đồng hành
          </p>
          <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-light font-cormorant mb-4 leading-tight text-[#2D231F] ">
            <span className="tct-shimmer-text italic block">
              Kết nối cùng chúng tôi
            </span>
          </h1>
          <p className="text-xs text-[#7A6A5C]/70 max-w-137.5 mx-auto leading-relaxed uppercase tracking-widest">
            InviGo luôn sẵn sàng lắng nghe câu chuyện tình yêu của
            hai bạn
          </p>
          <div className="w-12 h-px bg-[#2D231F]/40 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {SOCIAL_CHANNELS.map((ch, idx) => {
            return (
              <a
                key={idx}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center rounded-2xl p-6 text-center border transition-all duration-500 hover:-translate-y-1 bg-linear-to-b from-white to-[#EDE4D5]"
                style={{ borderColor: "rgba(45, 35, 31, 0.12)" }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(45, 35, 31,0.04)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="w-11 h-11 rounded-xl bg-[#EDE4D5] border border-[#2D231F]/20 flex items-center justify-center text-[#2D231F] mb-4 transition-all duration-500 group-hover:bg-[#2D231F] group-hover:text-[#F3EDE3] group-hover:shadow-[0_0_15px_rgba(45, 35, 31,0.3)]">
                  <img className="w-11 h-11" src={ch.icon} alt={ch.name} />
                </div>

                <span
                  className="font-medium text-sm mb-1 text-[#2D231F] transition-colors duration-300 group-hover:text-[#2D231F]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {ch.name}
                </span>
                <span className="text-[11px] text-[#7A6A5C]/60 font-light tracking-wide truncate max-w-full">
                  {ch.actionText}
                </span>

                <div className="absolute inset-0 border border-[#2D231F]/0 rounded-2xl transition-all duration-500 group-hover:border-[#2D231F]/25 pointer-events-none" />
              </a>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start mt-12">
          <div className="space-y-4">
            <div className="text-left mb-8 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#EDE4D5] border border-[#2D231F]/15 flex items-center justify-center text-[#2D231F]">
                <Sparkles size={16} />
              </div>
              <div>
                <h2
                  className="text-xl font-medium text-[#2D231F]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Câu hỏi thường gặp
                </h2>
                <p className="text-[11px] text-[#7A6A5C]/50 uppercase tracking-widest mt-0.5 font-cormorant font-bold">
                  Hỗ trợ trực tuyến nhanh chóng
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {FAQS.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`group rounded-xl border transition-all duration-300 ${
                      isOpen
                        ? "bg-[#EDE4D5]/40 border-[#2D231F] shadow-[0_8px_25px_rgba(45, 35, 31,0.3)]"
                        : "bg-[#EDE4D5]/40 border-[#2D231F]/10 hover:border-[#2D231F]/25"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between p-5 text-left cursor-pointer transition-colors"
                    >
                      <span
                        className={`text-[14px] font-medium pr-6 leading-snug tracking-wide transition-colors duration-300 ${isOpen ? "text-[#7A6A5C]" : "text-[#2D231F]/90 group-hover:text-[#2D231F]"}`}
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-[#2D231F]/60 shrink-0 transition-transform duration-500 ${
                          isOpen ? "rotate-180 text-[#7A6A5C]" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isOpen
                          ? "max-h-75 opacity-100 border-t border-[#2D231F]/10"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="p-5 text-xs text-[#7A6A5C]/80 leading-relaxed font-light">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="rounded-2xl p-8 border text-left relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #F3EDE3 0%, #EDE4D5 100%)",
              borderColor: "rgba(45, 35, 31, 0.15)",
            }}
          >
            <div className="absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_center,rgba(45, 35, 31,0.03)_0%,transparent_70%)] pointer-events-none" />

            <div className="mb-6 flex items-center gap-3 relative z-10">
              <div className="w-9 h-9 rounded-lg bg-[#EDE4D5] border border-[#2D231F]/15 flex items-center justify-center text-[#2D231F]">
                <MessageSquare size={16} />
              </div>
              <div>
                <h2
                  className="text-xl font-medium text-[#2D231F]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Gửi lời nhắn riêng
                </h2>
                <p className="text-[11px] text-[#7A6A5C]/50 uppercase tracking-widest mt-0.5 font-cormorant font-bold">
                  Bespoke inquiry message
                </p>
              </div>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="space-y-4 relative z-10"
            >
              <div className="space-y-1">
                <label className="text-[10px] text-[#7A6A5C]/50 uppercase tracking-widest font-semibold block">
                  Họ và tên
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập họ và tên..."
                  className="w-full bg-[#EDE4D5] border border-[#2D231F]/15 rounded-lg h-10 px-4 text-xs text-[#2D231F] outline-none transition-all focus:border-[#2D231F]/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#7A6A5C]/50 uppercase tracking-widest font-semibold block">
                  Địa chỉ email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  required
                  placeholder="vi-du@gmail.com"
                  className="w-full bg-[#EDE4D5] border border-[#2D231F]/15 rounded-lg h-10 px-4 text-xs text-[#2D231F] outline-none transition-all focus:border-[#2D231F]/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#7A6A5C]/50 uppercase tracking-widest font-semibold block">
                  Nội dung câu hỏi
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formState.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Gửi gắm nỗi băn khoăn của bạn cho InviGo nhé..."
                  className="w-full bg-[#EDE4D5] border border-[#2D231F]/15 rounded-lg p-4 text-xs text-[#2D231F] outline-none transition-all focus:border-[#2D231F]/60 resize-none leading-relaxed"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-[#2D231F] hover:opacity-95 text-[#F3EDE3] font-bold text-xs tracking-widest uppercase rounded-lg flex items-center justify-center gap-2 transition-all transform active:scale-98 shadow-md"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-[#F3EDE3] border-t-transparent rounded-full animate-spin" />
                ) : success ? (
                  "Đã gửi thư thành công"
                ) : (
                  <>
                    Gửi thư liên hệ <Send size={12} />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
