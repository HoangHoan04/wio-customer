import { Sparkles } from "lucide-react";
import ComingSoon from "../components/ComingSoon";
import type {
  EditorElement,
  EditorTool,
  InvitationEffects,
  TextPreset,
  WidgetConfig,
  WidgetType,
} from "../types";
import { DEFAULT_INVITATION_EFFECTS } from "../utils/invitation-effects";
import BackgroundPanelContent from "./BackgroundPanelContent";
import EffectPanelContent from "./EffectPanelContent";
import ImageUploadContent from "./ImageUploadContent";
import MusicPanelContent from "./MusicPanelContent";
import PresetPanelContent from "./PresetPanelContent";
import PropertyPanelContent from "./PropertyPanelContent";
import ShapePanelContent from "./ShapePanelContent";
import StockPanelContent from "./StockPanelContent";
import TextPanelContent from "./TextPanelContent";
import UtilityPanelContent from "./UtilityPanelContent";

export default function PanelContent({
  tool,
  elements,
  selectedElement,
  canvasBackground,
  backgroundOpacity,
  onUpdateElement,
  onUpdateWidgetConfig,
  onDeleteElement,
  onDeleteElements,
  onSetBackground,
  onSetBackgroundOpacity,
  onAddText,
  onAddShape,
  onSelect,
  onAlignElement,
  onAddImageToCanvas,
  selectedCanvasImageUrl,
  onDeselectImage,
  selectedAudio,
  onSelectAudio,
  onAddElements,
  onUngroupElements,
  onUpdateElements,
  effects,
  onUpdateEffects,
  onReplayIntro,
}: {
  tool: EditorTool;
  elements: EditorElement[];
  selectedElement: EditorElement | null;
  canvasBackground: string;
  backgroundOpacity?: number;
  onUpdateElement: (id: string, updates: Partial<EditorElement>) => void;
  onUpdateWidgetConfig: (
    widgetType: WidgetType,
    enabled: boolean,
    updates?: Partial<WidgetConfig>,
  ) => void;
  onDeleteElement: (id: string) => void;
  onDeleteElements?: (ids: string[]) => void;
  onSelect?: (id: string | null) => void;
  onSetBackground: (color: string) => void;
  onSetBackgroundOpacity?: (opacity: number) => void;
  onAddText: (preset?: TextPreset) => void;
  onAddShape: (type: string) => void;
  onAlignElement?: (
    id: string,
    align: { h?: "left" | "center" | "right"; v?: "top" | "middle" | "bottom" },
  ) => void;
  onAddImageToCanvas: (
    url: string,
    settings?: {
      width?: number;
      height?: number;
      opacity?: number;
      borderRadius?: number;
      shadowBlur?: number;
      shadowColor?: string;
    },
  ) => void;
  selectedCanvasImageUrl?: string | null;
  onDeselectImage?: () => void;
  selectedAudio?: {
    id: string;
    name: string;
    url?: string;
    duration: string;
    source?: "admin" | "user";
  } | null;
  onSelectAudio?: (
    audio: {
      id: string;
      name: string;
      url?: string;
      duration: string;
      source?: "admin" | "user";
    } | null,
  ) => void;
  onAddElements?: (
    els: Omit<EditorElement, "id" | "zIndex">[],
    grouped: boolean,
  ) => void;
  onUngroupElements?: (groupId: string) => void;
  onUpdateElements?: (
    updater: EditorElement[] | ((prev: EditorElement[]) => EditorElement[]),
  ) => void;
  effects?: InvitationEffects;
  onUpdateEffects?: (effects: InvitationEffects) => void;
  onReplayIntro?: () => void;
}) {
  switch (tool) {
    case "text":
      return (
        <TextPanelContent
          selectedElement={selectedElement}
          onUpdate={onUpdateElement}
          onDelete={onDeleteElement}
          onAddText={onAddText}
          elements={elements}
          onSelect={onSelect}
          onAlignElement={onAlignElement}
        />
      );
    case "uploads":
      return (
        <ImageUploadContent
          onAddImageToCanvas={onAddImageToCanvas}
          selectedCanvasImageUrl={selectedCanvasImageUrl}
          onDeselect={onDeselectImage}
          selectedElement={selectedElement}
          onUpdateElement={onUpdateElement}
          elements={elements}
          onDeleteElement={onDeleteElement}
          onDeleteElements={onDeleteElements}
        />
      );
    case "shape":
      return (
        <ShapePanelContent
          elements={elements}
          selectedElement={selectedElement}
          onUpdate={onUpdateElement}
          onDelete={onDeleteElement}
          onAddShape={onAddShape}
          onSelect={onSelect}
        />
      );
    case "background":
      return (
        <BackgroundPanelContent
          canvasBackground={canvasBackground}
          backgroundOpacity={backgroundOpacity ?? 1}
          onSetBackground={onSetBackground}
          onSetBackgroundOpacity={onSetBackgroundOpacity ?? (() => {})}
          bgType={"color"}
        />
      );
    case "stock":
      return (
        <StockPanelContent
          onAddImageToCanvas={onAddImageToCanvas}
          selectedCanvasImageUrl={selectedCanvasImageUrl}
          onDeselect={onDeselectImage}
          selectedElement={selectedElement}
          onUpdateElement={onUpdateElement}
          elements={elements}
          onDeleteElement={onDeleteElement}
          onDeleteElements={onDeleteElements}
        />
      );
    case "music":
      return (
        <MusicPanelContent
          elements={elements}
          selectedAudio={selectedAudio ?? null}
          onSelectAudio={onSelectAudio ?? (() => {})}
          onUpdateWidgetConfig={onUpdateWidgetConfig}
        />
      );
    case "utility":
      return (
        <UtilityPanelContent
          elements={elements}
          selectedElement={selectedElement}
          onUpdateWidgetConfig={onUpdateWidgetConfig}
          onSelect={onSelect}
        />
      );
    case "preset":
      return <PresetPanelContent onAddElements={onAddElements ?? (() => {})} />;
    case "template":
      return <ComingSoon icon={Sparkles} text="Hiệu ứng động cho thiệp" />;
    case "effect":
      return (
        <EffectPanelContent
          effects={effects ?? DEFAULT_INVITATION_EFFECTS}
          onChange={onUpdateEffects ?? (() => {})}
          onReplayIntro={onReplayIntro ?? (() => {})}
        />
      );
    case "property":
      return (
        <PropertyPanelContent
          elements={elements}
          selectedElementId={selectedElement?.id ?? null}
          onSelectElement={onSelect ?? (() => {})}
          onUpdateElements={onUpdateElements ?? (() => {})}
          onUngroupElements={onUngroupElements}
        />
      );
    default:
      return null;
  }
}
