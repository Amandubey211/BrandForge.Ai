import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SmoothScroller } from "./Components/layout/SmoothScroller";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrandForge AI - AI Social Media Post Generator",
  description:
    "A creative playground to generate polished, on-brand social media posts for event vendors using a multimodal AI. A take-home assignment by Aman Dubey.",

  // --- Open Graph (for social media link previews) ---
  openGraph: {
    title: "BrandForge AI by Aman Dubey",
    description: "Generate stunning social posts with an AI creative director.",
    url: "https://brandforge-ai-olive.vercel.app/", // IMPORTANT: Replace with your final Vercel URL
    siteName: "BrandForge AI",
    images: [
      {
        url: "/og-image.png", // Next.js will automatically handle this if the image is in /src/app
        width: 1200,
        height: 630,
        alt: "A preview of the BrandForge AI application interface showing the creative playground.",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // --- Twitter-specific tags ---
  twitter: {
    card: "summary_large_image",
    title: "BrandForge AI - AI Social Post Generator by Aman Dubey",
    description:
      "Generate stunning social posts with an AI creative director. Built with Next.js, Gemini, and Framer Motion.",
    creator: "https://x.com/AmanDub97115331", // Optional: Add your Twitter handle
    images: ["/og-image.png"],
  },

  // --- Other useful metadata ---
  metadataBase: new URL("https://brandforge-ai-olive.vercel.app/"), // IMPORTANT: Replace with your final Vercel URL
  keywords: [
    "Aman Dubey",
    "AI",
    "Generative AI",
    "Next.js",
    "React",
    "TypeScript",
    "PartyHub",
    "Social Media",
    "Gemini",
  ],
  authors: [{ name: "Aman Dubey", url: "https://amandubey.vercel.app/" }],
  creator: "Aman Dubey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <SmoothScroller>
          {children} <Toaster position="top-right" richColors />{" "}
        </SmoothScroller>
        <Analytics />
      </body>
    </html>
  );
}
