export interface ThemeTemplateConfig {
  code: string;
  slug?: string;
  name?: string;
  colors: {
    background: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    envelope: string;
    buttonBg: string;
    buttonText: string;
  };
  fonts: {
    heading: string;
    body: string;
    script?: string;
  };
  styles?: {
    heroBackgroundBlendMode?:
      | "multiply"
      | "overlay"
      | "normal"
      | "luminosity"
      | "color-burn";
    heroBackgroundOpacity?: string;
  };
}
