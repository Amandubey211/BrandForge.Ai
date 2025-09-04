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

    // --- [THIS IS THE FIX] The Advanced Prompt is updated for JSON mode ---
    const prompt = `
      You are an expert social media manager and graphic designer for PartyHub.
      Your task is to analyze the user-provided image and design a complete, professional social media post.
      
      **IMPORTANT INSTRUCTION:** You MUST respond with a valid JSON object. Do not include any markdown formatting like \`\`\`json or any text outside of the JSON structure.
      
      The JSON object should conform to the following schema:
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

      **Analysis Context:**
      - **Vendor Image:** An image is provided. Analyze its composition, main subject, and colors. Identify areas of empty space or low visual noise where text would be most readable.
      - **Brand Identity:** The vendor's tone of voice is "${brandTone}", and their primary brand color is "${brandColor}".
      - **Core Message:** The vendor wants to communicate this: "${postText}"

      **Instructions:**
      1.  **Generate Copy:** Create a compelling 'headline' and 'body' based on the core message and brand tone.
      2.  **Choose Layout:** Based on the image, decide the optimal 'textPosition' and 'logoPosition'.
      3.  **Determine Theme:** Decide if a 'light' or 'dark' text theme would have better contrast.
      4.  **Provide Hashtags:** Generate an array of 3-5 relevant 'hashtags'.
      5.  **Suggest Style:** Add a creative 'styleSuggestion'.
    `;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    // --- [THIS IS THE FIX] The second argument is now empty ---
    const result = await model.generateContent([prompt, imagePart]);

    const responseText = result.response.text();
    // Use a try-catch block here for robustness in case the model returns non-JSON
    try {
      const generatedPost: PostLayout = JSON.parse(responseText);
      return NextResponse.json({ generatedPost });
    } catch (parseError) {
      console.error("Failed to parse JSON response from AI:", responseText);
      throw new Error("AI returned an invalid response format.");
    }

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