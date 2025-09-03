// src/components/layout/SmoothScroller.tsx
'use client'; // This directive is crucial!

import { useLenis } from '@/hooks/useLenis';
import React from 'react';

export const SmoothScroller = ({ children }: { children: React.ReactNode }) => {
  // Our custom hook initializes Lenis for the entire application
  useLenis();

  return <>{children}</>;
};