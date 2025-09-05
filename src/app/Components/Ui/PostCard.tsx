'use client';

import React, { forwardRef, useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, Point } from 'framer-motion';

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
  onHeadlinePositionChange: (position: Point) => void;
  onLogoPositionChange: (position: Point) => void;
  dragConstraintsRef: React.RefObject<HTMLDivElement>;
  onHeadlineDoubleClick: () => void;
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
  template,
  onHeadlinePositionChange,
  onLogoPositionChange,
  dragConstraintsRef,
  onHeadlineDoubleClick
}, ref) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  // Use useEffect to measure the canvas size only when needed
  const updateCanvasSize = useCallback(() => {
    if (contentRef.current) {
      const { width, height } = contentRef.current.getBoundingClientRect();
      setCanvasSize({ width, height });
    }
  }, []);

  // Measure on mount and when template changes
  useEffect(() => {
    updateCanvasSize();
    
    // Optional: Add resize observer for responsive changes
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, [updateCanvasSize, template]);

  const getTemplateClass = () => {
    switch (template) {
      case 'image-left':
        return 'flex-row';
      case 'text-overlay':
        return '';
      case 'footer-focus':
        return 'flex-col-reverse';
      default:
        return 'flex-col';
    }
  };

  const getImageContainerClass = () => {
    switch (template) {
      case 'image-left':
        return 'w-1/2';
      default:
        return 'w-full flex-grow';
    }
  };

  const getTextContainerClass = () => {
    switch (template) {
      case 'image-left':
        return 'w-1/2 flex flex-col justify-between';
      default:
        return 'w-full';
    }
  };

  return (
    <div 
      ref={ref} 
      className="w-full h-full bg-black overflow-hidden flex relative"
      style={template === 'image-left' ? { flexDirection: 'row' } : {}}
    >
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
      <div 
        ref={contentRef}
        className={`relative z-10 flex ${getTemplateClass()} h-full w-full`}
      >
        {/* 1. Main Image Area */}
        <div className={`${getImageContainerClass()} relative flex items-center justify-center`}>
          {imagePreviewUrl ? (
            <Image 
              src={imagePreviewUrl} 
              alt="Post image" 
              fill 
              className="object-cover" 
              sizes="70vw" 
            />
          ) : (
            <div className="absolute inset-0 bg-slate-200" />
          )}
        </div>

        {/* 2. Text Content Area */}
        <div className={`${getTextContainerClass()} bg-white text-slate-800 flex flex-col`}>
          {/* Header Section */}
          {headlineContent && (
            <div 
              className="p-4 border-b border-slate-200 font-bold text-xl"
              style={{ color: brandColor }}
              dangerouslySetInnerHTML={{ __html: headlineContent.replace(/<h2[^>]*>|<\/h2>/g, '') }}
            />
          )}
          
          {/* Body Text Area */}
          {bodyContent && (
            <div 
              className="p-4 flex-grow"
              dangerouslySetInnerHTML={{ __html: bodyContent.replace(/<p[^>]*>|<\/p>/g, '') }}
            />
          )}
          
          {/* 3. Hashtag Footer Area */}
          {hashtags.length > 0 && (
            <div 
              className="p-3 text-white text-sm font-medium" 
              style={{ backgroundColor: brandColor }}
            >
              <p>{hashtags.join(' ')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Elements (will be captured in download) */}
      {headlineContent && (
        <motion.div 
          className="absolute cursor-grab active:cursor-grabbing p-2 z-20 bg-white/80 backdrop-blur-sm rounded-lg"
          style={{ 
            left: headlinePosition.x, 
            top: headlinePosition.y,
            transform: 'translateZ(0)', // Force GPU rendering for crisp capture
            maxWidth: canvasSize.width * 0.8
          }}
          drag
          dragConstraints={dragConstraintsRef}
          dragMomentum={false}
          onDragEnd={(e, info) => {
            onHeadlinePositionChange({
              x: Math.max(0, Math.min(canvasSize.width - 200, headlinePosition.x + info.offset.x)),
              y: Math.max(0, Math.min(canvasSize.height - 100, headlinePosition.y + info.offset.y))
            });
          }}
          onDoubleClick={onHeadlineDoubleClick}
          dangerouslySetInnerHTML={{ __html: headlineContent }}
        />
      )}
      
      {logoPreviewUrl && (
        <motion.div 
          className="absolute cursor-grab active:cursor-grabbing group z-20"
          style={{ 
            left: logoPosition.x, 
            top: logoPosition.y,
            transform: 'translateZ(0)' // Force GPU rendering for crisp capture
          }}
          drag
          dragConstraints={dragConstraintsRef}
          dragMomentum={false}
          onDragEnd={(e, info) => {
            onLogoPositionChange({
              x: Math.max(0, Math.min(canvasSize.width - 64, logoPosition.x + info.offset.x)),
              y: Math.max(0, Math.min(canvasSize.height - 64, logoPosition.y + info.offset.y))
            });
          }}
        >
          <Image 
            src={logoPreviewUrl} 
            alt="Brand logo" 
            width={64} 
            height={64} 
            className="object-contain"
          />
        </motion.div>
      )}
    </div>
  );
});

PostCard.displayName = 'PostCard';