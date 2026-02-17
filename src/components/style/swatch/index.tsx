import { cn } from "@/lib/utils";
import React from "react";

type ColorSwatchProps = {
  name: string;
  value: string;
  className?: string;
};

const ColorSwatch = ({ name, value, className }: ColorSwatchProps) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="w-12 h-12 rounded-lg border border-border/20 flex-shrink-0"
        style={{ backgroundColor: value }}
      ></div>
      <div className="space-y-1 flex-1">
        <h4 className="text-sm text-muted-foreground font-mono uppercase">
          {name}
        </h4>
        <p className="text-xs text-muted-foreground font-mono uppercase">
          {value}
        </p>
      </div>
    </div>
  );
};

export default ColorSwatch;
