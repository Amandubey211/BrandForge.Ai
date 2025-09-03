import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SmoothScroller } from "./Components/layout/SmoothScroller";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: 'PartyHub Post Generator', // Updated title
  description: 'AI-Powered Social Media Post Generator for Event Vendors', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <SmoothScroller>{children}</SmoothScroller>
      </body>
    </html>
  );
}
