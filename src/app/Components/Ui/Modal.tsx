"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React, { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    // Function to handle the Escape key press
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // When the modal is open...
    if (isOpen) {
      // 1. Prevent background scrolling
      document.body.style.overflow = "hidden";
      // 2. Add listener for the Escape key
      document.addEventListener("keydown", handleEscape);
    }

    // Cleanup function that runs when the modal closes or component unmounts
    return () => {
      // 1. Restore background scrolling
      document.body.style.overflow = "unset";
      // 2. Remove the Escape key listener to prevent memory leaks
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]); // Re-run the effect if isOpen or onClose changes

  return (
    <AnimatePresence>
      {isOpen && (
        // The main container is now a portal-like div that handles the backdrop and centering
        <motion.div
          className="fixed h-full inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16 sm:pt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }} // Faster transition for the backdrop
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm h-svw"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-white rounded-xl shadow-2xl p-6 w-auto max-w-3xl mb-8"
            // Stop click events from bubbling up to the backdrop and closing the modal
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 id="modal-title" className="text-xl font-bold text-slate-800">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
