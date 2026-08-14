export default function InviGoLogo() {
  return (
    <span
      className="invigo-logo flex items-baseline leading-none select-none"
      style={{ fontFamily: "var(--font-heading), 'Playfair Display', serif" }}
    >
      <span className="text-[1.65rem] sm:text-[1.9rem] md:text-[2.15rem] font-bold tracking-[-0.03em] text-[#2D231F]">
        Invi
      </span>
      <span className="invigo-go relative text-[1.65rem] sm:text-[1.9rem] md:text-[2.15rem] font-bold italic tracking-[-0.04em] text-[#2D231F]">
        Go
        <span
          aria-hidden
          className="absolute -right-1.5 top-1 w-1.5 h-1.5 rounded-full bg-[#C4B09A] shadow-[0_0_0_2px_#F3EDE3]"
        />
      </span>
    </span>
  );
}
