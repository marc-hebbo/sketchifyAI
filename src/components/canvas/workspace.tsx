"use client";

import React, { useMemo, useRef, useState } from "react";
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
} from "@/redux/slice/shapes";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

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

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draft, setDraft] = useState<DraftShape | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const toLocalPoint = (e: React.PointerEvent): Point => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const point = toLocalPoint(e);
    if (tool === "select") return;

    if (tool === "text") {
      dispatch(addText({ x: point.x, y: point.y }));
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

    if (draft.type === "freedraw") {
      dispatch(addFreeDrawShape({ points: draft.points }));
      return;
    }

    const { start, end } = draft;
    if (draft.type === "rect") {
      const { x, y, w, h } = normalizeRect(start, end);
      dispatch(addRect({ x, y, w, h }));
      return;
    }
    if (draft.type === "ellipse") {
      const { x, y, w, h } = normalizeRect(start, end);
      dispatch(addEllipse({ x, y, w, h }));
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
    switch (shape.type) {
      case "frame":
      case "rect":
        return (
          <rect
            key={shape.id}
            x={shape.x}
            y={shape.y}
            width={shape.w}
            height={shape.h}
            fill={shape.fill ?? "transparent"}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            rx={shape.type === "frame" ? 12 : 4}
          />
        );
      case "ellipse":
        return (
          <ellipse
            key={shape.id}
            cx={shape.x + shape.w / 2}
            cy={shape.y + shape.h / 2}
            rx={Math.max(1, shape.w / 2)}
            ry={Math.max(1, shape.h / 2)}
            fill={shape.fill ?? "transparent"}
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
          />
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
    if (draft.type === "freedraw") {
      return (
        <polyline
          points={draft.points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
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
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={2}
          strokeLinecap="round"
          markerEnd={draft.type === "arrow" ? "url(#arrowhead)" : undefined}
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
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={2}
        />
      );
    }

    return (
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth={2}
        rx={draft.type === "frame" ? 12 : 4}
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

        <Button
          variant="secondary"
          className="mt-auto h-10 w-10 rounded-xl"
          onClick={() => dispatch(clearAll())}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </aside>

      <div className="relative flex-1">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur md:hidden">
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
            variant="secondary"
            className="h-9 w-9 rounded-full"
            onClick={() => dispatch(clearAll())}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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
          {shapes.map(renderShape)}
          {renderDraft()}
        </svg>

        {shapes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-sm text-white/60">
            <div className="rounded-2xl border border-white/10 bg-black/40 px-6 py-4 backdrop-blur">
              Select a tool on the left and start drawing.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasWorkspace;
