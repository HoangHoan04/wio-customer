"use client";

import { PUBLIC_ROUTES } from "@/common/routes";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/hooks/useToast";
import { Monitor } from "lucide-react";
import {
  cardTypeService,
  FALLBACK_CARD_TYPES,
  type ICardType,
} from "@/services/card-type.service";
import { invitationService } from "@/services/invitation.service";
import { templateService } from "@/services/template.service";
import BottomToolbar from "@/templates/customer-design/BottomToolbar";
import Canvas from "@/templates/customer-design/Canvas";
import { useEditorHistory } from "@/templates/customer-design/hooks/useEditorHistory";
import LeftToolbar from "@/templates/customer-design/LeftToolbar";
import RightPanel from "@/templates/customer-design/RightPanel";
import TopBar from "@/templates/customer-design/TopBar";
import type {
  EditorElement,
  EditorTool,
  InvitationEffects,
  TextPreset,
  WidgetConfig,
  WidgetType,
} from "@/templates/customer-design/types";
import Button from "@/templates/customer-design/ui/button/Button";
import Input from "@/templates/customer-design/ui/input/Input";
import {
  createDefaultImage,
  createDefaultShape,
  createDefaultText,
  WIDGET_DEFAULT_SIZE,
} from "@/templates/customer-design/utils/constants";
import {
  fitImageToCanvas,
  loadImageSize,
} from "@/templates/customer-design/utils/image-fit";
import {
  DEFAULT_INVITATION_EFFECTS,
  normalizeEffects,
} from "@/templates/customer-design/utils/invitation-effects";
import {
  ensureEditorFonts,
  measureTextBox,
  shouldRefitTextHeight,
} from "@/templates/customer-design/utils/text-fit";
import {
  buildCanvasInvitationPayload,
  invitationLabel,
  publicInvitationPath,
} from "@/utils/invitation-mapper";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

function matchCardType(
  raw: string | null | undefined,
  types: ICardType[],
): string {
  if (!raw) return "CUSTOM";
  const found = types.find(
    (item) =>
      item.code.toLowerCase() === raw.toLowerCase() ||
      item.slug.toLowerCase() === raw.toLowerCase(),
  );
  return found?.code || "CUSTOM";
}

function toValidSlug(text: string): string {
  let slug = slugify(text) || "thiep";
  if (slug.length < 5) slug = `${slug}-thiep`;
  if (!/^[a-z0-9]/.test(slug)) slug = `t${slug}`;
  if (!/[a-z0-9]$/.test(slug)) slug = `${slug}0`;
  return slug.slice(0, 60);
}

async function ensureAvailableSlug(base: string): Promise<string> {
  const root = toValidSlug(base);
  const trySlug = async (slug: string) => {
    const res = await invitationService.checkSlug(slug);
    return res?.data?.available !== false;
  };
  if (await trySlug(root)) return root;
  for (let i = 2; i <= 20; i++) {
    const candidate = toValidSlug(`${root}-${i}`);
    if (await trySlug(candidate)) return candidate;
  }
  return toValidSlug(`${root}-${Date.now().toString(36)}`);
}

async function resolveCustomDesignTemplateId(): Promise<string | undefined> {
  try {
    const res = await templateService.getTemplates({
      skip: 0,
      take: 1,
      where: { themeCode: "CUSTOM_DESIGN" },
    });
    return res.data?.[0]?.id;
  } catch {
    return undefined;
  }
}

function DesignEditorContent() {
  const { showToast } = useToast();
  const [elements, setElements] = useState<EditorElement[]>([]);
  const elementsRef = useRef(elements);
  elementsRef.current = elements;
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );
  const [selectedTool, setSelectedTool] = useState<EditorTool | null>(
    "template",
  );
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
  const [selectedCanvasImageUrl, setSelectedCanvasImageUrl] = useState<
    string | null
  >(null);
  const [showLeftBar, setShowLeftBar] = useState(true);
  const [showRightBar, setShowRightBar] = useState(true);
  const [showBottomBar, setShowBottomBar] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [gridType, setGridType] = useState<"lines" | "dots">("lines");
  const [gridSize, setGridSize] = useState<number>(40);
  const [projectName, setProjectName] = useState("Thiết kế của tôi");
  const [effects, setEffects] = useState<InvitationEffects>(
    DEFAULT_INVITATION_EFFECTS,
  );
  const [introReplayKey, setIntroReplayKey] = useState(0);
  const [autoEditTextId, setAutoEditTextId] = useState<string | null>(null);

  const dragStartPositions = useRef<Record<string, { x: number; y: number }>>(
    {},
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationId =
    searchParams.get("invitationId") || searchParams.get("id");
  const [invitation, setInvitation] = useState<any>(null);
  const [showInitModal, setShowInitModal] = useState(false);
  const [showPublishConfirmModal, setShowPublishConfirmModal] = useState(false);
  const [showMobileWarningModal, setShowMobileWarningModal] = useState(false);
  const [cardTypes, setCardTypes] = useState<ICardType[]>(FALLBACK_CARD_TYPES);
  const [initForm, setInitForm] = useState({
    title: "",
    slug: "",
    cardType: "CUSTOM",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setShowLeftBar(false);
        setShowRightBar(false);
        const fitZoom = Math.min(
          100,
          Math.max(
            30,
            Math.round(((window.innerWidth - 32) / CANVAS_WIDTH) * 100),
          ),
        );
        setZoom(fitZoom);

        const dismissed = sessionStorage.getItem(
          "invigo_design_mobile_warning_dismissed",
        );
        if (!dismissed) {
          setShowMobileWarningModal(true);
        }
      }
    }
  }, []);

  const urlCardType = searchParams.get("cardType") || searchParams.get("type");

  useEffect(() => {
    cardTypeService
      .listActive()
      .then(setCardTypes)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setInitForm((f) => ({
      ...f,
      cardType: matchCardType(urlCardType, cardTypes),
    }));
  }, [urlCardType, cardTypes]);

  useEffect(() => {
    if (initForm.title) {
      setInitForm((f) => ({ ...f, slug: toValidSlug(initForm.title) }));
    }
  }, [initForm.title]);
  const [saving, setSaving] = useState(false);

  const { present, pushHistory, canUndo, canRedo, undo, redo, replacePresent } =
    useEditorHistory(elements);

  useEffect(() => {
    if (present !== elements) {
      setElements(present);
    }
  }, [present]);

  useEffect(() => {
    ensureEditorFonts();
  }, []);

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
        if (target.closest("input, textarea, select, [contenteditable]"))
          return;
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
    [elements, selectedElementId],
  );

  const updateElements = useCallback(
    (
      updater: EditorElement[] | ((prev: EditorElement[]) => EditorElement[]),
    ) => {
      const prev = elementsRef.current;
      const next = typeof updater === "function" ? updater(prev) : updater;
      elementsRef.current = next;
      setElements(next);
      pushHistory(next);
    },
    [pushHistory],
  );

  const handleUpdateElement = useCallback(
    (id: string, updates: Partial<EditorElement>) => {
      updateElements((prev) =>
        prev.map((el) => {
          if (el.id !== id) return el;
          const next = { ...el, ...updates };
          if (next.type === "text" && shouldRefitTextHeight(updates)) {
            const { height } = measureTextBox(next, "wrap");
            return { ...next, height };
          }
          return next;
        }),
      );
    },
    [updateElements],
  );

  const handleDeleteElement = useCallback(
    (id: string) => {
      updateElements((prev) => prev.filter((el) => el.id !== id));
      if (selectedElementId === id) setSelectedElementId(null);
    },
    [updateElements, selectedElementId],
  );

  const handleDeleteElements = useCallback(
    (ids: string[]) => {
      updateElements((prev) => prev.filter((el) => !ids.includes(el.id)));
      if (selectedElementId && ids.includes(selectedElementId))
        setSelectedElementId(null);
    },
    [updateElements, selectedElementId],
  );

  const handleAddText = useCallback(
    (preset?: TextPreset) => {
      const newEl = createDefaultText(crypto.randomUUID(), preset);
      const maxWidth = CANVAS_WIDTH - 24;
      const fitted = measureTextBox(newEl, "hug", maxWidth);
      newEl.width = fitted.width;
      newEl.height = fitted.height;
      newEl.x = Math.round(Math.max(12, (CANVAS_WIDTH - newEl.width) / 2));
      newEl.y = Math.round(Math.max(12, canvasHeight * 0.2 - newEl.height / 2));
      updateElements((prev) => [
        ...prev,
        {
          ...newEl,
          zIndex: Math.max(0, ...prev.map((e) => e.zIndex || 0)) + 1,
        },
      ]);
      setSelectedElementId(newEl.id);
      setSelectedTool("text");
      setAutoEditTextId(newEl.id);
    },
    [updateElements, canvasHeight],
  );

  const handleAddShape = useCallback(
    (type: string) => {
      const newEl = createDefaultShape(crypto.randomUUID(), type as any);
      updateElements((prev) => [
        ...prev,
        {
          ...newEl,
          zIndex: Math.max(0, ...prev.map((e) => e.zIndex || 0)) + 1,
        },
      ]);
      setSelectedElementId(newEl.id);
      setSelectedTool("shape");
    },
    [updateElements],
  );

  const handleAddImageToCanvas = useCallback(
    async (
      url: string,
      settings?: {
        width?: number;
        height?: number;
        opacity?: number;
        borderRadius?: number;
        shadowBlur?: number;
        shadowColor?: string;
      },
    ) => {
      let width = settings?.width;
      let height = settings?.height;

      if (!width || !height) {
        const natural = await loadImageSize(url);
        ({ width, height } = fitImageToCanvas(
          natural.width,
          natural.height,
          CANVAS_WIDTH,
          canvasHeight,
        ));
      }

      const newEl = createDefaultImage(crypto.randomUUID(), url);
      const configured = {
        ...newEl,
        width,
        height,
        ...(settings?.opacity !== undefined && { opacity: settings.opacity }),
        ...(settings?.borderRadius !== undefined && {
          borderRadiusTopLeft: settings.borderRadius,
          borderRadiusTopRight: settings.borderRadius,
          borderRadiusBottomLeft: settings.borderRadius,
          borderRadiusBottomRight: settings.borderRadius,
        }),
        ...(settings?.shadowBlur !== undefined && {
          shadowBlur: settings.shadowBlur,
        }),
        ...(settings?.shadowColor !== undefined && {
          shadowColor: settings.shadowColor,
        }),
        zIndex: Math.max(0, ...elements.map((e) => e.zIndex || 0)) + 1,
      };
      updateElements((prev) => [...prev, configured]);
      setSelectedElementId(configured.id);
      setSelectedCanvasImageUrl(url);
    },
    [updateElements, elements, canvasHeight],
  );

  const handleDragMove = useCallback(
    (id: string, x: number, y: number) => {
      const el = elements.find((e) => e.id === id);
      if (!el?.groupId) return;

      const groupMembers = elements.filter((e) => e.groupId === el.groupId);
      if (!dragStartPositions.current[el.groupId]) {
        const startMap: Record<string, { x: number; y: number }> = {};
        groupMembers.forEach((m) => {
          startMap[m.id] = { x: m.x, y: m.y };
        });
        dragStartPositions.current[el.groupId] = { x: el.x, y: el.y };
        groupMembers.forEach((m) => {
          dragStartPositions.current[`${el.groupId}:${m.id}`] = {
            x: m.x,
            y: m.y,
          };
        });
      }

      const draggedStart = dragStartPositions.current[`${el.groupId}:${id}`];
      if (!draggedStart) return;

      const dx = x - draggedStart.x;
      const dy = y - draggedStart.y;

      updateElements((prev) =>
        prev.map((e) => {
          if (e.groupId !== el.groupId || e.id === id) return e;
          const memberStart =
            dragStartPositions.current[`${el.groupId}:${e.id}`];
          if (!memberStart) return e;
          return { ...e, x: memberStart.x + dx, y: memberStart.y + dy };
        }),
      );
    },
    [elements, updateElements],
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
          .forEach(
            (m) => delete dragStartPositions.current[`${el.groupId}:${m.id}`],
          );

        updateElements((prev) =>
          prev.map((e) => {
            if (e.groupId !== el.groupId) return e;
            if (e.id === id)
              return {
                ...e,
                x,
                y,
                frameAlignH: undefined,
                frameAlignV: undefined,
              };
            return { ...e, frameAlignH: undefined, frameAlignV: undefined };
          }),
        );
      } else {
        handleUpdateElement(id, {
          x,
          y,
          frameAlignH: undefined,
          frameAlignV: undefined,
        });
      }
    },
    [elements, handleUpdateElement, updateElements],
  );

  const handleTransformEnd = useCallback(
    (
      id: string,
      attrs: {
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
        fontSize?: number;
      },
    ) => {
      handleUpdateElement(id, {
        ...attrs,
        frameAlignH: undefined,
        frameAlignV: undefined,
      });
    },
    [handleUpdateElement],
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
    [elements, updateElements],
  );

  const handleUngroupElements = useCallback(
    (groupId: string) => {
      updateElements((prev) =>
        prev.map((el) =>
          el.groupId === groupId ? { ...el, groupId: undefined } : el,
        ),
      );
    },
    [updateElements],
  );

  const handleAlignElement = useCallback(
    (
      id: string,
      align: {
        h?: "left" | "center" | "right";
        v?: "top" | "middle" | "bottom";
      },
    ) => {
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
    [elements, canvasHeight, handleUpdateElement],
  );

  const handleUpdateWidgetConfig = useCallback(
    (
      widgetType: WidgetType,
      enabled: boolean,
      updates?: Partial<WidgetConfig>,
    ) => {
      const existing = elements.find(
        (el) => el.type === "widget" && el.widgetType === widgetType,
      );
      if (enabled) {
        if (existing) {
          handleUpdateElement(existing.id, {
            widgetConfig: { ...existing.widgetConfig, ...updates },
          });
        } else {
          const size = WIDGET_DEFAULT_SIZE[widgetType] || {
            width: 280,
            height: 120,
          };
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
                    color: "#2D231F",
                  }
                : {}),
              ...updates,
            },
            width: size.width,
            height: size.height,
            x: Math.round(Math.max(12, (CANVAS_WIDTH - size.width) / 2)),
            y: Math.round(Math.max(12, canvasHeight * 0.18)),
            zIndex: Math.max(0, ...elements.map((e) => e.zIndex || 0)) + 1,
          };
          updateElements((prev) => [...prev, newEl]);
          setSelectedElementId(newEl.id);
        }
      } else if (existing) {
        handleDeleteElement(existing.id);
      }
    },
    [
      elements,
      handleUpdateElement,
      handleDeleteElement,
      updateElements,
      selectedAudio,
      canvasHeight,
    ],
  );

  const buildDesignSnapshot = useCallback(
    () => ({
      elements,
      canvasBackground,
      backgroundOpacity,
      canvasHeight,
      projectName,
      effects,
    }),
    [
      elements,
      canvasBackground,
      backgroundOpacity,
      canvasHeight,
      projectName,
      effects,
    ],
  );

  const musicFromDesign = useCallback(() => {
    if (selectedAudio?.url) {
      return {
        url: selectedAudio.url,
        name: selectedAudio.name || "",
        type: "UPLOAD",
        autoplay: true,
      };
    }
    const musicEl = elements.find(
      (el) => el.type === "widget" && el.widgetType === "music",
    );
    const url = musicEl?.widgetConfig?.audioUrl;
    if (!url) return undefined;
    return {
      url,
      name: musicEl?.widgetConfig?.songTitle || "",
      type: "UPLOAD",
      autoplay: true,
    };
  }, [selectedAudio, elements]);

  const openInitModal = useCallback(() => {
    const title = projectName.trim() || "Thiệp của tôi";
    setInitForm({
      title,
      slug: toValidSlug(title),
      cardType: matchCardType(urlCardType, cardTypes),
    });
    setShowInitModal(true);
  }, [projectName, urlCardType, cardTypes]);

  const handleCreateInvitation = async (action: "draft" | "publish") => {
    const title = initForm.title.trim();
    if (!title || !initForm.slug.trim() || !initForm.cardType) {
      showToast({
        message: "Vui lòng nhập tên thiệp, đường dẫn và chọn loại thiệp",
        type: "warning",
      });
      return;
    }

    setSaving(true);
    try {
      const slug = await ensureAvailableSlug(initForm.slug);
      const templateId = await resolveCustomDesignTemplateId();
      const payload = buildCanvasInvitationPayload({
        cardType: initForm.cardType,
        title,
        slug,
        templateId,
        customDesign: buildDesignSnapshot(),
        music: musicFromDesign(),
      });

      const res = await invitationService.create(payload);
      const created = res?.data || res;
      const newId = created?.id;
      const publishedSlug = created?.slug || slug;
      if (!newId) {
        throw new Error("Không nhận được mã thiệp từ máy chủ");
      }

      if (action === "publish") {
        await invitationService.publish(newId);
        showToast({
          message: "Xuất bản thiệp thành công",
          type: "success",
        });
        window.open(publicInvitationPath(publishedSlug), "_blank");
      } else {
        showToast({ message: "Đã lưu bản nháp thành công", type: "success" });
      }
      setProjectName(title);
      setShowInitModal(false);
      localStorage.removeItem("invigo_design_draft");
      router.replace(`/design?id=${newId}`);
    } catch (err: any) {
      console.error(err);
      showToast({
        message: err?.response?.data?.message || "Không thể lưu thiệp",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = useCallback(async () => {
    const snapshot = buildDesignSnapshot();
    localStorage.setItem("invigo_design_draft", JSON.stringify(snapshot));

    if (!invitationId) {
      openInitModal();
      return;
    }

    setSaving(true);
    try {
      await invitationService.update(invitationId, {
        title: projectName.trim() || invitation?.title,
        customDesign: snapshot,
        music: musicFromDesign(),
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
  }, [
    buildDesignSnapshot,
    invitationId,
    openInitModal,
    projectName,
    invitation,
    musicFromDesign,
    showToast,
  ]);

  const executePublishOrSave = async (action: "draft" | "publish") => {
    if (!invitationId) return;
    setSaving(true);
    try {
      const snapshot = buildDesignSnapshot();
      await invitationService.update(invitationId, {
        title: projectName.trim() || invitation?.title,
        customDesign: snapshot,
        music: musicFromDesign(),
      });

      if (action === "publish") {
        await invitationService.publish(invitationId);
        const current =
          invitation || (await invitationService.findById(invitationId));
        const slug = current?.slug || current?.data?.slug;
        showToast({
          title: "Xuất bản thành công",
          message: "Thiệp của bạn đã được xuất bản!",
          type: "success",
        });
        if (slug) {
          window.open(publicInvitationPath(slug), "_blank");
        }
      } else {
        showToast({
          title: "Đã lưu nháp",
          message: "Thiệp đã được lưu ở trạng thái bản nháp!",
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
    if (!invitationId) {
      openInitModal();
      return;
    }

    setShowPublishConfirmModal(true);
  }, [invitationId, openInitModal]);

  const handleZoomToFit = useCallback(() => {
    setZoom(100);
  }, []);

  const handleZoom100 = useCallback(() => {
    setZoom(100);
  }, []);

  useEffect(() => {
    if (invitationId) {
      invitationService
        .findById(invitationId)
        .then((res) => {
          const data = res?.data || res;
          if (data) {
            setInvitation(data);
            setProjectName(invitationLabel(data));
            if (data.music?.url) {
              setSelectedAudio({
                id: data.music.url,
                name: data.music.name || "",
                url: data.music.url,
                duration: "",
                source: "admin",
              });
            }
            if (data.customDesign) {
              const parsed =
                typeof data.customDesign === "string"
                  ? JSON.parse(data.customDesign)
                  : data.customDesign;
              if (parsed.elements) {
                replacePresent(parsed.elements);
                setElements(parsed.elements);
              }
              if (parsed.canvasBackground)
                setCanvasBackground(parsed.canvasBackground);
              if (parsed.backgroundOpacity !== undefined)
                setBackgroundOpacity(parsed.backgroundOpacity);
              if (parsed.canvasHeight) setCanvasHeight(parsed.canvasHeight);
              if (parsed.effects) setEffects(normalizeEffects(parsed.effects));
            }
          }
        })
        .catch((err) => {
          console.error(err);
          showToast({
            message: "Không thể tải thiệp",
            type: "error",
          });
        });
    } else {
      try {
        const saved = localStorage.getItem("invigo_design_draft");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.elements) {
            replacePresent(parsed.elements);
            setElements(parsed.elements);
          }
          if (parsed.canvasBackground)
            setCanvasBackground(parsed.canvasBackground);
          if (parsed.backgroundOpacity !== undefined)
            setBackgroundOpacity(parsed.backgroundOpacity);
          if (parsed.canvasHeight) setCanvasHeight(parsed.canvasHeight);
          if (parsed.projectName) setProjectName(parsed.projectName);
          if (parsed.effects) setEffects(normalizeEffects(parsed.effects));
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [invitationId, replacePresent]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#F3EDE3] overflow-hidden">
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
            effects,
          };
          localStorage.setItem("invigo_design_draft", JSON.stringify(data));
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
          onDelete={() =>
            selectedElementId && handleDeleteElement(selectedElementId)
          }
          onZoomToFit={handleZoomToFit}
          onZoom100={handleZoom100}
          zoom={zoom}
        />
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {showLeftBar && (
          <div className="md:relative absolute z-40 inset-y-0 left-0 flex h-full shadow-2xl md:shadow-none bg-[#EDE4D5]">
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
              effects={effects}
              onUpdateEffects={setEffects}
              onReplayIntro={() => setIntroReplayKey((k) => k + 1)}
            />
          </div>
        )}

        {/* Mobile backdrop for LeftToolbar */}
        {showLeftBar && (
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowLeftBar(false)}
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
          autoEditTextId={autoEditTextId}
          onAutoEditConsumed={() => setAutoEditTextId(null)}
          onHeightChange={setCanvasHeight}
          showGrid={showGrid}
          gridType={gridType}
          gridSize={gridSize}
          effects={effects}
          introReplayKey={introReplayKey}
        />

        {showRightBar && (
          <div className="md:relative absolute z-40 inset-y-0 right-0 flex h-full shadow-2xl md:shadow-none bg-[#F3EDE3]">
            <RightPanel
              sharedToCommunity={sharedToCommunity}
              onToggleShareToCommunity={() => setSharedToCommunity((v) => !v)}
              elements={elements}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onUpdateElements={updateElements}
              onUngroupElements={handleUngroupElements}
              onClose={() => setShowRightBar(false)}
            />
          </div>
        )}

        {/* Mobile backdrop for RightPanel */}
        {showRightBar && (
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowRightBar(false)}
          />
        )}
      </div>

      <Modal
        isOpen={showInitModal}
        onClose={() => {
          if (invitationId) {
            setShowInitModal(false);
          } else {
            router.push("/my-templates");
          }
        }}
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-4 py-4 text-[#2D231F] font-sans">
          <h2 className="text-lg font-bold text-[#2D231F]">
            Lưu thiệp lên hệ thống
          </h2>
          <p className="text-xs text-[#2D231F]/60">
            Chọn loại thiệp, đặt tên và đường dẫn công khai. Tên cô dâu chú rể
            không bắt buộc — nội dung đã nằm trên bản thiết kế.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-[2px] uppercase text-[#2D231F] select-none">
              Loại thiệp
            </label>
            <select
              value={initForm.cardType}
              onChange={(e) =>
                setInitForm((f) => ({ ...f, cardType: e.target.value }))
              }
              className="h-11 px-3 rounded-md bg-[#F3EDE3] border border-[#2D231F]/35 text-[#2D231F] text-sm outline-none"
            >
              {cardTypes.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.nameVi}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Input
              type="text"
              label="Tên thiệp"
              value={initForm.title}
              onChange={(e) =>
                setInitForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Ví dụ: Thiệp mời An & Minh"
              className="bg-[#F3EDE3] border-[#2D231F]/35 text-[#2D231F]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-[2px] uppercase text-[#2D231F] select-none">
              Đường dẫn thiệp
            </label>
            <div className="flex items-center gap-1 bg-[#F3EDE3] border border-[#2D231F]/35 rounded-md px-3">
              <span className="text-xs text-[#2D231F]/40 select-none">
                /thiep/
              </span>
              <input
                type="text"
                value={initForm.slug}
                onChange={(e) =>
                  setInitForm((f) => ({
                    ...f,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, ""),
                  }))
                }
                placeholder="thiep-cua-toi"
                className="bg-transparent border-none text-[#2D231F] text-sm outline-none flex-1 py-2.5 placeholder:text-[#6b5743]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                if (invitationId) {
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
              onClick={() => handleCreateInvitation("draft")}
              disabled={saving}
              className="px-4 py-2 text-xs border-[#2D231F]/40 text-[#2D231F]"
            >
              Lưu bản nháp
            </Button>
            <Button
              variant="primary"
              onClick={() => handleCreateInvitation("publish")}
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
        <div className="flex flex-col gap-4 py-4 text-[#2D231F] font-sans">
          <h2 className="text-lg font-bold text-[#2D231F]">
            Lưu và Xuất bản thiệp
          </h2>
          <p className="text-sm text-[#2D231F]/80">
            Bạn muốn lưu thiết kế này dưới dạng bản nháp trực tuyến hay xuất bản
            chính thức luôn?
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
              className="px-4 py-2 text-xs border-[#2D231F]/40 text-[#2D231F]"
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

      <Modal
        isOpen={showMobileWarningModal}
        onClose={() => {
          sessionStorage.setItem(
            "invigo_design_mobile_warning_dismissed",
            "true",
          );
          setShowMobileWarningModal(false);
        }}
        maxWidth="max-w-md"
      >
        <div className="flex flex-col items-center text-center gap-4 py-4 text-[#2D231F] font-sans">
          <div className="w-14 h-14 rounded-full bg-[#2D231F]/10 flex items-center justify-center text-[#2D231F] border border-[#2D231F]/20">
            <Monitor size={28} />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-[#2D231F]">
              Khuyến nghị sử dụng máy tính
            </h2>
            <p className="text-xs sm:text-sm text-[#2D231F]/80 leading-relaxed">
              Ở chế độ điện thoại, không gian thao tác bị hạn chế. Bạn nên thực hiện thiết kế trên máy tính để có trải nghiệm kéo thả, căn chỉnh và chỉnh sửa chi tiết tốt nhất.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 mt-4 w-full">
            <Button
              variant="outline"
              onClick={() => {
                setShowMobileWarningModal(false);
                router.push(PUBLIC_ROUTES.TEMPLATES);
              }}
              className="flex-1 py-2.5 text-xs font-medium border-[#2D231F]/30 text-[#2D231F]"
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                sessionStorage.setItem(
                  "invigo_design_mobile_warning_dismissed",
                  "true",
                );
                setShowMobileWarningModal(false);
              }}
              className="flex-1 py-2.5 text-xs font-semibold"
            >
              Vẫn tiếp tục
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function DesignEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F3EDE3] flex items-center justify-center text-[#2D231F] font-sans">
          Đang tải thiết kế...
        </div>
      }
    >
      <DesignEditorContent />
    </Suspense>
  );
}
