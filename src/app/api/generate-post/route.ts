// src/app/api/generate-post/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
// Helper function to extract a JSON object from a string that might contain markdown
const extractJson = (text: string): object | null => {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (match && match) {
    try {
      return JSON.parse(match);
    } catch (e) {
      console.error("Failed to parse extracted JSON:", e);
      return null;
    }
  }
  // Fallback for cases where there's no markdown, just the object
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse raw text as JSON:", e);
    return null;
  }
};
// Define the expected shape of the AI's JSON output
interface PostLayout {
  headline: string;
  body: string;
  hashtags: string[];
  layout: {
    theme: 'light' | 'dark';
    textPosition: 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    logoPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    styleSuggestion: string;
  };
}

// Define the shape of the incoming request body
interface RequestBody {
  postText: string;
  brandTone: string;
  brandColor: string;
  base64Image: string; // Raw base64 data, without the prefix
  mimeType: string;    // Explicit mimeType, e.g., 'image/jpeg'
}
export async function POST(req: Request) {
  try {
    const { postText, brandTone, brandColor, base64Image, mimeType }: RequestBody = await req.json();

    if (!postText || !brandTone || !brandColor || !base64Image || !mimeType) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    // --- [THIS IS THE FIX] The Strictest Possible Prompt ---
    const prompt = `
      Your task is to act as an API endpoint. You must analyze the user-provided data and image.
      Your response must be ONLY and EXCLUSIVELY a single, valid JSON object.
      Do not include any text, explanation, or markdown formatting like \`\`\`json before or after the JSON object.

      **JSON Schema to follow:**
      {
        "headline": "string",
        "body": "string",
        "hashtags": ["string"],
        "layout": {
          "theme": "'light' or 'dark'",
          "textPosition": "'top-left', 'bottom-center', etc.",
          "logoPosition": "'top-left', 'bottom-right', etc.",
          "styleSuggestion": "string"
        }
      }

      **Data for Analysis:**
      - **Vendor Image:** An image is provided. Analyze its composition to determine the best placement for text and a logo.
      - **Brand Tone:** "${brandTone}"
      - **Brand Color:** "${brandColor}"
      - **Core Message:** "${postText}"

      **Instructions for JSON content:**
      1.  **headline/body:** Generate compelling copy based on the core message and brand tone.
      2.  **layout.textPosition/logoPosition:** Choose positions with low visual conflict on the image.
      3.  **layout.theme:** Choose 'light' or 'dark' text for best contrast.
      4.  **hashtags:** Provide 3-5 relevant hashtags, including #PartyHub.
    `;

    const imagePart = {
      inlineData: { data: base64Image, mimeType: mimeType },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    // [THIS IS THE FIX] Use the robust parsing function
    const generatedPost = extractJson(responseText);

    if (!generatedPost) {
      console.error("Failed to parse JSON response from AI:", responseText);
      throw new Error("AI returned an invalid response format.");
    }

    return NextResponse.json({ generatedPost });

  } catch (error: unknown) {
    console.error('Error in generate-post API route:', error);
    let errorMessage = 'An unexpected error occurred.';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ error: `Failed to generate post. Details: ${errorMessage}` }, { status: 500 });
  }
}