"use client";

import { useToast } from "@/hooks/useToast";
import {
  createDefaultImage,
  createDefaultShape,
  createDefaultText,
} from "@/templates/customer-design/utils/constants";
import { useEditorHistory } from "@/templates/customer-design/hooks/useEditorHistory";
import type { EditorElement, EditorTool, WidgetConfig, WidgetType } from "@/templates/customer-design/types";
import BottomToolbar from "@/templates/customer-design/BottomToolbar";
import Canvas from "@/templates/customer-design/Canvas";
import LeftToolbar from "@/templates/customer-design/LeftToolbar";
import RightPanel from "@/templates/customer-design/RightPanel";
import TopBar from "@/templates/customer-design/TopBar";
import { useCallback, useEffect, useMemo, useState } from "react";

const CANVAS_WIDTH = 440;
const DEFAULT_CANVAS_HEIGHT = 956;

export default function DesignEditorPage() {
  const { showToast } = useToast();
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<EditorTool | null>("template");
  const [canvasBackground, setCanvasBackground] = useState("#FDFBF7");
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [canvasHeight, setCanvasHeight] = useState(DEFAULT_CANVAS_HEIGHT);
  const [sharedToCommunity, setSharedToCommunity] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<{
    id: string;
    name: string;
    url?: string;
    duration: string;
    source?: "admin" | "user";
  } | null>(null);
  const [selectedCanvasImageUrl, setSelectedCanvasImageUrl] = useState<string | null>(null);
  const [showLeftBar, setShowLeftBar] = useState(true);
  const [showRightBar, setShowRightBar] = useState(true);
  const [showBottomBar, setShowBottomBar] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [projectName, setProjectName] = useState("Thiết kế của tôi");

  const { present, pushHistory, canUndo, canRedo, undo, redo, replacePresent } = useEditorHistory(
    elements
  );

  useEffect(() => {
    if (present !== elements) {
      setElements(present);
    }
  }, [present]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) redo();
        } else {
          if (canUndo) undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedElementId) {
          handleDeleteElement(selectedElementId);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canUndo, canRedo, undo, redo, selectedElementId]);

  const selectedElement = useMemo(
    () => elements.find((el) => el.id === selectedElementId) || null,
    [elements, selectedElementId]
  );

  const updateElements = useCallback(
    (updater: EditorElement[] | ((prev: EditorElement[]) => EditorElement[])) => {
      const next = typeof updater === "function" ? updater(elements) : updater;
      setElements(next);
      pushHistory(next);
    },
    [elements, pushHistory]
  );

  const handleUpdateElement = useCallback(
    (id: string, updates: Partial<EditorElement>) => {
      updateElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
      );
    },
    [updateElements]
  );

  const handleDeleteElement = useCallback(
    (id: string) => {
      updateElements((prev) => prev.filter((el) => el.id !== id));
      if (selectedElementId === id) setSelectedElementId(null);
    },
    [updateElements, selectedElementId]
  );

  const handleDeleteElements = useCallback(
    (ids: string[]) => {
      updateElements((prev) => prev.filter((el) => !ids.includes(el.id)));
      if (selectedElementId && ids.includes(selectedElementId)) setSelectedElementId(null);
    },
    [updateElements, selectedElementId]
  );

  const handleAddText = useCallback(() => {
    const newEl = createDefaultText(crypto.randomUUID());
    updateElements((prev) => [...prev, { ...newEl, zIndex: prev.length + 1 }]);
    setSelectedElementId(newEl.id);
    setSelectedTool("text");
  }, [updateElements]);

  const handleAddShape = useCallback(
    (type: string) => {
      const newEl = createDefaultShape(crypto.randomUUID(), type as any);
      updateElements((prev) => [...prev, { ...newEl, zIndex: prev.length + 1 }]);
      setSelectedElementId(newEl.id);
      setSelectedTool("shape");
    },
    [updateElements]
  );

  const handleAddImageToCanvas = useCallback(
    (
      url: string,
      settings?: {
        width?: number;
        height?: number;
        opacity?: number;
        borderRadius?: number;
        shadowBlur?: number;
        shadowColor?: string;
      }
    ) => {
      const newEl = createDefaultImage(crypto.randomUUID(), url);
      const configured = {
        ...newEl,
        ...(settings?.width && { width: settings.width }),
        ...(settings?.height && { height: settings.height }),
        ...(settings?.opacity !== undefined && { opacity: settings.opacity }),
        ...(settings?.borderRadius !== undefined && {
          borderRadiusTopLeft: settings.borderRadius,
          borderRadiusTopRight: settings.borderRadius,
          borderRadiusBottomLeft: settings.borderRadius,
          borderRadiusBottomRight: settings.borderRadius,
        }),
        ...(settings?.shadowBlur !== undefined && { shadowBlur: settings.shadowBlur }),
        ...(settings?.shadowColor !== undefined && { shadowColor: settings.shadowColor }),
        zIndex: elements.length + 1,
      };
      updateElements((prev) => [...prev, configured]);
      setSelectedElementId(configured.id);
      setSelectedCanvasImageUrl(url);
      setSelectedTool("uploads");
    },
    [updateElements, elements.length]
  );

  const handleDragEnd = useCallback(
    (id: string, x: number, y: number) => {
      handleUpdateElement(id, { x, y });
    },
    [handleUpdateElement]
  );

  const handleTransformEnd = useCallback(
    (
      id: string,
      attrs: { x: number; y: number; width: number; height: number; rotation: number }
    ) => {
      handleUpdateElement(id, attrs);
    },
    [handleUpdateElement]
  );

  const handleBringToFront = useCallback(() => {
    if (!selectedElementId) return;
    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    handleUpdateElement(selectedElementId, { zIndex: maxZ + 1 });
  }, [elements, handleUpdateElement, selectedElementId]);

  const handleSendToBack = useCallback(() => {
    if (!selectedElementId) return;
    const minZ = elements.reduce((min, el) => Math.min(min, el.zIndex), 0);
    handleUpdateElement(selectedElementId, { zIndex: minZ - 1 });
  }, [elements, handleUpdateElement, selectedElementId]);

  const handleBringForward = useCallback(() => {
    if (!selectedElementId) return;
    const el = elements.find((e) => e.id === selectedElementId);
    if (!el) return;
    handleUpdateElement(selectedElementId, { zIndex: el.zIndex + 1 });
  }, [elements, handleUpdateElement, selectedElementId]);

  const handleSendBackward = useCallback(() => {
    if (!selectedElementId) return;
    const el = elements.find((e) => e.id === selectedElementId);
    if (!el) return;
    handleUpdateElement(selectedElementId, { zIndex: el.zIndex - 1 });
  }, [elements, handleUpdateElement, selectedElementId]);

  const handleDuplicate = useCallback(() => {
    if (!selectedElementId) return;
    const el = elements.find((e) => e.id === selectedElementId);
    if (!el) return;
    const newEl = {
      ...el,
      id: crypto.randomUUID(),
      x: el.x + 20,
      y: el.y + 20,
      zIndex: Math.max(...elements.map((e) => e.zIndex), 0) + 1,
    };
    updateElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
  }, [elements, selectedElementId, updateElements]);

  const handleAlignElement = useCallback(
    (id: string, align: { h?: "left" | "center" | "right"; v?: "top" | "middle" | "bottom" }) => {
      const el = elements.find((e) => e.id === id);
      if (!el) return;
      const updates: Partial<EditorElement> = {};
      if (align.h) {
        updates.textAlign = align.h;
        if (align.h === "left") updates.x = 0;
        if (align.h === "center") updates.x = (CANVAS_WIDTH - el.width) / 2;
        if (align.h === "right") updates.x = CANVAS_WIDTH - el.width;
      }
      if (align.v) {
        updates.verticalAlign = align.v;
        if (align.v === "top") updates.y = 0;
        if (align.v === "middle") updates.y = (canvasHeight - el.height) / 2;
        if (align.v === "bottom") updates.y = canvasHeight - el.height;
      }
      handleUpdateElement(id, updates);
    },
    [elements, canvasHeight, handleUpdateElement]
  );

  const handleUpdateWidgetConfig = useCallback(
    (widgetType: WidgetType, enabled: boolean, updates?: Partial<WidgetConfig>) => {
      const existing = elements.find((el) => el.type === "widget" && el.widgetType === widgetType);
      if (enabled) {
        if (existing) {
          handleUpdateElement(existing.id, {
            widgetConfig: { ...existing.widgetConfig, ...updates },
          });
        } else {
          const newEl: EditorElement = {
            ...createDefaultText(crypto.randomUUID()),
            type: "widget",
            widgetType: widgetType,
            widgetConfig: {
              ...(widgetType === "music" && selectedAudio
                ? {
                    audioEnabled: true,
                    audioUrl: selectedAudio.url,
                    songTitle: selectedAudio.name,
                    audioSource: selectedAudio.source,
                    iconId: "music-1",
                    color: "#d4af37",
                  }
                : {}),
              ...updates,
            },
            x: 20,
            y: 20,
            width: 280,
            height: widgetType === "music" ? 60 : 120,
            zIndex: elements.length + 1,
          };
          updateElements((prev) => [...prev, newEl]);
          setSelectedElementId(newEl.id);
        }
      } else if (existing) {
        handleDeleteElement(existing.id);
      }
    },
    [elements, handleUpdateElement, handleDeleteElement, updateElements, selectedAudio]
  );

  const handleSave = useCallback(() => {
    try {
      const payload = {
        elements,
        canvasBackground,
        backgroundOpacity,
        canvasHeight,
        projectName,
      };
      localStorage.setItem("wio_design_draft", JSON.stringify(payload));
      showToast({
        title: "Đã lưu",
        message: "Thiết kế đã được lưu nháp",
        type: "success",
        timeout: 1500,
      });
    } catch {
      showToast({
        title: "Lỗi",
        message: "Không thể lưu thiết kế",
        type: "error",
      });
    }
  }, [elements, canvasBackground, backgroundOpacity, canvasHeight, projectName, showToast]);

  const handlePublish = useCallback(() => {
    showToast({
      title: "Thông báo",
      message: "Chức năng xuất bản đang được hoàn thiện",
      type: "info",
    });
  }, [showToast]);

  const handleZoomToFit = useCallback(() => {
    setZoom(100);
  }, []);

  const handleZoom100 = useCallback(() => {
    setZoom(100);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wio_design_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.elements) {
          replacePresent(parsed.elements);
          setElements(parsed.elements);
        }
        if (parsed.canvasBackground) setCanvasBackground(parsed.canvasBackground);
        if (parsed.backgroundOpacity !== undefined) setBackgroundOpacity(parsed.backgroundOpacity);
        if (parsed.canvasHeight) setCanvasHeight(parsed.canvasHeight);
        if (parsed.projectName) setProjectName(parsed.projectName);
      }
    } catch {
      // ignore corrupted draft
    }
  }, [replacePresent]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#0a0508] overflow-hidden">
      <TopBar
        zoom={zoom}
        onZoomChange={setZoom}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onSave={handleSave}
        onPublish={handlePublish}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid((v) => !v)}
        projectName={projectName}
        onProjectNameChange={setProjectName}
        showBottomBar={showBottomBar}
        onToggleBottomBar={() => setShowBottomBar((v) => !v)}
        showLeftBar={showLeftBar}
        onToggleLeftBar={() => setShowLeftBar((v) => !v)}
        showRightBar={showRightBar}
        onToggleRightBar={() => setShowRightBar((v) => !v)}
      />

      {showBottomBar && (
        <BottomToolbar
          selectedElement={selectedElement}
          onBringToFront={handleBringToFront}
          onSendToBack={handleSendToBack}
          onBringForward={handleBringForward}
          onSendBackward={handleSendBackward}
          onDuplicate={handleDuplicate}
          onDelete={() => selectedElementId && handleDeleteElement(selectedElementId)}
          onZoomToFit={handleZoomToFit}
          onZoom100={handleZoom100}
          zoom={zoom}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {showLeftBar && (
          <LeftToolbar
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
            selectedElement={selectedElement}
            canvasBackground={canvasBackground}
            backgroundOpacity={backgroundOpacity}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            onDeleteElements={handleDeleteElements}
            onSetBackground={(value) => setCanvasBackground(value)}
            onSetBackgroundOpacity={setBackgroundOpacity}
            onAddImageToCanvas={handleAddImageToCanvas}
            selectedCanvasImageUrl={selectedCanvasImageUrl}
            onDeselectImage={() => setSelectedCanvasImageUrl(null)}
            onAddText={handleAddText}
            onAddShape={handleAddShape}
            elements={elements}
            onUpdateWidgetConfig={handleUpdateWidgetConfig}
            onSelectElement={setSelectedElementId}
            onAlignElement={handleAlignElement}
            selectedAudio={selectedAudio}
            onSelectAudio={setSelectedAudio}
          />
        )}

        <Canvas
          elements={elements}
          selectedElementId={selectedElementId}
          canvasBackground={canvasBackground}
          backgroundOpacity={backgroundOpacity}
          zoom={zoom}
          canvasWidth={CANVAS_WIDTH}
          canvasHeight={canvasHeight}
          onSelect={setSelectedElementId}
          onUpdate={handleUpdateElement}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
          onHeightChange={setCanvasHeight}
        />

        {showRightBar && (
          <RightPanel
            sharedToCommunity={sharedToCommunity}
            onToggleShareToCommunity={() => setSharedToCommunity((v) => !v)}
          />
        )}
      </div>
    </div>
  );
}
