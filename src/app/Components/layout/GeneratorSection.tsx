// src/app/Components/layout/GeneratorSection.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, Point } from 'framer-motion';
import { Image as ImageIcon,  UploadCloud, Copy, PartyPopper, FileCheck2, Move } from 'lucide-react';
import Stepper, { Step } from '../animations/Stepper';

// --- INTERFACES ---
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
  generatedOutput: string;
  error: string;
}

// --- MAIN COMPONENT ---
export const GeneratorSection: React.FC<GeneratorSectionProps> = ({
  brandColor, setBrandColor, onGenerate, isLoading, generatedOutput, error,
}) => {
  const [formData, setFormData] = useState<FormData>({ brandTone: 'Friendly & Professional', postText: '', logoFile: null, imageFile: null });
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [logoPosition, setLogoPosition] = useState<Point>({ x: 0, y: 0 });
  const [currentStep, setCurrentStep] = useState(1);

  // --- HANDLERS ---
  const handleInputChange = (field: keyof FormData, value: string | File | null) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange('imageFile', file);
    if (file) setImagePreviewUrl(URL.createObjectURL(file)); else setImagePreviewUrl(null);
  };
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange('logoFile', file);
    if (file) setLogoPreviewUrl(URL.createObjectURL(file)); else setLogoPreviewUrl(null);
  };
  const handleCopy = () => navigator.clipboard.writeText(generatedOutput);
  
  // --- CONDITIONAL LOGIC ---
  const isStep1Complete = formData.logoFile !== null;
  const isStep2Complete = formData.imageFile !== null && formData.postText.trim() !== '';

  return (
    <main className="container mx-auto px-6 py-12 -mt-16 relative z-20">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* --- LEFT PANEL: STEPPER FORM --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-2xl border border-slate-200">
          <Stepper
            brandColor={brandColor}
            onFinalStepCompleted={() => onGenerate(formData)}
            onStepChange={setCurrentStep}
            isNextDisabled={
              (currentStep === 1 && !isStep1Complete) ||
              (currentStep === 2 && !isStep2Complete)
            }
          >
            {/* Step 1: Brand Details */}
            <Step>
              <h3 className="text-xl font-bold mb-4">Brand Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Brand Color</label>
                  <div className="relative">
                    <input type="text" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2" style={{ borderColor: brandColor, boxShadow: `0 0 0 2px ${brandColor}20` }} />
                    <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 border-none cursor-pointer" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Brand Tone</label>
                  <select value={formData.brandTone} onChange={(e) => handleInputChange('brandTone', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-md">
                    <option>Friendly & Professional</option>
                    <option>Whimsical & Playful</option>
                    <option>Elegant & Luxurious</option>
                    <option>Modern & Minimalistic</option>
                  </select>
                </div>
                <FileInput label="Brand Logo (Required)" file={formData.logoFile} onFileChange={handleLogoChange} />
              </div>
            </Step>
            
            {/* Step 2: Post Content */}
            <Step>
              <h3 className="text-xl font-bold mb-4">Post Content</h3>
              <div className="space-y-4">
                <FileInput label="Your Image (Required)" file={formData.imageFile} onFileChange={handleImageChange} />
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Core Message (Required)</label>
                  <textarea rows={4} value={formData.postText} onChange={(e) => handleInputChange('postText', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm" placeholder="e.g., Our new spring floral arrangements..."></textarea>
                </div>
              </div>
            </Step>

            {/* Step 3: Generate */}
            <Step>
              <div className="text-center py-4">
                <PartyPopper className="mx-auto h-12 w-12 mb-4" style={{ color: brandColor }} />
                <h3 className="text-xl font-bold">You&apos;re All Set!</h3>
                <p className="text-slate-500 mt-2 text-sm">Click the &quot;Generate&quot; button below to create your AI-powered social media post.</p>
              </div>
            </Step>
          </Stepper>
          {error && <p className="text-red-500 text-sm mt-4 px-4">{error}</p>}
        </div>
        
        {/* --- RIGHT PANEL: PREVIEW --- */}
        <div className="lg:col-span-3 bg-white p-8 rounded-xl shadow-2xl border border-slate-200 sticky top-28">
           <h3 className="text-2xl font-bold mb-6">Live Preview</h3>
           <div className="aspect-[4/5] w-full max-w-md mx-auto bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed relative overflow-hidden">
              {imagePreviewUrl ? <Image src={imagePreviewUrl} alt="Main image preview" fill className="object-cover" /> : <div className="text-center p-4"><ImageIcon className="mx-auto h-12 w-12 text-slate-400" /><h4 className="mt-2 text-sm font-semibold">Generated Post Visual</h4></div>}
              
              {logoPreviewUrl && (
                <motion.div
                  className="absolute w-16 h-16 p-1 bg-white/50 rounded-md backdrop-blur-sm shadow-md cursor-grab active:cursor-grabbing"
                  drag dragConstraints={{ top: -160, left: -140, right: 140, bottom: 160 }} dragElastic={0.2}
                  onDragEnd={(event, info) => setLogoPosition(info.point)}
                  style={{ x: logoPosition.x, y: logoPosition.y }}
                >
                  <Move className="absolute -top-2 -right-2 h-4 w-4 text-slate-800 bg-white rounded-full p-0.5" />
                  <Image src={logoPreviewUrl} alt="Logo preview" fill className="object-contain" />
                </motion.div>
              )}
           </div>
           {isLoading && (<div className="mt-6 animate-pulse"><div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div><div className="space-y-2"><div className="h-4 bg-slate-200 rounded"></div><div className="h-4 bg-slate-200 rounded w-3/4"></div></div></div>)}
           {generatedOutput && (<div className="mt-6"><div className="flex items-center justify-between mb-2"><h4 className="text-lg font-semibold">Generated Post Copy</h4><button onClick={handleCopy} className="flex items-center gap-2 text-sm font-medium"><Copy className="h-4 w-4" /> Copy</button></div><p className="bg-slate-100 p-4 rounded-md whitespace-pre-wrap font-mono text-sm">{generatedOutput}</p></div>)}
        </div>
      </div>
    </main>
  );
};

// --- HELPER COMPONENT ---
const FileInput = ({ label, file, onFileChange }: { label: string; file: File | null; onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
    <label className="cursor-pointer bg-slate-50 border-2 border-dashed rounded-lg p-4 flex flex-col items-center hover:bg-slate-100 transition-colors text-center">
      {file ? <><FileCheck2 className="h-8 w-8 text-green-500 mb-1" /><span className="text-sm font-medium text-slate-700 truncate max-w-full px-2">{file.name}</span><span className="text-xs text-slate-500">Click to change</span></> : <><UploadCloud className="h-8 w-8 text-slate-400 mb-1" /><span className="text-sm font-medium text-slate-600">Click to upload</span></>}
      <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
    </label>
  </div>
);