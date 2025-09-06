"use client";

import React, { useState } from "react";
import Confetti from "react-confetti";
import { FinalOutputCard } from "../Ui/FinalOutputCard";
import { Modal } from "../Ui/Modal";
import { PostData } from "../Ui/PostCard";
import { usePlayground } from "@/hooks/usePlayground";
import { BrandPanel } from "./Playground/BrandPanel";
import { PreviewPanel } from "./Playground/PreviewPanel";
import { TemplateSelector } from "./Playground/TemplateSelector";
import { ActionBar } from "./Playground/ActionBar";
import { Download, Palette, Eye } from "lucide-react";

export interface FormData {
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

export const Playground: React.FC<PlaygroundProps> = ({
  brandColor,
  setBrandColor,
  onGenerate,
  isLoading,
  generatedPost,
  error,
}) => {
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

  // State to manage which panel is visible on mobile
  const [mobileActivePanel, setMobileActivePanel] = useState<
    "brand" | "preview"
  >("brand");

  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
        />
      )}

      <div className="absolute top-0 left-0 -translate-x-full pointer-events-none">
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

      <div className="min-h-[85vh] bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-indigo-500/10 flex flex-col">
        {/* --- Mobile Panel Toggles --- */}
        <div className="lg:hidden flex border-b border-slate-200">
          <button
            onClick={() => setMobileActivePanel("brand")}
            className={`flex-1 p-3 text-sm font-semibold flex items-center justify-center gap-2 ${
              mobileActivePanel === "brand"
                ? "text-indigo-600 bg-indigo-50"
                : "text-slate-600"
            }`}
          >
            <Palette size={16} /> Brand & Image
          </button>
          <button
            onClick={() => setMobileActivePanel("preview")}
            className={`flex-1 p-3 text-sm font-semibold flex items-center justify-center gap-2 ${
              mobileActivePanel === "preview"
                ? "text-indigo-600 bg-indigo-50"
                : "text-slate-600"
            }`}
          >
            <Eye size={16} /> Preview & Layout
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-grow min-h-0">
          <div
            className={`${
              mobileActivePanel === "brand" ? "block" : "hidden"
            } lg:block`}
          >
            <BrandPanel
              brandColor={brandColor}
              setBrandColor={setBrandColor}
              formData={formData}
              setFormData={setFormData}
              handleFileChange={handleFileChange}
              handleRemoveFile={handleRemoveFile}
            />
          </div>

          {/* --- Preview Panel (Center) --- */}
          <div
            className={`flex-grow ${
              mobileActivePanel === "preview" ? "flex" : "hidden"
            } lg:flex`}
          >
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
          </div>

          {/* --- Template Selector (Right) --- */}
          <div
            className={`p-4 border-t lg:border-t-0 lg:border-l border-slate-200 ${
              mobileActivePanel === "preview" ? "block" : "hidden"
            } lg:block`}
          >
            <h3 className="text-sm font-semibold text-slate-600 mb-4 text-center">
              Layout
            </h3>
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2">
              <TemplateSelector
                activeTemplate={activeTemplate}
                onSelect={setActiveTemplate}
              />
            </div>
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

      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Final Download Preview"
        size="xl"
      >
        <div className="relative w-full aspect-[4/5] bg-slate-100 rounded-md overflow-hidden">
          <div className="absolute inset-0 transform scale-[0.5] origin-top-left">
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
