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
          className="bg-[#EDE4D5] rounded-lg p-4 hover:bg-[#F3EDE3] cursor-pointer transition-colors border border-[#D9CDBE] hover:border-[#2D231F]/30"
        >
          <p className="text-[#2D231F] text-sm font-medium">{t.name}</p>
          <p className="text-gray-500 text-xs mt-1">{t.desc}</p>
        </div>
      ))}
    </div>
  );
}
