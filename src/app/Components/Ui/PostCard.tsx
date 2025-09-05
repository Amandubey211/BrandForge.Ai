// src/app/Components/ui/PostCard.tsx
'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';

interface PostCardProps {
  imagePreviewUrl: string | null;
  logoPreviewUrl: string | null;
  bodyContent: string;
  hashtags: string[];
  brandColor: string;
  headlineContent: string;
  headlinePosition: { x: number; y: number };
  logoPosition: { x: number; y: number };
  template: string;
}

export const PostCard = forwardRef<HTMLDivElement, PostCardProps>(({
  imagePreviewUrl,
  logoPreviewUrl,
  bodyContent,
  hashtags,
  brandColor,
  headlineContent,
  headlinePosition,
  logoPosition,
  template
}, ref) => {
  return (
    <div ref={ref} className="w-full h-full bg-black overflow-hidden flex flex-col relative">
      {/* Blurred Background for object-contain effect */}
      {imagePreviewUrl && (
        <Image 
          src={imagePreviewUrl} 
          alt="Post background" 
          fill 
          className="object-cover z-0 scale-110 brightness-50" 
          style={{ filter: 'blur(24px)' }}
          sizes="70vw" 
        />
      )}
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* 1. Main Image Area */}
        <div className="w-full flex-grow relative flex items-center justify-center">
          {imagePreviewUrl ? (
            <Image 
              src={imagePreviewUrl} 
              alt="Post image" 
              fill 
              className="object-contain" 
              sizes="70vw" 
            />
          ) : (
            <div className="absolute inset-0 bg-slate-200" />
          )}
        </div>

        {/* 2. Body Text Area */}
        {bodyContent && (
          <div 
            className="w-full p-6 bg-white border-t border-slate-200 text-slate-800"
            dangerouslySetInnerHTML={{ __html: bodyContent }}
          />
        )}

        {/* 3. Hashtag Footer Area */}
        {hashtags.length > 0 && (
          <div className="w-full p-3 text-white text-sm font-medium" style={{ backgroundColor: brandColor }}>
            <p>{hashtags.join(' ')}</p>
          </div>
        )}
      </div>

      {/* Interactive Elements (will be captured in download) */}
      {headlineContent && (
        <div 
          className="absolute cursor-grab active:cursor-grabbing p-2 z-20"
          style={{ 
            left: headlinePosition.x, 
            top: headlinePosition.y,
            transform: 'translateZ(0)' // Force GPU rendering for crisp capture
          }}
          dangerouslySetInnerHTML={{ __html: headlineContent }}
        />
      )}
      
      {logoPreviewUrl && (
        <div 
          className="absolute cursor-grab active:cursor-grabbing group z-20"
          style={{ 
            left: logoPosition.x, 
            top: logoPosition.y,
            transform: 'translateZ(0)' // Force GPU rendering for crisp capture
          }}
        >
          <div className="relative w-16 h-16 p-1 bg-white/50 rounded-lg backdrop-blur-sm">
            <Image 
              src={logoPreviewUrl} 
              alt="Logo" 
              fill 
              className="object-contain" 
            />
          </div>
        </div>
      )}
    </div>
  );
});

PostCard.displayName = 'PostCard';