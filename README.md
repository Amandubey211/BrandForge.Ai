# PartyHub - AI Social Media Post Generator

This project is a submission for the SDE-1 take-home assignment for PartyHub. It is an AI-powered tool designed to help event vendors effortlessly create stunning, on-brand social media content by leveraging the power of Google's Gemini model.

<br/>

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://gsap.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

</div>

<br/>

## 🚀 Live Demo

**[Link to Deployed Application - In Progress]**

<br/>

## ✨ Key Features

This project focuses on creating a polished, intuitive, and delightful user experience as the foundation for the core AI functionality.

*   **Glassmorphic Dynamic Header:** A modern, sticky header that elegantly transforms from a transparent overlay to a floating glass panel on scroll.
*   **Engaging Animations & Transitions:** The entire UI is brought to life with sophisticated animations using **GSAP** for text reveals and **Framer Motion** for interactive elements and background visuals.
*   **Premium Smooth Scrolling:** Utilizes **Lenis** to ensure a fluid and seamless navigation experience across the entire application, mimicking the feel of a native application.
*   **Interactive Branding:** Users can immediately experience the tool's core promise by live-editing the brand color directly in the hero section, with all relevant UI elements updating in real-time.
*   **Robust & Scalable Architecture:** Built with a clean, component-based structure that emphasizes separation of concerns and maintainability.

<br/>

## 📸 Application Preview

Here's a look at the current state of the polished user interface:

*(**Note:** To make this image appear, please add your screenshot to the repository, for example in a `/public/images` folder, and update the path below.)*

![PartyHub AI Post Generator UI Preview](./public/images/app-preview.png)

<br/>

## 🛠️ Tech Stack

| Category            | Technology                                                              |
| ------------------- | ----------------------------------------------------------------------- |
| **Framework**       | [Next.js 14](https://nextjs.org/) (App Router)                          |
| **Language**        | [TypeScript](https://www.typescriptlang.org/)                           |
| **Styling**         | [Tailwind CSS](https://tailwindcss.com/)                                |
| **Animation**       | [GSAP](https://gsap.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Smooth Scrolling**| [Lenis](https://lenis.studiofreight.com/)                               |
| **Icons**           | [Lucide React](https://lucide.dev/)                                     |
| **AI Integration**  | [Google Gemini](https://ai.google.dev/) (Next Step)                     |

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

## 🏛️ Architectural Decisions & Philosophy

The development process prioritized establishing a high-quality, interactive user experience *before* integrating the core backend logic. This "UX-First" approach ensures the final product is not just functional, but genuinely enjoyable to use.

*   **Component-Driven Architecture:** The UI is broken down into logical, reusable components (`Header`, `HeroSection`, `SplitText`). This promotes maintainability, scalability, and clean code.
*   **Centralized State Management:** Page-level state is managed in the main `page.tsx` component and passed down as props. This follows the "lifting state up" pattern, creating a single source of truth for the application's data.
*   **Separation of Concerns:** Global logic, such as the initialization of the Lenis smooth scroller, is handled in a dedicated client wrapper within the `RootLayout`. This separates global concerns from page-specific logic, making the codebase more predictable and organized.

<br/>

## 🗺️ Project Roadmap

The project is being developed in two distinct phases:

-   [x] **Phase 1: UI/UX Foundation (Complete)**
    -   [x] Design and build the core layout and components.
    -   [x] Implement all animations, transitions, and interactive elements.
    -   [x] Establish a robust and scalable front-end architecture.

-   [ ] **Phase 2: Core AI Functionality (In Progress)**
    -   [ ] Implement file upload logic for vendor images and logos.
    -   [ ] Create the Next.js API route for Google Gemini integration.
    -   [ ] Engineer the prompt to incorporate brand identity (color, tone).
    -   [ ] Develop the logic to combine the vendor's image with the AI-generated text into a final, polished visual.

<br/>

## 📹 Video Walkthrough

A link to the video walkthrough explaining the thought process, architecture, and showcasing the final outputs will be added here upon submission.

**[Link to Video - Coming Soon]**
