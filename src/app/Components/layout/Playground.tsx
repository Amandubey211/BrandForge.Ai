// src/app/Components/layout/Playground.tsx
'use client';

import React, { useState, useRef, ChangeEvent, ReactNode, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Point } from 'framer-motion';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import { Copy, Download, Sparkles, UploadCloud, FileCheck2, X, Move, Bot, Wand2, Info, ChevronDown, Eye, Square, Columns, PanelRight, Layers, Grid } from 'lucide-react';
import { PostCard } from '../Ui/PostCard';
import { Modal } from '../Ui/Modal';

// Helper function to convert a File to a base64 data URL
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// --- INTERFACES ---
export interface PostData {
  headline: string;
  body: string;
  hashtags: string[];
  layout: {
    theme: 'light' | 'dark';
    textPosition: string;
    logoPosition: string;
    styleSuggestion: string;
  };
}
interface FormData {
  brandTone: string;
  postText: string;
  logoFile: File | null;
  imageFile: File | null;
}
interface PlaygroundProps {
  brandColor: string;
  setBrandColor: (color: string) => void;
  onGenerate: (data: FormData) => void;
  isLoading: boolean;
  generatedPost: PostData | null;
  error: string;
}

type LayoutTemplate = 'default' | 'image-left' | 'text-overlay' | 'footer-focus';

// --- MAIN COMPONENT ---
export const Playground: React.FC<PlaygroundProps> = ({
  brandColor, setBrandColor, onGenerate, isLoading, generatedPost, error,
}) => {
  const [formData, setFormData] = useState<FormData>({ brandTone: 'Friendly & Professional', postText: '', logoFile: null, imageFile: null });
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('templates');
  
  const [headlineContent, setHeadlineContent] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const [logoPosition, setLogoPosition] = useState<Point>({ x: 20, y: 20 });
  const [headlinePosition, setHeadlinePosition] = useState<Point>({ x: 20, y: 200 });
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<LayoutTemplate>('default');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (generatedPost) {
      setHeadlineContent(`<h2 class="font-extrabold text-2xl leading-tight" style="color: ${brandColor}; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));">${generatedPost.headline}</h2>`);
      setBodyContent(`<p class="text-base">${generatedPost.body}</p>`);
      setActiveAccordion('customize');
      setIsPanelOpen(false);
    }
  }, [generatedPost, brandColor]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, type: 'logo' | 'image') => {
    const file = e.target.files?.[0] || null;
    const stateKey = type === 'logo' ? 'logoFile' : 'imageFile';
    setFormData(prev => ({ ...prev, [stateKey]: file }));
    if (file) {
      const base64 = await fileToBase64(file);
      if (type === 'logo') setLogoBase64(base64);
      else setImageBase64(base64);
    } else handleRemoveFile(type);
  };

  const handleRemoveFile = (type: 'logo' | 'image') => {
    const stateKey = type === 'logo' ? 'logoFile' : 'imageFile';
    setFormData(prev => ({ ...prev, [stateKey]: null }));
    if (type === 'logo') setLogoBase64(null);
    else setImageBase64(null);
  };
  
  const handleCopy = () => {
    if (!generatedPost) return;
    const fullText = `${generatedPost.headline}\n\n${generatedPost.body}\n\n${generatedPost.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    toast.success('Post text copied to clipboard!');
  };
  
  const handleDownload = async () => {
    if (!canvasRef.current) return toast.error("Canvas element not found.");
    const toastId = toast.loading("Preparing your download...");
    try {
      const dataUrl = await toPng(canvasRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        backgroundColor: '#000000'
      });
      const link = document.createElement('a');
      link.download = `partyhub-post-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Download started!", { id: toastId });
    } catch (err) {
      console.error('Failed to download image', err);
      toast.error("Failed to create image. Please try again.", { id: toastId });
    }
  };
  
  const isFormComplete = !!(formData.logoFile && formData.imageFile && formData.postText.trim());
  const canvasAspectRatio = activeTemplate === 'default' ? '4/5' : activeTemplate === 'image-left' ? '16/9' : activeTemplate === 'text-overlay' ? '4/5' : '4/5';

  const ControlPanelContent = () => (
    <>
      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        <AccordionItem title="1. Layout Templates" id="templates" activeId={activeAccordion} setActiveId={setActiveAccordion}>
          <div className="p-4">
            <TemplateSelector activeTemplate={activeTemplate} onSelect={setActiveTemplate} />
          </div>
        </AccordionItem>
        <AccordionItem title="2. Brand Identity" id="brand" activeId={activeAccordion} setActiveId={setActiveAccordion}>
          <div className="space-y-4 p-4">
            <div><label className="block text-sm font-semibold text-slate-700 mb-2">Primary Brand Color</label><div className="relative"><input type="text" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2" style={{ borderColor: brandColor, boxShadow: `0 0 0 2px ${brandColor}20` }} /><input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 border-none cursor-pointer" /></div></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-2">Brand Tone</label><select value={formData.brandTone} onChange={(e) => setFormData(p => ({...p, brandTone: e.target.value}))} className="w-full px-4 py-2 border border-slate-300 rounded-md"><option>Friendly & Professional</option><option>Whimsical & Playful</option><option>Elegant & Luxurious</option><option>Modern & Minimalistic</option></select></div>
            <FileInput label="Brand Logo" file={formData.logoFile} onFileChange={(e) => handleFileChange(e, 'logo')} onRemove={() => handleRemoveFile('logo')} onView={() => setModalContent(logoBase64)} />
          </div>
        </AccordionItem>
        <AccordionItem title="3. Post Content" id="content" activeId={activeAccordion} setActiveId={setActiveAccordion}>
          <div className="space-y-4 p-4">
            <FileInput label="Your Image" file={formData.imageFile} onFileChange={(e) => handleFileChange(e, 'image')} onRemove={() => handleRemoveFile('image')} onView={() => setModalContent(imageBase64)} />
            <div><label className="block text-sm font-semibold text-slate-700 mb-2">Your Core Message</label><textarea rows={4} value={formData.postText} onChange={(e) => setFormData(p => ({...p, postText: e.target.value}))} className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm" placeholder="e.g., Our new spring floral arrangements..."></textarea></div>
          </div>
        </AccordionItem>
        <AnimatePresence>
          {generatedPost && (
            <AccordionItem title="4. Customize" id="customize" activeId={activeAccordion} setActiveId={setActiveAccordion}>
               <div className="p-4 text-center">
                  <div className="flex items-start gap-2 p-3 bg-slate-100 rounded-lg text-slate-600"><Info className="h-4 w-4 mt-0.5 flex-shrink-0"/><p className="text-xs">You can now click the text on the canvas to edit it, and drag the headline and logo to move them!</p></div>
               </div>
            </AccordionItem>
          )}
        </AnimatePresence>
      </div>
      <div className="p-4 border-t border-slate-200 space-y-4 flex-shrink-0">
         <button onClick={() => onGenerate(formData)} disabled={!isFormComplete || isLoading} className="w-full flex items-center justify-center gap-2 rounded-md py-3 px-4 font-semibold text-white transition hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: brandColor }}>
            {isLoading ? "Generating..." : <><Bot className="h-5 w-5"/> {generatedPost ? "Regenerate" : "Generate Post"}</>}
         </button>
         <AnimatePresence>
           {generatedPost && (
             <motion.div className="flex items-center justify-center gap-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
               <button onClick={handleCopy} className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors w-1/2 justify-center"><Copy className="h-4 w-4" /> Copy Text</button>
               <button onClick={handleDownload} className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors w-1/2 justify-center" style={{ backgroundColor: brandColor }}><Download className="h-4 w-4" /> Download</button>
             </motion.div>
           )}
         </AnimatePresence>
         {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </>
  );

  return (
    <>
      <main className="min-h-screen bg-white">
        <div className="flex flex-col lg:flex-row h-screen">
          {/* --- LEFT CONTROL PANEL (Desktop) --- */}
          <div className="hidden lg:flex w-full max-w-md bg-white border-r border-slate-200 shadow-xl flex-col h-screen">
            <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center gap-2"><Image src="/logo.png" alt="PartyHub Logo" width={32} height={32} /><h2 className="text-xl font-bold">PartyHub Generator</h2></div>
            <ControlPanelContent />
          </div>
          
          {/* --- RIGHT CANVAS --- */}
          <div ref={dragConstraintsRef} className="flex-grow flex items-center justify-center p-4 lg:p-8 bg-grid relative h-screen">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[length:20px_20px] bg-repeat" style={{ backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)' }}></div>
            
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-xl rounded-lg shadow-2xl overflow-hidden relative z-10"
              style={{ aspectRatio: canvasAspectRatio }}
            >
              <div ref={canvasRef} className="w-full h-full">
                <PostCard 
                  template={activeTemplate} 
                  imagePreviewUrl={imageBase64} 
                  logoPreviewUrl={logoBase64} 
                  bodyContent={bodyContent} 
                  hashtags={generatedPost?.hashtags || []} 
                  brandColor={brandColor} 
                  headlinePosition={headlinePosition} 
                  logoPosition={logoPosition} 
                  headlineContent={headlineContent} 
                />
              </div>
            </motion.div>

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-50">
                <motion.div
                  className="w-full max-w-xl rounded-lg bg-slate-200 overflow-hidden"
                  style={{ aspectRatio: canvasAspectRatio }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  <div className="w-full h-full animate-pulse bg-slate-300" />
                </motion.div>
              </div>
            )}
          </div>
          
          {/* --- FLOATING ACTION BUTTON (Mobile) --- */}
          <button onClick={() => setIsPanelOpen(true)} className="lg:hidden fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-full bg-indigo-600 text-white px-4 py-3 shadow-lg">
            <Sparkles className="h-5 w-5"/> Controls
          </button>
        </div>
      </main>

      {/* --- SLIDE-OVER PANEL (Mobile) --- */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div className="lg:hidden fixed inset-0 z-40 flex justify-end">
            <motion.div onClick={() => setIsPanelOpen(false)} className="absolute inset-0 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}/>
            <motion.div className="relative w-full max-w-sm bg-white h-full flex flex-col" initial={{ x: '100%' }} animate={{ x: '0%' }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 400, damping: 40 }}>
              <div className="p-4 border-b border-slate-200 flex-shrink-0 flex justify-between items-center"><h2 className="text-xl font-bold">Control Panel</h2><button onClick={() => setIsPanelOpen(false)}><X className="h-5 w-5"/></button></div>
              <ControlPanelContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Modal isOpen={!!modalContent} onClose={() => setModalContent(null)} imageUrl={modalContent} />
    </>
  );
};

// --- HELPER COMPONENTS ---
const AccordionItem = ({ id, title, activeId, setActiveId, children }: { id: string, title: string, activeId: string | null, setActiveId: (id: string | null) => void, children: ReactNode }) => {
  const isOpen = id === activeId;
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button onClick={() => setActiveId(isOpen ? null : id)} className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDown className="h-5 w-5 text-slate-500"/></motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && <motion.section initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">{children}</motion.section>}
      </AnimatePresence>
    </div>
  );
};

const TemplateSelector = ({ activeTemplate, onSelect }: { activeTemplate: LayoutTemplate, onSelect: (template: LayoutTemplate) => void }) => {
  const templates = [
    { id: 'default', name: 'Default', icon: Square },
    { id: 'image-left', name: 'Split Left', icon: Columns },
    { id: 'text-overlay', name: 'Overlay', icon: Layers },
    { id: 'footer-focus', name: 'Footer Focus', icon: PanelRight },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-2">
      {templates.map(template => (
        <button key={template.id} onClick={() => onSelect(template.id)} className={`relative flex flex-col items-center justify-center p-2 border-2 rounded-md transition-colors ${activeTemplate === template.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
          <template.icon className="h-8 w-8 text-slate-500 mb-1" />
          <span className="text-xs font-semibold">{template.name}</span>
          {activeTemplate === template.id && (
            <motion.div layoutId="template-active-indicator" className="absolute inset-0 border-2 border-indigo-500 rounded-md" />
          )}
        </button>
      ))}
    </div>
  );
};

const FileInput = ({ label, file, onFileChange, onRemove, onView }: { label: string; file: File | null; onFileChange: (e: ChangeEvent<HTMLInputElement>) => void; onRemove: () => void; onView: () => void; }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
    <div className="relative">
      <label className="cursor-pointer bg-slate-50 border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center min-h-[120px] hover:bg-slate-100 transition-colors text-center">
        <AnimatePresence mode="wait">
          {file ? (
            <motion.div key="selected" className="flex flex-col items-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <FileCheck2 className="h-8 w-8 text-green-500 mb-1" />
              <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{file.name}</span>
            </motion.div>
          ) : (
            <motion.div key="empty" className="flex flex-col items-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <UploadCloud className="h-8 w-8 text-slate-400 mb-1" />
              <span className="text-sm font-medium text-slate-600">Click to upload</span>
            </motion.div>
          )}
        </AnimatePresence>
        <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
      </label>
      {file && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1.5">
           <motion.button onClick={(e) => { e.preventDefault(); onView(); }} className="bg-slate-600 text-white rounded-full p-1 hover:bg-slate-800 transition-colors" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} aria-label="View file"><Eye className="h-3 w-3" /></motion.button>
           <motion.button onClick={(e) => { e.preventDefault(); onRemove(); }} className="bg-slate-600 text-white rounded-full p-1 hover:bg-slate-800 transition-colors" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} aria-label="Remove file"><X className="h-3 w-3" /></motion.button>
        </div>
      )}
    </div>
  </div>
);