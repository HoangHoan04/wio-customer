import { Lunar, Solar } from "lunar-javascript";

export const formatDate = (dateStr?: string | Date): string => {
  if (!dateStr) return "";
  try {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "";
  }
};

export const formatTime = (dateStr?: string | Date): string => {
  if (!dateStr) return "";
  try {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return "";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch {
    return "";
  }
};

export const formatDateTime = (dateStr?: string | Date): string => {
  if (!dateStr) return "";
  try {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return "";
  }
};

export const getLunarDateStr = (dateStr?: string | Date): string => {
  if (!dateStr) return "";
  try {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return "";
    const solar = Solar.fromDate(date);
    const lunar = Lunar.fromSolar(solar);
    return `Ngày ${lunar.getDay()} tháng ${lunar.getMonth()} âm lịch`;
  } catch {
    return "";
  }
};

export const getWeekday = (dateStr?: string | Date): string => {
  if (!dateStr) return "";
  try {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("vi-VN", { weekday: "long" });
  } catch {
    return "";
  }
};

export const getDayStr = (dateStr?: string | Date): string => {
  if (!dateStr) return "";
  try {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return "";
    return date.getDate().toString().padStart(2, "0");
  } catch {
    return "";
  }
};

export const getMonthStr = (dateStr?: string | Date): string => {
  if (!dateStr) return "";
  try {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return "";
    return (date.getMonth() + 1).toString().padStart(2, "0");
  } catch {
    return "";
  }
};

export const getYearStr = (dateStr?: string | Date): string => {
  if (!dateStr) return "";
  try {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return "";
    return date.getFullYear().toString();
  } catch {
    return "";
  }
};

export const getStartEmptyDays = (dateStr?: string | Date) => {
  if (!dateStr) return 0;
  try {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return 0;
    const firstDay = date.getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  } catch {
    return 0;
  }
};

export const formatDateToVietnamese = (dateStr?: string | Date): string => {
  if (!dateStr) return "";
  try {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return "";
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day} tháng ${month}, ${year}`;
  } catch {
    return "";
  }
};

export const capitalizeFirstLetter = (val: string): string => {
  if (!val) return "";
  return val.charAt(0).toUpperCase() + val.slice(1);
};

export const sortAndMapTimeline = (items: any[]): any[] => {
  if (!items) return [];
  return [...items]
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((t) => ({
      id: t.id || Date.now().toString(),
      time: t.time || "",
      title: t.title || "",
    }));
};

export const sortAndMapEvents = (items: any[]): any[] => {
  if (!items) return [];
  return [...items]
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((e) => ({
      id: e.id || Date.now().toString(),
      date: e.date || "",
      time: e.time || "",
      title: e.title || "",
      address: e.address || "",
    }));
};

export const formatTime2Digit = (dateStr?: string | Date, fallback: string = "11:30"): string => {
  if (!dateStr) return fallback;
  try {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return fallback;
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return fallback;
  }
};

export const formatDateISO = (dateStr?: string | Date): string => {
  if (!dateStr) return "";
  try {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
};
