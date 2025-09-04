// src/app/Components/layout/GeneratorSection.tsx
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Point } from 'framer-motion';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import { Copy, Download, PartyPopper, UploadCloud, FileCheck2, X, Move } from 'lucide-react';
import Stepper, { Step } from '../animations/Stepper';
import { PostCard } from '../Ui/PostCard';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export interface PostData {
  headline: string;
  body: string;
  hashtags: string[];
  layout: {
    theme: 'light' | 'dark';
    textPosition: string; // Not used in this layout, but kept for AI context
    logoPosition: string; // Not used in this layout, but kept for AI context
    styleSuggestion: string;
  };
}

interface FormData {
  brandTone: string;
  postText: string;
  logoFile: File | null;
  imageFile: File | null;
}

interface GeneratorSectionProps {
  brandColor: string;
  setBrandColor: (color: string) => void;
  onGenerate: (data: FormData) => void;
  isLoading: boolean;
  generatedPost: PostData | null;
  error: string;
}

export const GeneratorSection: React.FC<GeneratorSectionProps> = ({
  brandColor, setBrandColor, onGenerate, isLoading, generatedPost, error,
}) => {
  const [formData, setFormData] = useState<FormData>({ brandTone: 'Friendly & Professional', postText: '', logoFile: null, imageFile: null });
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const postCardRef = useRef<HTMLDivElement>(null);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);

  const [logoPosition, setLogoPosition] = useState<Point>({ x: 16, y: 16 });
  const [headlinePosition, setHeadlinePosition] = useState<Point>({ x: 16, y: 150 });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, type: 'logo' | 'image') => {
    const file = e.target.files?.[0] || null;
    const stateKey = type === 'logo' ? 'logoFile' : 'imageFile';
    setFormData(prev => ({ ...prev, [stateKey]: file }));

    if (file) {
      const base64 = await fileToBase64(file);
      if (type === 'logo') setLogoBase64(base64);
      else setImageBase64(base64);
    } else {
      handleRemoveFile(type);
    }
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
    if (!postCardRef.current) return toast.error("Preview element not found.");
    const toastId = toast.loading("Preparing your download...");
    try {
      const dataUrl = await toPng(postCardRef.current, { cacheBust: true, pixelRatio: 2 });
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
  
 const isStep1Complete = formData.logoFile !== null;
  const isStep2Complete = formData.imageFile !== null && formData.postText.trim() !== '';

  return (
    <main className="container mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* --- LEFT PANEL: STEPPER FORM --- */}
        <div className="bg-white p-6 rounded-xl shadow-2xl border border-slate-200 lg:sticky lg:top-28">
          <Stepper
            brandColor={brandColor}
            onFinalStepCompleted={() => onGenerate(formData)}
            onStepChange={setCurrentStep}
            isNextDisabled={(currentStep === 1 && !isStep1Complete) || (currentStep === 2 && !isStep2Complete)}
            isLoading={isLoading}
          >
            {/* ... Stepper content is the same ... */}
            <Step>
              <h3 className="text-xl font-bold mb-4">Brand Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Brand Color</label>
                  <div className="relative"><input type="text" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2" style={{ borderColor: brandColor, boxShadow: `0 0 0 2px ${brandColor}20` }} /><input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 border-none cursor-pointer" /></div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Brand Tone</label>
                  <select value={formData.brandTone} onChange={(e) => setFormData(p => ({...p, brandTone: e.target.value}))} className="w-full px-4 py-2 border border-slate-300 rounded-md"><option>Friendly & Professional</option><option>Whimsical & Playful</option><option>Elegant & Luxurious</option><option>Modern & Minimalistic</option></select>
                </div>
                <FileInput label="Brand Logo (Required)" file={formData.logoFile} onFileChange={(e) => handleFileChange(e, 'logo')} onRemove={() => handleRemoveFile('logo')} />
              </div>
            </Step>
            <Step>
              <h3 className="text-xl font-bold mb-4">Post Content</h3>
              <div className="space-y-4">
                <FileInput label="Your Image (Required)" file={formData.imageFile} onFileChange={(e) => handleFileChange(e, 'image')} onRemove={() => handleRemoveFile('image')} />
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Core Message (Required)</label>
                  <textarea rows={4} value={formData.postText} onChange={(e) => setFormData(p => ({...p, postText: e.target.value}))} className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm" placeholder="e.g., Our new spring floral arrangements..."></textarea>
                </div>
              </div>
            </Step>
            <Step>
              <div className="text-center py-4">
                <PartyPopper className="mx-auto h-12 w-12 mb-4" style={{ color: brandColor }} /><h3 className="text-xl font-bold">You're All Set!</h3><p className="text-slate-500 mt-2 text-sm">Drag your logo and headline on the preview to position them perfectly before generating.</p>
              </div>
            </Step>
          </Stepper>
          {error && <p className="text-red-500 text-sm mt-4 px-4">{error}</p>}
        </div>
        
        {/* --- RIGHT PANEL: INTERACTIVE PREVIEW & ACTIONS --- */}
        <div className="flex flex-col items-center">
           <h3 className="text-2xl font-bold mb-6 text-center">Live Preview & Customization</h3>
           <div
             ref={dragConstraintsRef}
             className="w-full max-w-lg aspect-[4/5] rounded-lg shadow-2xl overflow-hidden relative" // [MODIFIED] Using a fixed aspect ratio for the container
           >
             <PostCard
               ref={postCardRef}
               imagePreviewUrl={imageBase64}
               logoPreviewUrl={logoBase64}
               generatedPost={generatedPost}
               brandColor={brandColor}
               logoPosition={logoPosition}
               headlinePosition={headlinePosition}
             />
             
             <AnimatePresence>
               {generatedPost && (
                 <>
                   <motion.div
                     drag dragConstraints={dragConstraintsRef}
                     onDragEnd={(e, { point }) => setHeadlinePosition(point)}
                     className="absolute top-0 left-0 cursor-grab active:cursor-grabbing"
                     initial={{ x: 16, y: 150 }} style={{ x: headlinePosition.x, y: headlinePosition.y }}
                   >
                     <h2 className="font-extrabold text-3xl leading-tight p-2 whitespace-nowrap" style={{ color: brandColor, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}>
                       {generatedPost.headline}
                     </h2>
                   </motion.div>
                   
                   {logoBase64 && (
                     <motion.div
                       drag dragConstraints={dragConstraintsRef}
                       onDragEnd={(e, { point }) => setLogoPosition(point)}
                       className="absolute top-0 left-0 cursor-grab active:cursor-grabbing"
                       initial={{ x: 16, y: 16 }} style={{ x: logoPosition.x, y: logoPosition.y }}
                     >
                       <div className="relative w-16 h-16 p-1 bg-white/50 rounded-lg backdrop-blur-sm"><Move className="absolute -top-2 -right-2 h-4 w-4 text-slate-800 bg-white rounded-full p-0.5" /><Image src={logoBase64} alt="Logo" fill className="object-contain" /></div>
                     </motion.div>
                   )}
                 </>
               )}
             </AnimatePresence>
           </div>

           <AnimatePresence>
             {!isLoading && generatedPost && (
               <motion.div
                 className="mt-6 flex items-center justify-center gap-4"
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                 <button onClick={handleCopy} className="..."><Copy className="h-4 w-4" /> Copy Text</button>
                 <button onClick={handleDownload} className="..." style={{ backgroundColor: brandColor }}><Download className="h-4 w-4" /> Download Post</button>
               </motion.div>
             )}
           </AnimatePresence>
           {isLoading && !generatedPost && ( <div className="mt-6 text-center text-sm text-slate-500 animate-pulse">✨ Analyzing your image and crafting a masterpiece...</div> )}
        </div>
      </div>
    </main>
  );
};

// --- ENHANCED HELPER COMPONENT ---
const FileInput = ({ label, file, onFileChange, onRemove }: { label: string; file: File | null; onFileChange: (e: ChangeEvent<HTMLInputElement>) => void; onRemove: () => void; }) => (
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
        <motion.button
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-slate-600 text-white rounded-full p-1 hover:bg-slate-800 transition-colors"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
          aria-label="Remove file"
        >
          <X className="h-3 w-3" />
        </motion.button>
      )}
    </div>
  </div>
);