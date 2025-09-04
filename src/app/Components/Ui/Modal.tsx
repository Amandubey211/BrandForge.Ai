// src/app/Components/ui/Modal.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <motion.div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-slate-700 text-white rounded-full p-1.5 z-10 hover:bg-slate-900 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="relative aspect-video w-full">
          <Image src={imageUrl} alt="File preview" fill className="object-contain rounded-lg" />
        </div>
      </motion.div>
    </motion.div>
  );
}