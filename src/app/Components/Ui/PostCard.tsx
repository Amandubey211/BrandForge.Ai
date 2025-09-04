// src/app/Components/ui/PostCard.tsx
'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';
import { motion, Point } from 'framer-motion';

// --- PROPS ---
export type LayoutTemplate = 'default' | 'image-left'; // Define available templates

interface PostCardProps {
  imagePreviewUrl: string | null;
  logoPreviewUrl: string | null;
  headlineContent: string;
  bodyContent: string;
  hashtags: string[];
  brandColor: string;
  logoPosition: Point;
  headlinePosition: Point;
  template: LayoutTemplate;
}

// --- COMPONENT ---
export const PostCard = forwardRef<HTMLDivElement, PostCardProps>(({
  imagePreviewUrl, logoPreviewUrl, headlineContent, bodyContent, hashtags,
  brandColor, logoPosition, headlinePosition, template
}, ref) => {
  const textShadow = 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))';

  const ImageArea = () => (
    <div className="w-full h-full relative">
      {imagePreviewUrl ? (
        <Image src={imagePreviewUrl} alt="Post image" fill className="object-contain" sizes="70vw" />
      ) : (
        <div className="absolute inset-0 bg-slate-200" />
      )}
      <motion.div className="absolute p-2 z-20" style={{ x: headlinePosition.x, y: headlinePosition.y, pointerEvents: 'none' }} dangerouslySetInnerHTML={{ __html: headlineContent }} />
      {logoPreviewUrl && (<motion.div className="absolute w-16 h-16 p-1  rounded-lg  z-30" style={{ x: logoPosition.x, y: logoPosition.y, pointerEvents: 'none' }}><Image src={logoPreviewUrl} alt="Logo" fill className="object-contain" sizes="64px" /></motion.div>)}
    </div>
  );

  const TextArea = () => (
    <div className="flex flex-col h-full">
      {bodyContent && (<div className="w-full p-6 bg-white text-slate-800 flex-grow" dangerouslySetInnerHTML={{ __html: bodyContent }} />)}
      {hashtags.length > 0 && (<div className="w-full p-3 text-white text-sm font-medium" style={{ backgroundColor: brandColor }}><p>{hashtags.join(' ')}</p></div>)}
    </div>
  );

  return (
    <div ref={ref} className="w-full h-full bg-white overflow-hidden">
      {template === 'default' && (
        <div className="flex flex-col h-full">
          <div className="flex-grow relative"><ImageArea /></div>
          <div className="flex-shrink-0"><TextArea /></div>
        </div>
      )}
      {template === 'image-left' && (
        <div className="grid grid-cols-2 h-full">
          <div className="relative"><ImageArea /></div>
          <div className="border-l border-slate-200"><TextArea /></div>
        </div>
      )}
    </div>
  );
});
PostCard.displayName = 'PostCard';