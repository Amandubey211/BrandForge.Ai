// src/app/Components/layout/GeneratorSection.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Sparkles, UploadCloud, Copy, Loader2 } from 'lucide-react';

// Define the shape of our form data
interface FormData {
  brandTone: string;
  postText: string;
  logoFile: File | null;
  imageFile: File | null;
}

// Define the props our parent page will pass down
interface GeneratorSectionProps {
  brandColor: string;
  setBrandColor: (color: string) => void;
  onGenerate: (data: FormData) => void; // Function to call the API
  isLoading: boolean;
  generatedOutput: string;
  error: string;
}

export const GeneratorSection: React.FC<GeneratorSectionProps> = ({
  brandColor,
  setBrandColor,
  onGenerate,
  isLoading,
  generatedOutput,
  error,
}) => {
  // --- INTERNAL STATE MANAGEMENT ---
  // This component now manages its own form inputs.
  const [formData, setFormData] = useState<FormData>({
    brandTone: 'Friendly & Professional',
    postText: '',
    logoFile: null,
    imageFile: null,
  });
  
  // State for showing the image preview
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // --- HANDLERS ---
  const handleInputChange = (
    field: keyof FormData,
    value: string | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange('imageFile', file);

    // Create a temporary URL for the preview
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImagePreviewUrl(null);
    }
  };
  
  const handleGenerateClick = () => {
    onGenerate(formData);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    // You could add a toast notification here for better UX
  };

  // Reusable File Input Component for a better UI
  const FileInput = ({ id, label, onFileChange }: { id: string, label: string, onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <label htmlFor={id} className="cursor-pointer bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-slate-100 hover:border-slate-400 transition-colors">
        <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
        <span className="text-sm font-medium text-slate-600">Click to upload or drag & drop</span>
        <span className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</span>
        <input id={id} type="file" className="hidden" onChange={onFileChange} />
      </label>
    </div>
  );

  return (
    <main className="container mx-auto px-6 py-12 -mt-16 relative z-20">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* --- LEFT PANEL: INPUTS --- */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-2xl border border-slate-200 space-y-8">
          {/* Section 1: Brand Details */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center">
              <span className="text-white bg-slate-800 rounded-full h-8 w-8 text-sm font-bold inline-flex items-center justify-center mr-3">1</span>
              Brand Details
            </h3>
            <div>
              <label htmlFor="brandColor" className="block text-sm font-semibold text-slate-700 mb-2">Primary Brand Color</label>
              <div className="relative">
                 <input id="brandColor" type="text" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-offset-2 focus:outline-none" style={{borderColor: brandColor, boxShadow: `0 0 0 2px ${brandColor}20`}} />
                 <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 border-none cursor-pointer appearance-none bg-transparent" />
              </div>
            </div>
            <div>
              <label htmlFor="brandTone" className="block text-sm font-semibold text-slate-700 mb-2">Brand Tone</label>
              <select id="brandTone" value={formData.brandTone} onChange={(e) => handleInputChange('brandTone', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option>Friendly & Professional</option>
                <option>Whimsical & Playful</option>
                <option>Elegant & Luxurious</option>
                <option>Modern & Minimalistic</option>
              </select>
            </div>
            <FileInput id="logo-upload" label="Brand Logo" onFileChange={(e) => handleInputChange('logoFile', e.target.files?.[0] || null)} />
          </div>

          {/* Section 2: Post Content */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center">
              <span className="text-white bg-slate-800 rounded-full h-8 w-8 text-sm font-bold inline-flex items-center justify-center mr-3">2</span>
              Post Content
            </h3>
            <FileInput id="image-upload" label="Your Image" onFileChange={handleImageChange} />
            <div>
              <label htmlFor="postText" className="block text-sm font-semibold text-slate-700 mb-2">Your Core Message</label>
              <textarea id="postText" rows={5} value={formData.postText} onChange={(e) => handleInputChange('postText', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., Our new spring floral arrangements are here!"></textarea>
            </div>
          </div>
          
          <button onClick={handleGenerateClick} disabled={isLoading || !formData.postText} className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-300">
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
            {isLoading ? 'Generating...' : 'Generate Post'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        
        {/* --- RIGHT PANEL: PREVIEW --- */}
        <div className="lg:col-span-3 bg-white p-8 rounded-xl shadow-2xl border border-slate-200 sticky top-28">
           <h3 className="text-2xl font-bold mb-6">Live Preview</h3>
           <div className="aspect-square w-full bg-slate-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-slate-300 p-4 relative overflow-hidden">
              {imagePreviewUrl ? (
                    <Image 
                  src={imagePreviewUrl} 
                  alt="Image Preview" 
                  fill // 'fill' makes it cover the parent container
                  className="object-cover" 
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                  <h4 className="mt-2 text-sm font-semibold text-slate-900">Generated Post Visual</h4>
                  <p className="mt-1 text-sm text-slate-500">Your on-brand image will appear here.</p>
                </div>
              )}
           </div>
           {isLoading && (
              <div className="mt-6 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  </div>
              </div>
           )}
           {generatedOutput && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-slate-900">Generated Post Copy</h4>
                  <button onClick={handleCopy} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                    <Copy className="h-4 w-4" /> Copy
                  </button>
                </div>
                <p className="text-slate-700 bg-slate-100 p-4 rounded-md whitespace-pre-wrap font-mono text-sm">{generatedOutput}</p>
              </div>
           )}
        </div>
      </div>
    </main>
  );
};