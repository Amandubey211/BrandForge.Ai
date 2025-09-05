"use client";

import { motion } from "framer-motion";
import { Sparkles, Twitter, Instagram, Linkedin, Github } from "lucide-react";

interface FooterProps {
  brandColor: string;
}

export const Footer: React.FC<FooterProps> = ({ brandColor }) => {
  const currentYear = new Date().getFullYear();

  const links = {
    product: ["Features", "Templates", "Pricing", "API", "Examples"],
    company: ["About", "Blog", "Careers", "Contact", "Partners"],
    resources: [
      "Documentation",
      "Help Center",
      "Community",
      "Guidelines",
      "Webinars",
    ],
    legal: ["Privacy", "Terms", "Security", "Cookies", "Compliance"],
  };

  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: "#", label: "Twitter" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" },
    { icon: <Github className="h-5 w-5" />, href: "#", label: "GitHub" },
  ];

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: brandColor }}
              >
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">PartyHub</span>
            </div>

            <p className="text-slate-400 mb-6 max-w-xs">
              Create stunning social media posts with AI-powered magic. No
              design skills needed.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(links).map(([category, items], index) => (
            <div key={category} className="lg:col-span-1">
              <h3 className="font-semibold text-lg mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-2">
                {items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors"
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
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 md:mb-0">
            © {currentYear} PartyHub Generator. All rights reserved.
          </p>

          <div className="flex items-center space-x-6">
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
            <a
              href="#"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
