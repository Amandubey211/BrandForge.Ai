
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HeaderProps {
  brandColor: string;
}

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#generator', label: 'Generator' },
  { href: '#about', label: 'About' },

];

export const Header: React.FC<HeaderProps> = ({ brandColor }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('Home'); // State to track the active link

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      

      const scrollPosition = window.scrollY;
      if (scrollPosition < 500) {
        setActiveLink('Home');
      } else {
        setActiveLink('Generator');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="sticky top-4 z-50 transition-all duration-300 ease-in-out">
      <div
        className={`container mx-auto transition-all duration-300 ease-in-out
          ${
            isScrolled
              ? 'max-w-4xl rounded-xl shadow-lg backdrop-blur-xl bg-white/50  '
              : 'max-w-full rounded-none bg-transparent shadow-none'
          }`}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Party<span style={{ color: brandColor }}>Hub</span>
          </Link>

          <nav className="hidden items-center gap-2 rounded-full bg-white/30 p-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setActiveLink(link.label)}
                className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors
                  ${
                    activeLink === link.label
                      ? 'text-white' 
                      : 'text-slate-600 hover:text-slate-900' 
                  }`}
              >
                {activeLink === link.label && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 z-0 rounded-full"
                    style={{ backgroundColor: brandColor }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <button className="px-4 py-2 bg-slate-800 text-white rounded-md font-semibold text-sm hover:bg-slate-700 transition-colors">
            Vendor Login
          </button>
        </div>
      </div>
    </header>
  );
};