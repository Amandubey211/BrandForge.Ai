// src/app/Components/layout/HeroSection.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SplitText from '../animations/SplitText';
import Aurora from '../animations/Aurora'; // [ADDED] Import the new Aurora component
import { ArrowDown } from 'lucide-react';
import type Lenis from 'lenis';

// Define the shape of the props this component expects
interface HeroSectionProps {
  brandColor: string;
  setBrandColor: (color: string) => void;
  generatorRef: React.RefObject<HTMLDivElement | null>;
}

const PRESET_COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'];

export const HeroSection: React.FC<HeroSectionProps> = ({
  brandColor,
  setBrandColor,
  generatorRef,
}) => {
 const handleScrollToGenerator = () => {
    const lenis = (window as { lenis?: Lenis }).lenis;
    if (lenis && generatorRef.current) {
      lenis.scrollTo(generatorRef.current, { offset: -100 });
    }
  };

  return (
    <div className="relative overflow-hidden  -mt-[88px] pt-[88px]">
      {/* [REPLACED] The old Framer Motion divs are replaced with the new Aurora background */}
      <div className="absolute inset-0 z-0">
        <Aurora
          key={brandColor} // Use key to force re-render on color change
          colorStops={[brandColor, '#7cff67', brandColor]}
          amplitude={0.6}
          blend={0.8}
        />
      </div>

      {/* The content now sits on top of the Aurora canvas */}
      <div className="relative z-10">
        <section className="text-center py-24 md:py-32 px-6 ">
          <div className="container mx-auto">
            <div className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              <SplitText text="AI-Powered Social Posts for " tag="span" splitType="words" className="inline" />
              <SplitText text="Your Brand" tag="span" splitType="words" className="inline" color={brandColor} />
            </div>
            <SplitText text="Effortlessly create stunning, on-brand social media content. Just provide a few details, and let our AI handle the rest." tag="p" splitType="words" delay={20} className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto" />
            <div className="mt-8 flex justify-center items-center gap-3">
              <p className="text-sm font-medium text-slate-500">Try a color:</p>
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setBrandColor(color)}
                  className="w-6 h-6 rounded-full transition-transform duration-200 ease-in-out"
                  style={{ 
                    backgroundColor: color,
                    transform: brandColor === color ? 'scale(1.25)' : 'scale(1)',
                    boxShadow: brandColor === color ? `0 0 0 3px white, 0 0 0 5px ${color}` : '0 0 0 3px white',
                  }}
                  aria-label={`Set brand color to ${color}`}
                />
              ))}
            </div>
            <motion.button onClick={handleScrollToGenerator} className="mt-10 inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-semibold rounded-lg shadow-lg hover:bg-slate-700 transition-all duration-300" whileHover={{ scale: 1.05, gap: '12px' }} whileTap={{ scale: 0.95 }}>
              Start Creating
              <ArrowDown className="h-5 w-5" />
            </motion.button>
          </div>
        </section>
      </div>
    </div>
  );
};