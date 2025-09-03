// src/hooks/useLenis.ts
'use client'; // It's good practice to add this to hooks that are client-only.

import { useEffect } from 'react';
import Lenis from 'lenis';

// Define a custom interface for the Window object to include our 'lenis' property
// This helps avoid using 'any' and keeps our code type-safe.
interface CustomWindow extends Window {
  lenis?: Lenis;
}

export const useLenis = () => {
  useEffect(() => {
    // All code that uses browser-specific objects like 'window' is now
    // safely inside this useEffect hook.
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Assign to the window object here, inside the effect.
    (window as CustomWindow).lenis = lenis;

    // The cleanup function also runs on the client.
    return () => {
      lenis.destroy();
      (window as CustomWindow).lenis = undefined;
    };
  }, []); // Empty dependency array ensures this runs once on mount.
};