"use client";

import MoodBoard from "@/components/style/mood-board";
import ThemeContent from "@/components/style/theme";
import StyleGuideTypography from "@/components/style/typography";
import { TabsContent } from "@/components/ui/tabs";
import { MoodBoardImage } from "@/hooks/use-styles";
import { StyleGuide } from "@/redux/api/style-guide";
import { Palette } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  projectId: string;
  initialGuide: StyleGuide | null;
  initialGuideImages: MoodBoardImage[];
};

const getLocalStyleGuideStorageKey = (projectId: string) =>
  `s2c-style-guide:${projectId}`;

const StyleGuideContent = ({
  projectId,
  initialGuide,
  initialGuideImages,
}: Props) => {
  const [guide, setGuide] = useState<StyleGuide | null>(initialGuide);

  useEffect(() => {
    setGuide(initialGuide);
  }, [initialGuide, projectId]);

  useEffect(() => {
    if (!projectId.startsWith("local-")) return;

    const cachedGuide = localStorage.getItem(
      getLocalStyleGuideStorageKey(projectId)
    );
    if (!cachedGuide) return;

    try {
      setGuide(JSON.parse(cachedGuide) as StyleGuide);
    } catch (error) {
      console.error("Failed to parse cached local style guide", error);
    }
  }, [projectId]);

  const handleStyleGuideGenerated = (nextGuide: StyleGuide) => {
    setGuide(nextGuide);

    if (projectId.startsWith("local-")) {
      localStorage.setItem(
        getLocalStyleGuideStorageKey(projectId),
        JSON.stringify(nextGuide)
      );
    }
  };

  const colorGuide = guide?.colorSections || [];
  const typographyGuide = guide?.typographySections || [];

  return (
    <div>
      <TabsContent value="colours" className="space-y-8">
        {colorGuide.length === 0 ? (
          <div className="space-y-8">
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
                <Palette className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No colors generated yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                Upload images to your mood board and generate an AI-powered
                style guide with colors and typography.
              </p>
            </div>
          </div>
        ) : (
          <ThemeContent colorGuide={colorGuide} />
        )}
      </TabsContent>

      <TabsContent value="typography" className="space-y-8">
        <StyleGuideTypography typographyGuide={typographyGuide} />
      </TabsContent>

      <TabsContent value="moodboard" className="space-y-8">
        <MoodBoard
          guideImages={initialGuideImages}
          projectId={projectId}
          onStyleGuideGenerated={handleStyleGuideGenerated}
        />
      </TabsContent>
    </div>
  );
};

export default StyleGuideContent;
