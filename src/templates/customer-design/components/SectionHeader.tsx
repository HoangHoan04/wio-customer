export default function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#d4af37]/10 text-[#d4af37]">
        {icon}
      </div>
      <span className="text-xs font-semibold text-[#f5e6d3] uppercase tracking-wider">{title}</span>
    </div>
  );
}
