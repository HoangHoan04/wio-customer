import Konva from "konva";
import { Disc, Headphones, Music, Music2, Music3, Music4 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Circle,
  Group,
  Image as KonvaImage,
  Layer,
  Line,
  Rect,
  Stage,
  Text,
  Transformer,
  Path,
} from "react-konva";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { useImageCache } from "./hooks/useImageCache";
import type { EditorElement } from "./types";
import {
  CalendarWidget,
  CallWidget,
  CountdownWidget,
  GalleryWidget,
  MapWidget,
  QRWidget,
  RSVPWidget,
  YouTubeWidget,
} from "./widgets";

interface Props {
  elements: EditorElement[];
  selectedElementId: string | null;
  canvasBackground: string;
  backgroundOpacity: number;
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<EditorElement>) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onDragMove?: (id: string, x: number, y: number) => void;
  onTransformEnd: (
    id: string,
    attrs: { x: number; y: number; width: number; height: number; rotation: number }
  ) => void;
  readOnly?: boolean;
  onHeightChange?: (height: number) => void;
  showGrid?: boolean;
  gridType?: "lines" | "dots";
  gridSize?: number;
}

export default function Canvas({
  elements,
  selectedElementId,
  canvasBackground,
  backgroundOpacity = 1,
  zoom,
  canvasWidth,
  canvasHeight,
  onSelect,
  onUpdate,
  onDragEnd,
  onDragMove,
  onTransformEnd,
  readOnly = false,
  onHeightChange,
  showGrid = false,
  gridType = "lines",
  gridSize = 40,
}: Props) {
  const scale = zoom / 100;
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const elementsLayerRef = useRef<Konva.Layer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  const visibleElements = useMemo(
    () => elements.filter((el) => el.visible !== false && el.id !== editingTextId),
    [elements, editingTextId]
  );

  const musicWidgetEl = useMemo(
    () =>
      elements.find(
        (el) =>
          el.type === "widget" &&
          el.widgetType === "music" &&
          el.visible !== false
      ),
    [elements]
  );
  const audioSrc = musicWidgetEl?.widgetConfig?.audioUrl || "";
  const { isPlaying, playMusic, toggleMusic } = useAudioPlayer(audioSrc);

  const konvaElements = useMemo(
    () => visibleElements.filter((el) => el.type !== "widget"),
    [visibleElements]
  );

  const musicIconMap: Record<
    string,
    React.ComponentType<{ size?: number; className?: string; color?: string }>
  > = useMemo(
    () => ({
      "music-1": Music,
      "music-2": Music2,
      "music-3": Music3,
      "music-4": Music4,
      headphones: Headphones,
      disc: Disc,
    }),
    []
  );

  const prevAudioSrcRef = useRef<string | null>(null);
  useEffect(() => {
    if (musicWidgetEl && audioSrc) {
      if (audioSrc !== prevAudioSrcRef.current) {
        prevAudioSrcRef.current = audioSrc;
        playMusic();
      }
    } else {
      prevAudioSrcRef.current = null;
    }
  }, [musicWidgetEl, audioSrc, playMusic]);

  const hasAnimatedImages = useMemo(
    () =>
      visibleElements.some(
        (el) => el.type === "image" && (el.src.includes("giphy.com") || /\.gif/i.test(el.src))
      ),
    [visibleElements]
  );

  useEffect(() => {
    const layer = elementsLayerRef.current;
    if (!layer) return;
    let frameId: number;
    const draw = () => {
      layer.batchDraw();
      frameId = requestAnimationFrame(draw);
    };
    if (hasAnimatedImages) {
      frameId = requestAnimationFrame(draw);
    }
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [hasAnimatedImages]);

  useEffect(() => {
    if (!transformerRef.current || !selectedElementId) {
      transformerRef.current?.nodes([]);
      return;
    }
    const stage = stageRef.current;
    if (!stage) return;
    const node = stage.findOne(`#el-${selectedElementId}`);
    if (node) {
      transformerRef.current.nodes([node]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedElementId, elements]);

  useEffect(() => {
    if (editingTextId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingTextId]);

  const animTweensRef = useRef<Konva.Tween[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    const container = containerRef.current;
    if (!stage || !container) return;

    animTweensRef.current.forEach((t) => t.destroy());
    animTweensRef.current = [];

    const tweensToPlay: { id: string; tween: Konva.Tween; y: number }[] = [];
    const playedIds = new Set<string>();

    visibleElements.forEach((el) => {
      const node = stage.findOne(`#el-${el.id}`);
      if (!node) return;

      if (el.motionEnabled) {
        const origX = node.x();
        const origY = node.y();
        const origOpacity = node.opacity();

        const tweenConfig: Record<string, unknown> = {
          node,
          duration: el.motionDuration,
          delay: el.motionDelay,
          easing:
            Konva.Easings[el.motionEasing as keyof typeof Konva.Easings] || Konva.Easings.EaseOut,
          onFinish: () => {
            if (el.continuousMotionEnabled) {
              startContinuousMotion(node, el);
            }
          },
        };

        if (el.motionType === "fadeIn" || el.motionType === "fadeOut") {
          node.opacity(el.motionType === "fadeIn" ? 0 : 0);
          tweenConfig.opacity = origOpacity;
        } else if (el.motionType === "slideInLeft") {
          node.x(origX - 50);
          tweenConfig.x = origX;
        } else if (el.motionType === "slideInRight") {
          node.x(origX + 50);
          tweenConfig.x = origX;
        } else if (el.motionType === "slideInUp") {
          node.y(origY - 50);
          tweenConfig.y = origY;
        } else if (el.motionType === "slideInDown") {
          node.y(origY + 50);
          tweenConfig.y = origY;
        } else if (el.motionType === "zoomIn" || el.motionType === "zoomOut") {
          node.scaleX(0).scaleY(0);
          tweenConfig.scaleX = 1;
          tweenConfig.scaleY = 1;
        } else if (el.motionType === "bounceIn") {
          node.scaleX(0).scaleY(0);
          tweenConfig.scaleX = 1;
          tweenConfig.scaleY = 1;
        } else if (el.motionType === "rotateIn") {
          tweenConfig.rotation = (node.rotation() || 0) + 360;
        } else if (el.motionType === "flipInX") {
          node.scaleX(0);
          tweenConfig.scaleX = 1;
        } else if (el.motionType === "flipInY") {
          node.scaleY(0);
          tweenConfig.scaleY = 1;
        } else {
          node.opacity(0);
          tweenConfig.opacity = origOpacity;
        }

        const tween = new Konva.Tween(tweenConfig as any);
        tweensToPlay.push({
          id: el.id,
          tween,
          y: el.y,
        });
        animTweensRef.current.push(tween);
      } else if (el.continuousMotionEnabled) {
        startContinuousMotion(node, el);
      }
    });

    const checkScroll = () => {
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
      const triggerLimit = scrollTop + clientHeight;

      tweensToPlay.forEach((item) => {
        if (playedIds.has(item.id)) return;

        const elTopScaled = item.y * scale;
        if (elTopScaled < triggerLimit - 20) {
          playedIds.add(item.id);
          item.tween.play();
        }
      });
    };

    const timer = setTimeout(checkScroll, 100);
    container.addEventListener("scroll", checkScroll);

    return () => {
      clearTimeout(timer);
      container.removeEventListener("scroll", checkScroll);
      animTweensRef.current.forEach((t) => t.destroy());
      animTweensRef.current = [];
    };
  }, [visibleElements, scale]);

  function startContinuousMotion(node: Konva.Node, el: EditorElement) {
    const duration = el.continuousMotionDuration;
    const delay = el.continuousMotionDelay;

    const tweenConfig: Record<string, unknown> = {
      node,
      duration,
      delay,
      easing: Konva.Easings.EaseInOut,
      onFinish: () => {
        setTimeout(() => startContinuousMotion(node, el), delay * 1000);
      },
    };

    const type = el.continuousMotionType;
    if (type === "float" || type === "bounce") {
      tweenConfig.y = node.y() + 10;
    } else if (type === "spin") {
      tweenConfig.rotation = (node.rotation() || 0) + 360;
    } else if (type === "pulse") {
      tweenConfig.opacity = 0.5;
    } else if (type === "wobble") {
      tweenConfig.scaleX = 1.1;
      tweenConfig.scaleY = 0.9;
    } else if (type === "shake") {
      tweenConfig.x = node.x() + 5;
    }

    const anim = new Konva.Tween(tweenConfig as any);
    anim.play();
    animTweensRef.current.push(anim);
  }

  const forwardEventToUnderlying = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>,
    eventType: "click" | "mousedown" | "touchstart"
  ) => {
    const evt = e.evt as any;
    const clientX = evt.clientX || (evt.touches && evt.touches[0]?.clientX);
    const clientY = evt.clientY || (evt.touches && evt.touches[0]?.clientY);
    if (clientX === undefined || clientY === undefined) return;

    const targets = document.elementsFromPoint(clientX, clientY);
    const underlyingTarget = targets.find(
      (el) => !stageRef.current?.container().contains(el)
    ) as HTMLElement | undefined;

    if (underlyingTarget) {
      let forwardedEvent;
      if (eventType === "touchstart") {
        forwardedEvent = new TouchEvent("touchstart", {
          bubbles: true,
          cancelable: true,
          touches: evt.touches ? Array.from(evt.touches) as any : [],
          targetTouches: evt.targetTouches ? Array.from(evt.targetTouches) as any : [],
          changedTouches: evt.changedTouches ? Array.from(evt.changedTouches) as any : [],
        });
      } else {
        forwardedEvent = new MouseEvent(eventType, {
          clientX,
          clientY,
          bubbles: true,
          cancelable: true,
          button: evt.button ?? 0,
          buttons: evt.buttons ?? 1,
        });
      }
      underlyingTarget.dispatchEvent(forwardedEvent);
      underlyingTarget.focus();
    }
  };

  const handleStageMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.target === e.target.getStage()) {
        onSelect(null);
        forwardEventToUnderlying(e, "mousedown");
      }
    },
    [onSelect]
  );

  const handleStageTouchStart = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (e.target === e.target.getStage()) {
        onSelect(null);
        forwardEventToUnderlying(e, "touchstart");
      }
    },
    [onSelect]
  );

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.target === e.target.getStage()) {
        onSelect(null);
        forwardEventToUnderlying(e, "click");
      }
    },
    [onSelect]
  );

  const handleStageTap = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      if (e.target === e.target.getStage()) {
        onSelect(null);
        forwardEventToUnderlying(e, "touchstart");
      }
    },
    [onSelect]
  );

  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === containerRef.current) {
        onSelect(null);
      }
    },
    [onSelect]
  );

  const handleDblClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const target = e.target;
      const parent = target.getParent();
      const nodeId = target.id() || parent?.id() || "";
      const id = nodeId.replace("el-", "");
      const el = elements.find((el) => el.id === id);
      if (el && el.type === "text") {
        setEditValue(el.content);
        setEditingTextId(id);
        onSelect(id);
      }
    },
    [elements, onSelect]
  );

  const handleDblTap = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      const target = e.target;
      const parent = target.getParent();
      const nodeId = target.id() || parent?.id() || "";
      const id = nodeId.replace("el-", "");
      const el = elements.find((el) => el.id === id);
      if (el && el.type === "text") {
        setEditValue(el.content);
        setEditingTextId(id);
        onSelect(id);
      }
    },
    [elements, onSelect]
  );

  const handleEditCommit = useCallback(() => {
    if (editingTextId && editValue.trim()) {
      onUpdate(editingTextId, { content: editValue });
    }
    setEditingTextId(null);
  }, [editingTextId, editValue, onUpdate]);

  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const dragRef = useRef<{ startY: number; startH: number; currH: number } | null>(null);

  const displayHeight = dragHeight ?? canvasHeight;

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current = { startY: e.clientY, startH: canvasHeight, currH: canvasHeight };
      setDragHeight(canvasHeight);

      const handleMouseMove = (e: MouseEvent) => {
        if (!dragRef.current) return;
        const delta = (e.clientY - dragRef.current.startY) / scale;
        const h = Math.max(100, Math.round(dragRef.current.startH + delta));
        dragRef.current.currH = h;
        setDragHeight(h);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        if (dragRef.current) {
          onHeightChange?.(dragRef.current.currH);
          dragRef.current = null;
          setDragHeight(null);
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [canvasHeight, scale, onHeightChange]
  );

  const handleHeightInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val >= 100) {
        onHeightChange?.(val);
      }
    },
    [onHeightChange]
  );

  const editingEl = editingTextId ? elements.find((el) => el.id === editingTextId) : null;
  const bgIsImage =
    canvasBackground.startsWith("http") ||
    canvasBackground.startsWith("blob:") ||
    canvasBackground.startsWith("data:") ||
    canvasBackground.startsWith("/");
  const bgStyle: React.CSSProperties = useMemo(() => {
    if (canvasBackground === "transparent") {
      return { background: "transparent" };
    }
    if (bgIsImage) {
      return { background: `url(${canvasBackground}) center/cover no-repeat` };
    }
    return { background: canvasBackground };
  }, [canvasBackground, bgIsImage]);

  const gridShapes = useMemo(() => {
    if (!showGrid) return null;

    const shapes = [];
    const strokeColor = "rgba(212, 175, 55, 0.15)";
    const dotColor = "rgba(212, 175, 55, 0.25)";

    if (gridType === "lines") {
      for (let x = gridSize; x < canvasWidth; x += gridSize) {
        shapes.push(
          <Line
            key={`v-${x}`}
            points={[x, 0, x, displayHeight]}
            stroke={strokeColor}
            strokeWidth={1}
            dash={[4, 4]}
          />
        );
      }
      for (let y = gridSize; y < displayHeight; y += gridSize) {
        shapes.push(
          <Line
            key={`h-${y}`}
            points={[0, y, canvasWidth, y]}
            stroke={strokeColor}
            strokeWidth={1}
            dash={[4, 4]}
          />
        );
      }
    } else if (gridType === "dots") {
      for (let x = gridSize; x < canvasWidth; x += gridSize) {
        for (let y = gridSize; y < displayHeight; y += gridSize) {
          shapes.push(
            <Circle
              key={`dot-${x}-${y}`}
              x={x}
              y={y}
              radius={1.5}
              fill={dotColor}
            />
          );
        }
      }
    }

    return shapes;
  }, [showGrid, gridType, gridSize, canvasWidth, displayHeight]);

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-[#1a1a1a] flex items-start justify-center overflow-y-auto overflow-x-hidden pt-8"
      onClick={handleContainerClick}
    >
      <div className="flex flex-col items-center gap-1 pb-8">
        <div className="relative inline-flex flex-col items-center">
          <div
            style={{
              width: canvasWidth * scale,
              minHeight: displayHeight * scale,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "4px",
                boxShadow: "0 0 60px rgba(0,0,0,0.5)",
                opacity: backgroundOpacity,
                ...bgStyle,
              }}
            />
            <Stage
              ref={stageRef}
              width={canvasWidth * scale}
              height={displayHeight * scale}
              scaleX={scale}
              scaleY={scale}
              onMouseDown={handleStageMouseDown}
              onTouchStart={handleStageTouchStart}
              onClick={handleStageClick}
              onTap={handleStageTap}
              onDblClick={handleDblClick}
              onDblTap={handleDblTap}
              style={{
                borderRadius: "4px",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 10,
                pointerEvents: readOnly ? "none" : "auto",
              }}
            >
              <Layer>{gridShapes}</Layer>

              <Layer ref={elementsLayerRef}>
                {konvaElements
                  .sort((a, b) => a.zIndex - b.zIndex)
                  .map((el) => (
                    <CanvasElement
                      key={el.id}
                      element={el}
                      onSelect={onSelect}
                      onDragEnd={onDragEnd}
                      onDragMove={onDragMove}
                      readOnly={readOnly}
                    />
                  ))}
              </Layer>

              {!readOnly && (
                <Layer>
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 10 || newBox.height < 10) return oldBox;
                      return newBox;
                    }}
                    onTransformEnd={() => {
                      const tr = transformerRef.current;
                      if (!tr) return;
                      const nodes = tr.nodes();
                      if (!nodes || nodes.length === 0) return;
                      const node = nodes[0];
                      const id = node.id()?.replace("el-", "");
                      if (!id) return;
                      const el = elements.find((e) => e.id === id);
                      if (!el) return;
                      const isText = el.type === "text";
                      const paddingL = isText ? (el.paddingLeft ?? 0) : 0;
                      const paddingR = isText ? (el.paddingRight ?? 0) : 0;
                      const paddingT = isText ? (el.paddingTop ?? 0) : 0;
                      const paddingB = isText ? (el.paddingBottom ?? 0) : 0;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();
                      node.scaleX(1);
                      node.scaleY(1);
                      onTransformEnd(id, {
                        x: node.x() + paddingL,
                        y: node.y() + paddingT,
                        width: Math.max(10, node.width() * scaleX) - paddingL - paddingR,
                        height: Math.max(10, node.height() * scaleY) - paddingT - paddingB,
                        rotation: node.rotation(),
                      });
                    }}
                    borderStroke="#d4af37"
                    borderStrokeWidth={1.5}
                    anchorStroke="#d4af37"
                    anchorFill="white"
                    anchorSize={8}
                    rotateEnabled={true}
                    rotateAnchorBorder={false}
                    enabledAnchors={[
                      "top-left",
                      "top-right",
                      "bottom-left",
                      "bottom-right",
                      "middle-left",
                      "middle-right",
                      "top-center",
                      "bottom-center",
                    ]}
                  />
                </Layer>
              )}
            </Stage>

            {musicWidgetEl &&
              (() => {
                const color = musicWidgetEl.widgetConfig?.color || "#d4af37";
                const iconId = musicWidgetEl.widgetConfig?.iconId || "music-1";
                const IconComp = musicIconMap[iconId] || Music;
                const iconSize = 20 * scale;
                const circleSize = 40 * scale;
                return (
                  <div
                    onClick={() => {
                      onSelect(musicWidgetEl.id);
                      toggleMusic();
                    }}
                    style={{
                      position: "absolute",
                      left: musicWidgetEl.x * scale,
                      top: musicWidgetEl.y * scale,
                      width: circleSize,
                      height: circleSize,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: musicWidgetEl.zIndex,
                      transition: "opacity 0.2s",
                    }}
                    title={musicWidgetEl.widgetConfig?.songTitle || "Music"}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        backgroundColor: color,
                        opacity: isPlaying ? 0.2 : 0.1,
                        transition: "opacity 0.3s",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 2,
                        borderRadius: "50%",
                        border: `2px solid ${color}`,
                        pointerEvents: "none",
                        opacity: isPlaying ? 1 : 0.5,
                        transition: "opacity 0.3s",
                        boxShadow: isPlaying ? `0 0 8px ${color}40` : "none",
                      }}
                    />
                    <div
                      style={{
                        animation: isPlaying ? "spin 3s linear infinite" : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconComp size={iconSize} color={isPlaying ? color : `${color}99`} />
                    </div>
                  </div>
                );
              })()}

            {visibleElements
              .filter((el) => el.type === "widget" && el.widgetType !== "music" && el.widgetConfig)
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((el) => (
                <WidgetOverlay
                  key={el.id}
                  element={el}
                  scale={scale}
                  isSelected={selectedElementId === el.id}
                  onSelect={onSelect}
                  onDragEnd={onDragEnd}
                  canvasWidth={canvasWidth}
                  canvasHeight={displayHeight}
                  readOnly={readOnly}
                />
              ))}



            {editingEl && editingTextId && (
              <textarea
                ref={editInputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleEditCommit}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setEditingTextId(null);
                  }
                }}
                className="absolute outline-none border-2 border-[#d4af37] resize-none z-50 overflow-hidden whitespace-pre-wrap wrap-break-word"
                style={{
                  left: (editingEl.x - (editingEl.paddingLeft ?? 0)) * scale,
                  top: (editingEl.y - (editingEl.paddingTop ?? 0)) * scale,
                  width: Math.max(
                    100,
                    (editingEl.width +
                      (editingEl.paddingLeft ?? 0) +
                      (editingEl.paddingRight ?? 0)) *
                      scale
                  ),
                  height:
                    (editingEl.height +
                      (editingEl.paddingTop ?? 0) +
                      (editingEl.paddingBottom ?? 0)) *
                    scale,
                  backgroundColor: editingEl.backgroundColor || "transparent",
                  color: editingEl.color || "#1a1a1a",
                  fontSize: Math.max(12, editingEl.fontSize * scale),
                  fontFamily: editingEl.fontFamily,
                  fontWeight: editingEl.fontWeight || "normal",
                  fontStyle: editingEl.fontStyle || "normal",
                  textAlign: editingEl.textAlign || "left",
                  textTransform: editingEl.textTransform || "none",
                  letterSpacing: (editingEl.letterSpacing ?? 0) * scale,
                  lineHeight: editingEl.lineHeight || 1.4,
                  padding: `${(editingEl.paddingTop ?? 0) * scale}px ${(editingEl.paddingRight ?? 0) * scale}px ${(editingEl.paddingBottom ?? 0) * scale}px ${(editingEl.paddingLeft ?? 0) * scale}px`,
                  borderRadius: `${editingEl.borderRadiusTopLeft ?? 0}px ${editingEl.borderRadiusTopRight ?? 0}px ${editingEl.borderRadiusBottomRight ?? 0}px ${editingEl.borderRadiusBottomLeft ?? 0}px`,
                  transform: editingEl.rotation ? `rotate(${editingEl.rotation}deg)` : undefined,
                  boxSizing: "border-box",
                }}
              />
            )}
          </div>

          {!readOnly && (
            <div
              onMouseDown={handleResizeStart}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-6 flex items-center justify-center cursor-s-resize z-10 group"
            >
              <div className="w-12 h-1.5 rounded-full bg-[#3a3a3a] group-hover:bg-[#d4af37] transition-colors" />
            </div>
          )}
        </div>

        {!readOnly && (
          <div className="flex items-center gap-3 mt-4 mb-4">
            <button
              onClick={() => onHeightChange?.(Math.max(100, canvasHeight - 50))}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-[#3a3a3a] text-white text-lg font-bold hover:bg-[#4a4a4a] transition-colors"
            >
              −
            </button>
            <div className="flex items-center gap-1 bg-[#202020] border border-[#333] rounded-md px-3 py-1.5">
              <input
                type="number"
                value={displayHeight}
                onChange={handleHeightInputChange}
                className="w-16 bg-transparent text-white text-sm text-center font-mono outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                min={100}
              />
              <span className="text-gray-500 text-xs">px</span>
            </div>
            <button
              onClick={() => onHeightChange?.(canvasHeight + 50)}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-[#3a3a3a] text-white text-lg font-bold hover:bg-[#4a4a4a] transition-colors"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface ElementProps {
  element: EditorElement;
  onSelect: (id: string | null) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onDragMove?: (id: string, x: number, y: number) => void;
  readOnly?: boolean;
}

function CanvasElement({ element, onSelect, onDragEnd, onDragMove, readOnly = false }: ElementProps) {
  const image = useImageCache(element.type === "image" ? element.src : "");

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const isText = element.type === "text";
      const newX = e.target.x() + (isText ? (element.paddingLeft ?? 0) : 0);
      const newY = e.target.y() + (isText ? (element.paddingTop ?? 0) : 0);
      onDragEnd(element.id, newX, newY);
    },
    [element.id, element.type, element.paddingLeft, element.paddingTop, onDragEnd]
  );

  const handleClick = useCallback(() => {
    onSelect(element.id);
    if (element.link && !readOnly) {
      window.open(element.link, "_blank", "noopener,noreferrer");
    }
  }, [element.id, onSelect, element.link, readOnly]);

  const handleDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      if (!onDragMove) return;
      const isText = element.type === "text";
      const newX = e.target.x() + (isText ? (element.paddingLeft ?? 0) : 0);
      const newY = e.target.y() + (isText ? (element.paddingTop ?? 0) : 0);
      onDragMove(element.id, newX, newY);
    },
    [element.id, element.type, element.paddingLeft, element.paddingTop, onDragMove]
  );

  const commonProps = {
    id: `el-${element.id}`,
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
    rotation: element.rotation,
    opacity: element.opacity,
    draggable: readOnly ? false : !element.locked,
    onClick: readOnly ? undefined : handleClick,
    onTap: readOnly ? undefined : handleClick,
    onDragEnd: readOnly ? undefined : handleDragEnd,
    onDragMove: readOnly || !onDragMove ? undefined : handleDragMove,
  };

  if (element.type === "text") {
    const displayText = (() => {
      switch (element.textTransform) {
        case "uppercase":
          return element.content.toUpperCase();
        case "lowercase":
          return element.content.toLowerCase();
        case "capitalize":
          return element.content.replace(/\b\w/g, (c) => c.toUpperCase());
        default:
          return element.content;
      }
    })();

    const groupW = element.width + element.paddingLeft + element.paddingRight;
    const groupH = element.height + element.paddingTop + element.paddingBottom;
    const hasBorder = element.borderWidth > 0 && element.borderColor;

    const textMetrics = (() => {
      try {
        const temp = new Konva.Text({
          text: displayText,
          fontSize: element.fontSize,
          fontFamily: element.fontFamily,
          fontStyle:
            `${element.fontWeight === "bold" ? "bold " : ""}${element.fontStyle === "italic" ? "italic" : ""}`.trim() ||
            undefined,
          letterSpacing: element.letterSpacing,
          lineHeight: element.lineHeight,
        });
        const w = temp.textWidth;
        temp.destroy();
        return Math.min(w, element.width);
      } catch {
        return element.width;
      }
    })();

    const getDecorationX = () => {
      const align = element.textAlign;
      if (align === "center") return element.paddingLeft + (element.width - textMetrics) / 2;
      if (align === "right") return element.paddingLeft + element.width - textMetrics;
      return element.paddingLeft;
    };

    const renderBorder = () => {
      if (!hasBorder) return null;
      const bw = element.borderWidth;
      const bc = element.borderColor;
      const bp = element.borderPosition;
      const bs = element.borderStyle;
      const isDouble = bs === "double";
      const dash = bs === "dashed" ? [bw * 3, bw * 2] : bs === "dotted" ? [bw, bw] : undefined;
      const renderTop = bp === "all" || bp === "top" || bp === "top-left" || bp === "top-right";
      const renderBottom =
        bp === "all" || bp === "bottom" || bp === "bottom-left" || bp === "bottom-right";
      const renderLeft = bp === "all" || bp === "left" || bp === "top-left" || bp === "bottom-left";
      const renderRight =
        bp === "all" || bp === "right" || bp === "top-right" || bp === "bottom-right";

      const B = ({ pts }: { pts: number[] }) => (
        <Line points={pts} stroke={bc} strokeWidth={bw} dash={dash} tension={0} lineCap="round" />
      );

      return (
        <>
          {renderTop &&
            (isDouble ? (
              <>
                <Rect x={0} y={0} width={groupW} height={bw / 3} fill={bc} />
                <Rect x={0} y={(bw * 2) / 3} width={groupW} height={bw / 3} fill={bc} />
              </>
            ) : (
              <B pts={[0, bw / 2, groupW, bw / 2]} />
            ))}
          {renderBottom &&
            (isDouble ? (
              <>
                <Rect x={0} y={groupH - bw / 3} width={groupW} height={bw / 3} fill={bc} />
                <Rect
                  x={0}
                  y={groupH - (bw * 2) / 3 - bw / 3}
                  width={groupW}
                  height={bw / 3}
                  fill={bc}
                />
              </>
            ) : (
              <B pts={[0, groupH - bw / 2, groupW, groupH - bw / 2]} />
            ))}
          {renderLeft &&
            (isDouble ? (
              <>
                <Rect x={0} y={0} width={bw / 3} height={groupH} fill={bc} />
                <Rect x={(bw * 2) / 3} y={0} width={bw / 3} height={groupH} fill={bc} />
              </>
            ) : (
              <B pts={[bw / 2, 0, bw / 2, groupH]} />
            ))}
          {renderRight &&
            (isDouble ? (
              <>
                <Rect x={groupW - bw / 3} y={0} width={bw / 3} height={groupH} fill={bc} />
                <Rect
                  x={groupW - (bw * 2) / 3 - bw / 3}
                  y={0}
                  width={bw / 3}
                  height={groupH}
                  fill={bc}
                />
              </>
            ) : (
              <B pts={[groupW - bw / 2, 0, groupW - bw / 2, groupH]} />
            ))}
        </>
      );
    };

    return (
      <Group
        id={`el-${element.id}`}
        x={element.x - element.paddingLeft}
        y={element.y - element.paddingTop}
        width={groupW}
        height={groupH}
        rotation={element.rotation}
        onClick={readOnly ? undefined : handleClick}
        onTap={readOnly ? undefined : handleClick}
        draggable={readOnly ? false : !element.locked}
        onDragEnd={readOnly ? undefined : handleDragEnd}
      >
        <Rect
          x={0}
          y={0}
          width={groupW}
          height={groupH}
          fill={element.backgroundColor !== "transparent" ? element.backgroundColor : undefined}
          cornerRadius={[
            element.borderRadiusTopLeft,
            element.borderRadiusTopRight,
            element.borderRadiusBottomRight,
            element.borderRadiusBottomLeft,
          ]}
          shadowColor={element.shadowBlur > 0 ? element.shadowColor : undefined}
          shadowBlur={element.shadowBlur > 0 ? element.shadowBlur : undefined}
          shadowOffsetX={element.shadowOffsetX}
          shadowOffsetY={element.shadowOffsetY}
          shadowOpacity={element.shadowBlur > 0 ? 0.4 : 0}
          stroke={hasBorder && element.borderStyle !== "double" ? element.borderColor : undefined}
          strokeWidth={
            hasBorder && element.borderStyle !== "double" ? element.borderWidth : undefined
          }
          dash={
            hasBorder && element.borderStyle === "dashed"
              ? [element.borderWidth * 3, element.borderWidth * 2]
              : element.borderStyle === "dotted"
                ? [element.borderWidth, element.borderWidth]
                : undefined
          }
        />
        <Text
          x={element.paddingLeft}
          y={element.paddingTop}
          width={element.width}
          height={element.height}
          text={displayText}
          fontSize={element.fontSize}
          fontFamily={element.fontFamily}
          fontStyle={
            `${element.fontWeight === "bold" ? "bold " : ""}${element.fontStyle === "italic" ? "italic" : ""}`.trim() ||
            undefined
          }
          fill={element.color}
          align={element.textAlign}
          verticalAlign={element.verticalAlign || "middle"}
          letterSpacing={element.letterSpacing}
          lineHeight={element.lineHeight}
          wrap="word"
          shadowColor={element.shadowBlur > 0 ? element.shadowColor : undefined}
          shadowBlur={element.shadowBlur > 0 ? element.shadowBlur : undefined}
          shadowOffsetX={element.shadowOffsetX}
          shadowOffsetY={element.shadowOffsetY}
          shadowOpacity={element.shadowBlur > 0 ? 0.4 : 0}
          opacity={element.opacity}
          perfectDrawEnabled={false}
          listening={!readOnly}
        />
        {hasBorder &&
          (element.borderPosition !== "all" || element.borderStyle === "double") &&
          renderBorder()}
        {(element.textDecoration === "underline" ||
          element.textDecoration === "underline line-through") && (
          <Rect
            x={getDecorationX()}
            y={element.paddingTop + element.height - 2}
            width={textMetrics}
            height={1}
            fill={element.color}
          />
        )}
        {(element.textDecoration === "line-through" ||
          element.textDecoration === "underline line-through") && (
          <Rect
            x={getDecorationX()}
            y={element.paddingTop + element.height / 2}
            width={textMetrics}
            height={1}
            fill={element.color}
          />
        )}
      </Group>
    );
  }

  if (element.type === "image" && image) {
    return (
      <KonvaImage
        {...commonProps}
        image={image}
        perfectDrawEnabled={false}
        cornerRadius={[
          element.borderRadiusTopLeft ?? 0,
          element.borderRadiusTopRight ?? 0,
          element.borderRadiusBottomRight ?? 0,
          element.borderRadiusBottomLeft ?? 0,
        ]}
        shadowColor={element.shadowBlur > 0 ? element.shadowColor : undefined}
        shadowBlur={element.shadowBlur > 0 ? element.shadowBlur : undefined}
        shadowOffsetX={element.shadowOffsetX}
        shadowOffsetY={element.shadowOffsetY}
        shadowOpacity={element.shadowBlur > 0 ? 0.6 : 0}
      />
    );
  }

  if (element.type === "shape") {
    return <ShapeElement {...commonProps} element={element} />;
  }

  if (element.type === "widget") {
    const conf = element.widgetConfig || {};

    if (conf.audioEnabled) return null;

    const isCountdownVertical = element.widgetType === "countdown" && conf.countdownOrientation === "vertical";
    const overrideWidth = isCountdownVertical
      ? Math.min(element.width, element.height)
      : (element.widgetType === "calendar" && element.width === 280 ? 380 : element.width);
    const overrideHeight = isCountdownVertical
      ? Math.max(element.width, element.height)
      : (element.widgetType === "calendar" && element.height === 120 ? 240 : element.height);

    let labelText = `[Widget: ${element.widgetType || "Tiện ích"}]`;

    if (conf.calendarEnabled) labelText = `📅 Lịch: ${conf.targetDate || "Chưa cài đặt"}`;
    else if (conf.countdownEnabled)
      labelText = `⏳ Đếm ngược: ${conf.targetDate ? "Đã đặt ngày" : "Chưa đặt ngày"}`;
    else if (conf.mapEnabled)
      labelText = `📍 Bản đồ: ${conf.locationAddress || "Chưa nhập vị trí"}`;
    else if (conf.contactEnabled) {
      const parts: string[] = [];
      if (conf.phoneEnabled) parts.push("📞");
      if (conf.messengerEnabled) parts.push("💬");
      if (conf.zaloEnabled) parts.push("Z");
      labelText = `📞 Liên hệ${parts.length ? ": " + parts.join(" ") : ""}`;
    } else if (conf.rsvpEnabled) labelText = `💌 Xác nhận tham dự`;
    else if (conf.qrEnabled) labelText = `🎁 Mừng cưới`;
    else if (conf.galleryEnabled)
      labelText = `🖼️ Thư viện ảnh (${(conf.images || []).length} hình)`;
    else if (conf.youtubeEnabled) labelText = `▶️ Video Youtube`;

    return (
      <Group
        id={`el-${element.id}`}
        x={element.x}
        y={element.y}
        width={overrideWidth}
        height={overrideHeight}
        rotation={element.rotation}
        opacity={element.opacity}
        onClick={readOnly ? undefined : handleClick}
        onTap={readOnly ? undefined : handleClick}
        draggable={readOnly ? false : !element.locked}
        onDragEnd={readOnly ? undefined : handleDragEnd}
      >
        <Rect
          x={0}
          y={0}
          width={overrideWidth}
          height={overrideHeight}
          fill={conf.color || "#242526"}
          stroke="#d4af37"
          strokeWidth={1.5}
          dash={[5, 5]}
          cornerRadius={6}
        />
        <Text
          x={10}
          y={element.height / 2 - 6}
          width={element.width - 20}
          text={labelText}
          fontSize={12}
          fontFamily={conf.fontFamily || "Quicksand"}
          fill="#f5e6d3"
          align="center"
        />
      </Group>
    );
  }
  return null;
}

function WidgetOverlay({
  element,
  scale,
  isSelected,
  onSelect,
  onDragEnd,
  canvasWidth,
  canvasHeight,
  readOnly = false,
}: {
  element: EditorElement;
  scale: number;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  canvasWidth: number;
  canvasHeight: number;
  readOnly?: boolean;
}) {
  const conf = element.widgetConfig || {};
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const depsRef = useRef({ elementId: element.id, onDragEnd, scale });
  depsRef.current = { elementId: element.id, onDragEnd, scale };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("input, button, textarea, select, a, [role='button'], label, .no-drag"))
      return;
    e.preventDefault();
    const { elementId, onDragEnd, scale } = depsRef.current;
    onSelect(elementId);

    const startX = e.clientX;
    const startY = e.clientY;
    const elStartX = element.x;
    const elStartY = element.y;
    let dragging = false;

    const clamp = (x: number, y: number) => ({
      x: Math.max(0, Math.min(canvasWidth - overrideWidth, x)),
      y: Math.max(0, Math.min(canvasHeight - overrideHeight, y)),
    });

    const handleMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX - startX) / scale;
      const dy = (e.clientY - startY) / scale;
      if (!dragging) {
        if (Math.abs(e.clientX - startX) > 3 || Math.abs(e.clientY - startY) > 3) {
          dragging = true;
        } else {
          return;
        }
      }
      const clamped = clamp(elStartX + dx, elStartY + dy);
      setOffset({ x: clamped.x - elStartX, y: clamped.y - elStartY });
    };

    const handleMouseUp = (e: MouseEvent) => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      if (dragging) {
        const dx = (e.clientX - startX) / scale;
        const dy = (e.clientY - startY) / scale;
        const clamped = clamp(elStartX + dx, elStartY + dy);
        onDragEnd(elementId, clamped.x, clamped.y);
      }
      setOffset({ x: 0, y: 0 });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const isCountdownVertical = element.widgetType === "countdown" && conf.countdownOrientation === "vertical";
  
  const overrideWidth = isCountdownVertical
    ? Math.min(element.width, element.height)
    : ((element.widgetType === "calendar" || element.widgetType === "youtube") && element.width === 280
      ? 380
      : element.widgetType === "call"
        ? 60
        : element.width);
    
  const overrideHeight = isCountdownVertical
    ? Math.max(element.width, element.height)
    : element.widgetType === "youtube"
      ? (overrideWidth * 9) / 16
      : (element.widgetType === "calendar" && element.height === 120 ? 240 : element.height);

  const commonStyle: React.CSSProperties = {
    position: "absolute",
    left: (element.x + offset.x) * scale,
    top: (element.y + offset.y) * scale,
    width: overrideWidth * scale,
    height: "auto",
    zIndex: element.zIndex,
    cursor: isSelected ? "move" : "pointer",
    outlineOffset: -1,
    borderRadius: 6 * scale,
    touchAction: "none",
  };

  const widgetProps = {
    color: conf.color,
    fontFamily: conf.fontFamily,
    width: element.width,
    height: element.height,
    scale,
    isSelected: false,
  };

  return (
    <div style={commonStyle} onMouseDown={handleMouseDown}>
      {element.widgetType === "calendar" && conf.calendarEnabled && (
        <CalendarWidget
          width={overrideWidth}
          height={overrideHeight}
          scale={scale}
          color={conf.color}
          fontFamily={conf.fontFamily}
          targetDate={conf.targetDate}
          displayMode={conf.calendarDisplayMode}
          calendarStyle={conf.calendarStyle}
        />
      )}
      {element.widgetType === "countdown" && conf.countdownEnabled && (
        <CountdownWidget
          color={conf.color}
          fontFamily={conf.fontFamily}
          width={overrideWidth}
          height={overrideHeight}
          scale={scale}
          targetDate={conf.countdownTarget}
          countdownType={conf.countdownType}
          styleType={conf.countdownStyle || "classic"}
          orientation={conf.countdownOrientation || "horizontal"}
        />
      )}
      {element.widgetType === "map" && conf.mapEnabled && (
        <MapWidget
          {...widgetProps}
          locationAddress={conf.locationAddress}
          mapEmbedUrl={conf.mapEmbedUrl}
          mapType={conf.mapType}
        />
      )}
      {element.widgetType === "call" && conf.contactEnabled && (
        <CallWidget
          {...widgetProps}
          width={overrideWidth}
          height={overrideHeight}
          phoneEnabled={conf.phoneEnabled}
          phoneLabel={conf.phoneLabel}
          phoneNumber={conf.phoneNumber}
          messengerEnabled={conf.messengerEnabled}
          messengerLabel={conf.messengerLabel}
          messengerUrl={conf.messengerUrl}
          zaloEnabled={conf.zaloEnabled}
          zaloLabel={conf.zaloLabel}
          zaloPhone={conf.zaloPhone}
        />
      )}
      {element.widgetType === "rsvp" && conf.rsvpEnabled && (
        <RSVPWidget {...widgetProps} rsvpType={conf.rsvpType} />
      )}
      {element.widgetType === "qr" && conf.qrEnabled && (
        <QRWidget
          {...widgetProps}
          qrTarget={conf.qrTarget}
          groom={{
            accountName: conf.groomAccountName,
            accountNumber: conf.groomAccountNumber,
            bankName: conf.groomBankName,
            qrUrl: conf.groomQrUrl,
          }}
          bride={{
            accountName: conf.brideAccountName,
            accountNumber: conf.brideAccountNumber,
            bankName: conf.brideBankName,
            qrUrl: conf.brideQrUrl,
          }}
        />
      )}
      {(element.widgetType === "album" ||
        element.widgetType === "carousel" ||
        element.widgetType === "gallery") &&
        conf.galleryEnabled && (
          <GalleryWidget {...widgetProps} images={conf.images} layout={conf.galleryLayout} />
        )}
      {element.widgetType === "youtube" && conf.youtubeEnabled && (
        <YouTubeWidget {...widgetProps} youtubeUrl={conf.youtubeUrl} />
      )}
      
      {!readOnly && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 50,
            cursor: isSelected ? "move" : "pointer",
          }}
        />
      )}
    </div>
  );
}

function ShapeElement(props: any) {
  const { element, ...commonProps } = props;

  const shadowProps =
    element.shadowBlur > 0
      ? {
          shadowColor: element.shadowColor,
          shadowBlur: element.shadowBlur,
          shadowOffsetX: element.shadowOffsetX,
          shadowOffsetY: element.shadowOffsetY,
          shadowOpacity: 0.6,
        }
      : {};

  const cx = element.width / 2;
  const cy = element.height / 2;

  switch (element.shapeType) {
    case "circle":
      return (
        <Circle
          {...commonProps}
          x={element.x + element.width / 2}
          y={element.y + element.height / 2}
          radius={Math.min(element.width, element.height) / 2}
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          {...shadowProps}
        />
      );
    case "heart": {
      const w = element.width;
      const h = element.height;
      const pathData = `
        M ${0.5 * w} ${0.9 * h}
        C ${0.1 * w} ${0.48 * h}, 0 ${0.35 * h}, 0 ${0.22 * h}
        C 0 ${0.08 * h}, ${0.08 * w} 0, ${0.22 * w} 0
        C ${0.34 * w} 0, ${0.45 * w} ${0.09 * h}, ${0.5 * w} ${0.18 * h}
        C ${0.55 * w} ${0.09 * h}, ${0.66 * w} 0, ${0.78 * w} 0
        C ${0.92 * w} 0, ${1 * w} ${0.08 * h}, ${1 * w} ${0.22 * h}
        C ${1 * w} ${0.35 * h}, ${0.9 * w} ${0.48 * h}, ${0.5 * w} ${0.9 * h}
        Z
      `;
      return (
        <Path
          {...commonProps}
          x={element.x}
          y={element.y}
          data={pathData}
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          {...shadowProps}
        />
      );
    }
    case "star": {
      const outerR = Math.min(element.width, element.height) / 2;
      const innerR = outerR * 0.4;
      const points = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        points.push(cx + r * Math.cos(angle));
        points.push(cy + r * Math.sin(angle));
      }
      return (
        <Group {...commonProps}>
          <Line
            points={points}
            closed
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            {...shadowProps}
          />
        </Group>
      );
    }
    case "triangle": {
      const r = Math.min(element.width, element.height) / 2;
      const points = [
        cx,
        cy - r,
        cx + r * Math.cos(Math.PI / 6),
        cy + r * Math.sin(Math.PI / 6),
        cx - r * Math.cos(Math.PI / 6),
        cy + r * Math.sin(Math.PI / 6),
      ];
      return (
        <Group {...commonProps}>
          <Line
            points={points}
            closed
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            {...shadowProps}
          />
        </Group>
      );
    }
    case "hexagon": {
      const r = Math.min(element.width, element.height) / 2;
      const points = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        points.push(cx + r * Math.cos(angle));
        points.push(cy + r * Math.sin(angle));
      }
      return (
        <Group {...commonProps}>
          <Line
            points={points}
            closed
            fill={element.fill}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            {...shadowProps}
          />
        </Group>
      );
    }
    case "line":
      return (
        <Group {...commonProps}>
          <Rect
            x={0}
            y={0}
            width={element.width}
            height={element.strokeWidth || 3}
            fill={element.fill}
            {...shadowProps}
          />
        </Group>
      );
    default:
      return (
        <Rect
          {...commonProps}
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          cornerRadius={[
            element.borderRadiusTopLeft ?? 0,
            element.borderRadiusTopRight ?? 0,
            element.borderRadiusBottomRight ?? 0,
            element.borderRadiusBottomLeft ?? 0,
          ]}
          {...shadowProps}
        />
      );
  }
}
