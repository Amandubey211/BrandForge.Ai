'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                 
                    className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16 sm:pt-24"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                        onClick={onClose} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    <motion.div
                        className="relative bg-white rounded-xl shadow-2xl p-6 w-auto max-w-4xl mb-8"
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <div className="flex justify-between items-center mb-4 h-full">
                            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
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