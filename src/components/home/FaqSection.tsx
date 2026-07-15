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
    question: "Thiệp cưới online của tôi sẽ hoạt động trong bao lâu?",
    answer:
      "Đối với gói Premium, liên kết thiệp cưới của hai bạn sẽ tồn tại vĩnh viễn cùng hệ thống. Các bạn hoàn toàn có thể mở lại xem bất cứ lúc nào như một trang nhật ký kỷ niệm ngày cưới ngọt ngào.",
  },
  {
    id: 2,
    question: "Tôi có thể tự tải lên nhạc nền của riêng mình không?",
    answer:
      "Hoàn toàn có thể. Bên cạnh danh sách các bản nhạc tình ca lãng mạn có sẵn trên hệ thống, gói Premium hỗ trợ bạn tải lên trực tiếp tệp âm thanh (định dạng MP3) hoặc chèn đường dẫn video YouTube yêu thích của hai bạn.",
  },
  {
    id: 3,
    question:
      "Lỡ thông tin tiệc cưới thay đổi sau khi gửi thiệp thì làm thế nào?",
    answer:
      "Đây chính là ưu điểm tuyệt vời nhất của thiệp số! Bạn có thể truy cập trang quản lý và sửa lại mọi thông tin (ngày giờ, địa điểm, hình ảnh) bất kỳ lúc nào. Đường link thiệp đã gửi đi sẽ tự động cập nhật dữ liệu mới nhất ngay lập tức mà không cần tạo lại thiệp mới.",
  },
  {
    id: 4,
    question: "Tính năng RSVP (Xác nhận tham dự) thống kê dữ liệu ra sao?",
    answer:
      "Mỗi khi có khách mời nhấn nút xác nhận tham gia và gửi thông tin đi, dữ liệu (Tên khách, số người đi cùng, lời chúc...) sẽ ngay lập tức được điền vào bảng điều khiển quản lý của hai bạn. Bạn cũng có thể xuất toàn bộ dữ liệu này ra file Excel chỉ với một chạm để bàn giao dễ dàng cho đơn vị chuẩn bị bàn tiệc.",
  },
  {
    id: 5,
    question: "Khách mời lớn tuổi có gặp khó khăn khi bóc thiệp số không?",
    answer:
      "Chúng tôi hiểu nỗi băn khoăn này nên đã tối ưu hóa luồng tương tác cực kỳ tối giản. Giao diện thiệp tương thích tuyệt đối với mọi dòng điện thoại thông minh, chữ viết rõ ràng, nút chạm to mượt và không yêu cầu đăng nhập hay cài đặt ứng dụng phức tạp.",
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-28 px-6 relative overflow-hidden border-b border-[#d4af37]/10">
      <div className="absolute top-0 right-1/4 w-125 h-125 bg-[radial-gradient(circle,rgba(212,175,55,0.02)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-212.5 mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-20">
            <p className="text-xs tracking-[6px] uppercase text-[#d4af37] mb-4 font-semibold font-cormorant">
              Góc giải đáp băn khoăn
            </p>
            <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-light font-cormorant ">
              <span className="tct-shimmer-text italic block">
                Để hành trình hạnh phúc vẹn tròn
              </span>
            </h2>
            <div className="w-12 h-px bg-[#d4af37]/40 mx-auto mt-6" />
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
                      ? "bg-[#221019]/40 border-[#d4af37] shadow-[0_8px_25px_rgba(34,16,25,0.3)]"
                      : "bg-transparent border-[#d4af37]/12 hover:border-[#d4af37]/25"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer transition-colors"
                  >
                    <span
                      className={`text-base font-medium pr-6 tracking-wide transition-colors duration-300 ${isOpen ? "text-[#f5c842]" : "text-[#f5e6d3]/95 group-hover:text-[#d4af37]"}`}
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#d4af37]/60 shrink-0 transition-transform duration-500 ${
                        isOpen ? "rotate-180 text-[#f5c842]" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen
                        ? "max-h-75 opacity-100 border-t border-[#d4af37]/10"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-6 text-xs sm:text-[13px] text-[#c9a98a]/85 leading-relaxed font-light">
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
