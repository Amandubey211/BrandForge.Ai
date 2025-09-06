// src/components/layout/Playground/TemplateSelector.tsx

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
    <>
      {LAYOUT_TEMPLATES.map((template) => {
        const Icon = iconMap[template.icon];
        return (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            disabled={template.disabled}
            className={`
              flex flex-col items-center justify-center p-2 border-2 rounded-md transition-all
              flex-shrink-0 w-20 h-20 lg:w-full lg:h-auto lg:p-3
              ${
                activeTemplate === template.id
                  ? "border-indigo-500 bg-indigo-50 shadow-inner"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            title={template.name}
          >
            <Icon className="h-5 w-5 mb-1 lg:h-6 lg:w-6" />
            <span className="text-xs font-medium text-center text-slate-600">
              {template.name}
            </span>
          </button>
        );
      })}
    </>
  );
};
