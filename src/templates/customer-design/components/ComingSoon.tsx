import type { ComponentType } from "react";

export default function ComingSoon({
  icon: Icon,
  text,
}: {
  icon: ComponentType<{ size?: number }>;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      {Icon && <Icon size={36} />}
      <p className="text-sm mt-3">{text}</p>
      <p className="text-xs mt-1 text-gray-600">Tính năng đang phát triển</p>
    </div>
  );
}
