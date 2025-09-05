
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const extractJson = (text: string): object | null => {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error("Failed to parse extracted JSON:", e);
      return null;
    }
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse raw text as JSON:", e);
    return null;
  }
};

interface GeneratedPost {
  headline: string;
  body: string;
  hashtags: string[];
  layout: {
    theme: 'light' | 'dark';
    textPosition: string;
    logoPosition: string;
    styleSuggestion: string;
  };
}

// Define the shape of the incoming request body
interface RequestBody {
  postText: string;
  brandTone: string;
  brandColor: string;
  base64Image: string;
  mimeType: string;
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

    const prompt = `
      **Objective:** Function as a JSON API endpoint. Your entire response must be a single, raw, valid JSON object, without any markdown, comments, or explanations.

      **Input Data:**
      - **Image:** Provided for visual analysis.
      - **Brand Tone:** "${brandTone}"
      - **Brand Color:** "${brandColor}"
      - **Core Message:** "${postText}"

      **Strict JSON Output Schema:**
      {
        "headline": "A concise, compelling headline based on the core message and tone.",
        "body": "A detailed body text expanding on the message, matching the brand tone.",
        "hashtags": ["An", "array", "of", "3-5", "relevant", "hashtags", "including", "#PartyHub"],
        "layout": {
          "theme": "Either 'light' or 'dark' for optimal text contrast against the image.",
          "textPosition": "The best position for text (e.g., 'bottom-center').",
          "logoPosition": "The best corner for a logo (e.g., 'top-left').",
          "styleSuggestion": "A brief suggestion for visual style."
        }
      }

      Analyze the image and data, then generate the content. Your response must start with "{" and end with "}".
    `;

    const imagePart = {
      inlineData: { data: base64Image, mimeType: mimeType },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    const generatedPost = extractJson(responseText);

    if (!generatedPost) {
      console.error("Failed to parse JSON response from AI:", responseText);
      throw new Error("AI returned an invalid response format.");
    }

    return NextResponse.json({ generatedPost });

  } catch (error: unknown) {
    console.error('Error in generate-post API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: `Failed to generate post. Details: ${errorMessage}` }, { status: 500 });
  }
}