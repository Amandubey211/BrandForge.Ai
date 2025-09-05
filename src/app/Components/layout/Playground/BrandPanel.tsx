// src/components/layout/Playground/BrandPanel.tsx

import React, { ChangeEvent } from "react";
import { Palette, FileImage } from "lucide-react";
import { BRAND_TONES } from "@/config/constants";
import { FileInputCompact } from "./FileInputCompact";
// FIX: Ensure FormData is imported from the parent Playground component, not defined locally.
import { FormData } from "../Playground";

interface BrandPanelProps {
  brandColor: string;
  setBrandColor: (color: string) => void;
  // This now correctly refers to the imported FormData type
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleFileChange: (
    e: ChangeEvent<HTMLInputElement>,
    type: "logo" | "image"
  ) => void;
  handleRemoveFile: (type: "logo" | "image") => void;
}

export const BrandPanel: React.FC<BrandPanelProps> = ({
  brandColor,
  setBrandColor,
  formData,
  setFormData,
  handleFileChange,
  handleRemoveFile,
}) => {
  return (
    <div className="w-full max-w-xs p-5 border-r border-slate-200 flex flex-col space-y-6 overflow-y-auto">
      {/* --- Brand Identity Section --- */}
      <div>
        <h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <Palette size={16} /> Brand Identity
        </h3>
        <div className="space-y-2">
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">
              Color
            </label>
            <input
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="w-full h-10 p-0 border-none cursor-pointer rounded-md"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">
              Tone
            </label>
            <select
              value={formData.brandTone}
              onChange={(e) =>
                setFormData((p) => ({ ...p, brandTone: e.target.value }))
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
            >
              {BRAND_TONES.map((tone) => (
                <option key={tone}>{tone}</option>
              ))}
            </select>
          </div>
          <FileInputCompact
            label="Logo"
            file={formData.logoFile}
            onFileChange={(e) => handleFileChange(e, "logo")}
            onRemove={() => handleRemoveFile("logo")}
          />
        </div>
      </div>

      {/* --- Post Image Section --- */}
      <div className="border-t border-slate-200 pt-2">
        <h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <FileImage size={16} /> Post Image
        </h3>
        <FileInputCompact
          label="Your Image"
          file={formData.imageFile}
          onFileChange={(e) => handleFileChange(e, "image")}
          onRemove={() => handleRemoveFile("image")}
        />
      </div>
    </div>
  );
};
