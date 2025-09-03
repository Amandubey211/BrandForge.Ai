// src/app/Components/layout/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
  brandColor: string;
}

const companyLinks = [
  { href: '#', label: 'About Us' },
  { href: '#', label: 'Blog' },
  { href: '#', label: 'Careers' },
];

const legalLinks = [
  { href: '#', label: 'Privacy Policy' },
  { href: '#', label: 'Terms of Service' },
];

export const Footer: React.FC<FooterProps> = ({ brandColor }) => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo and Mission */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white">
              Party<span style={{ color: brandColor }}>Hub</span>
            </Link>
            <p className="mt-4 text-sm text-slate-400">
              Your AI-powered platform for effortless event planning.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h3 className="font-semibold text-white tracking-wider">Company</h3>
              <ul className="mt-4 space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col items-center justify-between sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} PartyHub. All Rights Reserved.
          </p>
          <div className="mt-4 flex gap-x-6 sm:mt-0">
            <Link
              href="#"
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};