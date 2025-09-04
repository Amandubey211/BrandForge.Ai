// src/app/page.tsx
'use client';

import { useRef, useState } from 'react';
import { Header } from './Components/layout/Header';
import { HeroSection } from './Components/layout/HeroSection';
import { GeneratorSection } from './Components/layout/GeneratorSection';
import { AboutSection } from './Components/layout/AboutSection'; // 1. Import the new component
import { Footer } from './Components/layout/Footer';

// This defines the shape of the form data we'll receive from the child component
interface FormData {
  brandTone: string;
  postText: string;
  logoFile: File | null;
  imageFile: File | null;
}

export default function Home() {
  const [brandColor, setBrandColor] = useState<string>('#6366F1');
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const generatorRef = useRef<HTMLDivElement>(null);

  const handleGenerate = (formData: FormData) => {
    console.log('Data received from GeneratorSection:', formData);
    if (!formData.postText) {
      setError('Please enter some text.');
      return;
    }
    setError('');
    setIsLoading(true);
    setGeneratedOutput('');

    // Simulate API call
    setTimeout(() => {
      setGeneratedOutput(
        `🎉 AI-generated text for tone "${formData.brandTone}"! 🧁 Your message: "${formData.postText}". #AI #PartyHub`
      );
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Header brandColor={brandColor} />

      <HeroSection
        brandColor={brandColor}
        setBrandColor={setBrandColor}
        generatorRef={generatorRef}
      />

      {/* The ref is now attached to the GeneratorSection's wrapper */}
      <div id="generator" ref={generatorRef}> {/* Added id="generator" for nav link */}
        <GeneratorSection
          brandColor={brandColor}
          setBrandColor={setBrandColor}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          generatedOutput={generatedOutput}
          error={error}
        />
      </div>

      {/* 2. Add the new AboutSection between the Generator and Footer */}
      <AboutSection brandColor={brandColor} />

      <Footer brandColor={brandColor} />
    </div>
  );
}