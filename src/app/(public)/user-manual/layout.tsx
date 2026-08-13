import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hướng dẫn tạo thiệp online | InviGo",
  description:
    "Cách tạo thiệp mời online trên InviGo: chọn mẫu, điền nội dung, xem trước rồi gửi link cho khách. Dùng cho cưới hỏi, sinh nhật, tốt nghiệp và sự kiện khác.",
};

export default function UserManualLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
