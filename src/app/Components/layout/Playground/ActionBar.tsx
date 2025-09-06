// src/components/layout/Playground/ActionBar.tsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Copy, Download, Send, AlertTriangle } from "lucide-react";
import { MAX_CHARS } from "@/config/constants";
import { FormData } from "../Playground";
import { PostData } from "../../Ui/PostCard";

interface ActionBarProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onGenerate: () => void;
  isFormComplete: boolean;
  isLoading: boolean;
  error: string;
  brandColor: string;
  generatedPost: PostData | null;
  displayContent: PostData;
  handleDownload: () => void;
}

// Animation variants for the action buttons
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
};

const buttonVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const ActionBar: React.FC<ActionBarProps> = ({
  formData,
  setFormData,
  onGenerate,
  isFormComplete,
  isLoading,
  error,
  brandColor,
  generatedPost,
  displayContent,
  handleDownload,
}) => {
  const handleCopyText = () => {
    const postText = `${displayContent.headline}\n\n${
      displayContent.body
    }\n\n${displayContent.hashtags.join(" ")}`;
    navigator.clipboard.writeText(postText).then(() => {
      toast.success("Post text copied!");
    });
  };

  return (
    <div className="relative flex-shrink-0 border-t border-slate-200 bg-white/80 backdrop-blur-sm p-4 flex flex-col gap-4 overflow-hidden">
      {/* --- Animated Loading Bar --- */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="h-full"
              style={{ backgroundColor: brandColor }}
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Text Input Area --- */}
      <div className="relative w-full max-w-4xl mx-auto">
        <textarea
          rows={3}
          value={formData.postText}
          onChange={(e) =>
            setFormData((p) => ({ ...p, postText: e.target.value }))
          }
          className="w-full px-4 py-3 pr-[110px] border border-slate-300 rounded-xl shadow-sm resize-none focus:ring-2 focus:ring-offset-1 transition-all text-base"
          style={{
            borderColor: error ? "rgb(239 68 68)" : undefined,
            boxShadow: error ? `0 0 0 2px rgb(239 68 68 / 20%)` : undefined,
          }}
          placeholder="Enter your core message, keywords, or a simple idea..."
          maxLength={MAX_CHARS}
          disabled={isLoading}
        />
        <div className="absolute right-3 inset-y-0 flex items-center gap-2">
          <span
            className={`text-xs font-mono transition-colors ${
              formData.postText.length >= MAX_CHARS
                ? "text-red-500 font-medium"
                : "text-slate-400"
            }`}
          >
            {formData.postText.length}/{MAX_CHARS}
          </span>
          <motion.button
            onClick={onGenerate}
            disabled={!isFormComplete || isLoading}
            className="p-3 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: brandColor }}
            aria-label="Generate Post"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>

      {/* --- Animated Error Message --- */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-500 text-sm text-center flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="alert"
          >
            <AlertTriangle className="h-4 w-4" /> {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* --- Staggered Action Buttons (Copy/Download) --- */}
      <AnimatePresence>
        {generatedPost && !isLoading && (
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.button
              onClick={handleCopyText}
              className="w-full sm:w-auto flex-grow sm:flex-grow-0 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors justify-center"
              variants={buttonVariants}
            >
              <Copy className="h-4 w-4" /> Copy Text
            </motion.button>
            <motion.button
              onClick={handleDownload}
              className="w-full sm:w-auto flex-grow sm:flex-grow-0 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors justify-center"
              style={{ backgroundColor: brandColor }}
              variants={buttonVariants}
            >
              <Download className="h-4 w-4" /> Download Image
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
