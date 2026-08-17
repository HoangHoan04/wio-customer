import {
  useEnvelopeState,
  useThemeAudio,
  useThemeFonts,
} from "../../../shared/hooks/useThemeRuntime";
import type { PresetThemeConfig } from "../../../shared/types/preset-theme.types";
import type { ThemeRenderProps, ThemeRuntime } from "./types";

export function createThemeHook(config: PresetThemeConfig) {
  return function useTheme(props: ThemeRenderProps): ThemeRuntime {
    useThemeFonts(config.googleFontsUrl);

    const previewMode = !!(props.isHoverPreview || props.isPreview);
    const { isEnvelopeOpen, openEnvelope } = useEnvelopeState(previewMode);
    const { isPlaying, playMusic, toggleAudio } = useThemeAudio(
      props.data as { musicUrl?: string },
    );

    const showEnvelope =
      config.layout.envelopeStyle !== "none" && !isEnvelopeOpen && !previewMode;
    const showContent = isEnvelopeOpen || previewMode;

    const handleOpen = () => {
      openEnvelope();
      playMusic();
    };

    return {
      isEnvelopeOpen,
      openEnvelope: handleOpen,
      isPlaying,
      playMusic,
      toggleAudio,
      showEnvelope,
      showContent,
    };
  };
}
