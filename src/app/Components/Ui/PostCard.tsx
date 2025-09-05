"use client";

import React from "react";
import Image from "next/image";
import { motion, Point, PanInfo } from "framer-motion";

export type LayoutTemplate =
  | "default"
  | "image-left"
  | "text-overlay"
  | "footer-focus";

export interface PostData {
  headline: string;
  body: string;
  hashtags: string[];
}

interface PostCardProps {
  imagePreviewUrl: string | null;
  logoPreviewUrl: string | null;
  displayContent: PostData;
  brandColor: string;
  logoPosition: Point;
  template: LayoutTemplate;
  onLogoPositionChange: (position: Point) => void;
  dragConstraintsRef: React.RefObject<HTMLDivElement>;
}

export const PostCard: React.FC<PostCardProps> = ({
  imagePreviewUrl,
  logoPreviewUrl,
  displayContent,
  brandColor,
  logoPosition,
  template,
  onLogoPositionChange,
  dragConstraintsRef,
}) => {
  const { headline, body, hashtags } = displayContent;

  const handleLogoDragEnd = (info: PanInfo) => {
    if (!dragConstraintsRef.current) return;
    const containerRect = dragConstraintsRef.current.getBoundingClientRect();

    const newX = logoPosition.x + (info.offset.x / containerRect.width) * 100;
    const newY = logoPosition.y + (info.offset.y / containerRect.height) * 100;

    const clampedX = Math.max(0, Math.min(newX, 90));
    const clampedY = Math.max(0, Math.min(newY, 90));

    onLogoPositionChange({ x: clampedX, y: clampedY });
  };

  const logoElement = logoPreviewUrl && (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing z-40 w-[12%]"
      style={{
        top: `${logoPosition.y}%`,
        left: `${logoPosition.x}%`,
      }}
      drag
      dragConstraints={dragConstraintsRef}
      dragMomentum={false}
      onDragEnd={(_, info) => handleLogoDragEnd(info)}
    >
      <Image
        src={logoPreviewUrl}
        alt="Brand logo"
        width={64}
        height={64}
        className="object-contain"
      />
    </motion.div>
  );

  const imageBackground = imagePreviewUrl && (
    <Image
      src={imagePreviewUrl}
      alt="Post background"
      fill
      className="object-cover z-0 scale-110 brightness-50"
      style={{ filter: "blur(24px)" }}
      sizes="70vw"
    />
  );
  const mainImage = imagePreviewUrl ? (
    <Image
      src={imagePreviewUrl}
      alt="Post image"
      fill
      className="object-contain z-10"
      sizes="20vw"
    />
  ) : (
    <div className="w-full h-full bg-slate-200" />
  );
  const hashtagElement = hashtags.length > 0 && (
    <p className="text-xl opacity-90 mt-auto flex-shrink-0 pt-4">
      {hashtags.join(" ")}
    </p>
  );

  const renderContent = () => {
    switch (template) {
      case "footer-focus":
        return (
          <div className="w-full h-full flex flex-col bg-white">
            <div className="flex-grow relative">
              {imageBackground}
              {mainImage}
              {logoElement}
            </div>
            <div
              className="flex-shrink-0 p-6 text-slate-800 border-t-4"
              style={{ borderColor: brandColor }}
            >
              <h2
                className="font-extrabold text-xl leading-tight"
                style={{ color: brandColor }}
                dangerouslySetInnerHTML={{ __html: headline }}
              />
              <p
                className="text-sm mt-2"
                dangerouslySetInnerHTML={{ __html: body }}
              />
              {hashtagElement}
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex flex-col bg-white">
            <div className="w-full aspect-square relative flex-shrink-0">
              {imageBackground}
              {mainImage}
              {logoElement}
            </div>
            <div className="p-6 flex flex-col text-slate-800">
              <h2
                className="font-extrabold text-xl leading-tight"
                style={{ color: brandColor }}
                dangerouslySetInnerHTML={{ __html: headline }}
              />
              <p
                className="text-sm mt-2"
                dangerouslySetInnerHTML={{ __html: body }}
              />
              {hashtagElement}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full bg-black overflow-hidden relative">
      {renderContent()}
    </div>
  );
};
