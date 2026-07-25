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
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { weddingService } from "@/services/wedding.service";
import Modal from "@/components/ui/Modal";
import tokenCache from "@/utils/token-cache";
import Input from "@/templates/customer-design/ui/input/Input";
import Button from "@/templates/customer-design/ui/button/Button";

const CANVAS_WIDTH = 440;
const DEFAULT_CANVAS_HEIGHT = 956;

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

function DesignEditorContent() {
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
  const [gridType, setGridType] = useState<"lines" | "dots">("lines");
  const [gridSize, setGridSize] = useState<number>(40);
  const [projectName, setProjectName] = useState("Thiết kế của tôi");

  const dragStartPositions = useRef<Record<string, { x: number; y: number }>>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const weddingId = searchParams.get("weddingId") || searchParams.get("id");
  const [wedding, setWedding] = useState<any>(null);
  const [showInitModal, setShowInitModal] = useState(false);
  const [showPublishConfirmModal, setShowPublishConfirmModal] = useState(false);
  const [initForm, setInitForm] = useState({
    groomShortName: "",
    brideShortName: "",
    slug: "",
  });

  useEffect(() => {
    if (initForm.groomShortName || initForm.brideShortName) {
      const suggested = slugify(initForm.groomShortName + "-" + initForm.brideShortName);
      setInitForm((f) => ({ ...f, slug: suggested }));
    } else if (projectName && projectName !== "Thiết kế của tôi") {
      setInitForm((f) => ({ ...f, slug: slugify(projectName) }));
    }
  }, [initForm.groomShortName, initForm.brideShortName, projectName]);
  const [saving, setSaving] = useState(false);

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
        const target = e.target as HTMLElement;
        if (target.closest("input, textarea, select, [contenteditable]")) return;
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
    updateElements((prev) => [
      ...prev,
      { ...newEl, zIndex: Math.max(0, ...prev.map((e) => e.zIndex || 0)) + 1 },
    ]);
    setSelectedElementId(newEl.id);
    setSelectedTool("text");
  }, [updateElements]);

  const handleAddShape = useCallback(
    (type: string) => {
      const newEl = createDefaultShape(crypto.randomUUID(), type as any);
      updateElements((prev) => [
        ...prev,
        { ...newEl, zIndex: Math.max(0, ...prev.map((e) => e.zIndex || 0)) + 1 },
      ]);
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
        zIndex: Math.max(0, ...elements.map((e) => e.zIndex || 0)) + 1,
      };
      updateElements((prev) => [...prev, configured]);
      setSelectedElementId(configured.id);
      setSelectedCanvasImageUrl(url);
      setSelectedTool("uploads");
    },
    [updateElements, elements]
  );

  const handleDragMove = useCallback(
    (id: string, x: number, y: number) => {
      const el = elements.find((e) => e.id === id);
      if (!el?.groupId) return;

      const groupMembers = elements.filter((e) => e.groupId === el.groupId);
      if (!dragStartPositions.current[el.groupId]) {
        const startMap: Record<string, { x: number; y: number }> = {};
        groupMembers.forEach((m) => { startMap[m.id] = { x: m.x, y: m.y }; });
        dragStartPositions.current[el.groupId] = { x: el.x, y: el.y };
        groupMembers.forEach((m) => {
          dragStartPositions.current[`${el.groupId}:${m.id}`] = { x: m.x, y: m.y };
        });
      }

      const draggedStart = dragStartPositions.current[`${el.groupId}:${id}`];
      if (!draggedStart) return;

      const dx = x - draggedStart.x;
      const dy = y - draggedStart.y;

      updateElements((prev) =>
        prev.map((e) => {
          if (e.groupId !== el.groupId || e.id === id) return e;
          const memberStart = dragStartPositions.current[`${el.groupId}:${e.id}`];
          if (!memberStart) return e;
          return { ...e, x: memberStart.x + dx, y: memberStart.y + dy };
        })
      );
    },
    [elements, updateElements]
  );

  const handleDragEnd = useCallback(
    (id: string, x: number, y: number) => {
      const el = elements.find((e) => e.id === id);
      if (el?.groupId) {
        const draggedStart = dragStartPositions.current[`${el.groupId}:${id}`];
        const dx = draggedStart ? x - draggedStart.x : 0;
        const dy = draggedStart ? y - draggedStart.y : 0;
        delete dragStartPositions.current[el.groupId];
        elements
          .filter((e) => e.groupId === el.groupId)
          .forEach((m) => delete dragStartPositions.current[`${el.groupId}:${m.id}`]);

        updateElements((prev) =>
          prev.map((e) => {
            if (e.groupId !== el.groupId) return e;
            if (e.id === id) return { ...e, x, y, frameAlignH: undefined, frameAlignV: undefined };
            return { ...e, frameAlignH: undefined, frameAlignV: undefined };
          })
        );
      } else {
        handleUpdateElement(id, { x, y, frameAlignH: undefined, frameAlignV: undefined });
      }
    },
    [elements, handleUpdateElement, updateElements]
  );

  const handleTransformEnd = useCallback(
    (
      id: string,
      attrs: { x: number; y: number; width: number; height: number; rotation: number }
    ) => {
      handleUpdateElement(id, { ...attrs, frameAlignH: undefined, frameAlignV: undefined });
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

  const handleAddElements = useCallback(
    (templateEls: Omit<EditorElement, "id" | "zIndex">[], grouped: boolean) => {
      const maxZ = Math.max(0, ...elements.map((e) => e.zIndex || 0));
      const groupId = grouped ? crypto.randomUUID() : undefined;
      const newEls = templateEls.map((el, i) => ({
        ...el,
        id: crypto.randomUUID(),
        zIndex: maxZ + i + 1,
        ...(groupId ? { groupId } : {}),
      })) as EditorElement[];
      updateElements((prev) => [...prev, ...newEls]);
      if (newEls.length > 0) setSelectedElementId(newEls[newEls.length - 1].id);
    },
    [elements, updateElements]
  );

  const handleUngroupElements = useCallback(
    (groupId: string) => {
      updateElements((prev) =>
        prev.map((el) =>
          el.groupId === groupId ? { ...el, groupId: undefined } : el
        )
      );
    },
    [updateElements]
  );

  const handleAlignElement = useCallback(
    (id: string, align: { h?: "left" | "center" | "right"; v?: "top" | "middle" | "bottom" }) => {
      const el = elements.find((e) => e.id === id);
      if (!el) return;
      const updates: Partial<EditorElement> = {};

      const paddingLeft = el.paddingLeft ?? 0;
      const paddingRight = el.paddingRight ?? 0;
      const paddingTop = el.paddingTop ?? 0;
      const paddingBottom = el.paddingBottom ?? 0;

      const groupW = el.width + paddingLeft + paddingRight;
      const groupH = el.height + paddingTop + paddingBottom;

      if (align.h) {
        updates.frameAlignH = align.h;
        if (align.h === "left") {
          updates.x = paddingLeft;
        }
        if (align.h === "center") {
          const visualX = (CANVAS_WIDTH - groupW) / 2;
          updates.x = visualX + paddingLeft;
        }
        if (align.h === "right") {
          const visualX = CANVAS_WIDTH - groupW;
          updates.x = visualX + paddingLeft;
        }
      }
      if (align.v) {
        updates.frameAlignV = align.v;
        if (align.v === "top") {
          updates.y = paddingTop;
        }
        if (align.v === "middle") {
          const visualY = (canvasHeight - groupH) / 2;
          updates.y = visualY + paddingTop;
        }
        if (align.v === "bottom") {
          const visualY = canvasHeight - groupH;
          updates.y = visualY + paddingTop;
        }
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
            width:
              widgetType === "calendar" || widgetType === "youtube"
                ? 380
                : widgetType === "call"
                  ? 60
                  : 280,
            height:
              widgetType === "music"
                ? 60
                : widgetType === "calendar"
                  ? 240
                  : widgetType === "call"
                    ? 180
                    : widgetType === "map" || widgetType === "youtube" || widgetType === "gallery"
                      ? 280
                      : 120,
            zIndex: Math.max(0, ...elements.map((e) => e.zIndex || 0)) + 1,
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

  const handleInitWedding = async (action: "draft" | "publish") => {
    if (!initForm.groomShortName || !initForm.brideShortName || !initForm.slug) {
      showToast({ message: "Vui lòng nhập đầy đủ thông tin", type: "warning" });
      return;
    }

    setSaving(true);
    try {
      const user = tokenCache.getUser();
      const payload = {
        userId: user?.id || "",
        groomName: initForm.groomShortName,
        groomShortName: initForm.groomShortName,
        brideName: initForm.brideShortName,
        brideShortName: initForm.brideShortName,
        slug: initForm.slug,
        ceremonyVenue: "Chưa thiết lập",
        ceremonyAddress: "Chưa thiết lập",
        ceremonyAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        musicAutoplay: true,
        status: "DRAFT",
        customDesign: {
          elements,
          canvasBackground,
          backgroundOpacity,
          canvasHeight,
          projectName,
        },
      };

      const res = await weddingService.createWedding(payload);
      const newWedding = res?.data || res;
      const newId = newWedding?.id;
      if (newId) {
        if (action === "publish") {
          await weddingService.publishWedding(newId);
          showToast({ message: "Xuất bản thiệp cưới thành công", type: "success" });
          window.open(`/thiep/${initForm.slug}`, "_blank");
        } else {
          showToast({ message: "Đã lưu bản nháp thành công", type: "success" });
        }
        setShowInitModal(false);
        router.replace(`/design?id=${newId}`);
      }
    } catch (err: any) {
      console.error(err);
      showToast({
        message: err?.response?.data?.message || "Không thể tạo thiệp cưới",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = useCallback(async () => {
    const payload = {
      elements,
      canvasBackground,
      backgroundOpacity,
      canvasHeight,
      projectName,
    };

    localStorage.setItem("wio_design_draft", JSON.stringify(payload));

    if (weddingId) {
      setSaving(true);
      try {
        await weddingService.updateWedding(weddingId, {
          customDesign: payload,
        });
        showToast({
          title: "Đã lưu",
          message: "Thiết kế đã được lưu thành công lên máy chủ",
          type: "success",
          timeout: 1500,
        });
      } catch (err: any) {
        console.error(err);
        showToast({
          title: "Lỗi",
          message: err?.response?.data?.message || "Không thể lưu lên máy chủ",
          type: "error",
        });
      } finally {
        setSaving(false);
      }
    } else {
      showToast({
        title: "Đã lưu nháp",
        message: "Đã lưu nháp trên thiết bị của bạn. Vui lòng thiết lập thông tin thiệp để lưu trực tuyến.",
        type: "info",
        timeout: 2500,
      });
    }
  }, [elements, canvasBackground, backgroundOpacity, canvasHeight, projectName, weddingId, showToast]);

  const executePublishOrSave = async (action: "draft" | "publish") => {
    if (!weddingId) return;
    setSaving(true);
    try {
      const payload = {
        elements,
        canvasBackground,
        backgroundOpacity,
        canvasHeight,
        projectName,
      };

      await weddingService.updateWedding(weddingId, {
        customDesign: payload,
      });

      if (action === "publish") {
        await weddingService.publishWedding(weddingId);
        const currentWedding = wedding || (await weddingService.getWeddingById(weddingId));
        const slug = currentWedding?.slug || currentWedding?.data?.slug;
        showToast({
          title: "Xuất bản thành công",
          message: "Thiệp cưới của bạn đã được xuất bản!",
          type: "success",
        });
        if (slug) {
          window.open(`/thiep/${slug}`, "_blank");
        }
      } else {
        await weddingService.unpublishWedding(weddingId);
        showToast({
          title: "Đã lưu nháp",
          message: "Thiệp cưới đã được lưu ở trạng thái bản nháp!",
          type: "success",
        });
      }
      setShowPublishConfirmModal(false);
    } catch (err: any) {
      console.error(err);
      showToast({
        title: "Thất bại",
        message: err?.response?.data?.message || "Thao tác không thành công",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = useCallback(async () => {
    if (!weddingId) {
      if (!initForm.slug) {
        setInitForm(f => ({
          ...f,
          slug: slugify(projectName) || "thiep-cuoi"
        }));
      }
      setShowInitModal(true);
      return;
    }

    setShowPublishConfirmModal(true);
  }, [weddingId, projectName, initForm.slug]);

  const handleZoomToFit = useCallback(() => {
    setZoom(100);
  }, []);

  const handleZoom100 = useCallback(() => {
    setZoom(100);
  }, []);

  useEffect(() => {
    if (weddingId) {
      weddingService
        .getWeddingById(weddingId)
        .then((res) => {
          const wData = res?.data || res;
          if (wData) {
            setWedding(wData);
            setProjectName(wData.groomShortName + " & " + wData.brideShortName);
            if (wData.customDesign) {
              const parsed = typeof wData.customDesign === "string"
                ? JSON.parse(wData.customDesign)
                : wData.customDesign;
              if (parsed.elements) {
                replacePresent(parsed.elements);
                setElements(parsed.elements);
              }
              if (parsed.canvasBackground) setCanvasBackground(parsed.canvasBackground);
              if (parsed.backgroundOpacity !== undefined) setBackgroundOpacity(parsed.backgroundOpacity);
              if (parsed.canvasHeight) setCanvasHeight(parsed.canvasHeight);
            }
          }
        })
        .catch((err) => {
          console.error(err);
          showToast({ message: "Không thể tải thông tin thiệp cưới", type: "error" });
        });
    } else {
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
      } catch (err) {
        console.error(err);
      }
    }
  }, [weddingId, replacePresent]);

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
        gridType={gridType}
        onGridTypeChange={setGridType}
        gridSize={gridSize}
        onGridSizeChange={setGridSize}
        projectName={projectName}
        onProjectNameChange={setProjectName}
        showBottomBar={showBottomBar}
        onToggleBottomBar={() => setShowBottomBar((v) => !v)}
        showLeftBar={showLeftBar}
        onToggleLeftBar={() => setShowLeftBar((v) => !v)}
        showRightBar={showRightBar}
        onToggleRightBar={() => setShowRightBar((v) => !v)}
        onOpenPreview={() => {
          const data = {
            elements,
            canvasBackground,
            backgroundOpacity,
            canvasHeight,
            projectName,
          };
          localStorage.setItem("wio_design_draft", JSON.stringify(data));
          const titleParam = encodeURIComponent(projectName);
          window.open(`/preview/design?title=${titleParam}`, "_blank");
        }}
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
            onAddElements={handleAddElements}
            onUngroupElements={handleUngroupElements}
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
          onDragMove={handleDragMove}
          onTransformEnd={handleTransformEnd}
          onHeightChange={setCanvasHeight}
          showGrid={showGrid}
          gridType={gridType}
          gridSize={gridSize}
        />

        {showRightBar && (
          <RightPanel
            sharedToCommunity={sharedToCommunity}
            onToggleShareToCommunity={() => setSharedToCommunity((v) => !v)}
            elements={elements}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElements={updateElements}
            onUngroupElements={handleUngroupElements}
          />
        )}
      </div>

      <Modal
        isOpen={showInitModal}
        onClose={() => {
          if (weddingId) {
            setShowInitModal(false);
          } else {
            router.push("/my-templates");
          }
        }}
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-4 py-4 text-[#f5e6d3] font-sans">
          <h2 className="text-lg font-bold text-[#d4af37]">Thiết lập thiệp cưới tự thiết kế</h2>
          <p className="text-xs text-[#f5e6d3]/60">
            Vui lòng nhập các thông tin cơ bản sau để khởi tạo thiệp cưới của bạn trong hệ thống.
          </p>

          <div className="flex flex-col gap-1.5">
            <Input
              type="text"
              label="Tên chú rể (viết tắt)"
              value={initForm.groomShortName}
              onChange={(e) => setInitForm((f) => ({ ...f, groomShortName: e.target.value }))}
              placeholder="Ví dụ: Hoàng Anh"
              className="bg-[#1a0a0f] border-[#d4af37]/35 text-[#f5e6d3]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Input
              type="text"
              label="Tên cô dâu (viết tắt)"
              value={initForm.brideShortName}
              onChange={(e) => setInitForm((f) => ({ ...f, brideShortName: e.target.value }))}
              placeholder="Ví dụ: Mai Chi"
              className="bg-[#1a0a0f] border-[#d4af37]/35 text-[#f5e6d3]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-[2px] uppercase text-[#d4af37] select-none">
              Đường dẫn thiệp (Slug)
            </label>
            <div className="flex items-center gap-1 bg-[#1a0a0f] border border-[#d4af37]/35 rounded-md px-3">
              <span className="text-xs text-[#f5e6d3]/40 select-none">/thiep/</span>
              <input
                type="text"
                value={initForm.slug}
                onChange={(e) =>
                  setInitForm((f) => ({
                    ...f,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  }))
                }
                placeholder="hoanganh-maichi"
                className="bg-transparent border-none text-[#f5e6d3] text-sm outline-none flex-1 py-2.5 placeholder:text-[#6b5743]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                if (weddingId) {
                  setShowInitModal(false);
                } else {
                  router.push("/my-templates");
                }
              }}
              className="px-4 py-2 text-xs"
            >
              Hủy
            </Button>
            <Button
              variant="outline"
              onClick={() => handleInitWedding("draft")}
              disabled={saving}
              className="px-4 py-2 text-xs border-[#d4af37]/40 text-[#d4af37]"
            >
              Lưu bản nháp
            </Button>
            <Button
              variant="primary"
              onClick={() => handleInitWedding("publish")}
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold"
            >
              Xuất bản ngay
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showPublishConfirmModal}
        onClose={() => setShowPublishConfirmModal(false)}
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-4 py-4 text-[#f5e6d3] font-sans">
          <h2 className="text-lg font-bold text-[#d4af37]">Lưu và Xuất bản thiệp</h2>
          <p className="text-sm text-[#f5e6d3]/80">
            Bạn muốn lưu thiết kế này dưới dạng bản nháp trực tuyến hay xuất bản chính thức luôn?
          </p>
          <div className="flex items-center justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowPublishConfirmModal(false)}
              className="px-4 py-2 text-xs"
            >
              Hủy
            </Button>
            <Button
              variant="outline"
              onClick={() => executePublishOrSave("draft")}
              disabled={saving}
              className="px-4 py-2 text-xs border-[#d4af37]/40 text-[#d4af37]"
            >
              Lưu bản nháp
            </Button>
            <Button
              variant="primary"
              onClick={() => executePublishOrSave("publish")}
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold"
            >
              Xuất bản ngay
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function DesignEditorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0508] flex items-center justify-center text-[#f5e6d3] font-sans">Đang tải thiết kế...</div>}>
      <DesignEditorContent />
    </Suspense>
  );
}
