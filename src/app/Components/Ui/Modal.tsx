// src/app/Components/ui/Modal.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, imageUrl }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.download = `partyhub-preview-${Date.now()}.png`;
    link.href = imageUrl;
    link.click();
  };

  return (
    <AnimatePresence>
      {isOpen && imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 bg-slate-800 text-white">
              <h3 className="font-semibold">Image Preview</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="p-2 rounded hover:bg-slate-700 disabled:opacity-50"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-5 w-5" />
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="p-2 rounded hover:bg-slate-700 disabled:opacity-50"
                  title="Zoom In"
                >
                  <ZoomIn className="h-5 w-5" />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 rounded hover:bg-slate-700"
                  title="Rotate"
                >
                  <RotateCw className="h-5 w-5" />
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 rounded hover:bg-slate-700"
                  title="Reset"
                >
                  Reset
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded hover:bg-slate-700"
                  title="Download"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded hover:bg-slate-700"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Image Content */}
            <div className="relative flex-1 overflow-auto bg-slate-900 flex items-center justify-center p-8">
              <motion.div
                style={{ 
                  scale: zoom,
                  rotate: `${rotation}deg`,
                  transition: 'transform 0.2s ease'
                }}
                className="relative"
              >
                <Image
                  src={imageUrl}
                  alt="Preview"
                  width={800}
                  height={600}
                  className="object-contain max-w-full max-h-full"
                />
              </motion.div>
            </div>
            
            {/* Zoom indicator */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {Math.round(zoom * 100)}%
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};