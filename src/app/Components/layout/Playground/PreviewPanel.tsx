// src/components/layout/Playground/PreviewPanel.tsx

import React from "react";
import { motion, Point } from "framer-motion";
import { Eye } from "lucide-react";
import { PostCard, LayoutTemplate, PostData } from "../../Ui/PostCard"; // Adjust path

interface PreviewPanelProps {
  generatedPost: PostData | null;
  setIsPreviewModalOpen: (isOpen: boolean) => void;
  dragConstraintsRef: React.RefObject<HTMLDivElement>;
  activeTemplate: LayoutTemplate;
  imageBase64: string | null;
  logoBase64: string | null;
  displayContent: PostData;
  brandColor: string;
  logoPosition: Point;
  setLogoPosition: (position: Point) => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  generatedPost,
  setIsPreviewModalOpen,
  dragConstraintsRef,
  activeTemplate,
  imageBase64,
  logoBase64,
  displayContent,
  brandColor,
  logoPosition,
  setLogoPosition,
}) => {
  return (
    <div
      ref={dragConstraintsRef}
      className="flex-grow flex items-center justify-center p-6 bg-slate-50 relative bg-grid "
    >
      {generatedPost && (
        <button
          onClick={() => setIsPreviewModalOpen(true)}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition "
          aria-label="Open full preview"
        >
          <Eye size={20} className="text-slate-700" />
        </button>
      )}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-2xl  h-auto max-h-[85%] rounded-lg shadow-lg overflow-y-scroll overflow-x-hidden relative z-10 bg-white"
      >
        <PostCard
          template={activeTemplate}
          imagePreviewUrl={imageBase64}
          logoPreviewUrl={logoBase64}
          displayContent={displayContent}
          brandColor={brandColor}
          logoPosition={logoPosition}
          onLogoPositionChange={setLogoPosition}
          dragConstraintsRef={dragConstraintsRef}
        />
      </motion.div>
    </div>
  );
};
