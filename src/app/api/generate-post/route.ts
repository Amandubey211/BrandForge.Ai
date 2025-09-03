// src/app/api/generate-post/route.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { desiredPostText, brandTone } = await req.json();

    if (!desiredPostText || !brandTone) {
      return NextResponse.json(
        { error: 'Missing desiredPostText or brandTone' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a social media post generator for Partyhub, an AI-powered platform for small, intimate events.
    Generate a compelling social media post based on the following:

    Desired Post Text: "${desiredPostText}"
    Brand Tone: "${brandTone}"

    Make sure the post is engaging, uses relevant emojis, and includes a call to action if appropriate.
    Focus on event planning, local vendors, and memorable experiences for small gatherings (under 100 people).
    Provide only the social media copy.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    return NextResponse.json({ generatedText });
  } catch (error: unknown) { // Use 'unknown' instead of 'any'
    console.error('Error generating post:', error);

    // Type check to safely access the 'message' property
    let errorMessage = 'Failed to generate social media post';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}