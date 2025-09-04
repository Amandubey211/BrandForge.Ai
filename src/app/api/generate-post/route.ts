// src/app/api/generate-post/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

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
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
    });

    // --- The Advanced Prompt ---
    const prompt = `
      You are an expert social media manager and graphic designer for PartyHub.
      Your task is to analyze the user-provided image and design a complete, professional social media post.
      You MUST return your response as a single, valid JSON object. Do not include any markdown formatting like \`\`\`json.

      **Analysis Context:**
      - **Vendor Image:** An image is provided. Analyze its composition, main subject, and colors. Identify areas of empty space or low visual noise (like a clear sky, a blurred background, or a solid wall) where text would be most readable.
      - **Brand Identity:** The vendor's tone of voice is "${brandTone}", and their primary brand color is "${brandColor}".
      - **Core Message:** The vendor wants to communicate this: "${postText}"

      **Instructions:**
      1.  **Generate Copy:** Create a compelling 'headline' and 'body' for the post. Expand on the core message, match the brand tone perfectly, and use engaging emojis.
      2.  **Choose Layout:** Based on your analysis of the image, decide the optimal 'textPosition' and 'logoPosition' to place them in an area with low visual conflict.
      3.  **Determine Theme:** Decide if a 'light' (white) or 'dark' (black/dark grey) text theme would have better contrast and readability against the chosen text position on the image.
      4.  **Provide Hashtags:** Generate an array of 3-5 relevant 'hashtags'. Include #PartyHub.
      5.  **Suggest Style:** Add a creative 'styleSuggestion', for example, "Use a subtle gradient overlay at the bottom for text readability" or "Use a clean, bold font."

      **JSON Output Structure:**
      {
        "headline": "A short, catchy headline.",
        "body": "The main body of the post, written in the specified tone.",
        "hashtags": ["#PartyHub", "#EventPlanning", "#ExampleTag"],
        "layout": {
          "theme": "light",
          "textPosition": "bottom-left",
          "logoPosition": "top-right",
          "styleSuggestion": "Use a bold sans-serif font for the headline."
        }
      }
    `;

    // Prepare the image data for the multimodal request using the explicit data from the client
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart], {
      responseMimeType: 'application/json',
    });

    const responseText = result.response.text();
    const generatedPost: PostLayout = JSON.parse(responseText);

    return NextResponse.json({ generatedPost });

  } catch (error: unknown) {
    console.error('Error in generate-post API route:', error);
    let errorMessage = 'An unexpected error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: `Failed to generate post. Details: ${errorMessage}` },
      { status: 500 }
    );
  }
}