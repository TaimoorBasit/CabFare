import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Carolean Coaches | Executive Precision in Motion",
  description: "Instant Fare Engine",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        {mapsKey && (
          <Script
            id="gm-script"
            src={`https://maps.googleapis.com/maps/api/js?key=${mapsKey}&libraries=places,geometry&callback=__gmCb`}
            strategy="beforeInteractive"
          />
        )}
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800&family=Figtree:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
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
