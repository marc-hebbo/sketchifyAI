/**
 * Moderation utility using Gemini API to check for inappropriate content
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface ModerationResult {
  isInappropriate: boolean;
  reason?: string;
  summary?: string;
}

// Quick keyword check for obviously inappropriate content
const BANNED_KEYWORDS = [
  "violence", "violent", "gore", "weapon", "gun", "knife", "killing", "murder", "blood",
  "hate", "harassment", "nudity", "sex", "explicit", "porn", "suicide", "self-harm",
  "illegal", "drug", "bomb", "explosion", "terrorist", "assault"
];

/**
 * Checks if the provided text or image is inappropriate using Gemini
 * based on the Safety Moderation Engine guidelines.
 */
export async function moderateContent(
  text?: string,
  imageUri?: string
): Promise<ModerationResult> {
  // 1. Quick local check for obvious violations in text
  if (text) {
    const lowerText = text.toLowerCase();
    const foundKeyword = BANNED_KEYWORDS.find(keyword => lowerText.includes(keyword));
    if (foundKeyword) {
      return {
        isInappropriate: true,
        reason: "textual_violation",
        summary: `Blocked due to restricted keyword: ${foundKeyword}`
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
You are the Safety Moderation Engine for a sketch-to-image application. Your role is to analyze a user's sketch (image) and description (text) simultaneously.

Safety Criteria:
Visual: Block graphic violence, nudity, anatomical sketches, hate symbols, or dehumanizing depictions of individuals.
Textual: Block profanity, hate speech, sexual innuendo, or descriptions of illegal acts.
Cross-Check: Block the request if an innocent sketch (e.g., a cylinder) is paired with a suggestive or violent description.

Output Format (Strict):
You must respond only in JSON format. Do not include prose or explanations outside the JSON block.

If Blocked:
{"status": "rejected", "reason": "visual_violation | textual_violation | combined_violation", "message": "Short explanation here."}

If Safe:
{"status": "approved", "description_summary": "Cleaned version of user text"}`,
      },
    ];

    if (text) {
      parts.push({ text: `User Description: "${text}"` });
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
      
      if (result.status === "rejected") {
        return {
          isInappropriate: true,
          reason: result.reason,
          summary: result.message
        };
      }

      return {
        isInappropriate: false,
        summary: result.description_summary
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
