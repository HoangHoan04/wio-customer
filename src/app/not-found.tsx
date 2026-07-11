import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f0608] text-[#f5e6d3] flex items-center justify-center">
      <div className="text-center space-y-6">
        <p className="text-8xl font-bold text-[#d4af37]/30">404</p>
        <h1 className="text-2xl font-bold">Trang không tìm thấy</h1>
        <p className="text-sm text-[#c9a98a]">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
        <Link href="/" className="inline-block px-6 py-3 bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#0f0608] font-bold rounded-lg hover:opacity-90 transition-all">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
