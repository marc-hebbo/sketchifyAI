"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type ColorSwatchProps = {
  name: string;
  value: string;
  className?: string;
};

const ColorSwatch = ({ name, value, className }: ColorSwatchProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => {
      setCopied(false);
    }, 1200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [copied]);

  const handleCopy = useCallback(async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }

      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`Copied ${value}`);
    } catch {
      toast.error("Failed to copy color");
    }
  }, [value]);

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
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-md"
        aria-label={`Copy ${name} color value`}
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default ColorSwatch;
