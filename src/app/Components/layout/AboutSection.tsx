"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Layers3,
  Cpu,
  Github,
  Linkedin,
  ArrowRight,
  Move3d, // For Framer Motion
  Wind, // For Tailwind
  Rocket, // For GSAP
  Sparkles, // For Gemini
  Mouse, // For Lenis
} from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component

// --- SVG Icon Components for Tech Stack ---
const TechIcons = {
  NextJS: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128Z"
        fill="black"
      />
      <path
        d="M98.7188 103.5H80.5312V55.8438L53.2188 88.375V70.625L75.6875 44.125H98.7188V103.5Z"
        fill="white"
      />
      <path d="M51.125 44.125H32.0938V103.5H51.125V44.125Z" fill="#999999" />
    </svg>
  ),
  TypeScript: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="128" height="128" rx="16" fill="#3178C6" />
      <path d="M28 28H100V100H28V28Z" fill="#3178C6" />
      <path
        d="M59.186 91.3333H88.32V79.2293L73.0667 64.9147L88.32 50.6053V38.496H59.186V50.6053H70.1333L63.3067 57.76L59.186 53.4453V45.28H48.24V91.3333H37.2933V38.496H26.3467V27.168H101.68V38.496H90.7333V91.3333H101.68V102.661H26.3467V91.3333H37.2933V80.0053H48.24V68.6773L59.186 80.0053V91.3333Z"
        fill="white"
        transform="translate(0, -2) scale(0.95)"
      />
    </svg>
  ),
  // You can add more custom SVG icons here for other technologies if needed
};

const tabs = [
  { id: "owner", label: "Developer", icon: User },
  { id: "project", label: "Project", icon: Layers3 },
  { id: "tech", label: "Tech Stack", icon: Cpu },
];

const techStack = [
  {
    name: "Next.js & React",
    description:
      "High-performance, server-rendered application with a component-driven architecture.",
    icon: <TechIcons.NextJS />,
  },
  {
    name: "Google Gemini",
    description:
      "Core AI engine for generating creative, context-aware post copy and content.",
    icon: <Sparkles className="h-6 w-6 text-purple-500" />,
  },
  {
    name: "TypeScript",
    description:
      "Ensures code quality, maintainability, and catches errors during development.",
    icon: <TechIcons.TypeScript />,
  },
  {
    name: "Tailwind CSS",
    description:
      "Rapid, utility-first styling for creating a consistent, responsive design system.",
    icon: <Wind className="h-6 w-6 text-cyan-500" />,
  },
  {
    name: "Framer Motion",
    description:
      "Fluid, meaningful animations that enhance the overall user experience.",
    icon: <Move3d className="h-6 w-6 text-indigo-500" />,
  },
  {
    name: "GSAP",
    description:
      "For advanced, high-performance text reveals and timeline-based animations.",
    icon: <Rocket className="h-6 w-6 text-green-500" />,
  },
  {
    name: "Lenis",
    description:
      "Provides a premium, smooth-scrolling experience across the application.",
    icon: <Mouse className="h-6 w-6 text-slate-500" />,
  },
];

export const AboutSection = ({ brandColor }: { brandColor: string }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <section id="about" className="py-16 sm:py-20 bg-slate-50 bg-grid">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Behind the Build
        </h2>

        {/* Increased max-w to 5xl for more horizontal space */}
        <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 p-2">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 py-3 px-2 sm:px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 rounded-md
                  ${
                    activeTab === tab.id
                      ? "text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <tab.icon className="h-5 w-5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute inset-0 z-0 bg-slate-100 rounded-md"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="relative min-h-[400px] p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "owner" && (
                  <div className="flex flex-col md:flex-row gap-8 text-slate-700 h-full">
                    {/* Image Section */}
                    <div className="flex-shrink-0 w-full md:w-1/3 flex justify-center items-start pt-2">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="relative w-52 h-52 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-xl border-4"
                        style={{ borderColor: brandColor }} // Dynamic border color
                      >
                        <Image
                          src="/amandubey.png"
                          alt="Aman Dubey - Developer"
                          layout="fill"
                          objectFit="cover"
                          // priority
                        />
                      </motion.div>
                    </div>

                    {/* Text and Links Section */}
                    <div className="flex-1 space-y-4 flex flex-col">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                        Aman Dubey
                      </h3>
                      <p className="text-lg font-medium text-slate-800">
                        Frontend-focused Full Stack Developer
                      </p>
                      <p>
                        With over 2 years of experience, I specialize in
                        building scalable, high-performance applications using
                        React and Next.js. My background includes leading
                        frontend teams and architecting robust UI/UX solutions
                        for SaaS, LMS, and fintech products.
                      </p>
                      <p>
                        This project, PartyHub, is a direct reflection of my
                        philosophy: to merge clean architecture with a polished,
                        engaging user experience, leveraging AI to create tools
                        that are not just functional, but delightful to use.
                      </p>
                      <div className="!mt-auto pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <Link
                          href="https://amandubey.vercel.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-semibold group hover:underline"
                          style={{ color: brandColor }}
                        >
                          View My Portfolio
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <div className="flex items-center gap-4">
                          <a
                            href="https://github.com/Amandubey211" // Ensure this is your correct GitHub
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-slate-800 transition-colors"
                            aria-label="GitHub"
                          >
                            <Github className="h-7 w-7" />{" "}
                            {/* Increased size */}
                          </a>
                          <a
                            href="https://www.linkedin.com/in/profile-amandubey/" // Ensure this is your correct LinkedIn
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-slate-800 transition-colors"
                            aria-label="LinkedIn"
                          >
                            <Linkedin className="h-7 w-7" />{" "}
                            {/* Increased size */}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "project" && (
                  <div className="space-y-4 text-slate-700">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                      Purpose & Methodology
                    </h3>
                    <p className="text-lg font-medium">
                      PartyHub was conceptualized to streamline social media
                      content creation, making it accessible and efficient for
                      everyone.
                    </p>
                    <p>
                      The core objective was to develop an AI-powered social
                      media post generator that truly understands context,
                      delivers high-quality output, and requires absolutely no
                      design skills from the user. We focused on crafting
                      content that is polished, brand-aligned, and genuinely
                      useful, allowing users to stand out without the usual
                      hurdles.
                    </p>
                    <p>
                      The development approach was strictly{" "}
                      <b style={{ color: brandColor }}>UX-First</b>. By
                      architecting a delightful, interactive, and highly
                      intuitive frontend, the powerful AI backend is delivered
                      through an interface that is not only functional but a joy
                      to use. This commitment to user experience ensures a
                      seamless journey from idea to ready-to-post content.
                    </p>
                  </div>
                )}

                {activeTab === "tech" && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
                      Tools & Technologies
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {techStack.map((tech) => (
                        <motion.div
                          key={tech.name}
                          className="flex items-start p-4 border border-slate-200 rounded-lg bg-white shadow-sm"
                          whileHover={{
                            y: -4,
                            boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                        >
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                            {tech.icon}
                          </div>
                          <div className="ml-4">
                            <p className="font-semibold text-slate-800">
                              {tech.name}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
                              {tech.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
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
