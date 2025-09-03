// src/app/page.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image'; // Assuming we'll use Next.js Image component

export default function Home() {
  const [desiredPostText, setDesiredPostText] = useState('');
  const [brandTone, setBrandTone] = useState('Friendly and professional'); // Default tone
  const [generatedPostText, setGeneratedPostText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Placeholder states for future image/logo uploads
  const [vendorImage, setVendorImage] = useState<File | null>(null);
  const [vendorLogo, setVendorLogo] = useState<File | null>(null);
  const [brandColor, setBrandColor] = useState('#87CEEB'); // Default color

  const handleGeneratePost = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedPostText('');

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ desiredPostText, brandTone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await response.json();
      setGeneratedPostText(data.generatedText);
    } catch (err: any) {
      console.error('Failed to generate post:', err);
      setError(err.message || 'Failed to generate post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-50">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8 text-center w-full">Partyhub Social Media Post Generator</h1>
      </div>

      <div className="relative flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
        {/* Input Section */}
        <div className="flex-1 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">1. Brand Identity & Post Content</h2>

          {/* Brand Identity Inputs (Placeholders for now) */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Brand Identity</h3>
            <label htmlFor="logoUpload" className="block text-sm font-medium text-gray-700 mb-2">Upload Logo (Placeholder)</label>
            <input
              type="file"
              id="logoUpload"
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              onChange={(e) => setVendorLogo(e.target.files ? e.target.files[0] : null)}
            />
            <label htmlFor="brandColor" className="block text-sm font-medium text-gray-700 mt-4 mb-2">Primary Brand Color</label>
            <input
              type="color"
              id="brandColor"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md p-0"
            />
            <label htmlFor="brandTone" className="block text-sm font-medium text-gray-700 mt-4 mb-2">Brand Tone</label>
            <select
              id="brandTone"
              value={brandTone}
              onChange={(e) => setBrandTone(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option>Friendly and professional</option>
              <option>Whimsical and playful</option>
              <option>Elegant and luxurious</option>
              <option>Modern and minimalistic</option>
            </select>
          </div>

          {/* Post Content Inputs */}
          <h3 className="text-lg font-medium mb-3">Post Content</h3>
          <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-2">Upload Image (Placeholder)</label>
          <input
            type="file"
            id="imageUpload"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            onChange={(e) => setVendorImage(e.target.files ? e.target.files[0] : null)}
          />
          <label htmlFor="desiredPostText" className="block text-sm font-medium text-gray-700 mt-4 mb-2">Desired Post Text</label>
          <textarea
            id="desiredPostText"
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="E.g., Our new artisanal cupcakes are perfect for any celebration!"
            value={desiredPostText}
            onChange={(e) => setDesiredPostText(e.target.value)}
          ></textarea>

          <button
            onClick={handleGeneratePost}
            disabled={isLoading || !desiredPostText}
            className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate Social Media Post'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </div>

        {/* Live Preview Section */}
        <div className="flex-1 bg-gray-100 p-8 rounded-lg shadow-inner flex flex-col justify-center items-center">
          <h2 className="text-2xl font-semibold mb-6">Live Preview</h2>
          <div className="w-full h-80 bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-center relative overflow-hidden">
            {/* This will eventually hold our generated image */}
            {generatedPostText ? (
              <div className="p-4 text-gray-800">
                <p className="font-semibold mb-2">Generated Text Preview:</p>
                <p>{generatedPostText}</p>
              </div>
            ) : (
              'Your generated social media post will appear here.'
            )}
            {/* Placeholder for eventual image display */}
            {/* {generatedImageUrl && <Image src={generatedImageUrl} alt="Generated Social Media Post" layout="fill" objectFit="cover" />} */}
          </div>
          {generatedPostText && (
            <button
              onClick={() => navigator.clipboard.writeText(generatedPostText)}
              className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Copy Text
            </button>
          )}
        </div>
      </div>
    </main>
  );
}