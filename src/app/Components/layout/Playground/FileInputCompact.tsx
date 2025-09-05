// src/components/layout/Playground/FileInputCompact.tsx

import React, { ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileCheck2, UploadCloud, X } from "lucide-react";

interface FileInputCompactProps {
  label: string;
  file: File | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export const FileInputCompact: React.FC<FileInputCompactProps> = ({
  label,
  file,
  onFileChange,
  onRemove,
}) => (
  <div>
    <label className="text-sm font-medium text-slate-600 mb-1 block">
      {label}
    </label>
    <div className="relative">
      <label className="cursor-pointer bg-slate-50 border-2 border-dashed rounded-lg p-3 flex items-center justify-center min-h-[60px] hover:bg-slate-100 transition-colors text-center overflow-hidden">
        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file-selected"
              className="flex items-center justify-center gap-2 w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {/* FIX: Ensure the icon does not shrink */}
              <FileCheck2 className="h-5 w-5 text-green-500 flex-shrink-0" />
              {/* 
                FIX: 
                - Removed max-w-[150px] to make it responsive.
                - Added min-w-0 to allow the element to shrink properly within a flex container, enabling truncation.
              */}
              <span className="text-xs font-medium text-slate-700 truncate min-w-0">
                {file.name}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="file-empty"
              className="flex items-center gap-2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <UploadCloud className="h-5 w-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Upload</span>
            </motion.div>
          )}
        </AnimatePresence>
        <input
          type="file"
          className="hidden"
          onChange={onFileChange}
          accept="image/*"
        />
      </label>
      {file && (
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          className="absolute top-1 right-1 bg-slate-600 text-white rounded-full p-0.5 hover:bg-slate-800 transition-colors"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          aria-label="Remove file"
        >
          <X className="h-3 w-3" />
        </motion.button>
      )}
    </div>
  </div>
);
