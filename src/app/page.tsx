"use client";

import { useRef, useState } from "react";
import { Header } from "./Components/layout/Header";
import { HeroSection } from "./Components/layout/HeroSection";
import { Playground } from "./Components/layout/Playground";
import { Footer } from "./Components/layout/Footer";
import { usePostGeneration } from "@/hooks/usePostGeneration";
import { AboutSection } from "./Components/layout/AboutSection";

export default function Home() {
  const [brandColor, setBrandColor] = useState<string>("#6366F1");

  const homeRef = useRef<HTMLDivElement>(null);
  const generatorRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const { generatedPost, isLoading, error, generatePost } = usePostGeneration();

  const sectionRefs = [
    { name: "Home", ref: homeRef },
    { name: "Generator", ref: generatorRef },
    { name: "About", ref: aboutRef },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 bg-grid ">
      <Header brandColor={brandColor} sectionRefs={sectionRefs} />
      <main>
        <div ref={homeRef} id="home">
          <HeroSection
            brandColor={brandColor}
            setBrandColor={setBrandColor}
            generatorRef={generatorRef}
          />
        </div>
        <div id="generator" ref={generatorRef} className=" px-3 md:px-20">
          <Playground
            brandColor={brandColor}
            setBrandColor={setBrandColor}
            onGenerate={(formData) => generatePost(formData, brandColor)}
            isLoading={isLoading}
            generatedPost={generatedPost}
            error={error}
          />
        </div>
        <div ref={aboutRef} id="about">
          <AboutSection brandColor={brandColor} />
        </div>
      </main>
      <Footer brandColor={brandColor} />
    </div>
  );
}
