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



export const SAMPLE_POSTS = [
  {
    headline: "Sunset Vibes & Party Beats",
    body: "Getting ready for an unforgettable night. The music is on, the lights are low. Let's make some memories!",
    hashtags: ["#PartyHub", "#Nightlife", "#GoodVibes", "#EventPlanner"],
    image: "/images/sample-1.png",
  },
  {
    headline: "Elegant Evenings, Perfect Moments",
    body: "Crafting the perfect atmosphere for a sophisticated gathering. Every detail matters.",
    hashtags: ["#CorporateEvent", "#LuxuryEvents", "#PartyHub", "#Details"],
    image: "/images/sample-2.png",
  },
  {
    headline: "The Ultimate Birthday Bash",
    body: "Balloons, cake, and all your favorite people. We're turning moments into milestones.",
    hashtags: ["#BirthdayParty", "#Celebration", "#MakingMemories", "#PartyHub"],
    image: "/images/sample-3.png",
  },
  {
    headline: "Dream Wedding Reception",
    body: "From the first dance to the last goodbye, creating magical wedding experiences is what we do best.",
    hashtags: ["#WeddingInspo", "#DreamDay", "#PartyHub", "#Love"],
    image: "/og-image.png",
  },
];