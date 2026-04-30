import { MoodBoardImage } from "@/hooks/use-styles";
import React, { Suspense } from "react";
import StyleGuideContent from "@/components/style/style-guide-content";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ project: string }>;
};

const StyleGuidePage = async ({ searchParams }: Props) => {
  const projectId = (await searchParams).project;

  return (
    <Suspense fallback={null}>
      <StyleGuideContent
        projectId={projectId || "local-standalone"}
        initialGuide={null}
        initialGuideImages={[]}
      />
    </Suspense>
  );
};

export default StyleGuidePage;
