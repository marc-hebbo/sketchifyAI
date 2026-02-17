import { MoodBoardImagesQuery, StyleGuideQuery } from "@/convex/query.config";
import { MoodBoardImage } from "@/hooks/use-styles";
import type { StyleGuide } from "@/redux/api/style-guide";
import React from "react";
import StyleGuideContent from "@/components/style/style-guide-content";

type Props = {
  searchParams: Promise<{ project: string }>;
};

const StyleGuidePage = async ({ searchParams }: Props) => {
  const projectId = (await searchParams).project;

  if (!projectId) {
    return (
      <StyleGuideContent
        projectId="local-standalone"
        initialGuide={null}
        initialGuideImages={[]}
      />
    );
  }

  const existingStyleGuide = await StyleGuideQuery(projectId);

  const guide =
    (existingStyleGuide.styleGuide?._valueJSON as unknown as StyleGuide) ||
    null;

  const existingMoodboardImages = await MoodBoardImagesQuery(projectId);

  const guideImages =
    (existingMoodboardImages.images?._valueJSON as unknown as MoodBoardImage[]) ||
    [];

  return (
    <StyleGuideContent
      projectId={projectId}
      initialGuide={guide}
      initialGuideImages={guideImages}
    />
  );
};

export default StyleGuidePage;
