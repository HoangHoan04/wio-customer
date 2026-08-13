import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F3EDE3] text-[#2D231F] flex items-center justify-center">
      <div className="text-center space-y-6">
        <p className="text-8xl font-bold text-[#2D231F]/30">404</p>
        <h1 className="text-2xl font-bold">Trang không tìm thấy</h1>
        <p className="text-sm text-[#7A6A5C]">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#2D231F] text-[#F3EDE3] font-bold rounded-lg hover:opacity-90 transition-all"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
