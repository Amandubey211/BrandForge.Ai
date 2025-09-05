'use client';

import { useRef, useState } from 'react';
import { Header } from './Components/layout/Header';
import { HeroSection } from './Components/layout/HeroSection';
import { Playground, PostData } from './Components/layout/Playground';
import { AboutSection } from './Components/layout/AboutSection';
import { Footer } from './Components/layout/Footer';

interface FormData {
  brandTone: string; postText: string; logoFile: File | null; imageFile: File | null;
}

const fileToJpegBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        } else reject(new Error('Could not get canvas context'));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function Home() {
  const [brandColor, setBrandColor] = useState<string>('#6366F1');
  const [generatedPost, setGeneratedPost] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const playgroundRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (formData: FormData) => {
    if (!formData.imageFile || !formData.postText) {
      setError('Please provide an image and a core message.'); return;
    }
    setError(''); setIsLoading(true); setGeneratedPost(null);
    try {
      const base64Image = await fileToJpegBase64(formData.imageFile);
      const response = await fetch('/api/generate-post', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postText: formData.postText, brandTone: formData.brandTone,
          brandColor: brandColor, base64Image: base64Image.split(',')[1],
          mimeType: 'image/jpeg',
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong.');
      setGeneratedPost(data.generatedPost);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 bg-grid">
      <Header brandColor={brandColor} />
      <HeroSection brandColor={brandColor} setBrandColor={setBrandColor} generatorRef={playgroundRef} />
      <div id="generator" ref={playgroundRef} className='md:px-10'>
        <Playground
          brandColor={brandColor} setBrandColor={setBrandColor}
          onGenerate={handleGenerate} isLoading={isLoading}
          generatedPost={generatedPost} error={error}
        />
      </div>
      <AboutSection brandColor={brandColor} />
      <Footer brandColor={brandColor} />
    </div>
  );
}