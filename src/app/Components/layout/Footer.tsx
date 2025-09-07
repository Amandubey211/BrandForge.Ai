// src/components/layout/Footer.tsx

"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Linkedin,
  Github,
  Code, // For LeetCode
  FileText, // For Resume
  Youtube, // For YouTube
  MessageSquare, // For Topmate
  Twitter, // For X / Twitter
  Mail, // For E-mail
  Share2, // For Portfolio/Projects link if desired
} from "lucide-react";
import Link from "next/link";

interface FooterProps {
  brandColor: string;
}

export const Footer: React.FC<FooterProps> = ({ brandColor }) => {
  const currentYear = new Date().getFullYear();

  // Updated social links based on your provided list
  const socialLinks = [
    {
      href: "https://linkedin.com/in/profile-amandubey",
      label: "LinkedIn",
      icon: <Linkedin className="size-5" />, // Reduced size for consistency with previous
    },
    {
      href: "https://github.com/AmanDubey02", // Using the one from the original footer for consistency, if you have two, pick one.
      label: "GitHub",
      icon: <Github className="size-5" />,
    },
    {
      href: "https://leetcode.com/u/amandubey8833/",
      label: "LeetCode",
      icon: <Code className="size-5" />,
    },
    {
      href: "https://docs.google.com/document/d/1CdB-RPXp6hxngGIV4Nks6Iy_agbW5fvdkNghAYQKSXk/edit?tab=t.0",
      label: "Resume",
      icon: <FileText className="size-5" />,
    },
    {
      href: "https://www.youtube.com/@GreenLadderNow",
      label: "YouTube",
      icon: <Youtube className="size-5" />,
    },
    {
      href: "https://topmate.io/aman_dubey_sde_2/",
      label: "Topmate",
      icon: <MessageSquare className="size-5" />,
    },
    {
      href: "https://twitter.com/AmanDub97115331",
      label: "X / Twitter",
      icon: <Twitter className="size-5" />,
    },
    {
      href: "mailto:amandubey8833@gmail.com",
      label: "E-mail",
      icon: <Mail className="size-5" />,
    },
  ];

  // Links for your portfolio/projects or other relevant pages
  const portfolioLinks = [
    {
      label: "Portfolio",
      href: "https://amandubey.vercel.app/", // Assuming this is your main portfolio
      target: "_blank",
    },
    {
      label: "All Projects",
      href: "https://github.com/AmanDubey02?tab=repositories", // Link to your GitHub repositories
      target: "_blank",
    },
    // Add other important pages if this was a larger site, e.g., "#about", "#generator"
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 sm:pt-20 pb-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8 mb-16">
          {/* Brand & Personal Intro Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4 w-fit">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: brandColor }}
              >
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PartyHub</span>
            </Link>

            <p className="text-slate-400 mb-4 max-w-xs">
              AI-powered social media content, tailored for your brand. No
              design skills needed.
            </p>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              A personal project by Frontend-focused Full Stack Developer Aman
              Dubey.
            </p>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                  title={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Portfolio & Projects Links */}
          <div>
            <h3 className="font-semibold text-white text-md mb-4">My Work</h3>
            <ul className="space-y-3">
              {portfolioLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.target}
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="mailto:amandubey.dev@gmail.com"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  Email Me
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Section (can be expanded) */}
          <div>
            <h3 className="font-semibold text-white text-md mb-4">Connect</h3>
            <p className="text-slate-400 text-sm mb-3">
              Aman Dubey <br />
              Frontend-focused Full Stack Developer
            </p>
            <p className="text-slate-400 text-sm mb-3">
              📍 Remote | Mumbai, India
            </p>
            {/* You can add a call to action here */}
            <Link
              href="https://topmate.io/aman_dubey_sde_2/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-slate-800 text-white rounded-md font-semibold text-sm hover:bg-slate-700 transition-colors mt-2"
            >
              <MessageSquare className="size-4 mr-2" /> Book a Call
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-slate-400 text-sm mb-1">
              © {currentYear} PartyHub. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs">
              Developed with passion by{" "}
              <a
                href="https://amandubey.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-slate-300 transition-colors"
                style={{ color: brandColor }}
              >
                Aman Dubey
              </a>
            </p>
          </div>

          {/* Privacy and Terms - Keep if you plan to have them for PartyHub itself */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <a
              href="#" // Consider adding actual links if PartyHub grows
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#" // Consider adding actual links if PartyHub grows
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
