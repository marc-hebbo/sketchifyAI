import { MoodBoardImagesQuery, StyleGuideQuery } from "@/convex/query.config";
import { MoodBoardImage } from "@/hooks/use-styles";
import type { StyleGuide } from "@/redux/api/style-guide";
import React, { Suspense } from "react";
import StyleGuideContent from "@/components/style/style-guide-content";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ project: string }>;
};

const StyleGuidePage = async ({ searchParams }: Props) => {
  const projectId = (await searchParams).project;

  if (!projectId) {
    return (
      <Suspense fallback={null}>
        <StyleGuideContent
          projectId="local-standalone"
          initialGuide={null}
          initialGuideImages={[]}
        />
      </Suspense>
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
    <Suspense fallback={null}>
      <StyleGuideContent
        projectId={projectId}
        initialGuide={guide}
        initialGuideImages={guideImages}
      />
    </Suspense>
  );
};

export default StyleGuidePage;
