export const MAX_CHARS = 1000;

export const BRAND_TONES = [
  // Original Tones
  "💼 Friendly & Professional",
  "🎉 Whimsical & Playful",
  "💎 Elegant & Luxurious",
  "✨ Modern & Minimalistic",

  // Approachable & Encouraging
  "😊 Warm & Welcoming",
  "🗣️ Conversational & Casual",
  "🙌 Inspirational & Motivating",
  "👍 Helpful & Informative",
  "🤗 Authentic & Genuine",
  "🤝 Trustworthy & Reliable",

  // Direct & Confident
  "💪 Bold & Assertive",
  "🧠 Authoritative & Expert",
  "🔥 Passionate & Energetic",
  "🎯 Straightforward & Direct",
  "👔 Serious & Formal",
  "🏆 Confident & Assured",

  // Creative & Edgy
  "😂 Humorous & Witty",
  "😜 Sassy & Irreverent",
  "🎨 Artistic & Expressive",
  "🚀 Innovative & Visionary",

  // Sincere & Empathetic
  "❤️ Empathetic & Compassionate",
  "🙏 Respectful & Considerate",
  "🌿 Down-to-earth & Relatable",
];
export const LAYOUT_TEMPLATES = [
  { id: "default", name: "Standard", icon: "Square", disabled: false },
  { id: "footer-focus", name: "Footer", icon: "PanelRight", disabled: false },
  { id: "image-left", name: "Split", icon: "Columns", disabled: true },
  { id: "text-overlay", name: "Overlay", icon: "Layers", disabled: true },
] as const;
