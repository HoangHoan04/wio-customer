"use client";

import { Button } from "@/components/ui/button";
import Switch from "@/components/ui/switch";
import {
  DEFAULT_SECTION_ORDER,
  SECTION_FLAG_MAP,
  SECTION_LABELS,
} from "@/templates/shared/constants/sections";
import type { SectionId } from "@/templates/shared/types/preset-theme.types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo } from "react";

type SectionConfigMap = Record<string, boolean | { enabled: boolean; order?: number; variant?: string }>;

interface SectionLayoutPanelProps {
  sectionOrder: SectionId[];
  sectionConfig: SectionConfigMap;
  onChange: (next: { sectionOrder: SectionId[]; sectionConfig: SectionConfigMap }) => void;
}

const FLAG_BY_SECTION = Object.entries(SECTION_FLAG_MAP).reduce(
  (acc, [sectionId, flag]) => {
    if (flag) acc[sectionId as SectionId] = flag;
    return acc;
  },
  {} as Record<SectionId, string>,
);

export function SectionLayoutPanel({
  sectionOrder,
  sectionConfig,
  onChange,
}: SectionLayoutPanelProps) {
  const orderedSections = useMemo(() => {
    const base = sectionOrder.length ? sectionOrder : DEFAULT_SECTION_ORDER;
    const seen = new Set<SectionId>();
    const list: SectionId[] = [];
    for (const id of base) {
      if (seen.has(id)) continue;
      seen.add(id);
      list.push(id);
    }
    for (const id of DEFAULT_SECTION_ORDER) {
      if (!seen.has(id)) list.push(id);
    }
    return list;
  }, [sectionOrder]);

  const isEnabled = (sectionId: SectionId) => {
    const flag = FLAG_BY_SECTION[sectionId];
    if (!flag) return true;
    const value = sectionConfig[flag];
    if (typeof value === "boolean") return value;
    if (value && typeof value === "object") return value.enabled !== false;
    return true;
  };

  const setEnabled = (sectionId: SectionId, enabled: boolean) => {
    const flag = FLAG_BY_SECTION[sectionId];
    if (!flag) return;
    const current = sectionConfig[flag];
    const order =
      typeof current === "object" && current?.order !== undefined
        ? current.order
        : orderedSections.indexOf(sectionId);
    onChange({
      sectionOrder: orderedSections,
      sectionConfig: {
        ...sectionConfig,
        [flag]: { enabled, order },
      },
    });
  };

  const move = (sectionId: SectionId, direction: -1 | 1) => {
    const idx = orderedSections.indexOf(sectionId);
    const target = idx + direction;
    if (idx < 0 || target < 0 || target >= orderedSections.length) return;
    const nextOrder = [...orderedSections];
    [nextOrder[idx], nextOrder[target]] = [nextOrder[target], nextOrder[idx]];
    const nextConfig = { ...sectionConfig };
    nextOrder.forEach((id, order) => {
      const flag = FLAG_BY_SECTION[id];
      if (!flag) return;
      const current = nextConfig[flag];
      if (typeof current === "object") {
        nextConfig[flag] = { ...current, order };
      } else {
        nextConfig[flag] = { enabled: current !== false, order };
      }
    });
    onChange({ sectionOrder: nextOrder, sectionConfig: nextConfig });
  };

  return (
    <div className="rounded-2xl border border-[#D9CDBE] bg-[#F3EDE3] p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#2D231F]">Bố cục thiệp</h3>
        <p className="text-xs text-[#6B5A4E]">
          Bật/tắt và sắp xếp thứ tự các phần hiển thị trên thiệp.
        </p>
      </div>
      <div className="space-y-2">
        {orderedSections.map((sectionId) => {
          const flag = FLAG_BY_SECTION[sectionId];
          const canToggle = !!flag;
          return (
            <div
              key={sectionId}
              className="flex items-center justify-between rounded-xl border border-[#E2D6C6] bg-white px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => move(sectionId, -1)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => move(sectionId, 1)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm font-medium text-[#2D231F]">
                  {SECTION_LABELS[sectionId]}
                </span>
              </div>
              {canToggle ? (
                <Switch
                  checked={isEnabled(sectionId)}
                  onChange={(checked: boolean) => setEnabled(sectionId, checked)}
                />
              ) : (
                <span className="text-xs text-[#9A8778]">Cố định</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function buildExtendedSectionConfig(
  formData: Record<string, any>,
  sectionOrder: SectionId[],
): SectionConfigMap {
  const flags = {
    showHero: !!formData.showHeroImage,
    showIntro: !!formData.showIntro,
    showGallery: !!formData.showGallery,
    showCountdown: !!formData.showCountdown,
    showMap: !!formData.showMap,
    showDressCode: !!formData.showDressCode,
    showTimeline: !!formData.showTimeline,
    showRsvp: !!formData.showRsvp,
    showGuestbook: !!formData.showGuestbook,
    showGifts: true,
    showThankYou: !!formData.showThankYou,
    guestbookStatic: !!formData.guestbookStatic,
    guestbookFloating: !!formData.guestbookFloating,
  };

  const config: SectionConfigMap = {};
  sectionOrder.forEach((sectionId, order) => {
    const flag = SECTION_FLAG_MAP[sectionId];
    if (!flag) return;
    config[flag] = {
      enabled: flags[flag as keyof typeof flags] !== false,
      order,
    };
  });

  Object.entries(flags).forEach(([flag, enabled]) => {
    if (!(flag in config)) {
      config[flag] = { enabled, order: sectionOrder.length + 1 };
    }
  });

  return config;
}
