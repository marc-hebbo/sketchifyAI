"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Circle,
  Frame,
  Minus,
  MousePointer2,
  Pen,
  Square,
  Type,
  Trash2,
  Sparkles,
  Loader2,
  Download,
  ExternalLink,
  Layers,
} from "lucide-react";
import {
  addArrow,
  addEllipse,
  addFrame,
  addFreeDrawShape,
  addLine,
  addRect,
  addText,
  clearAll,
  setTool,
  Tool,
  Shape,
  updateShape,
  selectShape,
  deselectShape,
  clearSelection,
} from "@/redux/slice/shapes";
import ColorPicker from "@/components/canvas/color-picker";
import LayersPanel from "@/components/canvas/layers-panel";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import AuthDialog from "@/components/auth/auth-dialog";

type Point = { x: number; y: number };

type DraftShape =
  | { type: "rect" | "ellipse" | "frame"; start: Point; end: Point }
  | { type: "line" | "arrow"; start: Point; end: Point }
  | { type: "freedraw"; points: Point[] };

const TOOL_ITEMS: Array<{ tool: Tool; label: string; icon: React.ReactNode }> =
  [
    { tool: "select", label: "Select", icon: <MousePointer2 className="h-4 w-4" /> },
    { tool: "frame", label: "Frame", icon: <Frame className="h-4 w-4" /> },
    { tool: "rect", label: "Rect", icon: <Square className="h-4 w-4" /> },
    { tool: "ellipse", label: "Ellipse", icon: <Circle className="h-4 w-4" /> },
    { tool: "line", label: "Line", icon: <Minus className="h-4 w-4" /> },
    { tool: "arrow", label: "Arrow", icon: <ArrowRight className="h-4 w-4" /> },
    { tool: "freedraw", label: "Draw", icon: <Pen className="h-4 w-4" /> },
    { tool: "text", label: "Text", icon: <Type className="h-4 w-4" /> },
  ];

const normalizeRect = (a: Point, b: Point) => {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const w = Math.abs(b.x - a.x);
  const h = Math.abs(b.y - a.y);
  return { x, y, w, h };
};

type ShapesStateLike = {
  shapes: {
    ids: string[];
    entities: Record<string, Shape | undefined>;
  };
};

const shapesFromState = (shapesState: ShapesStateLike) =>
  (shapesState.shapes.ids as string[])
    .map((id) => shapesState.shapes.entities[id])
    .filter(Boolean) as Shape[];

const CanvasWorkspace = () => {
  const dispatch = useAppDispatch();
  const shapesState = useAppSelector((state) => state.shapes);
  const tool = shapesState.tool;
  const shapes = useMemo(() => shapesFromState(shapesState), [shapesState]);
  const currentStroke = shapesState.currentStroke;
  const currentFill = shapesState.currentFill;
  const selected = shapesState.selected;
  const selectedIds = useMemo(() => Object.keys(selected), [selected]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draft, setDraft] = useState<DraftShape | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [showBriefDialog, setShowBriefDialog] = useState(false);
  const [briefInput, setBriefInput] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const user = useAppSelector((state) => state.profile.user);

  const captureCanvasAsImage = useCallback(async (): Promise<string> => {
    const svg = svgRef.current;
    if (!svg) throw new Error("Canvas not found");

    const svgRect = svg.getBoundingClientRect();
    const width = svgRect.width;
    const height = svgRect.height;

    // Clone the SVG and add necessary styles
    const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
    clonedSvg.setAttribute("width", String(width));
    clonedSvg.setAttribute("height", String(height));
    clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    // Add a white background for better visibility
    const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bgRect.setAttribute("width", "100%");
    bgRect.setAttribute("height", "100%");
    bgRect.setAttribute("fill", "#1a1a1a");
    clonedSvg.insertBefore(bgRect, clonedSvg.firstChild);

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load SVG as image"));
      };
      img.src = url;
    });
  }, []);

  // Opens the brief dialog when user clicks generate
  const handleGenerateClick = useCallback(() => {
    if (shapes.length === 0) {
      toast.error("Please draw something first!");
      return;
    }
    if (!user?.id) {
      setShowAuthDialog(true);
      return;
    }
    setBriefInput("");
    setShowBriefDialog(true);
  }, [shapes.length, user?.id]);

  // Called after successful auth — proceed to brief dialog
  const handleAuthSuccess = useCallback(() => {
    setBriefInput("");
    setShowBriefDialog(true);
  }, []);

  // Submits the brief and generates the image from sketch
  const handleSubmitBrief = useCallback(async (brief: string) => {
    setShowBriefDialog(false);
    setIsGenerating(true);

    try {
      // Capture the sketch from canvas
      const imageData = await captureCanvasAsImage();

      const response = await fetch("/api/generate-ui", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, brief }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setGeneratedImage(data.imageUrl);
      setGeneratedPrompt(data.prompt);
      setShowResultDialog(true);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  }, [captureCanvasAsImage]);

  const handleDownloadImage = useCallback(async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated-ui.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch {
      toast.error("Failed to download image");
    }
  }, [generatedImage]);

  const handleOpenInNewTab = useCallback(() => {
    if (!generatedImage) return;
    window.open(generatedImage, "_blank");
  }, [generatedImage]);

  const toLocalPoint = (e: React.PointerEvent): Point => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const point = toLocalPoint(e);
    if (tool === "select") {
      // Check if clicked on a shape — select it; otherwise clear selection
      const clickedShape = [...shapes].reverse().find((shape) => {
        if ("x" in shape && "w" in shape) {
          return (
            point.x >= shape.x &&
            point.x <= shape.x + shape.w &&
            point.y >= shape.y &&
            point.y <= shape.y + shape.h
          );
        }
        return false;
      });
      if (clickedShape) {
        if (!e.shiftKey) dispatch(clearSelection());
        dispatch(selectShape(clickedShape.id));
      } else {
        dispatch(clearSelection());
      }
      return;
    }

    if (tool === "text") {
      dispatch(
        addText({
          x: point.x,
          y: point.y,
          fill: currentFill ?? currentStroke,
        })
      );
      return;
    }

    let nextDraft: DraftShape | null = null;
    if (tool === "freedraw") {
      nextDraft = { type: "freedraw", points: [point] };
    } else if (
      tool === "frame" ||
      tool === "rect" ||
      tool === "ellipse" ||
      tool === "line" ||
      tool === "arrow"
    ) {
      nextDraft = { type: tool, start: point, end: point };
    }

    if (!nextDraft) return;

    setDraft(nextDraft);
    setIsDrawing(true);
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || !draft) return;
    const point = toLocalPoint(e);

    if (draft.type === "freedraw") {
      setDraft({ type: "freedraw", points: [...draft.points, point] });
      return;
    }

    setDraft({ ...draft, end: point } as DraftShape);
  };

  const finalizeDraft = () => {
    if (!draft) return;

    const colors = { stroke: currentStroke, fill: currentFill };

    if (draft.type === "freedraw") {
      dispatch(addFreeDrawShape({ points: draft.points, ...colors }));
      return;
    }

    const { start, end } = draft;
    if (draft.type === "rect") {
      const { x, y, w, h } = normalizeRect(start, end);
      dispatch(addRect({ x, y, w, h, ...colors }));
      return;
    }
    if (draft.type === "ellipse") {
      const { x, y, w, h } = normalizeRect(start, end);
      dispatch(addEllipse({ x, y, w, h, ...colors }));
      return;
    }
    if (draft.type === "frame") {
      const { x, y, w, h } = normalizeRect(start, end);
      dispatch(addFrame({ x, y, w, h }));
      return;
    }
    if (draft.type === "line") {
      dispatch(
        addLine({
          startX: start.x,
          startY: start.y,
          endX: end.x,
          endY: end.y,
          ...colors,
        })
      );
      return;
    }
    if (draft.type === "arrow") {
      dispatch(
        addArrow({
          startX: start.x,
          startY: start.y,
          endX: end.x,
          endY: end.y,
          ...colors,
        })
      );
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    finalizeDraft();
    setDraft(null);
    setIsDrawing(false);
    try {
      (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const renderShape = (shape: Shape) => {
    const isSelected = selected[shape.id];
    const selectionOutline = isSelected ? (
      <>
        {"x" in shape && "w" in shape && (
          shape.type === "ellipse" ? (
            <ellipse
              cx={shape.x + shape.w / 2}
              cy={shape.y + shape.h / 2}
              rx={Math.max(1, shape.w / 2) + 3}
              ry={Math.max(1, shape.h / 2) + 3}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              pointerEvents="none"
            />
          ) : (
            <rect
              x={shape.x - 3}
              y={shape.y - 3}
              width={shape.w + 6}
              height={shape.h + 6}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              rx={shape.type === "frame" ? 14 : 6}
              pointerEvents="none"
            />
          )
        )}
      </>
    ) : null;

    switch (shape.type) {
      case "frame":
      case "rect":
        return (
          <g key={shape.id}>
            <rect
              x={shape.x}
              y={shape.y}
              width={shape.w}
              height={shape.h}
              fill={shape.fill ?? "transparent"}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              rx={shape.type === "frame" ? 12 : 4}
            />
            {selectionOutline}
          </g>
        );
      case "ellipse":
        return (
          <g key={shape.id}>
            <ellipse
              cx={shape.x + shape.w / 2}
              cy={shape.y + shape.h / 2}
              rx={Math.max(1, shape.w / 2)}
              ry={Math.max(1, shape.h / 2)}
              fill={shape.fill ?? "transparent"}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
            />
            {selectionOutline}
          </g>
        );
      case "line":
        return (
          <line
            key={shape.id}
            x1={shape.startX}
            y1={shape.startY}
            x2={shape.endX}
            y2={shape.endY}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            strokeLinecap="round"
          />
        );
      case "arrow":
        return (
          <line
            key={shape.id}
            x1={shape.startX}
            y1={shape.startY}
            x2={shape.endX}
            y2={shape.endY}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            strokeLinecap="round"
            markerEnd="url(#arrowhead)"
          />
        );
      case "freedraw":
        return (
          <polyline
            key={shape.id}
            points={shape.points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case "text":
        return (
          <text
            key={shape.id}
            x={shape.x}
            y={shape.y}
            fill={shape.fill ?? "#fff"}
            fontSize={shape.fontSize}
            fontFamily={shape.fontFamily}
            fontWeight={shape.fontWeight}
            fontStyle={shape.fontStyle}
            textAnchor={shape.textAlign === "center" ? "middle" : shape.textAlign === "right" ? "end" : "start"}
          >
            {shape.text}
          </text>
        );
      case "generatedui":
        return (
          <rect
            key={shape.id}
            x={shape.x}
            y={shape.y}
            width={shape.w}
            height={shape.h}
            fill="rgba(255,255,255,0.08)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={1}
            rx={8}
          />
        );
      default:
        return null;
    }
  };

  const renderDraft = () => {
    if (!draft) return null;
    const draftStroke = currentStroke || "rgba(255,255,255,0.6)";
    const draftFill = currentFill ?? "transparent";

    if (draft.type === "freedraw") {
      return (
        <polyline
          points={draft.points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke={draftStroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.7}
        />
      );
    }

    const { start, end } = draft;
    if (draft.type === "line" || draft.type === "arrow") {
      return (
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={draftStroke}
          strokeWidth={2}
          strokeLinecap="round"
          markerEnd={draft.type === "arrow" ? "url(#arrowhead)" : undefined}
          opacity={0.7}
        />
      );
    }

    const { x, y, w, h } = normalizeRect(start, end);
    if (draft.type === "ellipse") {
      return (
        <ellipse
          cx={x + w / 2}
          cy={y + h / 2}
          rx={Math.max(1, w / 2)}
          ry={Math.max(1, h / 2)}
          fill={draftFill}
          stroke={draftStroke}
          strokeWidth={2}
          opacity={0.7}
        />
      );
    }

    return (
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={draft.type === "frame" ? "rgba(255,255,255,0.05)" : draftFill}
        stroke={draft.type === "frame" ? "transparent" : draftStroke}
        strokeWidth={2}
        rx={draft.type === "frame" ? 12 : 4}
        opacity={0.7}
      />
    );
  };

  return (
    <div className="flex min-h-screen w-full pt-24">
      <aside className="hidden md:flex w-20 shrink-0 flex-col gap-4 border-r border-white/10 bg-black/30 p-3">
        <ToggleGroup
          type="single"
          value={tool}
          onValueChange={(value) => {
            if (value) dispatch(setTool(value as Tool));
          }}
          className="flex w-full flex-col gap-2"
        >
          {TOOL_ITEMS.map((item) => (
            <ToggleGroupItem
              key={item.tool}
              value={item.tool}
              aria-label={item.label}
              className={cn(
                "h-10 w-10 rounded-xl border border-transparent data-[state=on]:border-white/40 data-[state=on]:bg-white/10"
              )}
            >
              {item.icon}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="my-1 h-px bg-white/10" />
        <ColorPicker />

        <div className="mt-auto flex flex-col gap-2">
          <Button
            variant="ghost"
            className={cn(
              "h-10 w-10 rounded-xl border",
              showLayersPanel
                ? "border-white/40 bg-white/10"
                : "border-transparent hover:bg-white/5"
            )}
            onClick={() => setShowLayersPanel((v) => !v)}
            aria-label="Toggle layers panel"
          >
            <Layers className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            className="h-10 w-10 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500"
            onClick={handleGenerateClick}
            disabled={isGenerating || shapes.length === 0}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="secondary"
            className="h-10 w-10 rounded-xl"
            onClick={() => dispatch(clearAll())}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      <div className="relative flex-1">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2 md:hidden">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur">
            <ToggleGroup
              type="single"
              value={tool}
              onValueChange={(value) => {
                if (value) dispatch(setTool(value as Tool));
              }}
              className="flex items-center"
            >
              {TOOL_ITEMS.map((item) => (
                <ToggleGroupItem
                  key={item.tool}
                  value={item.tool}
                  aria-label={item.label}
                  className="h-9 w-9 rounded-full border border-transparent data-[state=on]:border-white/40 data-[state=on]:bg-white/10"
                >
                  {item.icon}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Button
              variant="default"
              className="h-9 w-9 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500"
              onClick={handleGenerateClick}
              disabled={isGenerating || shapes.length === 0}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="secondary"
              className="h-9 w-9 rounded-full"
              onClick={() => dispatch(clearAll())}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur w-fit">
            <ColorPicker />
            <Button
              variant="ghost"
              className={cn(
                "h-9 w-9 rounded-full border",
                showLayersPanel
                  ? "border-white/40 bg-white/10"
                  : "border-transparent hover:bg-white/5"
              )}
              onClick={() => setShowLayersPanel((v) => !v)}
              aria-label="Toggle layers panel"
            >
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <svg
          ref={svgRef}
          className="relative h-full w-full bg-gradient-to-br from-zinc-950 via-zinc-950 to-zinc-900"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#ffffff" />
            </marker>
          </defs>
          {shapes
            .filter((s) => s.visible !== false)
            .map(renderShape)}
          {renderDraft()}
        </svg>

        {shapes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-sm text-white/60">
            <div className="rounded-2xl border border-white/10 bg-black/40 px-6 py-4 backdrop-blur">
              Select a tool on the left and start drawing.
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-black/80 px-8 py-6">
              <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
              <p className="text-sm text-white/80">Transforming your sketch...</p>
            </div>
          </div>
        )}

        <LayersPanel
          open={showLayersPanel}
          onClose={() => setShowLayersPanel(false)}
        />
      </div>

      {/* Brief Input Dialog */}
      <Dialog open={showBriefDialog} onOpenChange={setShowBriefDialog}>
        <DialogContent className="sm:max-w-lg bg-zinc-950 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Describe your sketch</DialogTitle>
            <DialogDescription className="text-white/60">
              Your sketch will be transformed based on your description (optional).
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              placeholder="e.g., A wooden dining table, a cozy living room, a mountain landscape..."
              value={briefInput}
              onChange={(e) => setBriefInput(e.target.value)}
              className="min-h-[120px] bg-zinc-900 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-violet-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowBriefDialog(false)}
              className="border-white/10 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSubmitBrief("")}
              className="bg-zinc-800 text-white hover:bg-zinc-700"
            >
              Skip & Generate
            </Button>
            <Button
              onClick={() => handleSubmitBrief(briefInput)}
              disabled={!briefInput.trim()}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-5xl h-[85vh] flex flex-col bg-zinc-950 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Generated Image</DialogTitle>
            <DialogDescription className="text-white/60">
              Your sketch has been transformed into a detailed image.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 flex items-center justify-center">
            {generatedImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={generatedImage}
                alt="Generated UI Design"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
          {generatedPrompt && (
            <div className="rounded-lg border border-white/10 bg-zinc-900/50 p-3 mt-2">
              <p className="text-xs text-white/40 mb-1">AI Prompt Used:</p>
              <p className="text-sm text-white/70 line-clamp-2">{generatedPrompt}</p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleOpenInNewTab}
              className="border-white/10 text-white hover:bg-white/10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button
              onClick={handleDownloadImage}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default CanvasWorkspace;