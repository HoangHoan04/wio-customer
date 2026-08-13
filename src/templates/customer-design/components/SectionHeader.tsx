export default function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#2D231F]/10 text-[#2D231F]">
        {icon}
      </div>
      <span className="text-xs font-semibold text-[#2D231F] uppercase tracking-wider">{title}</span>
    </div>
  );
}
