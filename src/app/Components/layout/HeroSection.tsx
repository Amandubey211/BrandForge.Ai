"use client";

import React from "react";
import { motion } from "framer-motion";
import SplitText from "../animations/SplitText";
import { ArrowDown } from "lucide-react";
import type Lenis from "lenis";
// import { PostMarquee } from "../Ui/PostMarquee";
// import { SAMPLE_POSTS } from "@/config/constants";

interface HeroSectionProps {
  brandColor: string;
  setBrandColor: (color: string) => void;
  generatorRef: React.RefObject<HTMLDivElement | null>;
}

const PRESET_COLORS = ["#6366F1", "#EC4899", "#10B981", "#F59E0B", "#3B82F6"];

export const HeroSection: React.FC<HeroSectionProps> = ({
  brandColor,
  setBrandColor,
  generatorRef,
}) => {
  const handleScrollToGenerator = () => {
    const lenis = (window as { lenis?: Lenis }).lenis;
    if (lenis && generatorRef.current) {
      lenis.scrollTo(generatorRef.current, { offset: -100 });
    } else if (generatorRef.current) {
      generatorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-hidden -mt-[88px] pt-[88px] pb-20">
      <div className="relative z-10">
        <section className="text-center pt-24 md:pt-32 px-4 sm:px-6">
          <div className="container mx-auto">
            <div className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              <SplitText
                text="AI-Powered Social Posts for "
                tag="h1"
                splitType="words"
                className="inline"
              />
              <SplitText
                text="Your Brand"
                tag="span"
                splitType="words"
                className="inline"
                color={brandColor}
              />
            </div>
            <SplitText
              text="Effortlessly create stunning, on-brand social media content. Just provide a few details, and let our AI handle the rest."
              tag="p"
              splitType="words"
              delay={20}
              className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto"
            />
            <div className="mt-8 flex justify-center items-center gap-3 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setBrandColor(color)}
                  className="w-7 h-7 rounded-full transition-transform duration-200 ease-in-out"
                  style={{
                    backgroundColor: color,
                    transform:
                      brandColor === color ? "scale(1.25)" : "scale(1)",
                    boxShadow:
                      brandColor === color
                        ? `0 0 0 3px white, 0 0 0 5px ${color}`
                        : "0 0 0 3px white",
                  }}
                  aria-label={`Set brand color to ${color}`}
                />
              ))}
            </div>
            <motion.button
              onClick={handleScrollToGenerator}
              className="mt-10 inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-slate-900 text-white font-semibold rounded-lg shadow-lg hover:bg-slate-700 transition-all duration-300 text-base md:text-lg"
              whileHover={{ scale: 1.05, gap: "12px" }}
              whileTap={{ scale: 0.95 }}
            >
              Start Creating
              <ArrowDown className="h-5 w-5" />
            </motion.button>
          </div>
        </section>
      </div>

      {/* Post Marquee Section */}
      {/* <div className="relative mt-16 md:mt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50/80 to-slate-50 z-10" />
        <PostMarquee posts={SAMPLE_POSTS} brandColor={brandColor} baseVelocity={-5} />
      </div> */}
    </div>
  );
};