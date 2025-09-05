'use client';

import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence, Point } from 'framer-motion';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import Confetti from 'react-confetti';
import { Copy, Download, Eye, FileCheck2, FileImage, Palette, PanelRight, Send, Square, UploadCloud, X, Layers, Columns } from 'lucide-react';
import { PostCard, LayoutTemplate, PostData } from '../Ui/PostCard'; 
import { FinalOutputCard } from '../Ui/FinalOutputCard'; 
import { Modal } from '../Ui/Modal';
export type { PostData };
// --- HOOKS ---
const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return { width: size[0], height: size[1] };
};

// --- HELPERS ---
const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = (error) => reject(error);
});

// --- INTERFACES ---
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

// --- MAIN COMPONENT ---
export const Playground: React.FC<PlaygroundProps> = ({
  brandColor, setBrandColor, onGenerate, isLoading, generatedPost, error,
}) => {
  const [formData, setFormData] = useState<FormData>({ brandTone: 'Friendly & Professional', postText: '', logoFile: null, imageFile: null });
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const finalCanvasRef = useRef<HTMLDivElement>(null); // Ref for the hidden, high-res canvas
// After
const dragConstraintsRef = useRef<HTMLDivElement>(null!);
  const [activeTemplate, setActiveTemplate] = useState<LayoutTemplate>('default');
  const [displayContent, setDisplayContent] = useState<PostData>({ headline: '', body: '', hashtags: [] });

  // State is now in percentages { x: 0-100, y: 0-100 } for universal positioning
  const [logoPosition, setLogoPosition] = useState<Point>({ x: 5, y: 5 });

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const MAX_CHARS = 1000;

  useEffect(() => {
    if (generatedPost) {
      setDisplayContent(generatedPost);
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [generatedPost]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, type: 'logo' | 'image') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [type === 'logo' ? 'logoFile' : 'imageFile']: file }));
    if (file) {
      const base64 = await fileToBase64(file);
      if (type === 'logo') {
        setLogoBase64(base64);
        // Reset logo position to top-left (5%, 5%) on new upload
        setLogoPosition({ x: 5, y: 5 });
      } else {
        setImageBase64(base64);
      }
    } else {
      if (type === 'logo') setLogoBase64(null); else setImageBase64(null);
    }
  };

  const handleRemoveFile = (type: 'logo' | 'image') => {
    setFormData(prev => ({ ...prev, [type === 'logo' ? 'logoFile' : 'imageFile']: null }));
    if (type === 'logo') setLogoBase64(null); else setImageBase64(null);
  };

  const handleDownload = async () => {
    // Always target the hidden, high-resolution canvas for downloads
    if (!finalCanvasRef.current) return toast.error("Final output canvas not found.");
    const toastId = toast.loading("Generating your high-res image...");
    try {
      const dataUrl = await toPng(finalCanvasRef.current, {
        cacheBust: true,
        // pixelRatio is 1 because the canvas is already at the target resolution (1080px)
        pixelRatio: 1
      });
      const link = document.createElement('a');
      link.download = `partyhub-post-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Download started!", { id: toastId });
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Failed to create image. Please try again.", { id: toastId });
    }
  };

  const isFormComplete = !!(formData.imageFile && formData.postText.trim() && formData.postText.length <= MAX_CHARS);

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={400} />}

      {/* HIDDEN CANVAS FOR FINAL OUTPUT. Positioned outside the viewport. */}
      <div className="absolute top-0 left-0" style={{ transform: 'translateX(-2000px)', pointerEvents: 'none' }}>
        <FinalOutputCard
          ref={finalCanvasRef}
          template={activeTemplate}
          imagePreviewUrl={imageBase64}
          logoPreviewUrl={logoBase64}
          displayContent={displayContent}
          brandColor={brandColor}
          logoPosition={logoPosition}
        />
      </div>

      <div className="h-[85vh]  bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-indigo-500/10 flex flex-col ">
        <div className="flex flex-grow min-h-0">
          <div className="w-full max-w-xs p-5 border-r border-slate-200 flex flex-col space-y-6 overflow-y-auto">
            <div>
              <h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2"><Palette size={16} /> Brand Identity</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">Color</label>
                  <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="w-full h-10 p-0 border-none cursor-pointer rounded-md" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1 block">Tone</label>
                  <select value={formData.brandTone} onChange={(e) => setFormData(p => ({ ...p, brandTone: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm">
                    <option>💼 Friendly & Professional</option>
                    <option>🎉 Whimsical & Playful</option>
                    <option>💎 Elegant & Luxurious</option>
                    <option>✨ Modern & Minimalistic</option>
                  </select>
                </div>
                <FileInputCompact label="Logo" file={formData.logoFile} onFileChange={(e) => handleFileChange(e, 'logo')} onRemove={() => handleRemoveFile('logo')} />
              </div>
            </div>
            <div className="border-t border-slate-200 pt-2">
              <h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2"><FileImage size={16} /> Post Image</h3>
              <FileInputCompact label="Your Image" file={formData.imageFile} onFileChange={(e) => handleFileChange(e, 'image')} onRemove={() => handleRemoveFile('image')} />
            </div>
          </div>

          <div ref={dragConstraintsRef} className="flex-grow flex items-center justify-center p-6 bg-slate-50 relative bg-grid ">
            {generatedPost && (
              <button onClick={() => setIsPreviewModalOpen(true)} className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition shadow-lg" aria-label="Open full preview">
                <Eye size={20} className="text-slate-700" />
              </button>
            )}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-lg  h-auto max-h-[95%] rounded-lg shadow-lg overflow-y-scroll overflow-x-hidden relative z-10 bg-white"
            >
              <PostCard
                template={activeTemplate}
                imagePreviewUrl={imageBase64}
                logoPreviewUrl={logoBase64}
                displayContent={displayContent}
                brandColor={brandColor}
                logoPosition={logoPosition}
                onLogoPositionChange={setLogoPosition}
                dragConstraintsRef={dragConstraintsRef}
              />
            </motion.div>
          </div>

          <div className="w-32 p-4 border-l border-slate-200 overflow-y-auto">
            <h3 className="text-sm font-semibold text-slate-600 mb-4 text-center">Layout</h3>
            <TemplateSelector activeTemplate={activeTemplate} onSelect={setActiveTemplate} />
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-slate-200 bg-white p-4 space-y-3">
          <div className="relative w-full max-w-4xl mx-auto">
            <textarea rows={2} value={formData.postText} onChange={(e) => setFormData(p => ({ ...p, postText: e.target.value }))} className="w-full px-4 py-3 pr-28 border border-slate-300 rounded-xl shadow-sm resize-none focus:ring-2 focus:ring-indigo-500 transition" placeholder="Enter your core message here..." maxLength={MAX_CHARS} />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className={`text-xs font-mono ${formData.postText.length >= MAX_CHARS ? 'text-red-500' : 'text-slate-400'}`}>{formData.postText.length}/{MAX_CHARS}</span>
              <button onClick={() => onGenerate(formData)} disabled={!isFormComplete || isLoading} className="p-2 rounded-lg text-white transition disabled:opacity-50" style={{ backgroundColor: brandColor }}>{isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={20} />}</button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <AnimatePresence>
            {generatedPost && (
              <motion.div className="flex items-center justify-center gap-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <button onClick={() => navigator.clipboard.writeText(`${displayContent.headline}\n\n${displayContent.body}\n\n${displayContent.hashtags.join(' ')}`).then(() => toast.success('Post text copied!'))} className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors w-40 justify-center"><Copy className="h-4 w-4" /> Copy Text</button>
                <button onClick={handleDownload} className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors w-40 justify-center" style={{ backgroundColor: brandColor }}><Download className="h-4 w-4" /> Download</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Modal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} title="Final Download Preview">
        {/* The Modal now shows a scaled-down version of the high-res final output canvas */}
        <div className="relative w-[540px] h-[675px] bg-slate-200">
          <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left' }}>
            <FinalOutputCard
              template={activeTemplate}
              imagePreviewUrl={imageBase64}
              logoPreviewUrl={logoBase64}
              displayContent={displayContent}
              brandColor={brandColor}
              logoPosition={logoPosition}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handleDownload} className="flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium text-white transition-colors justify-center" style={{ backgroundColor: brandColor }}>
            <Download className="h-4 w-4" /> Download Image
          </button>
        </div>
      </Modal>
    </>
  );
};

// --- HELPER COMPONENTS ---

const TemplateSelector = ({ activeTemplate, onSelect }: { activeTemplate: LayoutTemplate, onSelect: (template: LayoutTemplate) => void }) => {
  const templates = [
    { id: 'default', name: 'Standard', icon: Square, disabled: false },
    { id: 'footer-focus', name: 'Footer', icon: PanelRight, disabled: false },
    { id: 'image-left', name: 'Split', icon: Columns, disabled: true },
    { id: 'text-overlay', name: 'Overlay', icon: Layers, disabled: true },
  ] as const;

  return (
    <div className="space-y-2">
      {templates.map(template => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          disabled={template.disabled}
          className={`w-full flex flex-col items-center justify-center p-3 border-2 rounded-md transition-all ${activeTemplate === template.id ? 'border-indigo-500 bg-indigo-50 shadow-inner' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'} disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:hover:border-slate-200`}
        >
          <template.icon className={`h-6 w-6 mb-1 ${activeTemplate === template.id ? 'text-indigo-600' : 'text-slate-500'} ${template.disabled ? 'text-slate-400' : ''}`} />
          <span className={`text-xs font-semibold ${activeTemplate === template.id ? 'text-indigo-800' : 'text-slate-700'} ${template.disabled ? 'text-slate-400' : ''}`}>{template.name}</span>
        </button>
      ))}
    </div>
  );
};

const FileInputCompact = ({ label, file, onFileChange, onRemove }: { label: string; file: File | null; onFileChange: (e: ChangeEvent<HTMLInputElement>) => void; onRemove: () => void; }) => (
  <div>
    <label className="text-sm font-medium text-slate-600 mb-1 block">{label}</label>
    <div className="relative">
      <label className="cursor-pointer bg-slate-50 border-2 border-dashed rounded-lg p-3 flex items-center justify-center min-h-[60px] hover:bg-slate-100 transition-colors text-center">
        <AnimatePresence mode="wait">
          {file ? (<motion.div key="s" className="flex items-center gap-2" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><FileCheck2 className="h-5 w-5 text-green-500" /><span className="text-xs font-medium text-slate-700 truncate max-w-[150px]">{file.name}</span></motion.div>) : (<motion.div key="e" className="flex items-center gap-2" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><UploadCloud className="h-5 w-5 text-slate-400" /><span className="text-sm font-medium text-slate-600">Upload</span></motion.div>)}
        </AnimatePresence>
        <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
      </label>
      {file && <motion.button onClick={(e) => { e.preventDefault(); onRemove(); }} className="absolute top-1 right-1 bg-slate-600 text-white rounded-full p-0.5 hover:bg-slate-800 transition-colors" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} aria-label="Remove file"><X className="h-3 w-3" /></motion.button>}
    </div>
  </div>
);