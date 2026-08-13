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
          ? "bg-[#2D231F]/10 text-[#2D231F] border-[#2D231F]/30 ring-1 ring-[#2D231F]/15"
          : "text-[#7A6A5C] hover:text-[#2D231F] hover:bg-[#EDE4D5] border-transparent"
      }`}
    >
      {children}
    </button>
  );
}
