"use client";

import React, { useCallback, useState } from "react";
import {
  Eye,
  EyeOff,
  Trash2,
  ChevronUp,
  ChevronDown,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Pen,
  Type,
  Frame,
  Monitor,
  Layers,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  Shape,
  selectShape,
  clearSelection,
  removeShape,
  toggleShapeVisibility,
  renameShape,
  moveShapeOrder,
} from "@/redux/slice/shapes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const SHAPE_ICONS: Record<Shape["type"], React.ReactNode> = {
  rect: <Square className="h-3.5 w-3.5" />,
  ellipse: <Circle className="h-3.5 w-3.5" />,
  line: <Minus className="h-3.5 w-3.5" />,
  arrow: <ArrowRight className="h-3.5 w-3.5" />,
  freedraw: <Pen className="h-3.5 w-3.5" />,
  text: <Type className="h-3.5 w-3.5" />,
  frame: <Frame className="h-3.5 w-3.5" />,
  generatedui: <Monitor className="h-3.5 w-3.5" />,
};

const SHAPE_LABELS: Record<Shape["type"], string> = {
  rect: "Rectangle",
  ellipse: "Ellipse",
  line: "Line",
  arrow: "Arrow",
  freedraw: "Drawing",
  text: "Text",
  frame: "Frame",
  generatedui: "Generated UI",
};

interface LayerItemProps {
  shape: Shape;
  isSelected: boolean;
  onSelect: (id: string, multi: boolean) => void;
  onRemove: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  isFirst: boolean;
  isLast: boolean;
}

const LayerItem = ({
  shape,
  isSelected,
  onSelect,
  onRemove,
  onToggleVisibility,
  onRename,
  onMove,
  isFirst,
  isLast,
}: LayerItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const isVisible = shape.visible ?? true;

  const displayName =
    shape.name ||
    (shape.type === "text" && "text" in shape
      ? (shape as { text: string }).text.slice(0, 20)
      : SHAPE_LABELS[shape.type]);

  const handleDoubleClick = () => {
    setEditValue(displayName);
    setIsEditing(true);
  };

  const handleRenameSubmit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== displayName) {
      onRename(shape.id, trimmed);
    }
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors cursor-pointer",
        isSelected
          ? "bg-blue-500/20 border border-blue-500/40"
          : "border border-transparent hover:bg-white/5"
      )}
      onClick={(e) => onSelect(shape.id, e.shiftKey)}
    >
      {/* Color preview */}
      <div
        className="h-4 w-4 shrink-0 rounded border border-white/20"
        style={{
          backgroundColor: shape.fill ?? "transparent",
          borderColor: shape.stroke === "transparent" ? "rgba(255,255,255,0.2)" : shape.stroke,
          borderWidth: shape.stroke === "transparent" ? 1 : 2,
        }}
      />

      {/* Shape icon */}
      <span className="shrink-0 text-white/50">{SHAPE_ICONS[shape.type]}</span>

      {/* Name */}
      {isEditing ? (
        <input
          autoFocus
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleRenameSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRenameSubmit();
            if (e.key === "Escape") setIsEditing(false);
          }}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 min-w-0 bg-white/10 rounded px-1 py-0.5 text-xs text-white outline-none border border-white/20 focus:border-blue-500/50"
        />
      ) : (
        <span
          className={cn(
            "flex-1 min-w-0 truncate text-xs",
            isVisible ? "text-white/80" : "text-white/30 line-through"
          )}
          onDoubleClick={handleDoubleClick}
        >
          {displayName}
        </span>
      )}

      {/* Actions — shown on hover */}
      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMove(shape.id, "up");
          }}
          disabled={isLast}
          className="h-5 w-5 flex items-center justify-center rounded text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed"
          title="Move up (higher)"
        >
          <ChevronUp className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMove(shape.id, "down");
          }}
          disabled={isFirst}
          className="h-5 w-5 flex items-center justify-center rounded text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed"
          title="Move down (lower)"
        >
          <ChevronDown className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(shape.id);
          }}
          className="h-5 w-5 flex items-center justify-center rounded text-white/40 hover:text-white hover:bg-white/10"
          title={isVisible ? "Hide" : "Show"}
        >
          {isVisible ? (
            <Eye className="h-3 w-3" />
          ) : (
            <EyeOff className="h-3 w-3" />
          )}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(shape.id);
          }}
          className="h-5 w-5 flex items-center justify-center rounded text-white/40 hover:text-red-400 hover:bg-red-500/10"
          title="Delete"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

interface LayersPanelProps {
  open: boolean;
  onClose: () => void;
}

const LayersPanel = ({ open, onClose }: LayersPanelProps) => {
  const dispatch = useAppDispatch();
  const shapesState = useAppSelector((s) => s.shapes);
  const selected = shapesState.selected;

  // Get shapes in reverse order (top layer first, like Figma)
  const shapes = React.useMemo(() => {
    const ids = shapesState.shapes.ids as string[];
    return [...ids]
      .reverse()
      .map((id) => shapesState.shapes.entities[id])
      .filter(Boolean) as Shape[];
  }, [shapesState.shapes]);

  const handleSelect = useCallback(
    (id: string, multi: boolean) => {
      if (!multi) dispatch(clearSelection());
      dispatch(selectShape(id));
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (id: string) => dispatch(removeShape(id)),
    [dispatch]
  );

  const handleToggleVisibility = useCallback(
    (id: string) => dispatch(toggleShapeVisibility(id)),
    [dispatch]
  );

  const handleRename = useCallback(
    (id: string, name: string) => dispatch(renameShape({ id, name })),
    [dispatch]
  );

  const handleMove = useCallback(
    (id: string, direction: "up" | "down") =>
      dispatch(moveShapeOrder({ id, direction })),
    [dispatch]
  );

  if (!open) return null;

  return (
    <aside className="absolute right-0 top-0 bottom-0 z-20 flex w-64 flex-col border-l border-white/10 bg-zinc-950/95 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-white/60" />
          <span className="text-sm font-medium text-white/80">Layers</span>
          <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-white/50">
            {shapes.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Layer list */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-0.5 p-2">
          {shapes.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Layers className="h-8 w-8 text-white/20" />
              <p className="text-xs text-white/30">
                No layers yet.
                <br />
                Draw something to get started.
              </p>
            </div>
          ) : (
            shapes.map((shape, index) => (
              <LayerItem
                key={shape.id}
                shape={shape}
                isSelected={!!selected[shape.id]}
                onSelect={handleSelect}
                onRemove={handleRemove}
                onToggleVisibility={handleToggleVisibility}
                onRename={handleRename}
                onMove={handleMove}
                isFirst={index === shapes.length - 1}
                isLast={index === 0}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default LayersPanel;
