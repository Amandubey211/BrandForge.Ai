"use client";

import { useLenis } from "@/hooks/useLenis";
import React from "react";

export const SmoothScroller = ({ children }: { children: React.ReactNode }) => {
  useLenis();

  return <>{children}</>;
};
