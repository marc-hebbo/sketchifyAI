import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCurrentUser = query({
  args: {},
  handler: async () => null,
});

export const ensureUser = mutation({
  args: {
    authUserId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, { authUserId, email, name, image }) => {
    const existingByAuthUserId = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", authUserId))
      .unique();

    if (existingByAuthUserId) {
      await ctx.db.patch(existingByAuthUserId._id, {
        email,
        image,
        name,
      });
      return existingByAuthUserId._id;
    }

    const existingByEmail = email
      ? await ctx.db
          .query("users")
          .withIndex("by_email", (q) => q.eq("email", email))
          .unique()
      : null;

    if (existingByEmail) {
      await ctx.db.patch(existingByEmail._id, {
        authUserId,
        email,
        image,
        name,
      });
      return existingByEmail._id;
    }

    return await ctx.db.insert("users", {
      authUserId,
      email,
      image,
      name,
    });
  },
});
