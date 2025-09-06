// src/components/layout/Footer.tsx

"use client";

import { motion } from "framer-motion";
import { Sparkles, Linkedin, Github } from "lucide-react";
import Link from "next/link"; // Use Next.js Link for internal navigation if needed

interface FooterProps {
  brandColor: string;
}

export const Footer: React.FC<FooterProps> = ({ brandColor }) => {
  const currentYear = new Date().getFullYear();

  const links = {
    product: ["Features", "Templates", "API", "Examples"],
    company: ["About", "Blog", "Contact", "Partners"],
    resources: ["Documentation", "Community", "Guidelines", "Webinars"],
    legal: ["Privacy", "Terms", "Security", "Cookies"],
  };

  // --- Personalized with your professional links ---
  const socialLinks = [
    {
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://www.linkedin.com/in/amandubeydev/",
      label: "LinkedIn",
    },
    {
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/AmanDubey02",
      label: "GitHub",
    },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 sm:pt-20 pb-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-10 gap-x-8 mb-16">
          {/* Brand Section */}
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

            <p className="text-slate-400 mb-6 max-w-xs">
              AI-powered social media content, tailored for your brand. No
              design skills needed.
            </p>

            <div className="flex space-x-4">
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
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold text-white text-md mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-slate-400 text-sm mb-1">
              © {currentYear} PartyHub Generator. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs">
              Designed & Built by{" "}
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

          <div className="flex items-center space-x-4 sm:space-x-6">
            <a
              href="#"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
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
