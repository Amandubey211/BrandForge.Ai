// src/app/Components/ui/PostCard.tsx
'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';

// --- PROPS ---
interface PostCardProps {
  imagePreviewUrl: string | null;
  bodyContent: string;
  hashtags: string[];
  brandColor: string;
}

// --- COMPONENT ---
export const PostCard = forwardRef<HTMLDivElement, PostCardProps>(({
  imagePreviewUrl, bodyContent, hashtags, brandColor
}, ref) => {
  return (
    <div ref={ref} className="w-full h-full bg-black overflow-hidden flex flex-col">
      {/* 1. Main Image Area */}
      <div className="w-full flex-grow relative">
        {/* Blurred Background Image */}
        {imagePreviewUrl && (
          <Image 
            src={imagePreviewUrl} 
            alt="Post background" 
            fill 
            className="object-cover z-0 scale-125 brightness-50" 
            style={{ filter: 'blur(24px)' }}
            sizes="70vw" 
          />
        )}
        {/* Main Content Image */}
        {imagePreviewUrl ? (
          <Image 
            src={imagePreviewUrl} 
            alt="Post image" 
            fill 
            className="object-contain z-10" 
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
  );
});
PostCard.displayName = 'PostCard';