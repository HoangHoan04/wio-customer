"use client";

const COLORS = {
  gold: "#d4af37",
  goldLight: "#f5c842",
  cream: "#f5e6d3",
  muted: "#c9a98a",
  bgCard: "#1a0a0f",
};

const socialChannels = [
  { name: "Facebook", actionText: "Theo dõi ngay" },
  { name: "Instagram", actionText: "Theo dõi ngay" },
  { name: "TikTok", actionText: "Theo dõi ngay" },
  { name: "Email", actionText: "Liên hệ ngay" },
];

const faqs = [
  {
    q: "Tôi đã tạo thiệp nhưng quên mật khẩu đăng nhập, phải làm sao?",
    a: "Bạn đừng lo, hãy nhấn vào nút 'Quên mật khẩu' tại màn hình đăng nhập và nhập email đã đăng ký. Hệ thống sẽ gửi đường link đặt lại mật khẩu vào email của bạn.",
  },
  {
    q: "Tôi có thể sửa lại nội dung thiệp sau khi đã gửi link cho bạn bè không?",
    a: "Hoàn toàn được. Bạn chỉ cần đăng nhập vào mục 'Thiệp đã tạo', chọn thiệp cần sửa và cập nhật thông tin. Nội dung sẽ tự động thay đổi trên đường link cũ.",
  },
  {
    q: "Tôi gặp lỗi khi thanh toán nâng cấp gói, tôi cần liên hệ ai?",
    a: "Nếu tài khoản đã bị trừ tiền nhưng gói dịch vụ chưa được kích hoạt, vui lòng chụp màn hình giao dịch và gửi vào Facebook. Chúng tôi sẽ kiểm tra và kích hoạt thủ công trong vòng 15 phút.",
  },
  {
    q: "Khách mời báo không gửi được lời chúc hoặc xác nhận tham dự?",
    a: "Vui lòng kiểm tra trong phần Cài đặt thiệp xem bạn đã thêm form xác nhận tham dự (RSVP) chưa. Nếu đã thêm mà vẫn gặp lỗi, hãy gửi đường link thiệp cho chúng tôi.",
  },
  {
    q: "Tiệm cưới tân thời có nhận thiết kế riêng theo yêu cầu không?",
    a: "Hiện tại chúng tôi tập trung phát triển kho mẫu có sẵn đa dạng để người dùng tự do tùy chỉnh. Với các nhu cầu hợp tác, vui lòng liên hệ qua các kênh phía trên.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-[140px] bg-[#0f0608] text-[#f5e6d3] overflow-x-hidden">
      <main className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          <span className="font-serif italic font-normal text-[#d4af37]">
            Thông tin liên hệ
          </span>
        </h1>
        <p className="text-base md:text-lg mb-16 opacity-90 text-[#c9a98a]">
          Kết nối với <span className="text-[#f5c842]">Tiệm cưới tân thời</span>{" "}
          qua các kênh mạng xã hội và email bên dưới.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-14">
          {socialChannels.map((ch, idx) => (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              aria-label={`Liên hệ qua ${ch.name}`}
              className="flex flex-col items-center justify-center rounded-2xl p-6 transition-all duration-300 cursor-pointer group bg-[#1a0a0f] border border-[#d4af37]/40 hover:border-[#d4af37] hover:translate-y-[-4px]"
            >
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] text-lg mb-3 group-hover:bg-[#d4af37] group-hover:text-[#1a0a0f] transition-all">
                {ch.name.charAt(0)}
              </div>
              <span className="font-semibold text-sm mb-1 text-[#f5e6d3]">
                {ch.name}
              </span>
              <span className="text-xs text-[#c9a98a]">{ch.actionText}</span>
            </div>
          ))}
        </div>

        <section className="mb-24 py-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-[#f5e6d3]">
            Câu hỏi thường gặp
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`${idx === faqs.length - 1 ? "md:col-span-2" : ""} rounded-2xl p-6 text-left border transition-colors duration-300 bg-[#1a0a0f] border-[#d4af37]/40 hover:border-[#d4af37]`}
              >
                <h3 className="font-bold text-base mb-3 leading-snug text-[#f5e6d3]">
                  {faq.q}
                </h3>
                <p className="text-sm leading-relaxed whitespace-pre-line text-[#c9a98a]">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
