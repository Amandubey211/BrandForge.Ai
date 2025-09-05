'use client';

import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence, Point } from 'framer-motion';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import Confetti from 'react-confetti';
import { Copy, Download, Eye, FileCheck2, FileImage, Palette, PanelRight, Send, Square, UploadCloud, X, Layers, Columns } from 'lucide-react';
import { PostCard, LayoutTemplate } from '../Ui/PostCard'; // Import type from PostCard
import { Modal } from '../Ui/Modal';

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

// Helper function to convert a File to a base64 data URL
const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
});

// --- INTERFACES ---
export interface PostData {
    headline: string;
    body: string;
    hashtags: string[];
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

// --- MAIN COMPONENT ---
export const Playground: React.FC<PlaygroundProps> = ({
    brandColor, setBrandColor, onGenerate, isLoading, generatedPost, error,
}) => {
    const [formData, setFormData] = useState<FormData>({ brandTone: 'Friendly & Professional', postText: '', logoFile: null, imageFile: null });
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [logoBase64, setLogoBase64] = useState<string | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const modalCanvasRef = useRef<HTMLDivElement>(null);
    const dragConstraintsRef = useRef<HTMLDivElement>(null);
    const [activeTemplate, setActiveTemplate] = useState<LayoutTemplate>('default');

    const [displayContent, setDisplayContent] = useState<PostData>({ headline: '', body: '', hashtags: [] });
    const [logoPosition, setLogoPosition] = useState<Point>({ x: 20, y: 20 });
    const [headlinePosition, setHeadlinePosition] = useState<Point>({ x: 20, y: 150 });
    
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const { width, height } = useWindowSize();

    const MAX_CHARS = 1000;

    useEffect(() => {
        if (generatedPost) {
            setDisplayContent({
                headline: generatedPost.headline,
                body: generatedPost.body,
                hashtags: generatedPost.hashtags,
            });
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 6000); // Confetti for 6 seconds
            return () => clearTimeout(timer);
        }
    }, [generatedPost]);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, type: 'logo' | 'image') => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, [type === 'logo' ? 'logoFile' : 'imageFile']: file }));
        if (file) {
            const base64 = await fileToBase64(file);
            if (type === 'logo') setLogoBase64(base64); else setImageBase64(base64);
        } else {
            if (type === 'logo') setLogoBase64(null); else setImageBase64(null);
        }
    };
    
    const handleRemoveFile = (type: 'logo' | 'image') => {
        setFormData(prev => ({ ...prev, [type === 'logo' ? 'logoFile' : 'imageFile']: null }));
        if (type === 'logo') setLogoBase64(null); else setImageBase64(null);
    };

    const handleDownload = async () => {
        const refToUse = isPreviewModalOpen ? modalCanvasRef : canvasRef;
        if (!refToUse.current) return toast.error("Canvas element not found.");
        const toastId = toast.loading("Generating your high-res image...");
        try {
            const dataUrl = await toPng(refToUse.current, { cacheBust: true, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `partyhub-post-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Download started!", { id: toastId });
        } catch (err) {
            toast.error("Failed to create image. Please try again.", { id: toastId });
        }
    };

    const isFormComplete = !!(formData.imageFile && formData.postText.trim() && formData.postText.length <= MAX_CHARS);

    return (
        <>
            {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={400} />}
            <div className="h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-indigo-500/10 flex flex-col overflow-hidden">
                <div className="flex flex-grow min-h-0">
                    {/* --- LEFT INPUT COLUMN --- */}
                    <div className="w-full max-w-xs p-5 border-r border-slate-200 flex flex-col space-y-6 overflow-y-auto">
                        <div>
                            <h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2"><Palette size={16} /> Brand Identity</h3>
                            <div className="space-y-4">
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
                        <div className="border-t border-slate-200 pt-6">
                            <h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2"><FileImage size={16} /> Post Image</h3>
                            <FileInputCompact label="Your Image" file={formData.imageFile} onFileChange={(e) => handleFileChange(e, 'image')} onRemove={() => handleRemoveFile('image')} />
                        </div>
                    </div>

                    {/* --- MIDDLE PREVIEW COLUMN --- */}
                    <div ref={dragConstraintsRef} className="flex-grow flex items-center justify-center p-6 bg-slate-50 relative">
                         {generatedPost && (
                            <button onClick={() => setIsPreviewModalOpen(true)} className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition shadow-lg">
                                <Eye size={20} className="text-slate-700"/>
                            </button>
                         )}
                        <motion.div
                            layout
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="w-full max-w-sm h-auto max-h-[95%] rounded-lg shadow-lg overflow-hidden relative z-10 bg-white"
                            style={{ aspectRatio: getAspectRatio(activeTemplate) }}
                        >
                            <PostCard
                                ref={canvasRef}
                                template={activeTemplate}
                                imagePreviewUrl={imageBase64}
                                logoPreviewUrl={logoBase64}
                                displayContent={displayContent}
                                brandColor={brandColor}
                                headlinePosition={headlinePosition}
                                logoPosition={logoPosition}
                                onHeadlinePositionChange={setHeadlinePosition}
                                onLogoPositionChange={setLogoPosition}
                                dragConstraintsRef={dragConstraintsRef}
                            />
                        </motion.div>
                    </div>

                    {/* --- RIGHT LAYOUT COLUMN --- */}
                    <div className="w-32 p-4 border-l border-slate-200 overflow-y-auto">
                        <h3 className="text-sm font-semibold text-slate-600 mb-4 text-center">Layout</h3>
                        <TemplateSelector activeTemplate={activeTemplate} onSelect={setActiveTemplate} />
                    </div>
                </div>

                {/* --- BOTTOM INPUT & ACTIONS ROW --- */}
                <div className="flex-shrink-0 border-t border-slate-200 bg-white p-4 space-y-3">
                    <div className="relative w-full max-w-4xl mx-auto">
                        <textarea
                            rows={2}
                            value={formData.postText}
                            onChange={(e) => setFormData(p => ({ ...p, postText: e.target.value }))}
                            className="w-full px-4 py-3 pr-28 border border-slate-300 rounded-xl shadow-sm resize-none focus:ring-2 focus:ring-indigo-500 transition"
                            placeholder="Enter your core message here... (e.g., Announcing our new summer collection!)"
                            maxLength={MAX_CHARS}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <span className={`text-xs font-mono ${formData.postText.length >= MAX_CHARS ? 'text-red-500' : 'text-slate-400'}`}>
                                {formData.postText.length}/{MAX_CHARS}
                            </span>
                            <button onClick={() => onGenerate(formData)} disabled={!isFormComplete || isLoading} className="p-2 rounded-lg text-white transition disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: brandColor }}>
                                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={20} />}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <AnimatePresence>
                        {generatedPost && (
                            <motion.div className="flex items-center justify-center gap-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                <button onClick={() => navigator.clipboard.writeText(`${displayContent.headline}\n\n${displayContent.body}\n\n${displayContent.hashtags.join(' ')}`).then(() => toast.success('Post text copied!'))} className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors w-40 justify-center">
                                    <Copy className="h-4 w-4" /> Copy Text
                                </button>
                                <button onClick={handleDownload} className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors w-40 justify-center" style={{ backgroundColor: brandColor }}>
                                    <Download className="h-4 w-4" /> Download
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            {/* --- PREVIEW MODAL --- */}
            <Modal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} title="Full Post Preview">
                <div className="w-[600px] h-auto" style={{ aspectRatio: getAspectRatio(activeTemplate)}}>
                    <PostCard
                        ref={modalCanvasRef}
                        template={activeTemplate}
                        imagePreviewUrl={imageBase64}
                        logoPreviewUrl={logoBase64}
                        displayContent={displayContent}
                        brandColor={brandColor}
                        headlinePosition={headlinePosition}
                        logoPosition={logoPosition}
                        onHeadlinePositionChange={setHeadlinePosition}
                        onLogoPositionChange={setLogoPosition}
                        dragConstraintsRef={dragConstraintsRef}
                    />
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

const getAspectRatio = (template: LayoutTemplate) => template === 'image-left' ? '16/9' : '4/5';

const TemplateSelector = ({ activeTemplate, onSelect }: { activeTemplate: LayoutTemplate, onSelect: (template: LayoutTemplate) => void }) => {
    const templates = [
        { id: 'default', name: 'Standard', icon: Square }, { id: 'image-left', name: 'Split', icon: Columns },
        { id: 'text-overlay', name: 'Overlay', icon: Layers }, { id: 'footer-focus', name: 'Footer', icon: PanelRight },
    ] as const;
    return (
        <div className="space-y-2">
            {templates.map(t => <button key={t.id} onClick={() => onSelect(t.id)} className={`w-full flex flex-col items-center justify-center p-3 border-2 rounded-md transition-all ${activeTemplate===t.id?'border-indigo-500 bg-indigo-50 shadow-inner':'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}><t.icon className={`h-6 w-6 mb-1 ${activeTemplate===t.id?'text-indigo-600':'text-slate-500'}`}/><span className={`text-xs font-semibold ${activeTemplate===t.id?'text-indigo-800':'text-slate-700'}`}>{t.name}</span></button>)}
        </div>
    );
};

const FileInputCompact = ({ label, file, onFileChange, onRemove }: { label: string; file: File | null; onFileChange: (e: ChangeEvent<HTMLInputElement>) => void; onRemove: () => void; }) => (
    <div>
        <label className="text-sm font-medium text-slate-600 mb-1 block">{label}</label>
        <div className="relative">
            <label className="cursor-pointer bg-slate-50 border-2 border-dashed rounded-lg p-3 flex items-center justify-center min-h-[60px] hover:bg-slate-100 transition-colors text-center">
                <AnimatePresence mode="wait">
                    {file?(<motion.div key="s" className="flex items-center gap-2" initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}><FileCheck2 className="h-5 w-5 text-green-500"/><span className="text-xs font-medium text-slate-700 truncate max-w-[150px]">{file.name}</span></motion.div>):(<motion.div key="e" className="flex items-center gap-2" initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}><UploadCloud className="h-5 w-5 text-slate-400"/><span className="text-sm font-medium text-slate-600">Upload</span></motion.div>)}
                </AnimatePresence>
                <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
            </label>
            {file&&<motion.button onClick={(e)=>{e.preventDefault();onRemove();}} className="absolute top-1 right-1 bg-slate-600 text-white rounded-full p-0.5 hover:bg-slate-800 transition-colors" initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} aria-label="Remove file"><X className="h-3 w-3"/></motion.button>}
        </div>
    </div>
);