// src/components/Ui/Modal.tsx

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React, { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

// Animation variants for the card
const cardVariants = {
  hidden: { scale: 0.95, y: -30, opacity: 0 },
  visible: { scale: 1, y: 0, opacity: 1 },
  exit: { scale: 0.95, y: 20, opacity: 0 },
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "2xl",
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        // --- NEW ---: Main wrapper is now a simple portal, aria attributes moved here.
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Sibling 1: The Backdrop. Independent and always covers the full screen. */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Sibling 2: The Scrolling and Centering Container. */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-start justify-center min-h-full p-4 pt-16 sm:pt-24">
              <motion.div
                className={`relative bg-white rounded-xl shadow-2xl w-full mb-8 ${sizeClasses[size]}`}
                onClick={(e) => e.stopPropagation()}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-200">
                  <h3
                    id="modal-title"
                    className="text-lg font-semibold text-slate-800"
                  >
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={22} />
                  </button>
                </div>
                <div className="p-4 sm:p-5">{children}</div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
