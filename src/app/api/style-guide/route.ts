import { NextResponse } from "next/server";
import { StyleGuide } from "@/redux/api/style-guide";

const COLOR_SECTION_TITLES = [
  "Primary Colors",
  "Secondary & Accent Colors",
  "UI Component Colors",
  "Utility & Form Colors",
  "Status & Feedback Colors",
] as const;

const TYPOGRAPHY_SECTION_TITLES = ["Headings", "Body Text", "UI Text"] as const;

const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const buildFallbackStyleGuide = (): StyleGuide => {
  const colorSections: StyleGuide["colorSections"] = [
    {
      title: "Primary Colors",
      swatches: [
        {
          name: "Primary",
          hexColor: "#4F46E5",
          description: "Primary brand action color",
        },
      ],
    },
    {
      title: "Secondary & Accent Colors",
      swatches: [
        {
          name: "Accent",
          hexColor: "#F59E0B",
          description: "Secondary highlight color",
        },
      ],
    },
    {
      title: "UI Component Colors",
      swatches: [
        {
          name: "Surface",
          hexColor: "#111827",
          description: "Primary surface background",
        },
      ],
    },
    {
      title: "Utility & Form Colors",
      swatches: [
        {
          name: "Input Border",
          hexColor: "#9CA3AF",
          description: "Default input border color",
        },
      ],
    },
    {
      title: "Status & Feedback Colors",
      swatches: [
        {
          name: "Success",
          hexColor: "#10B981",
          description: "Positive confirmation color",
        },
      ],
    },
  ];

  const typographySections: StyleGuide["typographySections"] = [
    {
      title: "Headings",
      styles: [
        {
          name: "H1",
          fontFamily: "Inter, sans-serif",
          fontSize: "48px",
          fontWeight: "700",
          lineHeight: "1.1",
          letterSpacing: "-0.02em",
          description: "Primary display heading",
        },
      ],
    },
    {
      title: "Body Text",
      styles: [
        {
          name: "Body",
          fontFamily: "Inter, sans-serif",
          fontSize: "16px",
          fontWeight: "400",
          lineHeight: "1.6",
          letterSpacing: "0",
          description: "Default paragraph text",
        },
      ],
    },
    {
      title: "UI Text",
      styles: [
        {
          name: "Button",
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: "600",
          lineHeight: "1.2",
          letterSpacing: "0.01em",
          description: "Button and control labels",
        },
      ],
    },
  ];

  return {
    theme: "Modern Minimal",
    description: "Clean, high-contrast interface with clear visual hierarchy.",
    colorSections,
    typographySections,
  };
};

const stripCodeFences = (value: string) =>
  value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/, "")
    .trim();

const asString = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : fallback;
};

const normalizeColorSections = (value: unknown): StyleGuide["colorSections"] => {
  const source = Array.isArray(value) ? value : [];

  const sections = COLOR_SECTION_TITLES.map((title, index) => {
    const rawSection = source[index] as
      | {
          swatches?: unknown;
        }
      | undefined;

    const rawSwatches = Array.isArray(rawSection?.swatches)
      ? rawSection.swatches
      : [];

    const swatches = rawSwatches
      .map((swatch, swatchIndex) => {
        const rawSwatch = swatch as
          | {
              name?: unknown;
              hexColor?: unknown;
              description?: unknown;
            }
          | undefined;

        const color = asString(rawSwatch?.hexColor, "");
        if (!HEX_COLOR_REGEX.test(color)) return null;

        return {
          name: asString(rawSwatch?.name, `${title} ${swatchIndex + 1}`),
          hexColor: color,
          description: asString(rawSwatch?.description, ""),
        };
      })
      .filter(
        (
          swatch
        ): swatch is { name: string; hexColor: string; description: string } =>
          Boolean(swatch)
      )
      .slice(0, 6);

    if (swatches.length === 0) {
      return {
        title,
        swatches: [
          {
            name: `${title} 1`,
            hexColor: "#4F46E5",
            description: "AI fallback swatch",
          },
        ],
      };
    }

    return { title, swatches };
  });

  return [
    sections[0],
    sections[1],
    sections[2],
    sections[3],
    sections[4],
  ] as StyleGuide["colorSections"];
};

const normalizeTypographySections = (
  value: unknown
): StyleGuide["typographySections"] => {
  const source = Array.isArray(value) ? value : [];

  const sections = TYPOGRAPHY_SECTION_TITLES.map((title, index) => {
    const rawSection = source[index] as
      | {
          styles?: unknown;
        }
      | undefined;

    const rawStyles = Array.isArray(rawSection?.styles) ? rawSection.styles : [];

    const styles = rawStyles
      .map((style, styleIndex) => {
        const rawStyle = style as
          | {
              name?: unknown;
              fontFamily?: unknown;
              fontSize?: unknown;
              fontWeight?: unknown;
              lineHeight?: unknown;
              letterSpacing?: unknown;
              description?: unknown;
            }
          | undefined;

        const fontFamily = asString(rawStyle?.fontFamily, "Inter, sans-serif");
        const fontSize = asString(rawStyle?.fontSize, "16px");
        const fontWeight = asString(rawStyle?.fontWeight, "400");
        const lineHeight = asString(rawStyle?.lineHeight, "1.5");

        return {
          name: asString(rawStyle?.name, `${title} ${styleIndex + 1}`),
          fontFamily,
          fontSize,
          fontWeight,
          lineHeight,
          letterSpacing: asString(rawStyle?.letterSpacing, "0"),
          description: asString(rawStyle?.description, ""),
        };
      })
      .slice(0, 6);

    if (styles.length === 0) {
      return {
        title,
        styles: [
          {
            name: `${title} 1`,
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: "400",
            lineHeight: "1.5",
            letterSpacing: "0",
            description: "AI fallback typography style",
          },
        ],
      };
    }

    return { title, styles };
  });

  return [sections[0], sections[1], sections[2]] as StyleGuide["typographySections"];
};

const normalizeStyleGuide = (value: unknown): StyleGuide => {
  const raw = value as
    | {
        theme?: unknown;
        description?: unknown;
        colorSections?: unknown;
        typographySections?: unknown;
      }
    | undefined;

  return {
    theme: asString(raw?.theme, "Generated Style Guide"),
    description: asString(
      raw?.description,
      "AI-generated guide based on your moodboard images."
    ),
    colorSections: normalizeColorSections(raw?.colorSections),
    typographySections: normalizeTypographySections(raw?.typographySections),
  };
};

const prompt = `Analyze the provided moodboard images and generate a complete UI style guide.

Return ONLY valid JSON (no markdown), using this exact structure:
{
  "theme": "string",
  "description": "string",
  "colorSections": [
    {
      "title": "Primary Colors",
      "swatches": [{ "name": "string", "hexColor": "#RRGGBB", "description": "string" }]
    },
    {
      "title": "Secondary & Accent Colors",
      "swatches": [{ "name": "string", "hexColor": "#RRGGBB", "description": "string" }]
    },
    {
      "title": "UI Component Colors",
      "swatches": [{ "name": "string", "hexColor": "#RRGGBB", "description": "string" }]
    },
    {
      "title": "Utility & Form Colors",
      "swatches": [{ "name": "string", "hexColor": "#RRGGBB", "description": "string" }]
    },
    {
      "title": "Status & Feedback Colors",
      "swatches": [{ "name": "string", "hexColor": "#RRGGBB", "description": "string" }]
    }
  ],
  "typographySections": [
    {
      "title": "Headings",
      "styles": [
        {
          "name": "string",
          "fontFamily": "string",
          "fontSize": "string",
          "fontWeight": "string",
          "lineHeight": "string",
          "letterSpacing": "string",
          "description": "string"
        }
      ]
    },
    {
      "title": "Body Text",
      "styles": [
        {
          "name": "string",
          "fontFamily": "string",
          "fontSize": "string",
          "fontWeight": "string",
          "lineHeight": "string",
          "letterSpacing": "string",
          "description": "string"
        }
      ]
    },
    {
      "title": "UI Text",
      "styles": [
        {
          "name": "string",
          "fontFamily": "string",
          "fontSize": "string",
          "fontWeight": "string",
          "lineHeight": "string",
          "letterSpacing": "string",
          "description": "string"
        }
      ]
    }
  ]
}

Rules:
- Keep section titles exactly as shown.
- Provide 3 to 6 colors per color section.
- All color values must be valid hex colors.
- Keep all descriptions concise and practical.
- Favor coherent, production-ready design systems over artistic one-offs.`;

const imageToPart = (image: string) => {
  const dataUriMatch = image.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
  if (dataUriMatch) {
    return {
      inlineData: {
        mimeType: dataUriMatch[1],
        data: dataUriMatch[2],
      },
    };
  }

  return {
    text: `Reference image URL: ${image}`,
  };
};

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY in environment." },
      { status: 500 }
    );
  }

  try {
    const payload = (await request.json()) as { images?: unknown };
    const images = Array.isArray(payload.images)
      ? payload.images
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 8)
      : [];

    if (images.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required." },
        { status: 400 }
      );
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }, ...images.map((image) => imageToPart(image))],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const geminiData = await geminiResponse.json();
    if (!geminiResponse.ok) {
      return NextResponse.json(
        {
          error:
            geminiData?.error?.message ||
            "Gemini request failed while generating a style guide.",
        },
        { status: 502 }
      );
    }

    const candidateText =
      geminiData?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part?.text || "")
        .join("\n") || "";

    if (!candidateText.trim()) {
      return NextResponse.json(
        { error: "Gemini returned an empty response." },
        { status: 502 }
      );
    }

    let parsedResponse: unknown;
    try {
      parsedResponse = JSON.parse(stripCodeFences(candidateText));
    } catch {
      parsedResponse = buildFallbackStyleGuide();
    }

    const styleGuide = normalizeStyleGuide(parsedResponse);
    return NextResponse.json({ styleGuide });
  } catch (error) {
    console.error("Style guide generation failed", error);
    return NextResponse.json(
      {
        error: "Failed to generate style guide.",
        styleGuide: buildFallbackStyleGuide(),
      },
      { status: 500 }
    );
  }
}
