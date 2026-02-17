"use client";

import { Button } from "@/components/ui/button";
import { MoodBoardImage, useMoodBoard } from "@/hooks/use-styles";
import { StyleGuide } from "@/redux/api/style-guide";
import { cn } from "@/lib/utils";
import { Loader2, Upload } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import ImagesBoard from "./images.board";

type Props = {
  guideImages: MoodBoardImage[];
  projectId: string;
  onStyleGuideGenerated: (guide: StyleGuide) => void;
};

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getImagePayload = async (image: MoodBoardImage) => {
  if (image.file) {
    return await toDataUrl(image.file);
  }
  if (
    image.preview.startsWith("data:image/") ||
    image.preview.startsWith("http://") ||
    image.preview.startsWith("https://")
  ) {
    return image.preview;
  }
  return null;
};

const MoodBoard = ({ guideImages, projectId, onStyleGuideGenerated }: Props) => {
  const {
    images,
    dragActive,
    removeImage,
    handleDrag,
    handleDrop,
    handleFileInput,
    canAddMore,
  } = useMoodBoard(guideImages);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleGenerateWithAI = async () => {
    if (!images.length) {
      toast.error("Upload at least one image first.");
      return;
    }

    setIsGenerating(true);
    try {
      const imagePayloads = (
        await Promise.all(images.map((image) => getImagePayload(image)))
      ).filter((value): value is string => Boolean(value));

      if (!imagePayloads.length) {
        toast.error("No valid images found for generation.");
        return;
      }

      const response = await fetch("/api/style-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          images: imagePayloads,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate style guide.");
      }

      if (!data?.styleGuide) {
        throw new Error("AI response did not include a style guide.");
      }

      onStyleGuideGenerated(data.styleGuide as StyleGuide);
      toast.success("Style guide generated.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate style guide.";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 min-h-[400px] flex items-center justify-center",
          dragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border/50 hover:border-border"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-3xl" />
        </div>

        {images.length > 0 && (
          <>
            <div className="lg:hidden absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {images.map((image, index) => {
                  const seed = image.id
                    .split("")
                    .reduce((a, b) => a + b.charCodeAt(0), 0);

                  const random1 = ((seed * 9301 + 49297) % 233280) / 233280;

                  const random2 =
                    (((seed + 1) * 9301 + 49297) % 233280) / 233280;
                  const random3 =
                    (((seed + 2) * 9301 + 49297) % 233280) / 233280;

                  const rotation = (random1 - 0.5) * 20; // -10 to +10 degrees for subtle tilt
                  const xOffset = (random2 - 0.5) * 40; // -20 to +20 pixels for subtle horizontal offset
                  const yOffset = (random3 - 0.5) * 30; // -15 to +15 pixels for subtle vertical offset

                  return (
                    <ImagesBoard
                      key={`mobile-${image.id}`}
                      image={image}
                      removeImage={removeImage}
                      xOffset={xOffset}
                      yOffset={yOffset}
                      rotation={rotation}
                      zIndex={index + 1}
                      marginLeft="-80px"
                      marginTop="-96px"
                    />
                  );
                })}
              </div>
            </div>

            <div className="hidden lg:flex absolute inset-0 items-center justify-center">
              <div className="relative w-full max-w-[700px] h-[300px] mx-auto">
                {images.length > 0 && (
                  <>
                    {images.map((image, index) => {
                      const seed = image.id
                        .split("")
                        .reduce((a, b) => a + b.charCodeAt(0), 0);

                      const random1 = ((seed * 9301 + 49297) % 233280) / 233280;

                      // const random2 =
                      //   (((seed + 1) * 9301 + 49297) % 233280) / 233280;
                      const random3 =
                        (((seed + 2) * 9301 + 49297) % 233280) / 233280;

                      // Sequential positioning: each image moves right with slight overlap
                      const imageWidth = 192; // w-48 == 192px
                      const overlapAmount = 30; // Reduced overlap
                      const spacing = imageWidth - overlapAmount; // 162px between image centers

                      // Position from left to right with slight random rotation and minimal vertical offset
                      const rotation = (random1 - 0.5) * 50; // -25 to +25 degrees for subtle tilt
                      const xOffset =
                        index * spacing - ((images.length - 1) * spacing) / 2; // Center the sequence
                      const yOffset = (random3 - 0.5) * 30; // -15 to +15 pixels for subtle vertical offset
                      const zIndex = index + 1; // Later images on top
                      return (
                        <ImagesBoard
                          key={`mobile-${image.id}`}
                          image={image}
                          removeImage={removeImage}
                          xOffset={xOffset}
                          yOffset={yOffset}
                          rotation={rotation}
                          zIndex={zIndex}
                          marginLeft="-80px"
                          marginTop="-96px"
                        />
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {images.length === 0 && (
          <div className="relative z-10 space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">
                Drop your images here
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Drag and drop images to build your mood board
              </p>
            </div>

            <Button onClick={handleUploadClick} variant={"outline"}>
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          </div>
        )}

        {images.length > 0 && canAddMore && (
          <div className="absolute bottom-6 right-6 z-20">
            <Button onClick={handleUploadClick} size={"sm"} variant={"outline"}>
              <Upload className="w-4 h-4 mr-2" />
              Add More
            </Button>
          </div>
        )}

        <input
          title="Input"
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
      <Button
        className="w-fit"
        onClick={handleGenerateWithAI}
        disabled={isGenerating || images.length === 0}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate with AI"
        )}
      </Button>
    </div>
  );
};

export default MoodBoard;
