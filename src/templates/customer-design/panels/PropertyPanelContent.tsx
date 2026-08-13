import type { EditorElement } from "../types";
import LayersPanelContent from "./LayersPanelContent";

export default function PropertyPanelContent({
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElements,
  onUngroupElements,
}: {
  elements: EditorElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElements: (
    updater: EditorElement[] | ((prev: EditorElement[]) => EditorElement[]),
  ) => void;
  onUngroupElements?: (groupId: string) => void;
}) {
  return (
    <LayersPanelContent
      elements={elements}
      selectedElementId={selectedElementId}
      onSelectElement={onSelectElement}
      onUpdateElements={onUpdateElements}
      onUngroupElements={onUngroupElements}
    />
  );
}
