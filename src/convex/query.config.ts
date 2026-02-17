type PreloadedValue<T> = {
  _valueJSON: T;
};

export const ProjectQuery = async (): Promise<{
  projects: PreloadedValue<unknown[]> | null;
}> => {
  return {
    projects: null,
  };
};

export const StyleGuideQuery = async (
  projectId: string
): Promise<{ styleGuide: PreloadedValue<unknown> | null }> => {
  if (!projectId || projectId.startsWith("local-")) return { styleGuide: null };
  return { styleGuide: null };
};

export const MoodBoardImagesQuery = async (
  projectId: string
): Promise<{ images: PreloadedValue<unknown[]> | null }> => {
  if (!projectId || projectId.startsWith("local-")) return { images: null };
  return { images: null };
};
