"use client";

import React, { useCallback } from "react";
import { Paintbrush, PenLine, Ban } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  setCurrentStroke,
  setCurrentFill,
  updateShape,
} from "@/redux/slice/shapes";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#ffffff",
  "#000000",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
  "#14b8a6",
  "#f59e0b",
];

type ColorMode = "stroke" | "fill";

interface ColorSwatchProps {
  color: string;
  active: boolean;
  onClick: () => void;
}

const ColorSwatch = ({ color, active, onClick }: ColorSwatchProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "h-6 w-6 rounded-md border-2 transition-all hover:scale-110",
      active ? "border-white ring-1 ring-white/50" : "border-white/20"
    )}
    style={{ backgroundColor: color }}
  />
);

const ColorPicker = () => {
  const dispatch = useAppDispatch();
  const currentStroke = useAppSelector((s) => s.shapes.currentStroke);
  const currentFill = useAppSelector((s) => s.shapes.currentFill);
  const selected = useAppSelector((s) => s.shapes.selected);
  const selectedIds = Object.keys(selected);

  const applyToSelected = useCallback(
    (mode: ColorMode, color: string | null) => {
      selectedIds.forEach((id) => {
        const patch =
          mode === "stroke" ? { stroke: color ?? "#ffffff" } : { fill: color };
        dispatch(updateShape({ id, patch }));
      });
    },
    [dispatch, selectedIds]
  );

  const handleStrokeChange = useCallback(
    (color: string) => {
      dispatch(setCurrentStroke(color));
      if (selectedIds.length > 0) applyToSelected("stroke", color);
    },
    [dispatch, selectedIds.length, applyToSelected]
  );

  const handleFillChange = useCallback(
    (color: string | null) => {
      dispatch(setCurrentFill(color));
      if (selectedIds.length > 0) applyToSelected("fill", color);
    },
    [dispatch, selectedIds.length, applyToSelected]
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Stroke color */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-10 w-10 rounded-xl border border-white/10 p-0"
            aria-label="Stroke color"
          >
            <div className="relative flex items-center justify-center">
              <PenLine className="h-4 w-4 text-white/70" />
              <div
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-5 rounded-full"
                style={{ backgroundColor: currentStroke }}
              />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="start"
          className="w-52 bg-zinc-950 border-white/10 p-3"
        >
          <p className="text-xs font-medium text-white/60 mb-2">Stroke</p>
          <div className="grid grid-cols-6 gap-1.5 mb-3">
            {PRESET_COLORS.map((color) => (
              <ColorSwatch
                key={color}
                color={color}
                active={currentStroke === color}
                onClick={() => handleStrokeChange(color)}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentStroke}
              onChange={(e) => handleStrokeChange(e.target.value)}
              className="h-7 w-7 cursor-pointer rounded border border-white/10 bg-transparent p-0.5"
            />
            <span className="text-xs text-white/50 font-mono uppercase">
              {currentStroke}
            </span>
          </div>
        </PopoverContent>
      </Popover>

      {/* Fill color */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-10 w-10 rounded-xl border border-white/10 p-0"
            aria-label="Fill color"
          >
            <div className="relative flex items-center justify-center">
              <Paintbrush className="h-4 w-4 text-white/70" />
              <div
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-5 rounded-full border border-white/20"
                style={{
                  backgroundColor: currentFill ?? "transparent",
                  backgroundImage: currentFill
                    ? undefined
                    : "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
                }}
              />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="start"
          className="w-52 bg-zinc-950 border-white/10 p-3"
        >
          <p className="text-xs font-medium text-white/60 mb-2">Fill</p>
          <button
            type="button"
            onClick={() => handleFillChange(null)}
            className={cn(
              "mb-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors w-full",
              currentFill === null
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white/70 hover:bg-white/5"
            )}
          >
            <Ban className="h-3.5 w-3.5" />
            No fill
          </button>
          <div className="grid grid-cols-6 gap-1.5 mb-3">
            {PRESET_COLORS.map((color) => (
              <ColorSwatch
                key={color}
                color={color}
                active={currentFill === color}
                onClick={() => handleFillChange(color)}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentFill ?? "#ffffff"}
              onChange={(e) => handleFillChange(e.target.value)}
              className="h-7 w-7 cursor-pointer rounded border border-white/10 bg-transparent p-0.5"
            />
            <span className="text-xs text-white/50 font-mono uppercase">
              {currentFill ?? "none"}
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
