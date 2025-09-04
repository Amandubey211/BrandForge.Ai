// src/app/Components/layout/AboutSection.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Layers3, Cpu } from 'lucide-react';
import Link from 'next/link';

// Data for the tabs
const tabs = [
  { id: 'owner', label: 'About the Developer', icon: User },
  { id: 'project', label: 'About the Project', icon: Layers3 },
  { id: 'tech', label: 'Tech Stack', icon: Cpu },
];

const techStack = [
  { name: 'Next.js', description: 'For a high-performance, server-rendered React application.' },
  { name: 'TypeScript', description: 'To ensure code quality, maintainability, and scalability.' },
  { name: 'Tailwind CSS', description: 'For rapid, utility-first styling and a consistent design system.' },
  { name: 'Framer Motion', description: 'To create fluid animations and a delightful user experience.' },
  { name: 'GSAP & OGL', description: 'For advanced, high-performance text and WebGL animations.' },
  { name: 'Lenis', description: 'To provide a premium, smooth scrolling experience.' },
  { name: 'Google Gemini', description: 'As the core AI engine for generating creative post copy.' },
];

export const AboutSection = ({ brandColor }: { brandColor: string }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <section id="about" className="py-20 bg-slate-50 bg-grid">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Behind the Build
        </h2>

        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 p-2">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 py-3 px-4 text-sm font-medium transition-colors focus:outline-none
                  ${
                    activeTab === tab.id
                      ? 'text-slate-900'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <tab.icon className="h-4 w-4" /> {tab.label}
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute inset-0 z-0 bg-slate-100 rounded-md"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="relative min-h-[320px] p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'owner' && (
                  <div className="space-y-4 text-slate-700">
                    <h3 className="text-xl font-bold text-slate-900">Aman Dubey</h3>
                    <p>I am a product-minded Full-Stack Developer with a passion for building AI-driven applications that are both powerful and beautiful. My expertise lies in the modern web stack, particularly Next.js and React, and I have extensive experience integrating generative AI models like Google Gemini to create engaging user experiences.</p>
                    <p>This project is a reflection of my core philosophy: lead with a high-quality user experience, build on a robust and scalable architecture, and leverage AI to create genuinely useful tools.</p>
                    <Link href="https://amandubey.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-block font-semibold" style={{ color: brandColor }}>
                      View My Portfolio &rarr;
                    </Link>
                  </div>
                )}

                {activeTab === 'project' && (
                  <div className="space-y-4 text-slate-700">
                    <h3 className="text-xl font-bold text-slate-900">Purpose & Methodology</h3>
                    <p>The goal of this assignment was to build an AI-powered social media post generator for PartyHub&apos;s event vendors. The key was to focus on the **quality of the output**, ensuring the generated content was polished and truly reflected the vendor&apos;s brand identity.</p>
                    <p>My approach was **UX-First**. I began by architecting a delightful and interactive front-end experience. This included creating a dynamic, brand-aware UI with advanced animations and a guided multi-step form. This solid foundation ensures that the powerful AI backend is presented through an interface that is a joy to use.</p>
                  </div>
                )}

                {activeTab === 'tech' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Tools & Technologies</h3>
                    <ul className="space-y-3">
                      {techStack.map((tech) => (
                        <li key={tech.name} className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full mt-1" style={{ backgroundColor: brandColor }} />
                          <div className="ml-3">
                            <p className="font-semibold text-slate-800">{tech.name}</p>
                            <p className="text-sm text-slate-600">{tech.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};