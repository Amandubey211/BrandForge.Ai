// src/app/page.tsx
'use client';

import { useRef, useState } from 'react';
import { Header } from './Components/layout/Header';
import { HeroSection } from './Components/layout/HeroSection';
import { GeneratorSection } from './Components/layout/GeneratorSection';
import { Footer } from './Components/layout/Footer';

// This defines the shape of the form data we'll receive from the child component
interface FormData {
  brandTone: string;
  postText: string;
  logoFile: File | null;
  imageFile: File | null;
}

export default function Home() {
  // --- PARENT STATE MANAGEMENT ---
  // Manages the brand color for syncing across components (Header, Hero, Footer)
  const [brandColor, setBrandColor] = useState<string>('#6366F1');
  
  // Manages the final output from the API call
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Ref for the smooth-scroll CTA
  const generatorRef = useRef<HTMLDivElement>(null);

  // --- API HANDLER ---
  // This function is passed down to GeneratorSection and is called when the user clicks "Generate"
  const handleGenerate = (formData: FormData) => {
    // For now, we'll just log the data to see that it's coming from the child correctly.
    console.log('Data received from GeneratorSection:', formData);

    if (!formData.postText) {
      setError('Please enter some text to generate a post.');
      return;
    }
    setError('');
    setIsLoading(true);
    setGeneratedOutput('');

    // Simulate API call
    setTimeout(() => {
      setGeneratedOutput(
        `🎉 This is AI-generated text based on the tone: "${formData.brandTone}"! 🧁 Your message was: "${formData.postText}". #NextSteps #AI #PartyHub`
      );
      setIsLoading(false);
    }, 2000);
  };


  return (
    <div className="min-h-screen bg-white  text-slate-800">
      <Header brandColor={brandColor} />

      <HeroSection
        brandColor={brandColor}
        setBrandColor={setBrandColor}
        generatorRef={generatorRef}
      />

      {/* The ref is now attached to the GeneratorSection's wrapper */}
      <div ref={generatorRef}>
        <GeneratorSection
          brandColor={brandColor}
          setBrandColor={setBrandColor}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          generatedOutput={generatedOutput}
          error={error}
        />
      </div>

      <Footer brandColor={brandColor} />
    </div>
  );
}