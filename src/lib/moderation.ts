/**
 * Moderation utility using Gemini API to act as a Primary Safety Firewall
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface ModerationResult {
  isInappropriate: boolean;
  reason?: string;
  error?: string;
}

// Quick keyword check for obviously inappropriate content - No-Generation Zone
const BANNED_KEYWORDS = [
  "bloody", "weapon", "gore", "kill", "murder", "violence", "violent", "gun", "knife",
  "sexual", "sex", "porn", "explicit", "nudity", "hate", "harassment", "suicide",
  "self-harm", "illegal", "drug", "bomb", "explosion", "terrorist", "assault"
];

/**
 * Checks if the provided text or image is inappropriate using Gemini
 * acting as the Primary Safety Firewall for the sketch-to-app pipeline.
 */
export async function moderateContent(
  text?: string,
  imageUri?: string
): Promise<ModerationResult> {
  // 1. Quick local scan for restricted keywords and harmful intent in text
  if (text) {
    const lowerText = text.toLowerCase();
    const foundKeyword = BANNED_KEYWORDS.find(keyword => lowerText.includes(keyword));
    if (foundKeyword) {
      return {
        isInappropriate: true,
        reason: "RESTRICTED_CONTENT_DETECTED",
        error: "Safety Violation"
      };
    }
  }

  if (!GEMINI_API_KEY) {
    console.warn("Missing GEMINI_API_KEY for moderation. Skipping cloud check.");
    return { isInappropriate: false };
  }

  try {
    const parts: any[] = [
      {
        text: `System Instruction:
You are the Primary Safety Firewall for a sketch-to-app pipeline. You sit at the very beginning of the stack. Your only job is to validate the input. If you fail, the entire system is compromised.

The Rules:
No-Generation Zone: If the user description contains violent keywords (bloody, weapons, gore, kill, etc.) or sexual intent, you are legally and logically forbidden from performing any design tasks.
Contextual Intent: Even if the image is a simple shape (rectangle, circle, sketch), you must judge the intent based on the text. A rectangle + "a bloody scene" = VIOLATION.
JSON Lock: You are a headless service. You do not talk to humans. You only output structured JSON.

Evaluation Logic:
Step A: Scan image for restricted visual elements.
Step B: Scan text for restricted keywords and harmful intent.
Step C: Determine if the combination is safe.

Response Format:
IF VIOLATION: Output exactly: {"status": "blocked", "error": "Safety Violation", "reason": "RESTRICTED_CONTENT_DETECTED"}
IF SAFE: Output exactly: {"status": "safe", "action": "proceed_to_design"}`,
      },
    ];

    if (text) {
      parts.push({ text: `Analyze the provided image and this description: "${text}"` });
    } else {
      parts.push({ text: `Analyze the provided image.` });
    }

    if (imageUri) {
      const dataUriMatch = imageUri.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
      if (dataUriMatch) {
        parts.push({
          inlineData: {
            mimeType: dataUriMatch[1],
            data: dataUriMatch[2],
          },
        });
      }
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini moderation API error:", response.status, errorText);
      return { isInappropriate: false }; 
    }

    const data = await response.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      console.error("Empty response from Gemini moderation");
      return { isInappropriate: false };
    }
    
    try {
      const result = JSON.parse(resultText.replace(/```json\n?|\n?```/g, "").trim());
      
      if (result.status === "blocked") {
        return {
          isInappropriate: true,
          reason: result.reason,
          error: result.error
        };
      }

      return {
        isInappropriate: false
      };
    } catch (e) {
      console.error("Failed to parse moderation response:", resultText);
      return { isInappropriate: false };
    }
  } catch (error) {
    console.error("Moderation check failed:", error);
    return { isInappropriate: false };
  }
}
