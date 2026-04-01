import { moderateContent } from "@/lib/moderation";
import { NextResponse } from "next/server";

const RECRAFT_API_KEY = process.env.RECRAFT_API_KEY;
const RECRAFT_BASE_URL = "https://external.api.recraft.ai/v1";

interface RecraftResponse {
  data?: Array<{ url: string }>;
  error?: { message: string };
}

interface GenerateRequest {
  image?: string;
  brief?: string;
}

/**
 * Convert base64 data URI to a Blob
 */
function base64ToBlob(dataUri: string): Blob {
  const matches = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid data URI");

  const mimeType = matches[1];
  const base64Data = matches[2];
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeType });
}

/**
 * Generate image using Recraft.ai image-to-image transformation
 * The sketch is used as reference and transformed based on the prompt
 */
async function generateWithRecraft(
  imageDataUri: string,
  brief?: string
): Promise<string> {
  if (!RECRAFT_API_KEY) {
    throw new Error("Missing RECRAFT_API_KEY in environment.");
  }

  // Build prompt from user's brief
  const prompt = brief?.trim()
    ? `${brief}. High quality, detailed, professional rendering.`
    : "Transform this sketch into a polished, detailed image. High quality, professional rendering.";

  // Convert base64 to blob for multipart upload
  const imageBlob = base64ToBlob(imageDataUri);

  // Create form data for multipart request
  const formData = new FormData();
  formData.append("image", imageBlob, "sketch.png");
  formData.append("prompt", prompt);
  formData.append("strength", "0.75"); // Balance between sketch fidelity and transformation
  formData.append("model", "recraftv3");
  formData.append("n", "1");

  const response = await fetch(`${RECRAFT_BASE_URL}/images/imageToImage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RECRAFT_API_KEY}`,
      // Don't set Content-Type - let fetch set it with boundary for multipart
    },
    body: formData,
  });

  const data: RecraftResponse = await response.json();

  if (!response.ok) {
    console.error("Recraft API error:", data);
    throw new Error(data?.error?.message || "Recraft image generation failed.");
  }

  const imageUrl = data?.data?.[0]?.url;

  if (!imageUrl) {
    throw new Error("Recraft returned no image.");
  }

  return imageUrl;
}

export async function POST(request: Request) {
  try {
    if (!RECRAFT_API_KEY) {
      return NextResponse.json(
        { error: "Missing RECRAFT_API_KEY in environment." },
        { status: 500 }
      );
    }

    const payload: GenerateRequest = await request.json();
    const { image, brief } = payload;

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "Sketch image is required." },
        { status: 400 }
      );
    }

    // Validate image format
    if (!image.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid image format. Expected base64 data URI." },
        { status: 400 }
      );
    }

    // Check for inappropriate content using Gemini
    console.log("Moderating content...");
    const moderation = await moderateContent(brief, image);
    
    if (moderation.isInappropriate) {
      console.warn("Inappropriate content blocked:", moderation.reason);
      return NextResponse.json(
        { error: `Content restricted: ${moderation.reason || "Inappropriate content detected."}` },
        { status: 400 }
      );
    }

    // Generate image using sketch as reference
    console.log("Generating with Recraft.ai image-to-image...");
    console.log("Brief:", brief || "(none provided)");

    const imageUrl = await generateWithRecraft(image, brief);
    console.log("Generated image URL:", imageUrl);

    const usedPrompt = brief?.trim() || "Transformed from sketch";

    return NextResponse.json({
      imageUrl,
      prompt: usedPrompt,
    });
  } catch (error) {
    console.error("Image generation failed:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
