"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {  PostData } from "../Ui/PostCard"; //PostCard,

interface PostMarqueeProps {
  posts: (PostData & { image: string })[];
  brandColor: string;
  baseVelocity: number;
}

const marqueeVariants: Variants = {
  animate: {
    x: ["-100%", "0%"],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 50,
        ease: "linear",
      },
    },
  },
};

export const PostMarquee: React.FC<PostMarqueeProps> = ({
  posts,
  brandColor,
}) => {
  const extendedPosts = [...posts, ...posts]; // Duplicate for seamless loop
console.log(brandColor)
  return (
    <div className="w-full overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-block"
        variants={marqueeVariants}
        animate="animate"
      >
        {extendedPosts.map((post, index) => (
          <div key={`marquee-${index}`} className="inline-flex px-4 align-top">
            <div className="w-[300px] h-[300px] scale-90">
              {/* <PostCard
                displayContent={post}
                imagePreviewUrl={post.image}
                brandColor={brandColor}
                template="default"
                logoPreviewUrl={null}
                logoPosition={{ x: 0, y: 0 }}
                onLogoPositionChange={() => {}}
                dragConstraintsRef={{ current: null }}
              /> */}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
