import CanvasWorkspace from "@/components/canvas/workspace";
import React, { Suspense } from "react";

export const dynamic = "force-dynamic";

const CanvasPage = () => {
  return (
    <Suspense fallback={null}>
      <CanvasWorkspace />
    </Suspense>
  );
};

export default CanvasPage;
