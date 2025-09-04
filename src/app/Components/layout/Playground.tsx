// src/app/Components/layout/Playground.tsx
"use client";

import React, {
  useState,
  useRef,
  ChangeEvent,
  ReactNode,
  useEffect,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence, Point } from "framer-motion";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import {
  Copy,
  Download,
  Sparkles,
  UploadCloud,
  FileCheck2,
  X,
  Move,
  Bot,
  Wand2,
  Info,
  ChevronDown,
} from "lucide-react";
import { PostCard } from "../Ui/PostCard";

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
    theme: "light" | "dark";
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

// --- MAIN COMPONENT ---
export const Playground: React.FC<PlaygroundProps> = ({
  brandColor,
  setBrandColor,
  onGenerate,
  isLoading,
  generatedPost,
  error,
}) => {
  const [formData, setFormData] = useState<FormData>({
    brandTone: "Friendly & Professional",
    postText: "",
    logoFile: null,
    imageFile: null,
  });
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(
    "brand"
  );

  const [headlineContent, setHeadlineContent] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [logoPosition, setLogoPosition] = useState<Point>({ x: 20, y: 20 });
  const [headlinePosition, setHeadlinePosition] = useState<Point>({
    x: 20,
    y: 200,
  });

  useEffect(() => {
    if (generatedPost) {
      setHeadlineContent(
        `<h2 class="font-extrabold text-3xl leading-tight" style="color: ${brandColor}; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));">${generatedPost.headline}</h2>`
      );
      setBodyContent(`<p class="text-base">${generatedPost.body}</p>`);
      setActiveAccordion(null); // Close other accordions to focus on the result
    }
  }, [generatedPost, brandColor]);

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    type: "logo" | "image"
  ) => {
    const file = e.target.files?.[0] || null;
    const stateKey = type === "logo" ? "logoFile" : "imageFile";
    setFormData((prev) => ({ ...prev, [stateKey]: file }));
    if (file) {
      const base64 = await fileToBase64(file);
      if (type === "logo") setLogoBase64(base64);
      else setImageBase64(base64);
    } else handleRemoveFile(type);
  };

  const handleRemoveFile = (type: "logo" | "image") => {
    const stateKey = type === "logo" ? "logoFile" : "imageFile";
    setFormData((prev) => ({ ...prev, [stateKey]: null }));
    if (type === "logo") setLogoBase64(null);
    else setImageBase64(null);
  };

  const handleCopy = () => {
    if (!generatedPost) return;
    const fullText = `${generatedPost.headline}\n\n${
      generatedPost.body
    }\n\n${generatedPost.hashtags.join(" ")}`;
    navigator.clipboard.writeText(fullText);
    toast.success("Post text copied to clipboard!");
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return toast.error("Canvas element not found.");
    const toastId = toast.loading("Preparing your download...");
    try {
      // Temporarily hide interactive elements for a clean download
      const interactiveElements = canvasRef.current.querySelectorAll(
        ".interactive-element"
      );
      interactiveElements.forEach(
        (el) => ((el as HTMLElement).style.display = "none")
      );

      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      // Restore interactive elements after capture
      interactiveElements.forEach(
        (el) => ((el as HTMLElement).style.display = "block")
      );

      const link = document.createElement("a");
      link.download = `partyhub-post-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Download started!", { id: toastId });
    } catch (err) {
      console.error("Failed to download image", err);
      toast.error("Failed to create image. Please try again.", { id: toastId });
    }
  };

  const isFormComplete = !!(
    formData.logoFile &&
    formData.imageFile &&
    formData.postText.trim()
  );

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="flex h-screen">
        {/* --- LEFT CONTROL PANEL (30%) --- */}
        <div className="w-full max-w-md bg-white border-r border-slate-200 shadow-xl flex flex-col h-screen">
          <div className="p-4 border-b border-slate-200 flex-shrink-0">
            <h2 className="text-xl font-bold">Control Panel</h2>
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-2">
            <AccordionItem
              title="1. Brand Identity"
              id="brand"
              activeId={activeAccordion}
              setActiveId={setActiveAccordion}
            >
              <div className="space-y-4 p-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Primary Brand Color
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2"
                      style={{
                        borderColor: brandColor,
                        boxShadow: `0 0 0 2px ${brandColor}20`,
                      }}
                    />
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 border-none cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Brand Tone
                  </label>
                  <select
                    value={formData.brandTone}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, brandTone: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-md"
                  >
                    <option>Friendly & Professional</option>
                    <option>Whimsical & Playful</option>
                    <option>Elegant & Luxurious</option>
                    <option>Modern & Minimalistic</option>
                  </select>
                </div>
                <FileInput
                  label="Brand Logo"
                  file={formData.logoFile}
                  onFileChange={(e) => handleFileChange(e, "logo")}
                  onRemove={() => handleRemoveFile("logo")}
                />
              </div>
            </AccordionItem>

            <AccordionItem
              title="2. Post Content"
              id="content"
              activeId={activeAccordion}
              setActiveId={setActiveAccordion}
            >
              <div className="space-y-4 p-4">
                <FileInput
                  label="Your Image"
                  file={formData.imageFile}
                  onFileChange={(e) => handleFileChange(e, "image")}
                  onRemove={() => handleRemoveFile("image")}
                />
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Your Core Message
                  </label>
                  <textarea
                    rows={4}
                    value={formData.postText}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, postText: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm"
                    placeholder="e.g., Our new spring floral arrangements..."
                  ></textarea>
                </div>
              </div>
            </AccordionItem>

            <AnimatePresence>
              {generatedPost && (
                <AccordionItem
                  title="3. Customize"
                  id="customize"
                  activeId={activeAccordion}
                  setActiveId={setActiveAccordion}
                >
                  <div className="p-4 text-center">
                    <div className="flex items-start gap-2 p-3 bg-slate-100 rounded-lg text-slate-600">
                      <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p className="text-xs">
                        You can now click the text on the canvas to edit it, and
                        drag the headline and logo to move them!
                      </p>
                    </div>
                  </div>
                </AccordionItem>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-slate-200 space-y-4 flex-shrink-0">
            <button
              onClick={() => onGenerate(formData)}
              disabled={!isFormComplete || isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-md py-3 px-4 font-semibold text-white transition hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: brandColor }}
            >
              {isLoading ? (
                "Generating..."
              ) : (
                <>
                  <Bot className="h-5 w-5" />{" "}
                  {generatedPost ? "Regenerate" : "Generate Post"}
                </>
              )}
            </button>
            <AnimatePresence>
              {generatedPost && (
                <motion.div
                  className="flex items-center justify-center gap-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors w-1/2 justify-center"
                  >
                    <Copy className="h-4 w-4" /> Copy Text
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors w-1/2 justify-center"
                    style={{ backgroundColor: brandColor }}
                  >
                    <Download className="h-4 w-4" /> Download
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>

        {/* --- RIGHT CANVAS (70%) --- */}
        <div
          ref={dragConstraintsRef}
          className="flex-grow flex items-center justify-center p-8 bg-grid relative h-screen"
        >
          <div
            ref={canvasRef}
            className="w-full max-w-xl aspect-[4/5] rounded-lg shadow-2xl overflow-hidden relative"
          >
            <PostCard
              imagePreviewUrl={imageBase64}
              logoPreviewUrl={logoBase64}
              bodyContent={bodyContent}
              hashtags={generatedPost?.hashtags || []}
              brandColor={brandColor}
              headlinePosition={headlinePosition}
              logoPosition={logoPosition}
              headlineContent={headlineContent}
            />
            <AnimatePresence>
              {generatedPost && (
                <>
                  <motion.div
                    drag
                    dragConstraints={dragConstraintsRef}
                    onDragEnd={(e, { point }) => setHeadlinePosition(point)}
                    className="absolute top-0 left-0 cursor-grab active:cursor-grabbing p-2 z-40 interactive-element"
                    style={{ x: headlinePosition.x, y: headlinePosition.y }}
                  >
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        setHeadlineContent(e.currentTarget.innerHTML)
                      }
                      dangerouslySetInnerHTML={{ __html: headlineContent }}
                    />
                  </motion.div>

                  {logoBase64 && (
                    <motion.div
                      drag
                      dragConstraints={dragConstraintsRef}
                      onDragEnd={(e, { point }) => setLogoPosition(point)}
                      className="absolute top-0 left-0 cursor-grab active:cursor-grabbing group z-40 interactive-element"
                      style={{ x: logoPosition.x, y: logoPosition.y }}
                    >
                      <div className="relative w-16 h-16 p-1 bg-white/50 rounded-lg backdrop-blur-sm">
                        <Move className="absolute -top-2 -right-2 h-4 w-4 text-slate-800 bg-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Image
                          src={logoBase64}
                          alt="Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
};

// --- HELPER COMPONENTS ---
const AccordionItem = ({
  id,
  title,
  activeId,
  setActiveId,
  children,
}: {
  id: string;
  title: string;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  children: ReactNode;
}) => {
  const isOpen = id === activeId;
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setActiveId(isOpen ? null : id)}
        className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="h-5 w-5 text-slate-500" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            {children}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

const FileInput = ({
  label,
  file,
  onFileChange,
  onRemove,
}: {
  label: string;
  file: File | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      {label}
    </label>
    <div className="relative">
      <label className="cursor-pointer bg-slate-50 border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center min-h-[120px] hover:bg-slate-100 transition-colors text-center">
        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="selected"
              className="flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <FileCheck2 className="h-8 w-8 text-green-500 mb-1" />
              <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                {file.name}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <UploadCloud className="h-8 w-8 text-slate-400 mb-1" />
              <span className="text-sm font-medium text-slate-600">
                Click to upload
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <input
          type="file"
          className="hidden"
          onChange={onFileChange}
          accept="image/*"
        />
      </label>
      {file && (
        <motion.button
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-slate-600 text-white rounded-full p-1 hover:bg-slate-800 transition-colors"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          aria-label="Remove file"
        >
          <X className="h-3 w-3" />
        </motion.button>
      )}
    </div>
  </div>
);
