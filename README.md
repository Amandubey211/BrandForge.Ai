# PartyHub - AI Social Media Post Generator

This project is a high-quality, fully functional AI-powered tool designed to help event vendors effortlessly create stunning, on-brand social media content. It leverages Google's Gemini model for creative text generation and is built upon a robust, interactive, and user-centric front-end architecture.

<br/>

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E77F0?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)

</div>

<br/>

## 🚀 Live Demo

**https://brandforge-ai-olive.vercel.app/**

<br/>

## ✨ Key Features

*   **AI-Powered Content Generation:** Integrates with Google Gemini to generate compelling headlines, body text, and hashtags based on a core message and selected brand tone.
*   **Dynamic Brand Alignment:** Users can select a primary brand color that instantly updates the entire UI and is passed to the AI for context-aware content generation.
*   **Interactive WYSIWYG Editor:** A robust "What You See Is What You Get" post preview. The live editor is a perfectly scaled version of the final output, ensuring complete visual consistency.
*   **Draggable Logo with Boundary Detection:** Users can upload and freely drag their logo across the canvas. The drag logic is constrained within the post's boundaries to prevent the logo from ever being lost.
*   **Multiple Layout Templates:** Choose between different social media post layouts (e.g., Standard, Footer Focus) to best suit the content.
*   **High-Resolution Image Downloads:** Generates and downloads a pixel-perfect, 1080x1350px PNG of the final post, ready for social media.
*   **Polished & Animated UI:** The entire application is built with a focus on user experience, featuring fluid animations (`Framer Motion`), a glassmorphic header, delightful user feedback (`react-confetti`, `sonner`), and premium smooth scrolling (`Lenis`).

<br/>

## 📸 Application Preview

A brief walkthrough of the generator's core functionality:

*(**Recommendation:** Record a short GIF or video of the app in action and replace the placeholder image below.)*

![PartyHub AI Post Generator UI Preview](http://brandforge-ai-olive.vercel.app/og-image.png)

<br/>

## 🏛️ Final Architecture: The "Scaled WYSIWYG" Model

After encountering challenges with layout consistency between the live preview and the final download, the project was re-architected to a more robust and elegant solution.

1.  **Single Source of Truth:** A single master component, **`SocialPostCard.tsx`**, defines the pixel-perfect, high-resolution (1080x1350px) layout of the final social media post. This component is the definitive source of truth for the post's appearance.

2.  **Perfect WYSIWYG via Scaling:** The interactive live preview renders this high-resolution `SocialPostCard` and uses **CSS `transform: scale()`** to shrink it down to fit the editor's viewport. This guarantees that the text wrapping, spacing, and element positioning in the preview are identical to the final output.

3.  **Percentage-Based Positioning:** The draggable logo's position is stored as percentage values (`{ x: 0-100, y: 0-100 }`). This allows the position to be applied universally, whether on the scaled-down live preview or the full-resolution download canvas.

4.  **Reliable Downloads:** The download function targets a hidden, full-size instance of `SocialPostCard`, ensuring the output is always a high-quality, complete image with no cut-off content.

This architecture eliminates state synchronization issues and layout inconsistencies, resulting in a stable, predictable, and powerful user experience.

<br/>

## 🛠️ Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) | App Router, Server Actions, API Routes |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type safety and scalability |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Rapid, utility-first UI development |
| **AI Engine** | [Google Gemini](https://ai.google.dev/) | Creative text and hashtag generation |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) | Fluid UI animations and interactions |
| **Image Generation** | [html-to-image](https://github.com/bubkoo/html-to-image-pro) | Converting DOM nodes to downloadable PNGs |
| **User Feedback** | [Sonner](https://sonner.emilkowal.ski/), [React Confetti](https://github.com/alampros/react-confetti) | Toasts and celebratory animations |
| **Smooth Scrolling**| [Lenis](https://lenis.studiofreight.com/) | Premium smooth scrolling experience |
| **Icons** | [Lucide React](https://lucide.dev/) | Crisp and consistent iconography |

<br/>

## ⚙️ Getting Started

To run this project locally, follow these simple steps.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/partyhub-post-generator.git
    cd partyhub-post-generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add your Google Gemini API key.
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<br/>

## 📹 Video Walkthrough

A link to the video walkthrough explaining the thought process, final architecture, and showcasing the application's features.

**https://www.loom.com/share/02a2ce627cfe41b6b4112f2e70a6b95c?sid=a04007d1-66be-4a2b-8334-dd7126d278de**
