// src/components/layout/Playground/ActionBar.tsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Copy, Download, Send } from "lucide-react";
import { MAX_CHARS } from "@/config/constants"; // Adjust path
import { FormData } from "../Playground"; // Adjust path
import { PostData } from "../../Ui/PostCard"; // Adjust path

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
    <div className="flex-shrink-0 border-t border-slate-200 bg-white p-4 space-y-3">
      {/* --- Text Input Area --- */}
      <div className="relative w-full max-w-4xl mx-auto">
        <textarea
          rows={2}
          value={formData.postText}
          onChange={(e) =>
            setFormData((p) => ({ ...p, postText: e.target.value }))
          }
          className="w-full px-4 py-3 pr-28 border border-slate-300 rounded-xl shadow-sm resize-none focus:ring-2 focus:ring-indigo-500 transition"
          placeholder="Enter your core message here..."
          maxLength={MAX_CHARS}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <span
            className={`text-xs font-mono ${
              formData.postText.length >= MAX_CHARS
                ? "text-red-500"
                : "text-slate-400"
            }`}
          >
            {formData.postText.length}/{MAX_CHARS}
          </span>
          <button
            onClick={onGenerate}
            disabled={!isFormComplete || isLoading}
            className="p-2 rounded-lg text-white transition disabled:opacity-50"
            style={{ backgroundColor: brandColor }}
            aria-label="Generate Post"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>

      {/* --- Error Message --- */}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* --- Action Buttons (Copy/Download) --- */}
      <AnimatePresence>
        {generatedPost && (
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <button
              onClick={handleCopyText}
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors w-40 justify-center"
            >
              <Copy className="h-4 w-4" /> Copy Text
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors w-40 justify-center"
              style={{ backgroundColor: brandColor }}
            >
              <Download className="h-4 w-4" /> Download
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};