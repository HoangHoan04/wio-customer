"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 1,
    question: "Thiệp online hoạt động trong bao lâu?",
    answer:
      "Link thiệp mở được trong thời hạn gói bạn đang dùng. Trong khoảng đó bạn xem lại, chỉnh sửa hoặc gửi tiếp cho khách bất cứ lúc nào — cho cưới hỏi, sinh nhật hay sự kiện khác.",
  },
  {
    id: 2,
    question: "Tôi có thể dùng nhạc nền của riêng mình không?",
    answer:
      "Được. Chọn bài có sẵn trên hệ thống, tải tệp âm thanh, hoặc gắn đường dẫn YouTube. Nhạc tự phát khi khách mở thiệp, đúng không khí buổi tiệc của bạn.",
  },
  {
    id: 3,
    question: "Thông tin sự kiện đổi sau khi đã gửi thiệp thì sao?",
    answer:
      "Sửa ngày giờ, địa điểm hay ảnh ngay trên trang quản lý. Link đã gửi tự cập nhật, không cần tạo thiệp mới hay nhắn lại từng người.",
  },
  {
    id: 4,
    question: "RSVP thống kê danh sách khách thế nào?",
    answer:
      "Khi khách xác nhận tham dự, tên, số người đi cùng và lời chúc hiện ngay trên bảng quản lý. Bạn theo dõi danh sách, xếp bàn nếu cần, rồi xuất file khi chuẩn bị tiệc.",
  },
  {
    id: 5,
    question: "Người lớn tuổi mở thiệp số có khó không?",
    answer:
      "Thiệp mở trên điện thoại, không cần tải app hay đăng nhập. Chữ rõ, nút bấm lớn, thao tác chỉ vài chạm — khách chỉ việc mở link và đọc thiệp.",
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="py-28 px-6 relative overflow-hidden border-b border-[#2D231F]/10"
    >
      <div className="absolute top-0 right-1/4 w-125 h-125 bg-[radial-gradient(circle,rgba(45, 35, 31,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-212.5 mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="text-xs tracking-[6px] uppercase text-[#7A6A5C] mb-4 font-semibold font-cormorant">
              Câu hỏi thường gặp
            </p>
            <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-light font-cormorant ">
              <span className="tct-shimmer-text italic block">
                Trước khi gửi thiệp
              </span>
            </h2>
            <div className="w-12 h-px bg-[#2D231F]/40 mx-auto mt-6" />
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <ScrollReveal key={faq.id}>
                <div
                  className={`group rounded-xl border transition-all duration-300 ${
                    isOpen
                      ? "bg-[#EDE4D5]/70 border-[#2D231F] shadow-[0_8px_25px_rgba(45,35,31,0.08)]"
                      : "bg-transparent border-[#2D231F]/12 hover:border-[#2D231F]/25"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer transition-colors"
                  >
                    <span
                      className={`text-base font-medium pr-6 tracking-wide transition-colors duration-300 ${isOpen ? "text-[#7A6A5C]" : "text-[#2D231F]/95 group-hover:text-[#2D231F]"}`}
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={18}
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
                    <div className="p-6 text-xs sm:text-[13px] text-[#7A6A5C]/85 leading-relaxed font-light">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
