import { moderateContent } from "@/lib/moderation";
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_IMAGE_MODELS = Array.from(
  new Set(
    [
      process.env.GEMINI_IMAGE_MODEL?.trim(),
      "gemini-3.1-flash-image-preview",
      "gemini-2.5-flash-image",
      "gemini-2.5-flash-image-preview",
      "gemini-2.0-flash-preview-image-generation",
    ].filter((value): value is string => Boolean(value))
  )
);

const HEX_COLOR_REGEX = /^#([a-f0-9]{3}|[a-f0-9]{6})$/i;
const RGB_COLOR_REGEX =
  /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i;

interface CanvasColors {
  strokeColors?: string[];
  fillColors?: string[];
}

interface GenerateRequest {
  image?: string;
  brief?: string;
  colors?: CanvasColors;
}

interface GeminiInlineData {
  mimeType?: string;
  mime_type?: string;
  data: string;
}

interface GeminiInlineDataPart {
  inlineData?: GeminiInlineData;
  inline_data?: GeminiInlineData;
}

interface GeminiTextPart {
  text: string;
}

type GeminiPart = GeminiInlineDataPart | GeminiTextPart;

interface GeminiResponse {
  candidates?: Array<{
    content: { parts: GeminiPart[] };
  }>;
  error?: { message: string; code: number };
}

function getInlineData(part: GeminiPart): GeminiInlineData | null {
  if ("inlineData" in part && part.inlineData) return part.inlineData;
  if ("inline_data" in part && part.inline_data) return part.inline_data;
  return null;
}

/**
 * Map a hex color to a human-readable semantic description by HSL hue analysis.
 * Fill colors are the primary semantic signal — each filled region = a distinct object.
 */
function interpretColor(hex: string): string {
  const clean = hex.replace("#", "").padEnd(6, "0");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const s =
    max === min
      ? 0
      : l < 0.5
      ? (max - min) / (max + min)
      : (max - min) / (2 - max - min);

  let h = 0;
  if (max !== min) {
    if (max === r) h = ((g - b) / (max - min) + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / (max - min) + 2) / 6;
    else h = ((r - g) / (max - min) + 4) / 6;
  }
  const hDeg = h * 360;

  if (l > 0.88 && s < 0.15) return "clouds, snow, or bright open sky";
  if (l < 0.12) return "shadow, dark void, or night sky";
  if (s < 0.12) {
    if (l > 0.65) return "concrete, pale stone, or light metal";
    if (l > 0.38) return "stone, pavement, or weathered metal";
    return "dark stone, asphalt, or deep shadow";
  }

  if (hDeg < 20) return "fire, brick wall, or red earth";
  if (hDeg < 45) return "warm wood, clay earth, or terracotta";
  if (hDeg < 70) return "dry grass, sandy ground, or sunlit surface";
  if (hDeg < 150) return l > 0.5 ? "grass, leaves, or lush vegetation" : "forest, dense foliage, or dark vegetation";
  if (hDeg < 200) return "water, river, or teal surface";
  if (hDeg < 255) return l > 0.55 ? "sky, open air, or clear atmosphere" : "deep ocean, lake, or deep sky";
  if (hDeg < 290) return "mountain shadow, distant hills, or purple haze";
  if (hDeg < 340) return "flower, decorative surface, or accent object";
  return "warm tinted surface or decorative region";
}

function toHexByte(value: number): string {
  return Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0");
}

function normalizeColorToHex(color: string): string | null {
  const cleaned = color.trim();
  if (!cleaned) return null;

  if (HEX_COLOR_REGEX.test(cleaned)) {
    const normalized = cleaned.toLowerCase();
    if (normalized.length === 4) {
      return `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
    }
    return normalized;
  }

  const rgbMatch = cleaned.match(RGB_COLOR_REGEX);
  if (!rgbMatch) return null;

  const r = Number.parseInt(rgbMatch[1], 10);
  const g = Number.parseInt(rgbMatch[2], 10);
  const b = Number.parseInt(rgbMatch[3], 10);
  const alpha = rgbMatch[4] !== undefined ? Number.parseFloat(rgbMatch[4]) : 1;

  if ([r, g, b].some((v) => Number.isNaN(v) || v < 0 || v > 255)) return null;
  if (Number.isNaN(alpha) || alpha <= 0) return null;

  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
}

function extractPalette(colors?: CanvasColors): { fills: string[]; strokes: string[] } {
  const normalizeList = (values: string[] | undefined) => {
    const normalized = (values ?? [])
      .map((value) => normalizeColorToHex(value))
      .filter((value): value is string => Boolean(value));
    return Array.from(new Set(normalized));
  };

  return {
    fills: normalizeList(colors?.fillColors),
    strokes: normalizeList(colors?.strokeColors),
  };
}

/**
 * Build the color-to-semantic mapping section of the prompt.
 * Fill colors carry the primary spatial/semantic meaning.
 * Stroke colors define boundaries.
 */
function buildColorInterpretations(colors?: CanvasColors): string {
  if (!colors) return "";

  const DEFAULT_COLORS = new Set(["#ffffff", "#000000"]);
  const palette = extractPalette(colors);

  const fills = palette.fills.filter((c) => !DEFAULT_COLORS.has(c));
  const strokes = palette.strokes.filter((c) => !DEFAULT_COLORS.has(c));

  if (fills.length === 0 && strokes.length === 0) return "";

  const lines: string[] = [];
  fills.forEach((c) => lines.push(`  - Filled region ${c} → ${interpretColor(c)}`));
  strokes.forEach((c) => lines.push(`  - Outline/stroke ${c} → ${interpretColor(c)} boundary`));

  return lines.join("\n");
}

/**
 * Build the full Gemini prompt for strict sketch-to-image transformation.
 * The sketch is the spatial ground truth. The user text defines what the sketch represents.
 */
function buildPrompt(brief?: string, colors?: CanvasColors): string {
  const palette = extractPalette(colors);
  const strictPalette = Array.from(new Set([...palette.fills, ...palette.strokes]));
  const colorBlock = buildColorInterpretations(colors);
  const hasColorHints = colorBlock.length > 0;
  const hasStrictPalette = strictPalette.length > 0;

  const styleIntent = brief?.trim()
    ? `USER DESCRIPTION (required semantic meaning): "${brief.trim()}"`
    : "USER DESCRIPTION: No written description was provided, so infer the subject from the drawing only.";

  const strictPaletteSection = hasStrictPalette
    ? `LOCKED COLOR PALETTE (required):
- Use only these sketch colors as the main palette: ${strictPalette.join(", ")}
- Keep colors simple, flat, and easy to recognize
- Do not shift hue away from the palette
- Preserve per-region color identity from the sketch`
    : "";

  const colorSection = hasColorHints
    ? `Interpret each colored region according to its semantic meaning:\n${colorBlock}`
    : "Each shape represents a distinct object or surface. Interpret based on context.";

  return `Using the provided sketch image and the user's written description together, generate a clean 2D illustration.

${styleIntent}

CORE INTERPRETATION RULES (non-negotiable):
- The written description defines what the drawing is supposed to represent
- The drawing defines the exact composition, positions, shapes, and color placement
- Always associate the drawing with the written description; do not ignore either one
- If the drawing is abstract or rough, interpret its shapes as the objects described by the user
- If the text and drawing differ, keep the drawing's layout but use the text to label the intended subject

STRUCTURAL CONSTRAINTS (non-negotiable):
- Preserve the exact shapes, boundaries, and composition from the sketch
- Every region must appear at the same position and scale as in the sketch
- Do NOT add new objects, remove existing ones, or recompose the scene
- Do NOT merge separate regions into one
- Do NOT distort proportions or alter the perspective
- Keep all edges aligned with the sketch boundaries

COLOR AND SEMANTIC INTERPRETATION:
${colorSection}
${strictPaletteSection}

2D STYLE REQUIREMENTS:
- Output must be a flat 2D image, not 3D
- Do NOT use 3D rendering, perspective depth, realistic lighting, volumetric shadows, bevels, clay style, isometric style, or photorealism
- Use simple flat fills, clean outlines, and minimal texture
- Keep the original sketch colors simple and visually dominant
- Make the result look like a polished 2D cartoon, icon, sticker, or clean digital illustration
- Keep edges sharp and aligned with the sketch structure

Output quality: clean, simple, polished 2D illustration with clear color matching

The final image must look like a refined 2D version of the user's drawing that clearly matches the user's written description. Same structure, same layout, same simple color identity.`;
}

/**
 * Parse a base64 data URI into its components
 */
function parseDataUri(dataUri: string): { mimeType: string; data: string } {
  const matches = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid image data URI.");
  return { mimeType: matches[1], data: matches[2] };
}

/**
 * Call Gemini image generation with the sketch as image input.
 * Returns a base64 data URI of the generated image.
 */
async function generateWithGemini(
  imageDataUri: string,
  brief?: string,
  colors?: CanvasColors
): Promise<{ imageDataUri: string; prompt: string }> {
  if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY in environment.");

  const { mimeType, data } = parseDataUri(imageDataUri);
  const prompt = buildPrompt(brief, colors);

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType, data } },
          { text: prompt },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"],
    },
  };

  let lastErrorMessage = "Gemini image generation failed.";

  for (const model of GEMINI_IMAGE_MODELS) {
    const response = await fetch(
      `${GEMINI_BASE_URL}/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const geminiData: GeminiResponse = await response.json();

    if (!response.ok || geminiData.error) {
      lastErrorMessage = geminiData.error?.message || lastErrorMessage;
      console.error(`Gemini image model ${model} failed:`, JSON.stringify(geminiData));
      continue;
    }

    const parts = geminiData.candidates?.[0]?.content?.parts;
    if (!parts?.length) {
      lastErrorMessage = `Model ${model} returned no content.`;
      continue;
    }

    const imageData = parts.map(getInlineData).find(Boolean);

    if (!imageData) {
      lastErrorMessage = `Model ${model} did not return an image output.`;
      continue;
    }

    return {
      imageDataUri: `data:${imageData.mimeType || imageData.mime_type || "image/png"};base64,${imageData.data}`,
      prompt,
    };
  }

  throw new Error(lastErrorMessage);
}

export async function POST(request: Request) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in environment." },
        { status: 500 }
      );
    }

    const payload: GenerateRequest = await request.json();
    const { image, brief, colors } = payload;

    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "Sketch image is required." }, { status: 400 });
    }

    if (!image.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid image format. Expected base64 data URI." },
        { status: 400 }
      );
    }

    console.log("Moderating content...");
    const moderation = await moderateContent(brief, image);
    if (moderation.isInappropriate) {
      console.warn("Safety violation blocked:", moderation.reason);
      return NextResponse.json(
        {
          error: `${moderation.error || "Safety Violation"}: Content restricted.`,
          reason: moderation.reason,
        },
        { status: 403 }
      );
    }

    console.log("Generating with Gemini image editing...");
    console.log("Brief:", brief || "(none)");
    console.log("Fill colors:", colors?.fillColors ?? []);
    console.log("Stroke colors:", colors?.strokeColors ?? []);

    const { imageDataUri, prompt } = await generateWithGemini(image, brief, colors);

    return NextResponse.json({ imageUrl: imageDataUri, prompt });
  } catch (error) {
    console.error("Image generation failed:", error);
    const message = error instanceof Error ? error.message : "Failed to generate image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
