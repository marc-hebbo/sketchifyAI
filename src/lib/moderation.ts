/**
 * Moderation utility using Gemini API to check for inappropriate content
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface ModerationResult {
  isInappropriate: boolean;
  reason?: string;
}

/**
 * Checks if the provided text or image is inappropriate using Gemini
 */
export async function moderateContent(
  text?: string,
  imageUri?: string
): Promise<ModerationResult> {
  if (!GEMINI_API_KEY) {
    console.warn("Missing GEMINI_API_KEY for moderation. Skipping check.");
    return { isInappropriate: false };
  }

  try {
    const parts: any[] = [
      {
        text: `You are a strict content moderator. Analyze the following content (text description and/or sketch image) and determine if it contains inappropriate material. 
        Inappropriate content includes: 
        - Explicit violence, gore, or weapons
        - Hate speech, harassment, or symbols of hate
        - Sexually explicit content, nudity, or provocative material
        - Illegal activities or substances
        - Self-harm or suicide
        
        Respond ONLY with a JSON object in this format: 
        {"isInappropriate": boolean, "reason": "concise explanation if inappropriate"}`,
      },
    ];

    if (text) {
      parts.push({ text: `User's description: "${text}"` });
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
      const error = await response.json();
      console.error("Gemini moderation API error:", error);
      return { isInappropriate: false }; // Fail open to not block users on API issues
    }

    const data = await response.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    try {
      // Clean up potential markdown code blocks in the response
      const jsonString = resultText.replace(/```json\n?|\n?```/g, "").trim();
      const result = JSON.parse(jsonString);
      return {
        isInappropriate: !!result.isInappropriate,
        reason: result.reason,
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
