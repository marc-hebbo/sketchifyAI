import { combinedSlug } from "@/lib/utils";

export type ConvexUserRaw = {
  _id: string;
  _creationTime: number;
  email: string;
  emailVerificationTime?: number;
  image?: string;
  name?: string;
};

type Profile = {
  id: string;
  createdArMs: number;
  email: string;
  emailVerificationAtMs?: number;
  image?: string;
  name?: string;
};

export const normalizeProfile = (raw: ConvexUserRaw | null): Profile | null => {
  if (!raw) return null;
  const extractNameFromEmail = (email: string): string => {
    const username = email.split("@")[0];
    return username
      .split(/[._-]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  };

  const name = combinedSlug(raw.name!) || extractNameFromEmail(raw.email);


  return {
    id: raw._id,
    createdArMs: raw._creationTime,
    email: raw.email,
    emailVerificationAtMs: raw.emailVerificationTime,
    image: raw.image,
    name,
  }
};
