"use client";

import { useEffect } from "react";
import Lenis from "lenis";

interface CustomWindow extends Window {
  lenis?: Lenis;
}

export const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    (window as CustomWindow).lenis = lenis;

    return () => {
      lenis.destroy();
      (window as CustomWindow).lenis = undefined;
    };
  }, []);
};
