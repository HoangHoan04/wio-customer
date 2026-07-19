export default function TemplatePanelContent() {
  const templates = [
    { name: "Cổ điển vàng", desc: "Mẫu thiệp cổ điển vàng" },
    { name: "Hiện đại trắng", desc: "Mẫu thiệp hiện đại trắng" },
    { name: "Hoa lá", desc: "Mẫu thiệp hoa lá" },
    { name: "Long Phượng", desc: "Mẫu thiệp long phượng" },
  ];

  return (
    <div className="grid grid-cols-1 gap-3">
      {templates.map((t) => (
        <div
          key={t.name}
          className="bg-[#333] rounded-lg p-4 hover:bg-[#3a3a3a] cursor-pointer transition-colors border border-[#444] hover:border-[#d4af37]/30"
        >
          <p className="text-white text-sm font-medium">{t.name}</p>
          <p className="text-gray-500 text-xs mt-1">{t.desc}</p>
        </div>
      ))}
    </div>
  );
}
