import { useState } from "react";
import type { EditorElement } from "../types";
import { createDefaultText, createDefaultImage, createDefaultShape } from "../utils/constants";
import { Plus } from "lucide-react";

const pid = () => crypto.randomUUID();

function text(overrides: Partial<EditorElement>): Omit<EditorElement, "id" | "zIndex"> {
  const base = createDefaultText("__tmp__");
  const { id: _id, zIndex: _z, ...rest } = base;
  return { ...rest, ...overrides };
}

function img(src: string, overrides: Partial<EditorElement>): Omit<EditorElement, "id" | "zIndex"> {
  const base = createDefaultImage("__tmp__", src);
  const { id: _id, zIndex: _z, ...rest } = base;
  return { ...rest, ...overrides };
}

function shape(
  shapeType: EditorElement["shapeType"],
  overrides: Partial<EditorElement>
): Omit<EditorElement, "id" | "zIndex"> {
  const base = createDefaultShape("__tmp__", shapeType);
  const { id: _id, zIndex: _z, ...rest } = base;
  return { ...rest, ...overrides };
}

type PresetType = "family" | "intro" | "couple" | "dresscode";

interface PresetItem {
  id: string;
  name: string;
  type: PresetType;
  thumbnail: string;
  elements: Omit<EditorElement, "id" | "zIndex">[];
}

const PRESET_CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "intro", label: "Mở đầu" },
  { id: "couple", label: "Cô dâu chú rể" },
  { id: "family", label: "Gia đình" },
  { id: "dresscode", label: "Dresscode" },
];

const TYPE_BADGE_COLOR: Record<PresetType, string> = {
  intro: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  couple: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  family: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  dresscode: "bg-teal-500/20 text-teal-300 border-teal-500/30",
};

const TYPE_LABEL: Record<PresetType, string> = {
  intro: "Mở đầu",
  couple: "Cô dâu chú rể",
  family: "Gia đình",
  dresscode: "Dresscode",
};


const PRESETS: PresetItem[] = [
  {
    id: "intro_envelope_pink",
    name: "Mẫu Thư mời Bìa thư Hồng",
    type: "intro",
    thumbnail: "✉️",
    elements: [
      img("https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800", {
        x: 40, y: 40, width: 340, height: 260
      }),
      text({
        x: 60, y: 310, width: 300, height: 30,
        content: "Ngày Chung Đôi",
        fontSize: 16, fontFamily: "Dancing Script", fontWeight: "bold",
        textAlign: "center", color: "#e07a5f", fill: "transparent",
      }),
      text({
        x: 60, y: 345, width: 300, height: 25,
        content: "28.05.2026",
        fontSize: 14, fontFamily: "Montserrat",
        textAlign: "center", color: "#333333", fill: "transparent",
        letterSpacing: 2,
      })
    ]
  },
  {
    id: "intro_wedding_card",
    name: "Thư mời Tiệc cưới (Nơ đỏ)",
    type: "intro",
    thumbnail: "📜",
    elements: [
      text({
        x: 40, y: 30, width: 340, height: 40,
        content: "WEDDING",
        fontSize: 24, fontFamily: "Cinzel", fontWeight: "bold",
        textAlign: "center", color: "#8b5a2b", fill: "transparent",
        letterSpacing: 4
      }),
      text({
        x: 40, y: 80, width: 340, height: 35,
        content: "Văn Anh  -  Minh Thư",
        fontSize: 18, fontFamily: "Great Vibes",
        textAlign: "center", color: "#a64b2a", fill: "transparent"
      }),
      shape("line", { x: 100, y: 130, width: 220, height: 1, stroke: "#8b5a2b", strokeWidth: 1, fill: "transparent" }),
      text({
        x: 40, y: 140, width: 340, height: 25,
        content: "THƯ MỜI TIỆC CƯỚI",
        fontSize: 13, fontFamily: "Montserrat", fontWeight: "bold",
        textAlign: "center", color: "#333333", fill: "transparent",
        letterSpacing: 2
      }),
      text({
        x: 40, y: 170, width: 340, height: 20,
        content: "THỨ BẢY - 11:00",
        fontSize: 11, fontFamily: "Montserrat",
        textAlign: "center", color: "#666666", fill: "transparent"
      }),
      text({
        x: 40, y: 195, width: 340, height: 30,
        content: "19.12.2026",
        fontSize: 16, fontFamily: "Cinzel", fontWeight: "bold",
        textAlign: "center", color: "#333333", fill: "transparent"
      }),
      text({
        x: 40, y: 240, width: 150, height: 20,
        content: "NHÀ TRAI",
        fontSize: 11, fontFamily: "Montserrat", fontWeight: "bold",
        textAlign: "center", color: "#8b5a2b", fill: "transparent"
      }),
      text({
        x: 40, y: 265, width: 150, height: 40,
        content: "Ông NGUYỄN VĂN HẢI\nBà TRƯƠNG THỊ MINH",
        fontSize: 10, fontFamily: "Montserrat",
        textAlign: "center", color: "#444444", fill: "transparent", lineHeight: 1.4
      }),
      text({
        x: 230, y: 240, width: 150, height: 20,
        content: "NHÀ GÁI",
        fontSize: 11, fontFamily: "Montserrat", fontWeight: "bold",
        textAlign: "center", color: "#8b5a2b", fill: "transparent"
      }),
      text({
        x: 230, y: 265, width: 150, height: 40,
        content: "Ông LÊ MINH TÂM\nBà NGUYỄN VÂN ANH",
        fontSize: 10, fontFamily: "Montserrat",
        textAlign: "center", color: "#444444", fill: "transparent", lineHeight: 1.4
      })
    ]
  },
  {
    id: "family_horizontal",
    name: "Thông tin Gia đình (Bản ngang)",
    type: "family",
    thumbnail: "🏘️",
    elements: [
      text({
        x: 20, y: 20, width: 170, height: 25,
        content: "Nhà Trai 🧑‍💼",
        fontSize: 13, fontFamily: "Montserrat", fontWeight: "bold",
        textAlign: "center", color: "#333333", fill: "transparent"
      }),
      text({
        x: 20, y: 50, width: 170, height: 40,
        content: "Ông: Tống Đình Quý\nBà: Vũ Thị Hoài Vân",
        fontSize: 11, fontFamily: "Montserrat",
        textAlign: "center", color: "#555555", fill: "transparent", lineHeight: 1.4
      }),
      text({
        x: 20, y: 95, width: 170, height: 25,
        content: "Tuấn Linh",
        fontSize: 14, fontFamily: "Great Vibes",
        textAlign: "center", color: "#a64b2a", fill: "transparent"
      }),
      shape("line", { x: 205, y: 25, width: 1, height: 90, stroke: "#dddddd", strokeWidth: 1, fill: "transparent" }),
      text({
        x: 220, y: 20, width: 170, height: 25,
        content: "Nhà Gái 👩‍💼",
        fontSize: 13, fontFamily: "Montserrat", fontWeight: "bold",
        textAlign: "center", color: "#333333", fill: "transparent"
      }),
      text({
        x: 220, y: 50, width: 170, height: 40,
        content: "Ông: Nguyễn Đình Quý\nBà: Vũ Thị Hoài Vân",
        fontSize: 11, fontFamily: "Montserrat",
        textAlign: "center", color: "#555555", fill: "transparent", lineHeight: 1.4
      }),
      text({
        x: 220, y: 95, width: 170, height: 25,
        content: "Nguyễn Phượng",
        fontSize: 14, fontFamily: "Great Vibes",
        textAlign: "center", color: "#a64b2a", fill: "transparent"
      })
    ]
  },
  {
    id: "couple_welcome_calendar",
    name: "Ảnh Welcome & Lịch ngày cưới",
    type: "couple",
    thumbnail: "📅",
    elements: [
      img("https://images.pexels.com/photos/1488315/pexels-photo-1488315.jpeg?auto=compress&cs=tinysrgb&w=800", {
        x: 30, y: 60, width: 360, height: 460
      }),
      text({
        x: 30, y: 15, width: 360, height: 35,
        content: "WELCOME TO OUR WEDDING",
        fontSize: 15, fontFamily: "Cinzel", fontWeight: "bold",
        textAlign: "center", color: "#444444", fill: "transparent",
        letterSpacing: 3
      }),
      text({
        x: 60, y: 340, width: 300, height: 160,
        content: " 1   2   3   4   5   6   7\n 8   9  10  11  12  13  14\n15  16  17  18 [19] 20  21\n22  23  24  25  26  27  28\n29  30  31",
        fontSize: 12, fontFamily: "Courier New", fontWeight: "bold",
        textAlign: "center", color: "#ffffff", fill: "transparent",
        lineHeight: 1.6, opacity: 0.95
      })
    ]
  },
  {
    id: "couple_side_portraits",
    name: "Cặp đôi Groom & Bride tách biệt",
    type: "couple",
    thumbnail: "🤵👰",
    elements: [
      img("https://images.pexels.com/photos/1488312/pexels-photo-1488312.jpeg?auto=compress&cs=tinysrgb&w=800", {
        x: 30, y: 20, width: 175, height: 240 }),
      img("https://images.pexels.com/photos/1488315/pexels-photo-1488315.jpeg?auto=compress&cs=tinysrgb&w=800", {
        x: 215, y: 20, width: 175, height: 240 }),
      text({
        x: 30, y: 270, width: 175, height: 20,
        content: "GROOM",
        fontSize: 12, fontFamily: "Cinzel", fontWeight: "bold",
        textAlign: "center", color: "#333333", fill: "transparent", letterSpacing: 2
      }),
      text({
        x: 215, y: 270, width: 175, height: 20,
        content: "BRIDE",
        fontSize: 12, fontFamily: "Cinzel", fontWeight: "bold",
        textAlign: "center", color: "#333333", fill: "transparent", letterSpacing: 2
      }),
      text({
        x: 30, y: 295, width: 360, height: 30,
        content: "Văn Anh  💞  Minh Thư",
        fontSize: 16, fontFamily: "Great Vibes",
        textAlign: "center", color: "#a64b2a", fill: "transparent"
      })
    ]
  },
  {
    id: "intro_timeline",
    name: "Lịch trình đám cưới (Timeline)",
    type: "intro",
    thumbnail: "⏳",
    elements: [
      text({
        x: 20, y: 15, width: 400, height: 30,
        content: "Timeline",
        fontSize: 18, fontFamily: "Dancing Script", fontWeight: "bold",
        textAlign: "center", color: "#8b5a2b", fill: "transparent"
      }),
      text({
        x: 30, y: 55, width: 100, height: 20,
        content: "💍", fontSize: 18, textAlign: "center", fill: "transparent"
      }),
      text({
        x: 30, y: 80, width: 100, height: 40,
        content: "08:00\nLễ thành hôn",
        fontSize: 10, fontFamily: "Montserrat", textAlign: "center", color: "#444444", fill: "transparent", lineHeight: 1.3
      }),
      text({
        x: 170, y: 55, width: 100, height: 20,
        content: "📷", fontSize: 18, textAlign: "center", fill: "transparent"
      }),
      text({
        x: 170, y: 80, width: 100, height: 40,
        content: "10:30\nCheck-in",
        fontSize: 10, fontFamily: "Montserrat", textAlign: "center", color: "#444444", fill: "transparent", lineHeight: 1.3
      }),
      text({
        x: 310, y: 55, width: 100, height: 20,
        content: "🥂", fontSize: 18, textAlign: "center", fill: "transparent"
      }),
      text({
        x: 310, y: 80, width: 100, height: 40,
        content: "11:00\nKhai tiệc",
        fontSize: 10, fontFamily: "Montserrat", textAlign: "center", color: "#444444", fill: "transparent", lineHeight: 1.3
      })
    ]
  },
  {
    id: "dresscode_minimal",
    name: "Gợi ý màu trang phục (Dresscode)",
    type: "dresscode",
    thumbnail: "👔",
    elements: [
      text({
        x: 20, y: 15, width: 400, height: 25,
        content: "Dresscode",
        fontSize: 18, fontFamily: "Dancing Script", fontWeight: "bold",
        textAlign: "center", color: "#444444", fill: "transparent"
      }),
      shape("circle", { x: 75, y: 55, width: 45, height: 45, fill: "#4A6FA5", stroke: "transparent" }), 
      shape("circle", { x: 155, y: 55, width: 45, height: 45, fill: "#2D2D2D", stroke: "transparent" }), 
      shape("circle", { x: 235, y: 55, width: 45, height: 45, fill: "#F4EBE1", stroke: "#dddddd", strokeWidth: 1 }), 
      shape("circle", { x: 315, y: 55, width: 45, height: 45, fill: "#FFFFFF", stroke: "#dddddd", strokeWidth: 1 })  
    ]
  },
  {
    id: "intro_modern_typography",
    name: "Mở đầu Typography Hiện Đại",
    type: "intro",
    thumbnail: "✨",
    elements: [
      text({
        x: 40, y: 30, width: 340, height: 25,
        content: "THE WEDDING OF",
        fontSize: 12, fontFamily: "Montserrat", fontWeight: "bold",
        textAlign: "center", color: "#666666", fill: "transparent", letterSpacing: 5
      }),
      text({
        x: 40, y: 65, width: 340, height: 60,
        content: "Minh Quân & Linh Chi",
        fontSize: 26, fontFamily: "Playfair Display", fontWeight: "bold",
        textAlign: "center", color: "#1a1a1a", fill: "transparent"
      }),
      shape("line", { x: 150, y: 140, width: 120, height: 1, stroke: "#a64b2a", strokeWidth: 1.5, fill: "transparent" }),
      text({
        x: 40, y: 160, width: 340, height: 25,
        content: "SAVE OUR DATE",
        fontSize: 11, fontFamily: "Montserrat",
        textAlign: "center", color: "#8b5a2b", fill: "transparent", letterSpacing: 3
      }),
      text({
        x: 40, y: 195, width: 340, height: 40,
        content: "OCTOBER | 24 | 2026",
        fontSize: 16, fontFamily: "Oswald", fontWeight: "bold",
        textAlign: "center", color: "#1a1a1a", fill: "transparent", letterSpacing: 1
      }),
      text({
        x: 40, y: 245, width: 340, height: 20,
        content: "Tại Trung tâm Hội nghị Gem Center, TP. HCM",
        fontSize: 11, fontFamily: "Montserrat", fontStyle: "italic",
        textAlign: "center", color: "#555555", fill: "transparent"
      })
    ]
  },
  {
    id: "couple_photo_collage",
    name: "Album Grid Trái Tim & Đa Ảnh",
    type: "couple",
    thumbnail: "📸",
    elements: [
      img("https://images.pexels.com/photos/1488315/pexels-photo-1488315.jpeg?auto=compress&cs=tinysrgb&w=800", {
        x: 130, y: 90, width: 160, height: 200 
      }),
      img("https://images.pexels.com/photos/1488312/pexels-photo-1488312.jpeg?auto=compress&cs=tinysrgb&w=800", {
        x: 30, y: 30, width: 85, height: 85 
      }),
      img("https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800", {
        x: 305, y: 30, width: 85, height: 85
      }),
      img("https://images.pexels.com/photos/1488313/pexels-photo-1488313.jpeg?auto=compress&cs=tinysrgb&w=800", {
        x: 30, y: 205, width: 85, height: 85
      }),
      img("https://images.pexels.com/photos/1435635/pexels-photo-1435635.jpeg?auto=compress&cs=tinysrgb&w=800", {
        x: 305, y: 205, width: 85, height: 85
      }),
      text({
        x: 40, y: 305, width: 340, height: 30,
        content: "You are my everything Heart 💞",
        fontSize: 14, fontFamily: "Dancing Script",
        textAlign: "center", color: "#e07a5f", fill: "transparent"
      })
    ]
  },
  {
    id: "family_luxury_gold",
    name: "Gia Đình Hai Bên Bản Sang Trọng",
    type: "family",
    thumbnail: "👑",
    elements: [
      shape("rect", {
        x: 20, y: 20, width: 380, height: 160,
        fill: "transparent", stroke: "#d4af37", strokeWidth: 1
      }),
      text({
        x: 40, y: 35, width: 140, height: 25,
        content: "HỌ NHÀ TRAI",
        fontSize: 13, fontFamily: "Cinzel", fontWeight: "bold",
        textAlign: "center", color: "#d4af37", fill: "transparent", letterSpacing: 1
      }),
      text({
        x: 40, y: 70, width: 140, height: 60,
        content: "ST: Nguyễn Lâm Thao\nHiền thê: Lâm Thị Mỹ",
        fontSize: 11, fontFamily: "Montserrat",
        textAlign: "center", color: "#333333", fill: "transparent", lineHeight: 1.5
      }),
      text({
        x: 40, y: 135, width: 140, height: 25,
        content: "Trưởng nam: ĐỨC DUY",
        fontSize: 11, fontFamily: "Montserrat", fontWeight: "bold",
        textAlign: "center", color: "#a64b2a", fill: "transparent"
      }),
      shape("line", { x: 210, y: 35, width: 1, height: 120, stroke: "#d4af37", strokeWidth: 0.5, fill: "transparent", opacity: 0.6 }),
      text({
        x: 240, y: 35, width: 140, height: 25,
        content: "HỌ NHÀ GÁI",
        fontSize: 13, fontFamily: "Cinzel", fontWeight: "bold",
        textAlign: "center", color: "#d4af37", fill: "transparent", letterSpacing: 1
      }),
      text({
        x: 240, y: 70, width: 140, height: 60,
        content: "ST: Quách Hoàng Hải\nHiền thê: Trần Thu Nga",
        fontSize: 11, fontFamily: "Montserrat",
        textAlign: "center", color: "#333333", fill: "transparent", lineHeight: 1.5
      }),
      text({
        x: 240, y: 135, width: 140, height: 25,
        content: "Ái nữ: MINH HUYỀN",
        fontSize: 11, fontFamily: "Montserrat", fontWeight: "bold",
        textAlign: "center", color: "#a64b2a", fill: "transparent"
      })
    ]
  },
  {
    id: "intro_timeline_detailed",
    name: "Lịch Trình Chi Tiết Đầy Đủ (4 Bước)",
    type: "intro",
    thumbnail: "📅",
    elements: [
      text({
        x: 20, y: 15, width: 400, height: 25,
        content: "CHƯƠNG TRÌNH TIỆC",
        fontSize: 14, fontFamily: "Montserrat", fontWeight: "bold",
        textAlign: "center", color: "#333333", fill: "transparent", letterSpacing: 3
      }),
      text({ x: 30, y: 55, width: 80, height: 25, content: "🕊️", fontSize: 16, textAlign: "center", fill: "transparent" }),
      text({ x: 30, y: 85, width: 80, height: 35, content: "17:30\nĐón Khách", fontSize: 9, fontFamily: "Montserrat", textAlign: "center", color: "#555555", fill: "transparent", lineHeight: 1.3 }),
      text({ x: 125, y: 55, width: 80, height: 25, content: "📸", fontSize: 16, textAlign: "center", fill: "transparent" }),
      text({ x: 125, y: 85, width: 80, height: 35, content: "18:00\nChụp Ảnh", fontSize: 9, fontFamily: "Montserrat", textAlign: "center", color: "#555555", fill: "transparent", lineHeight: 1.3 }),
      text({ x: 220, y: 55, width: 80, height: 25, content: "🎼", fontSize: 16, textAlign: "center", fill: "transparent" }),
      text({ x: 220, y: 85, width: 80, height: 35, content: "18:30\nLàm Lễ", fontSize: 9, fontFamily: "Montserrat", textAlign: "center", color: "#555555", fill: "transparent", lineHeight: 1.3 }),
      text({ x: 315, y: 55, width: 80, height: 25, content: "🍽️", fontSize: 16, textAlign: "center", fill: "transparent" }),
      text({ x: 315, y: 85, width: 80, height: 35, content: "19:00\nKhai Tiệc", fontSize: 9, fontFamily: "Montserrat", textAlign: "center", color: "#555555", fill: "transparent", lineHeight: 1.3 })
    ]
  },
  {
    id: "dresscode_autumn_forest",
    name: "Dresscode Tone Thu Ấm (Autumn)",
    type: "dresscode",
    thumbnail: "🍁",
    elements: [
      text({
        x: 20, y: 15, width: 400, height: 25,
        content: "D R E S S C O D E",
        fontSize: 13, fontFamily: "Montserrat", fontWeight: "bold",
        textAlign: "center", color: "#8b5a2b", fill: "transparent"
      }),
      shape("circle", { x: 50, y: 50, width: 40, height: 40, fill: "#6B2D1C", stroke: "transparent" }),
      shape("circle", { x: 125, y: 50, width: 40, height: 40, fill: "#C97A3E", stroke: "transparent" }), 
      shape("circle", { x: 200, y: 50, width: 40, height: 40, fill: "#E3B448", stroke: "transparent" }), 
      shape("circle", { x: 275, y: 50, width: 40, height: 40, fill: "#3A5A40", stroke: "transparent" }),
      shape("circle", { x: 350, y: 50, width: 40, height: 40, fill: "#E6D8B8", stroke: "transparent" }) 
    ]
  },
  {
    id: "dresscode_pastel_dream",
    name: "Dresscode Tone Pastel Ngọt Ngào",
    type: "dresscode",
    thumbnail: "🌸",
    elements: [
      text({
        x: 20, y: 15, width: 400, height: 25,
        content: "DRESS CODE GỢI Ý",
        fontSize: 12, fontFamily: "Montserrat", fontWeight: "bold",
        textAlign: "center", color: "#a5a5a5", fill: "transparent", letterSpacing: 2
      }),
      shape("circle", { x: 80, y: 50, width: 45, height: 45, fill: "#FBC4AB", stroke: "transparent" }), 
      shape("circle", { x: 155, y: 50, width: 45, height: 45, fill: "#FFDDA2", stroke: "transparent" }), 
      shape("circle", { x: 230, y: 50, width: 45, height: 45, fill: "#C1DBE3", stroke: "transparent" }), 
      shape("circle", { x: 305, y: 50, width: 45, height: 45, fill: "#E8D7F1", stroke: "transparent" })  
    ]
  }
];

interface Props {
  onAddElements: (els: Omit<EditorElement, "id" | "zIndex">[], grouped: boolean) => void;
}

export default function PresetPanelContent({ onAddElements }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPresets = PRESETS.filter(
    (p) => selectedCategory === "all" || p.type === selectedCategory
  );

  return (
    <div className="flex flex-col gap-4 font-sans text-[#f5e6d3]">
      <p className="text-xs text-[#f5e6d3]/60 leading-relaxed">
        Nhấp để thêm nhóm thành phần vào canvas. Sau khi thêm, dùng nút <strong className="text-[#d4af37]">Bỏ nhóm</strong> trong danh sách lớp bên phải để tách từng đối tượng.
      </p>
      <div className="flex flex-wrap gap-1.5 pb-2 border-b border-[#2a252c]">
        {PRESET_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 text-[10px] font-semibold rounded-full border transition-all ${
              selectedCategory === cat.id
                ? "bg-[#d4af37] border-[#d4af37] text-[#141215]"
                : "border-[#d4af37]/30 text-[#f5e6d3]/70 hover:border-[#d4af37] hover:text-[#d4af37]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-1">
        {filteredPresets.map((preset) => (
          <div
            key={preset.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-[#2a252c] bg-[#1c181e]/60 hover:bg-[#2a252c]/40 hover:border-[#d4af37]/50 transition-all group"
          >
            <div className="w-9 h-9 rounded-md bg-[#2a252c] flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
              {preset.thumbnail}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] font-bold text-[#f5e6d3] truncate">{preset.name}</h4>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`inline-block px-1.5 py-0.5 text-[9px] font-semibold rounded border ${TYPE_BADGE_COLOR[preset.type]}`}
                >
                  {TYPE_LABEL[preset.type]}
                </span>
                <span className="text-[9px] text-[#f5e6d3]/40">
                  {preset.elements.length} đối tượng
                </span>
              </div>
            </div>
            <button
              onClick={() => onAddElements(preset.elements, true)}
              title="Thêm vào canvas (theo nhóm)"
              className="p-1.5 rounded-full bg-[#d4af37]/10 hover:bg-[#d4af37]/25 text-[#d4af37] transition-all shrink-0"
            >
              <Plus size={14} />
            </button>
          </div>
        ))}

        {filteredPresets.length === 0 && (
          <div className="text-center py-8 text-xs text-[#f5e6d3]/40">
            Chưa có mẫu preset nào trong danh mục này.
          </div>
        )}
      </div>
    </div>
  );
}
