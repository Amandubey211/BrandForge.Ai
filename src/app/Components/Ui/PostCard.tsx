'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';
import { motion, Point } from 'framer-motion';

// This type can be shared between Playground and PostCard
export type LayoutTemplate = 'default' | 'image-left' | 'text-overlay' | 'footer-focus';

interface PostData {
    headline: string;
    body: string;
    hashtags: string[];
}

interface PostCardProps {
    imagePreviewUrl: string | null;
    logoPreviewUrl: string | null;
    displayContent: PostData;
    brandColor: string;
    headlinePosition: Point;
    logoPosition: Point;
    template: LayoutTemplate;
    onHeadlinePositionChange: (position: Point) => void;
    onLogoPositionChange: (position: Point) => void;
    dragConstraintsRef: React.RefObject<HTMLDivElement>;
}

export const PostCard = forwardRef<HTMLDivElement, PostCardProps>(({
    imagePreviewUrl,
    logoPreviewUrl,
    displayContent,
    brandColor,
    headlinePosition,
    logoPosition,
    template,
    onHeadlinePositionChange,
    onLogoPositionChange,
    dragConstraintsRef
}, ref) => {

    const { headline, body, hashtags } = displayContent;

    const renderContent = () => {
        // --- Reusable Elements ---
        const logoElement = logoPreviewUrl && (
            <motion.div
                className="absolute cursor-grab active:cursor-grabbing z-30"
                style={{ left: logoPosition.x, top: logoPosition.y, transform: 'translateZ(0)' }}
                drag dragConstraints={dragConstraintsRef} dragMomentum={false}
                onDragEnd={(_, info) => onLogoPositionChange(info.point)}
            >
                <Image src={logoPreviewUrl} alt="Brand logo" width={64} height={64} className="object-contain" />
            </motion.div>
        );

        const imageBackground = imagePreviewUrl && (
             <Image src={imagePreviewUrl} alt="Post background" fill className="object-cover z-0 scale-110 brightness-50" style={{ filter: 'blur(24px)' }} sizes="70vw" />
        );

        const mainImage = imagePreviewUrl ? (
            <Image src={imagePreviewUrl} alt="Post image" fill className="object-contain z-10" sizes="70vw" />
        ) : (
            <div className="w-full h-full bg-slate-200" />
        );
        
        const hashtagElement = hashtags.length > 0 && (
            <p className="text-sm opacity-90 mt-auto">{hashtags.join(' ')}</p>
        );

        // --- Template-Specific Layouts ---
        switch (template) {
            case 'text-overlay':
                return (
                    <div className="w-full h-full relative flex items-center justify-center text-white">
                        {imageBackground}
                        <div className="relative z-10 w-full h-full">{mainImage}</div>
                        {logoElement}
                        <motion.div
                            className="absolute p-4 z-20 cursor-grab active:cursor-grabbing bg-black/50 rounded-lg max-w-[80%]"
                            style={{ left: headlinePosition.x, top: headlinePosition.y, transform: 'translateZ(0)' }}
                            drag dragConstraints={dragConstraintsRef} dragMomentum={false}
                            onDragEnd={(_, info) => onHeadlinePositionChange(info.point)}
                        >
                            <h2 className="font-extrabold text-2xl leading-tight" dangerouslySetInnerHTML={{ __html: headline }} />
                            <p className="text-base mt-2" dangerouslySetInnerHTML={{ __html: body }} />
                            <div className="mt-4 text-xs opacity-80">{hashtags.join(' ')}</div>
                        </motion.div>
                    </div>
                );

            case 'image-left':
                return (
                    <div className="w-full h-full flex flex-row">
                        <div className="w-1/2 h-full relative">{imageBackground}{mainImage}{logoElement}</div>
                        <div className="w-1/2 h-full flex flex-col bg-white p-6 text-slate-800">
                            <h2 className="font-extrabold text-2xl leading-tight mb-4" style={{ color: brandColor }} dangerouslySetInnerHTML={{ __html: headline }} />
                            <p className="text-base flex-grow" dangerouslySetInnerHTML={{ __html: body }} />
                            {hashtagElement}
                        </div>
                    </div>
                );

            case 'footer-focus':
                 return (
                    <div className="w-full h-full flex flex-col">
                        <div className="flex-grow relative">{imageBackground}{mainImage}{logoElement}</div>
                        <div className="shrink-0 bg-white p-6 text-slate-800 border-t-4" style={{ borderColor: brandColor }}>
                            <h2 className="font-extrabold text-xl leading-tight" style={{ color: brandColor }} dangerouslySetInnerHTML={{ __html: headline }} />
                            <p className="text-sm mt-2" dangerouslySetInnerHTML={{ __html: body }} />
                            <div className="text-xs text-slate-500 mt-3">{hashtags.join(' ')}</div>
                        </div>
                    </div>
                );
            
            default: // Standard template
                return (
                    <div className="w-full h-full flex flex-col">
                        <div className="h-3/5 relative">{imageBackground}{mainImage}{logoElement}</div>
                        <div className="h-2/5 bg-white p-6 flex flex-col text-slate-800">
                            <h2 className="font-extrabold text-xl leading-tight" style={{ color: brandColor }} dangerouslySetInnerHTML={{ __html: headline }} />
                            <p className="text-sm mt-2 flex-grow" dangerouslySetInnerHTML={{ __html: body }} />
                            {hashtagElement}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div ref={ref} className="w-full h-full bg-black overflow-hidden relative">
            {renderContent()}
        </div>
    );
});

PostCard.displayName = 'PostCard';