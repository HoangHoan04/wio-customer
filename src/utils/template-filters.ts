import type { ITemplate } from "@/services/template.service";

export const PUBLIC_TEMPLATE_WHERE = { isDeleted: false } as const;

export function filterPublicTemplates(
  templates: (ITemplate & { isDeleted?: boolean })[] = [],
): ITemplate[] {
  return templates.filter(
    (template) =>
      template.themeCode !== "CUSTOM_DESIGN" && template.isDeleted !== true,
  );
}
