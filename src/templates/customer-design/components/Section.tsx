export default function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}
