// src/components/layout/Playground.tsx

"use client";

import React from "react";
import Confetti from "react-confetti";
import { FinalOutputCard } from "../Ui/FinalOutputCard";
import { Modal } from "../Ui/Modal";
import { PostData } from "../Ui/PostCard";
import { usePlayground } from "@/hooks/usePlayground"; // Adjust path as needed

// Import the new smaller components
import { BrandPanel } from "./Playground/BrandPanel";
import { PreviewPanel } from "./Playground/PreviewPanel";
import { TemplateSelector } from "./Playground/TemplateSelector";
import { ActionBar } from "./Playground/ActionBar";
import { Download } from "lucide-react";

export interface FormData {
  brandTone: string;
  postText: string;
  logoFile: File | null;
  imageFile: File | null;
}

// --- PROPS ---
interface PlaygroundProps {
  brandColor: string;
  setBrandColor: (color: string) => void;
  onGenerate: (data: FormData) => void;
  isLoading: boolean;
  generatedPost: PostData | null;
  error: string;
}

export const Playground: React.FC<PlaygroundProps> = ({
  brandColor,
  setBrandColor,
  onGenerate,
  isLoading,
  generatedPost,
  error,
}) => {
  // The hook provides all the state and logic
  const {
    formData,
    setFormData,
    imageBase64,
    logoBase64,
    activeTemplate,
    setActiveTemplate,
    displayContent,
    logoPosition,
    setLogoPosition,
    isPreviewModalOpen,
    setIsPreviewModalOpen,
    showConfetti,
    width,
    height,
    finalCanvasRef,
    dragConstraintsRef,
    handleFileChange,
    handleRemoveFile,
    handleDownload,
    isFormComplete,
  } = usePlayground({ generatedPost });

  return (
    <>
      {/* --- UI Effects --- */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
        />
      )}

      {/* --- Hidden high-res canvas for downloads --- */}
      <div
        className="absolute top-0 left-0"
        style={{ transform: "translateX(-2000px)", pointerEvents: "none" }}
      >
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

      {/* --- Main Layout --- */}
      <div className="h-[85vh] bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-indigo-500/10 flex flex-col">
        <div className="flex flex-grow min-h-0">
          <BrandPanel
            brandColor={brandColor}
            setBrandColor={setBrandColor}
            formData={formData}
            setFormData={setFormData}
            handleFileChange={handleFileChange}
            handleRemoveFile={handleRemoveFile}
          />

          <PreviewPanel
            generatedPost={generatedPost}
            setIsPreviewModalOpen={setIsPreviewModalOpen}
            dragConstraintsRef={dragConstraintsRef}
            activeTemplate={activeTemplate}
            imageBase64={imageBase64}
            logoBase64={logoBase64}
            displayContent={displayContent}
            brandColor={brandColor}
            logoPosition={logoPosition}
            setLogoPosition={setLogoPosition}
          />

          <div className="w-32 p-4 border-l border-slate-200 overflow-y-auto">
            <h3 className="text-sm font-semibold text-slate-600 mb-4 text-center">
              Layout
            </h3>
            <TemplateSelector
              activeTemplate={activeTemplate}
              onSelect={setActiveTemplate}
            />
          </div>
        </div>

        <ActionBar
          formData={formData}
          setFormData={setFormData}
          onGenerate={() => onGenerate(formData)}
          isFormComplete={isFormComplete}
          isLoading={isLoading}
          error={error}
          brandColor={brandColor}
          generatedPost={generatedPost}
          displayContent={displayContent}
          handleDownload={handleDownload}
        />
      </div>

      {/* --- Preview Modal --- */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Final Download Preview"
      >
        <div className="relative w-[540px] h-[675px] bg-slate-200">
          {/* You might want to create a dedicated component for this preview content */}
          <div style={{ transform: "scale(0.5)", transformOrigin: "top left" }}>
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
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium text-white transition-colors justify-center"
            style={{ backgroundColor: brandColor }}
          >
            <Download className="h-4 w-4" /> Download Image
          </button>
        </div>
      </Modal>
    </>
  );
};
