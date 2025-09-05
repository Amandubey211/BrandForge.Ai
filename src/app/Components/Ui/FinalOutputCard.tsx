"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { Point } from "framer-motion";
import { LayoutTemplate, PostData } from "./PostCard";

interface FinalOutputCardProps {
  imagePreviewUrl: string | null;
  logoPreviewUrl: string | null;
  displayContent: PostData;
  brandColor: string;
  logoPosition: Point;
  template: LayoutTemplate;
}

export const FinalOutputCard = forwardRef<HTMLDivElement, FinalOutputCardProps>(
  (
    {
      imagePreviewUrl,
      logoPreviewUrl,
      displayContent,
      brandColor,
      logoPosition,
      template,
    },
    ref
  ) => {
    const { headline, body, hashtags } = displayContent;

    const logoElement = logoPreviewUrl && (
      <div
        className="absolute z-40"
        style={{
          top: `${logoPosition.y}%`,
          left: `${logoPosition.x}%`,
          width: "12%",
          height: "auto",
        }}
      >
        <Image
          src={logoPreviewUrl}
          alt="Brand logo"
          width={128}
          height={128}
          className="object-contain"
        />
      </div>
    );

    const imageBackground = imagePreviewUrl && (
      <Image
        src={imagePreviewUrl}
        alt="Post background"
        fill
        className="object-cover z-0 scale-110 brightness-50"
        style={{ filter: "blur(24px)" }}
        sizes="1080px"
      />
    );
    const mainImage = imagePreviewUrl ? (
      <Image
        src={imagePreviewUrl}
        alt="Post image"
        fill
        className="object-contain z-10"
        sizes="1080px"
      />
    ) : (
      <div className="w-full h-full bg-slate-200" />
    );
    const hashtagElement = hashtags.length > 0 && (
      <p
        className="text-lg opacity-90 mt-auto flex-shrink-0 pt-4"
        style={{ fontFamily: "sans-serif" }}
      >
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
                className="flex-shrink-0 p-12 text-slate-800 border-t-8"
                style={{ borderColor: brandColor }}
              >
                <h2
                  className="text-4xl leading-tight font-extrabold"
                  style={{ color: brandColor, fontFamily: "sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: headline }}
                />
                <p
                  className="text-2xl mt-4"
                  style={{ fontFamily: "sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: body }}
                />
                {hashtagElement}
              </div>
            </div>
          );
        default:
          return (
            <div className="w-full h-full flex flex-col bg-white">
              <div className="w-full h-3/5 relative flex-shrink-0">
                {imageBackground}
                {mainImage}
                {logoElement}
              </div>
              <div className="h-2/5 p-12 flex flex-col text-slate-800">
                <h2
                  className="text-4xl leading-tight font-extrabold flex-shrink-0"
                  style={{ color: brandColor, fontFamily: "sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: headline }}
                />
                <p
                  className="text-2xl mt-4"
                  style={{ fontFamily: "sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: body }}
                />
                {hashtagElement}
              </div>
            </div>
          );
      }
    };

    return (
      <div
        ref={ref}
        className="w-[1080px] h-[1350px] bg-black overflow-hidden relative"
      >
        {renderContent()}
      </div>
    );
  }
);

FinalOutputCard.displayName = "FinalOutputCard";
