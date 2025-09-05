"use client";

import { useState, useEffect, RefObject } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// --- THIS IS THE FIX ---
interface HeaderProps {
  brandColor: string;
  // The generic for RefObject has been updated to allow for a null element
  sectionRefs: { name: string; ref: RefObject<HTMLDivElement | null> }[];
}
// --------------------

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#generator", label: "Generator" },
  { href: "#about", label: "About" },
];

export const Header: React.FC<HeaderProps> = ({ brandColor, sectionRefs }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");

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
      // This check already makes our code safe for a potentially null ref
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
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-4 z-50 transition-all duration-300 ease-in-out">
      <div
        className={`container mx-auto transition-all duration-300 ease-in-out ${
          isScrolled
            ? "max-w-4xl rounded-xl shadow-lg backdrop-blur-xl bg-white/50"
            : "max-w-full rounded-none bg-transparent shadow-none"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-3">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Party<span style={{ color: brandColor }}>Hub</span>
          </Link>

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
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </nav>

          <button className="px-4 py-2 bg-slate-800 text-white rounded-md font-semibold text-sm hover:bg-slate-700 transition-colors">
            Vendor Login
          </button>
        </div>
      </div>
    </header>
  );
};
