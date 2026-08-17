import type {
  PresetThemeConfig,
  PresetThemeRenderData,
} from "../../../shared/types/preset-theme.types";

export interface ThemeRenderProps {
  data: PresetThemeRenderData;
  isHoverPreview?: boolean;
  isPreview?: boolean;
}

export interface ThemeRuntime {
  isEnvelopeOpen: boolean;
  openEnvelope: () => void;
  isPlaying: boolean;
  playMusic: () => void;
  toggleAudio: () => void;
  showEnvelope: boolean;
  showContent: boolean;
}

export interface ThemeModule {
  code: string;
  slug: string;
  aliases?: string[];
  config: PresetThemeConfig;
  useTheme: (props: ThemeRenderProps) => ThemeRuntime;
  Render: React.ComponentType<ThemeRenderProps>;
}

export type { PresetThemeConfig, PresetThemeRenderData };
