type PreloadedValue<T> = {
  _valueJSON: T;
};

type GuestProfile = {
  id: string | null;
  name: string | null;
};

export const ProfileQuery = async () => null;

export const SubscriptionEntitlementQuery = async (): Promise<{
  entitlement: PreloadedValue<boolean> | null;
  profileName: string | null;
}> => {
  return { entitlement: null, profileName: "guest" };
};

export const ProjectQuery = async (): Promise<{
  projects: PreloadedValue<unknown[]> | null;
  profile: GuestProfile | null;
}> => {
  return {
    projects: null,
    profile: {
      id: null,
      name: "guest",
    },
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
