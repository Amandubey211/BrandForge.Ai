import React from "react";
import * as Icons from "lucide-react";
import { LAYOUT_TEMPLATES } from "@/config/constants"; // Adjust path as needed
import { LayoutTemplate } from "../../Ui/PostCard";

// Map icon names from constants to actual Lucide components
const iconMap: { [key: string]: React.ElementType } = {
  Square: Icons.Square,
  PanelRight: Icons.PanelRight,
  Columns: Icons.Columns,
  Layers: Icons.Layers,
};

interface TemplateSelectorProps {
  activeTemplate: LayoutTemplate;
  onSelect: (template: LayoutTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  activeTemplate,
  onSelect,
}) => {
  return (
    <div className="space-y-2">
      {LAYOUT_TEMPLATES.map((template) => {
        const Icon = iconMap[template.icon];
        return (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            disabled={template.disabled}
            className={`w-full flex flex-col items-center justify-center p-3 border-2 rounded-md transition-all ${
              activeTemplate === template.id
                ? "border-indigo-500 bg-indigo-50 shadow-inner"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            } disabled:opacity-50 ...`}
          >
            <Icon /* ...omitted for brevity... */ />
            <span /* ...omitted for brevity... */>{template.name}</span>
          </button>
        );
      })}
    </div>
  );
};
