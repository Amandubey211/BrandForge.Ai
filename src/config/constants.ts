export const MAX_CHARS = 1000;

export const BRAND_TONES = [
  "💼 Friendly & Professional",
  "🎉 Whimsical & Playful",
  "💎 Elegant & Luxurious",
  "✨ Modern & Minimalistic",
];

export const LAYOUT_TEMPLATES = [
  { id: "default", name: "Standard", icon: "Square", disabled: false },
  { id: "footer-focus", name: "Footer", icon: "PanelRight", disabled: false },
  { id: "image-left", name: "Split", icon: "Columns", disabled: true },
  { id: "text-overlay", name: "Overlay", icon: "Layers", disabled: true },
] as const;
