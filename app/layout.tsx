import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Carolean Coaches | Executive Precision in Motion",
  description: "Instant Fare Engine",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800&family=Figtree:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <script id="tailwind-config" dangerouslySetInnerHTML={{ __html: `
          tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-surface": "#1c1b1b",
                        "surface-container": "#f0edec",
                        "surface-dim": "#dcd9d9",
                        "on-primary-container": "#868bcb",
                        "primary-container": "#1d225c",
                        "on-secondary": "#ffffff",
                        "surface-variant": "#e5e2e1",
                        "inverse-surface": "#313030",
                        "secondary": "#ba091c",
                        "error": "#ba1a1a",
                        "on-tertiary-fixed": "#191c1d",
                        "tertiary-fixed-dim": "#c5c7c8",
                        "surface-bright": "#fcf9f8",
                        "error-container": "#ffdad6",
                        "on-primary-fixed": "#0e134f",
                        "on-background": "#1c1b1b",
                        "on-primary-fixed-variant": "#3c417c",
                        "surface-container-highest": "#e5e2e1",
                        "on-error": "#ffffff",
                        "primary": "#060a48",
                        "primary-fixed": "#e0e0ff",
                        "impact-red": "#D2232A",
                        "surface": "#fcf9f8",
                        "on-secondary-container": "#fffbff",
                        "on-tertiary": "#ffffff",
                        "tertiary": "#121516",
                        "outline": "#777681",
                        "on-tertiary-fixed-variant": "#454748",
                        "tertiary-fixed": "#e1e3e4",
                        "stark-white": "#FFFFFF",
                        "secondary-fixed": "#ffdad6",
                        "on-secondary-fixed-variant": "#930012",
                        "on-error-container": "#93000a",
                        "surface-container-lowest": "#ffffff",
                        "obsidian": "#111111",
                        "inverse-primary": "#bec2ff",
                        "primary-fixed-dim": "#bec2ff",
                        "outline-variant": "#c7c5d1",
                        "on-surface-variant": "#464650",
                        "secondary-fixed-dim": "#ffb3ad",
                        "on-tertiary-container": "#8e9091",
                        "surface-tint": "#545996",
                        "on-secondary-fixed": "#410003",
                        "on-primary": "#ffffff",
                        "secondary-container": "#de2d31",
                        "background": "#fcf9f8",
                        "surface-container-low": "#f6f3f2",
                        "deep-navy": "#1D225C",
                        "inverse-on-surface": "#f3f0ef",
                        "surface-container-high": "#ebe7e7",
                        "tertiary-container": "#26292a"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "base": "8px",
                        "container-max": "1280px",
                        "gutter": "24px",
                        "section-gap-lg": "120px",
                        "margin-mobile": "16px",
                        "section-gap-md": "80px"
                    },
                    "fontFamily": {
                        "headline-lg": ["Hanken Grotesk"],
                        "label-lg": ["Figtree"],
                        "headline-xl-mobile": ["Hanken Grotesk"],
                        "headline-md": ["Hanken Grotesk"],
                        "body-md": ["Figtree"],
                        "label-sm": ["Figtree"],
                        "headline-xl": ["Hanken Grotesk"],
                        "body-lg": ["Figtree"]
                    },
                    "fontSize": {
                        "headline-lg": ["32px", {"lineHeight": "40px", "fontWeight": "700"}],
                        "label-lg": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "600"}],
                        "headline-xl-mobile": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "800"}],
                        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "700"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "label-sm": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
                        "headline-xl": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
                        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}]
                    }
                }
            }
          }
        `}} />
        <style dangerouslySetInnerHTML={{ __html: `
          .material-symbols-outlined {
              font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
          }
          .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #1D225C;
              border-radius: 10px;
          }
          .glass-panel {
              background: rgba(255, 255, 255, 0.98);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(255, 255, 255, 0.3);
          }
          .capsule-input {
              border-radius: 9999px !important;
          }
          .hero-gradient-overlay {
              background: linear-gradient(to right, rgba(6, 10, 72, 0.9) 0%, rgba(6, 10, 72, 0.4) 50%, rgba(6, 10, 72, 0.1) 100%);
          }
        `}} />
      </head>
      <body className="bg-background text-on-surface font-body-md selection:bg-secondary selection:text-white overflow-x-hidden">{children}</body>
    </html>
  );
}
