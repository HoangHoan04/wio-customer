export default function FormatButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors border ${
        active
          ? "bg-[#d4af37]/30 text-[#d4af37] border-[#d4af37]/50 ring-1 ring-[#d4af37]/30"
          : "text-gray-400 hover:text-white hover:bg-[#3a3a3a] border-transparent"
      }`}
    >
      {children}
    </button>
  );
}
