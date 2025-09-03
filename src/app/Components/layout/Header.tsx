// src/components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeaderProps {
  brandColor: string;
}

const navLinks = [
  { href: '#', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#owner', label: 'The Founder' },
];

export const Header: React.FC<HeaderProps> = ({ brandColor }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Set state to true if user has scrolled more than 10px, otherwise false
      setIsScrolled(window.scrollY > 10);
    };

    // Add event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <header className="sticky top-4 z-50 transition-all duration-300 ease-in-out">
      <div
        className={`container mx-auto transition-all duration-300 ease-in-out
          ${
            isScrolled
              ? 'max-w-4xl rounded-xl shadow-lg backdrop-blur-xl'
              : 'max-w-full rounded-none bg-transparent shadow-none'
          }`}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Party<span style={{ color: brandColor }}>Hub</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link.label}
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