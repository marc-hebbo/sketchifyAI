import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getMoodBoardImages = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    if (!project) {
      return [];
    }

    const storageIds = project.moodBoardImages || [];
    const images = await Promise.all(
      storageIds.map(async (storageId, index) => {
        try {
          const url = await ctx.storage.getUrl(storageId);
          return {
            id: `convex-${storageId}`,
            storageId,
            url,
            uploaded: true,
            uploading: false,
            index,
          };
        } catch (error) {
          return null;
        }
      })
    );

    return images
      .filter((image) => image !== null)
      .sort((a, b) => a!.index - b!.index);
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    // Generate a new upload URL that expires in 1 hour
    return await ctx.storage.generateUploadUrl();
  },
});

export const removeMoodBoardImage = mutation({
  args: {
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { projectId, storageId }) => {
    const project = await ctx.db.get(projectId);

    if (!project) {
      throw new Error("Project not found.");
    }

    const currentImages = project.moodBoardImages || [];

    const updatedImages = currentImages.filter((id) => id !== storageId);

    await ctx.db.patch(projectId, {
      moodBoardImages: updatedImages,
      lastModified: Date.now(),
    });

    try {
      await ctx.storage.delete(storageId);
    } catch (error) {
      console.error(`Failed to delete storage object ${storageId}:`, error);
    }
    return { success: true, imageCount: updatedImages.length };
  },
});

export const addMoodBoardImage = mutation({
  args: {
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { projectId, storageId }) => {
    const project = await ctx.db.get(projectId);

    if (!project) {
      throw new Error("Project not found.");
    }

    const currentImages = project.moodBoardImages || [];

    const updatedImages = [...currentImages, storageId];

    await ctx.db.patch(projectId, {
      moodBoardImages: updatedImages,
      lastModified: Date.now(),
    });

    return { success: true, imageCount: updatedImages.length };
  },
});
