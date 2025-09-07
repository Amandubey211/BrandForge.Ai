// src/components/layout/Header.tsx

"use client";

import { useState, useEffect, RefObject } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  brandColor: string;
  sectionRefs: { name: string; ref: RefObject<HTMLDivElement | null> }[];
}

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#generator", label: "Generator" },
  { href: "#about", label: "About" },
];

export const Header: React.FC<HeaderProps> = ({ brandColor, sectionRefs }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const correspondingNavLink = navLinks.find(
            (link) => `#${entry.target.id}` === link.href
          );
          if (correspondingNavLink) {
            setActiveLink(correspondingNavLink.label);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    sectionRefs.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      sectionRefs.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [sectionRefs]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setIsMenuOpen(false); // Close mobile menu on link click
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCreatorClick = () => {
    window.open("https://amandubey.vercel.app/about", "_blank");
  };

  return (
    <>
      <header className="sticky top-4 z-50 transition-all duration-300 ease-in-out">
        <div
          className={`container mx-auto px-4 sm:px-6 transition-all duration-300 ease-in-out ${
            isScrolled
              ? "max-w-4xl rounded-xl shadow-lg backdrop-blur-xl bg-white/50"
              : "max-w-full rounded-none bg-transparent shadow-none"
          }`}
        >
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="text-2xl font-bold text-slate-900">
              Party<span style={{ color: brandColor }}>Hub</span>
            </Link>

            {/* --- Desktop Navigation --- */}
            <nav className="hidden items-center gap-2 rounded-full bg-white/30 p-1 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeLink === link.label
                      ? "text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {activeLink === link.label && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 z-0 rounded-full"
                      style={{ backgroundColor: brandColor }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              ))}
            </nav>

            <button
              onClick={handleCreatorClick}
              className="hidden md:inline-block px-4 py-2 bg-slate-800 text-white rounded-md font-semibold text-sm hover:bg-slate-700 transition-colors"
            >
              Creator
            </button>

            {/* --- Mobile Menu Button --- */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-slate-800"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- Mobile Navigation Panel --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-[84px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-lg"
          >
            <nav className="container mx-auto flex flex-col items-center gap-4 px-6 py-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-lg font-medium ${
                    activeLink === link.label
                      ? "text-slate-900"
                      : "text-slate-600"
                  }`}
                  style={{
                    color: activeLink === link.label ? brandColor : "",
                  }}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={handleCreatorClick}
                className="mt-4 w-full max-w-xs px-4 py-3 bg-slate-800 text-white rounded-md font-semibold text-sm hover:bg-slate-700 transition-colors"
              >
                Creator
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
