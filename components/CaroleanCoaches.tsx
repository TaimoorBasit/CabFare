// @ts-nocheck
'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

// ── Design tokens ─────────────────────────────────────────────────────────────
const PX = {
  navy800: "#0D0E48",       // Primary Navy Blue from website
  navy700: "#13155C",       // Dark Accent
  navy600: "#1E228E",       // Medium Navy
  brandRed: "#CD202C",      // Primary Brand Red from website
  brandRedHover: "#b01c26", // Hover state for primary buttons
  amber500: "#E6A11D",      // Brand Gold/Accent
  amber400: "#d4a832",
  amber100: "#fdf3dc",
  teal700: "#0c6e55",
  teal100: "#e0f5ef",
  red700: "#b91c1c",
  red100: "#fee2e2",
  gray50: "#f8fafc",        // Light slate backgrounds
  gray100: "#f1f5f9",
  gray200: "#e2e8f0",
  gray400: "#94a3b8",
  gray600: "#475569",
  gray900: "#0f172a",
  offWhite: "#f4f5f7",
};

// ── Inline Vector SVG Components (Replacing Emojis) ───────────────────────────
function SvgMapPinGreen({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" fill="#22c55e" />
    </svg>
  );
}

function SvgMapPinRed({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#CD202C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" fill="#CD202C" />
    </svg>
  );
}

function SvgMapPinBlue({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" fill="#3b82f6" />
    </svg>
  );
}

function SvgMap({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

function SvgDepot({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 21V9h6v12" />
    </svg>
  );
}

function SvgLuggage({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="8" y1="11" x2="8" y2="16" />
      <line x1="16" y1="11" x2="16" y2="16" />
    </svg>
  );
}

function SvgUser({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SvgBus({ size = 28, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M7 10h2v3H7z" />
      <path d="M15 10h2v3h-2z" />
      <path d="M4 14h16" />
      <circle cx="8" cy="19" r="1.5" fill="currentColor" />
      <circle cx="16" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

// ── Minibus drawing ──
function SvgMinibus({ size = 28, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M3 11h18" />
      <path d="M8 5v6" />
      <path d="M16 5v6" />
      <circle cx="7" cy="18" r="1.5" fill="currentColor" />
      <circle cx="17" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}

// ── Coach drawing ──
function SvgCoach({ size = 28, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <rect x="2" y="3" width="20" height="15" rx="3" />
      <path d="M2 8h20" />
      <path d="M2 13h20" />
      <circle cx="6" cy="21" r="2" fill="currentColor" />
      <circle cx="18" cy="21" r="2" fill="currentColor" />
      <path d="M9 21h6" />
    </svg>
  );
}

function SvgSettings({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function SvgCalendar({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function SvgBookings({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function SvgPricing({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function SvgCheck({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SvgTrash({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function SvgAlert({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function SvgClose({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SvgKey({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l-1.5-1.5" />
    </svg>
  );
}

// ── Global CSS & Montserrat Font loading ───────────────────────────────────────
function GlobalStyle() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=Outfit:wght@100..900&display=swap');

      *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        background: #f8fafc;
        color: #0d0d1a;
        font-family: 'Figtree', system-ui, -apple-system, sans-serif;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }
      input, select, button, textarea { font-family: 'Figtree', sans-serif; }

      /* ── Base inputs ── */
      input[type=text], input[type=email], input[type=number],
      input[type=date], input[type=datetime-local], select {
        display: block;
        width: 100%;
        padding: 8px 12px;
        border: 1.5px solid #dde0e8;
        border-radius: 8px;
        font-size: 13px;
        color: #222;
        background: #fff;
        outline: none;
        transition: border .25s, box-shadow .25s;
        height: 36px;
      }
      input[type=text]:focus, input[type=email]:focus, input[type=number]:focus,
      input[type=date]:focus, input[type=datetime-local]:focus, select:focus {
        border-color: ${PX.brandRed};
        box-shadow: 0 0 0 3px rgba(205, 32, 44, 0.08);
        background: #ffffff;
      }
      input::placeholder { color: #94a3b8; }
      select { cursor: pointer; }

      /* ── Animations ── */
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes spin { to { transform: rotate(360deg); } }

      .fade-up { animation: fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .spinning { animation: spin 1s linear infinite; display: inline-block; }

      /* ── Google Places autocomplete ── */
      .pac-container {
        border-radius: 12px !important;
        border: 1px solid #dde0e8 !important;
        box-shadow: 0 8px 24px rgba(13, 14, 72, 0.06) !important;
        font-family: 'Figtree', sans-serif !important;
        margin-top: 4px !important;
        z-index: 99999 !important;
        padding: 6px 0 !important;
      }
      .pac-item { padding: 10px 14px !important; font-size: 13px !important; cursor: pointer; display: flex; align-items: center; gap: 8px; }
      .pac-item:hover { background: #f8fafc !important; }
      .pac-item-query { font-size: 13.5px !important; color: #0f172a !important; font-weight: 500 !important; }
      .pac-icon { display: none !important; }
      .pac-matched { color: ${PX.brandRed} !important; font-weight: 700 !important; }

      /* ── Scrollbar ── */
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
      ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

      /* ── Quotation results layout ── */
      .results-layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.25rem;
        align-items: start;
      }
      @media (min-width: 1024px) {
        .results-layout { grid-template-columns: 1.25fr 1fr; gap: 1.75rem; }
      }
      @media (min-width: 1024px) {
        .right-panel-map { position: sticky; top: 84px; }
      }

      .field-label {
        display: block;
        font-size: 11px;
        font-weight: 700;
        color: #64748b;
        letter-spacing: 0.6px;
        margin-bottom: 6px;
        text-transform: uppercase;
      }

      /* ═══════════════════════════════════════════════════
         PREMIUM ADMIN DASHBOARD DESIGN SYSTEM
      ═══════════════════════════════════════════════════ */

      /* Root wrapper — used to scope all admin overrides */
      .adm-root {
        display: flex;
        min-height: 100vh;
        background: #f7f8fa;
        font-family: 'Figtree', sans-serif;
      }

      /* ── Admin-scoped input overrides ── */
      /* Reset the red focus ring for everything inside the admin panel */
      .adm-root input[type=text]:focus,
      .adm-root input[type=email]:focus,
      .adm-root input[type=number]:focus,
      .adm-root input[type=date]:focus,
      .adm-root input[type=datetime-local]:focus,
      .adm-root select:focus {
        border-color: #93c5fd !important;
        box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.18) !important;
      }

      /* Section card */
      .adm-section {
        background: #ffffff;
        border: 1px solid #eaecf0;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      }

      /* Section header bar */
      .adm-section-head {
        padding: 11px 18px;
        border-bottom: 1px solid #eaecf0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        background: #fcfcfd;
      }
      .adm-section-head h2 {
        font-size: 13.5px;
        font-weight: 700;
        color: #101828;
        letter-spacing: -0.1px;
        margin: 0;
      }
      .adm-section-head p {
        font-size: 12.5px;
        color: #667085;
        margin-top: 2px;
        margin-bottom: 0;
      }

      /* Form panel inside a section — white background, proper padding */
      .adm-form-panel {
        padding: 14px 18px;
        background: #ffffff;
        border-bottom: 1px solid #eaecf0;
      }
      .adm-form-panel:last-child {
        border-bottom: none;
      }
      .adm-form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 10px;
        margin-bottom: 14px;
      }
      .adm-form-grid .span2 { grid-column: span 2; }

      /* Data list container */
      .adm-list { padding: 8px 16px 14px; }

      /* Single data row */
      .adm-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 9px 12px;
        border: 1px solid #eaecf0;
        border-radius: 7px;
        background: #fff;
        margin-top: 6px;
        transition: border-color 0.15s, box-shadow 0.15s;
      }
      .adm-row:hover {
        border-color: #c0c9d7;
        box-shadow: 0 1px 6px rgba(0,0,0,0.05);
      }
      .adm-row-title {
        font-size: 13px;
        font-weight: 600;
        color: #101828;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .adm-row-sub {
        font-size: 11.5px;
        color: #667085;
        margin-top: 2px;
      }
      .adm-row-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }

      /* Ghost / danger buttons used in rows */
      .adm-btn-ghost {
        background: none;
        border: 1px solid #e4e7ec;
        border-radius: 6px;
        padding: 5px 11px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        color: #344054;
        transition: all 0.15s;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .adm-btn-ghost:hover { background: #f9fafb; border-color: #c0c9d7; }
      .adm-btn-danger {
        background: none;
        border: 1px solid #fecdca;
        border-radius: 6px;
        padding: 5px 9px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        color: #b42318;
        transition: all 0.15s;
        display: inline-flex;
        align-items: center;
      }
      .adm-btn-danger:hover { background: #fff1f0; }

      /* Status badges */
      .adm-badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 9px;
        border-radius: 99px;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
      }
      .adm-badge-green { background: #ecfdf3; color: #027a48; }
      .adm-badge-blue  { background: #eff8ff; color: #175cd3; }
      .adm-badge-amber { background: #fffaeb; color: #b54708; }
      .adm-badge-gray  { background: #f2f4f7; color: #344054; }
      .adm-badge-red   { background: #fff1f0; color: #b42318; }

      /* Empty state placeholder */
      .adm-empty {
        padding: 40px 24px;
        text-align: center;
        color: #98a2b3;
        font-size: 13px;
      }

      /* Search / filter bar */
      .adm-search-bar {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        align-items: center;
        padding: 12px 20px;
        border-bottom: 1px solid #eaecf0;
        background: #fafafa;
      }
      .adm-search-bar input[type=text],
      .adm-search-bar input[type=date] {
        height: 34px !important;
        font-size: 13px !important;
        padding: 0 12px !important;
        border-radius: 7px !important;
        border: 1px solid #e2e8f0 !important;
        width: auto !important;
        min-width: 130px;
        flex: 1;
        max-width: 200px;
        background: #fff !important;
      }
      .adm-search-bar input:focus {
        border-color: #93c5fd !important;
        box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.18) !important;
      }

      /* ── Admin table ── */
      .admin-table {
        width: 100%;
        border-collapse: separate !important;
        border-spacing: 0 !important;
      }
      .admin-table th {
        background: #f9fafb;
        padding: 10px 20px;
        font-weight: 600;
        color: #667085;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.7px;
        border-bottom: 1px solid #eaecf0;
        white-space: nowrap;
        text-align: left;
      }
      .admin-table td {
        padding: 11px 20px;
        border-bottom: 1px solid #eaecf0;
        vertical-align: middle;
      }
      .admin-table tbody tr:hover { background: #f8fafc; }
      .admin-table tbody tr:last-child td { border-bottom: none; }
    `;
    document.head.appendChild(el);
    return () => {
      document.head.removeChild(el);
    };
  }, []);
  return null;
}

// ── Google Maps loader ────────────────────────────────────────────────────────
function useGoogleMaps(apiKey) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!apiKey?.trim()) return;
    if (window.google?.maps?.places) { setLoaded(true); return; }
    const existing = document.getElementById("gm-script");
    if (existing) { existing.onload = () => setLoaded(true); return; }
    const s = document.createElement("script");
    s.id = "gm-script";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey.trim()}&libraries=places,geometry&callback=__gmCb`;
    s.async = true; s.defer = true;
    window.__gmCb = () => setLoaded(true);
    s.onerror = () => {};
    document.head.appendChild(s);
    return () => { delete window.__gmCb; };
  }, [apiKey]);
  return { loaded };
}

// ── Map Picker Modal ──────────────────────────────────────────────────────────
function MapPickerModal({ isOpen, onClose, onConfirm, initialSearch }) {
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedAddr, setSelectedAddr] = useState("");
  const [selectedGeo, setSelectedGeo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMap(null);
      setMarker(null);
      return;
    }
    let mapListener, markerListener, acListener;
    if (isOpen && window.google?.maps && mapRef.current && !map) {
      // Small timeout ensures the modal animation is complete and map container has a non-zero size
      setTimeout(() => {
        if (!mapRef.current) return;
        const m = new window.google.maps.Map(mapRef.current, {
          zoom: 6,
          center: { lat: 52.5, lng: -1.5 },
          disableDefaultUI: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        });
        const mk = new window.google.maps.Marker({ map: m, draggable: true });
        setMap(m);
        setMarker(mk);

        const geocoder = new window.google.maps.Geocoder();

        const handleSelect = (latLng) => {
          mk.setPosition(latLng);
          setLoading(true);
          geocoder.geocode({ location: latLng }, (results, status) => {
            setLoading(false);
            if (status === "OK" && results[0]) {
              const isUK = results[0].address_components.some(c => c.short_name === "GB" || c.long_name === "United Kingdom");
              if (!isUK) {
                setSelectedAddr("❌ Service is exclusively available in the UK");
                setSelectedGeo(null);
                return;
              }
              setSelectedAddr(results[0].formatted_address);
              setSelectedGeo({ lat: latLng.lat(), lng: latLng.lng(), name: results[0].formatted_address });
            } else {
              setSelectedAddr("❌ Unknown location");
              setSelectedGeo(null);
            }
          });
        };

        mapListener = m.addListener("click", (e) => handleSelect(e.latLng));
        markerListener = mk.addListener("dragend", (e) => handleSelect(e.latLng));

        if (initialSearch) {
          geocoder.geocode({ address: initialSearch }, (results, status) => {
            if (status === "OK" && results[0]) {
              m.setCenter(results[0].geometry.location);
              m.setZoom(14);
              handleSelect(results[0].geometry.location);
            }
          });
        }

        if (window.google?.maps?.places && searchInputRef.current) {
          const ac = new window.google.maps.places.Autocomplete(searchInputRef.current, {
            componentRestrictions: { country: "gb" },
            fields: ["formatted_address", "geometry", "name"],
          });
          ac.bindTo("bounds", m);
          acListener = ac.addListener("place_changed", () => {
            const p = ac.getPlace();
            if (!p.geometry || !p.geometry.location) return;
            m.setCenter(p.geometry.location);
            m.setZoom(14);
            handleSelect(p.geometry.location);
          });
        }
      }, 400); // 400ms delay to ensure modal animation is fully complete
    }

    return () => {
      if (mapListener) window.google?.maps?.event?.removeListener(mapListener);
      if (markerListener) window.google?.maps?.event?.removeListener(markerListener);
      if (acListener) window.google?.maps?.event?.removeListener(acListener);
    };
  }, [isOpen, mapRef, initialSearch]);

  if (!isOpen) return null;

  return (
    <div style={{ position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(13,14,72,0.45)",backdropFilter:"blur(4px)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div className="fade-up" style={{ width:"100%",maxWidth:600,maxHeight:"90vh",background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 20px 50px rgba(0,0,0,0.3)", display:"flex", flexDirection:"column" }}>
        
        {/* Header */}
        <div style={{ padding:"16px 20px",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center", flexShrink:0 }}>
          <div style={{ fontWeight:700,color:PX.navy800,fontSize:16, display:"flex", alignItems:"center", gap:6 }}><SvgMapPinRed /> Pinpoint Location</div>
          <button type="button" onClick={onClose} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:PX.gray400,lineHeight:1, display:"flex", alignItems:"center" }}><SvgClose size={18} /></button>
        </div>

        {/* Search Bar */}
        <div style={{ padding:"12px 20px", borderBottom:"1px solid #e2e8f0", background: "#f8fafc", flexShrink:0 }}>
          <div style={{ background:"#fff",padding:"10px 16px",borderRadius:8,border:`1.5px solid #fee2e2`,boxShadow:"0 2px 4px rgba(0,0,0,.02)",display:"flex",alignItems:"center",gap:8 }}>
            {loading ? <span className="spinning" style={{color:PX.navy800}}>⟳</span> : <SvgMapPinRed />}
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search for a location or click map to drop pin..." 
              value={selectedAddr} 
              onChange={e => setSelectedAddr(e.target.value)}
              style={{ flex:1, border:"none", outline:"none", fontSize:14, fontWeight:500, color:PX.navy800, background:"transparent", width:"100%" }}
            />
          </div>
        </div>

        {/* Map Container (Flexible Height) */}
        <div style={{ position:"relative", flex:1, minHeight: 250, height: 360 }}>
          <div ref={mapRef} style={{ position: "absolute", top:0, left:0, right:0, bottom:0, background:PX.gray100 }}/>
        </div>

        {/* Footer */}
        <div style={{ padding:"16px 20px",display:"flex",justifyContent:"flex-end",gap:12,background:PX.gray50,borderTop:"1px solid #e2e8f0", flexShrink:0 }}>
          <button type="button" onClick={onClose} style={{ padding:"8px 16px",borderRadius:8,border:`1px solid ${PX.gray200}`,background:"#fff",cursor:"pointer",fontWeight:600,color:PX.gray600 }}>Cancel</button>
          <button type="button" onClick={()=>{ if(selectedGeo) onConfirm(selectedAddr, selectedGeo); }} disabled={!selectedGeo} style={{ padding:"8px 16px",borderRadius:8,border:"none",background:PX.navy800,color:"#fff",cursor:selectedGeo?"pointer":"not-allowed",fontWeight:600,opacity:selectedGeo?1:0.5 }}>Confirm Location</button>
        </div>

      </div>
    </div>
  );
}

// ── Places Autocomplete Input ─────────────────────────────────────────────────
function PlacesInput({ value, onChange, placeholder, icon, mapsLoaded, onIconClick }) {
  const inputRef = useRef(null);
  const acRef = useRef(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [localVal, setLocalVal] = useState(value || "");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLocalVal(value || "");
  }, [value]);

  useEffect(() => {
    if (!mapsLoaded || !inputRef.current || acRef.current) return;
    let listener;
    try {
      acRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "gb" },
        fields: ["formatted_address", "geometry", "name"],
      });
      listener = acRef.current.addListener("place_changed", () => {
        const p = acRef.current.getPlace();
        let addr = p.formatted_address || "";
        if (p.name && !addr.toLowerCase().includes(p.name.toLowerCase())) {
          addr = p.name + (addr ? ", " + addr : "");
        }
        if (!addr) addr = p.name || "";
        const lat = p.geometry?.location?.lat();
        const lng = p.geometry?.location?.lng();
        setLocalVal(addr);
        onChange(addr, lat && lng ? { lat, lng, name: addr } : null);
      });
    } catch (_) {}

    return () => {
      if (listener) {
        window.google?.maps?.event?.removeListener(listener);
      }
      if (window.google?.maps?.event?.clearInstanceListeners && acRef.current) {
        window.google.maps.event.clearInstanceListeners(acRef.current);
      }
      acRef.current = null;
    };
  }, [mapsLoaded]);

  const handleTextChange = (val) => {
    setLocalVal(val);
    onChange(val, null);
  };

  const handleBlur = () => {
    if (localVal !== value) {
      onChange(localVal, null);
    }
  };

  return (
    <div style={{ position:"relative" }}>
      <button type="button" onClick={()=>{ if (onIconClick) onIconClick(); else setPickerOpen(true); }} title="Choose on map"
        style={{ position:"absolute", left:6, top:"50%", transform:"translateY(-50%)",
          display:"flex", alignItems:"center", zIndex:1, background:"none", border:"none", cursor:"pointer",
          padding:"6px", borderRadius:6, transition:"background .15s" }}
        onMouseOver={e=>e.currentTarget.style.background="#f1f5f9"} onMouseOut={e=>e.currentTarget.style.background="none"}>
        {icon}
      </button>
      <input ref={inputRef} type="text" placeholder={placeholder} value={localVal}
        style={{ paddingLeft:38, paddingRight: 12 }} 
        onChange={e => handleTextChange(e.target.value)}
        onBlur={handleBlur}
      />
      {mounted && typeof document !== 'undefined' ? createPortal(
        <MapPickerModal isOpen={pickerOpen} onClose={()=>setPickerOpen(false)} 
          initialSearch={localVal} onConfirm={(addr, geo)=>{ setLocalVal(addr); onChange(addr, geo); setPickerOpen(false); }} />,
        document.body
      ) : null}
    </div>
  );
}

function InlineDepotMap({ depotLoc, setDepotLoc, mapsLoaded }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !window.google?.maps) return;

    const initialLat = Number(depotLoc.lat) || 52.5863;
    const initialLng = Number(depotLoc.lng) || -1.9817;

    const m = new window.google.maps.Map(mapRef.current, {
      zoom: 13,
      center: { lat: initialLat, lng: initialLng },
      disableDefaultUI: true,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    const mk = new window.google.maps.Marker({
      map: m,
      position: { lat: initialLat, lng: initialLng },
      draggable: true,
      title: "Depot/Yard Location",
    });

    setMap(m);
    setMarker(mk);

    const geocoder = new window.google.maps.Geocoder();

    const updateLocation = (latLng) => {
      const lat = latLng.lat();
      const lng = latLng.lng();
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          setDepotLoc({
            address: results[0].formatted_address,
            lat,
            lng
          });
        } else {
          setDepotLoc(prev => ({
            ...prev,
            lat,
            lng
          }));
        }
      });
    };

    m.addListener("click", (e) => {
      mk.setPosition(e.latLng);
      updateLocation(e.latLng);
    });

    mk.addListener("dragend", (e) => {
      updateLocation(e.latLng);
    });

    return () => {
      window.google.maps.event.clearInstanceListeners(m);
      window.google.maps.event.clearInstanceListeners(mk);
    };
  }, [mapsLoaded]);

  // Center and update marker when depotLoc changes from external (e.g. typing in input)
  useEffect(() => {
    if (!map || !marker || !depotLoc.lat || !depotLoc.lng) return;
    const latLng = new window.google.maps.LatLng(Number(depotLoc.lat), Number(depotLoc.lng));
    marker.setPosition(latLng);
    map.panTo(latLng);
  }, [depotLoc.lat, depotLoc.lng, map, marker]);

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      {!mapsLoaded && (
        <div style={{ position: "absolute", inset: 0, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: PX.gray500 }}>
          Loading Map...
        </div>
      )}
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}


// ── UK Cities fallback geocoder ───────────────────────────────────────────────
const UK_CITIES = {
  "walsall":[52.5863,-1.9817],"london":[51.5074,-0.1278],"birmingham":[52.4862,-1.8904],
  "manchester":[53.4808,-2.2426],"liverpool":[53.4084,-2.9916],"leeds":[53.8008,-1.5491],
  "sheffield":[53.3811,-1.4701],"bristol":[51.4545,-2.5879],"edinburgh":[55.9533,-3.1883],
  "glasgow":[55.8642,-4.2518],"cardiff":[51.4816,-3.1791],"nottingham":[52.9548,-1.1581],
  "leicester":[52.6369,-1.1398],"coventry":[52.4068,-1.5197],"derby":[52.9225,-1.4746],
  "newcastle":[54.9783,-1.6178],"oxford":[51.7520,-1.2577],"cambridge":[52.2053,0.1218],
  "brighton":[50.8225,-0.1372],"portsmouth":[50.8198,-1.0880],"southampton":[50.9097,-1.4044],
  "exeter":[50.7184,-3.5339],"plymouth":[50.3755,-4.1427],"norwich":[52.6309,1.2974],
  "wolverhampton":[52.5870,-2.1288],"stoke":[53.0027,-2.1794],"chester":[53.1905,-2.8910],
  "york":[53.9590,-1.0815],"bath":[51.3758,-2.3599],"luton":[51.8787,-0.4200],
  "reading":[51.4543,-0.9781],"blackpool":[53.8175,-3.0357],"bradford":[53.7960,-1.7594],
  "hull":[53.7676,-0.3274],"swindon":[51.5558,-1.7797],"northampton":[52.2405,-0.9027],
  "milton keynes":[52.0406,-0.7594],"worcester":[52.1920,-2.2200],"gloucester":[51.8642,-2.2380],
};
const YARD_GEO = { lat:52.5863, lng:-1.9817, name:"Walsall Yard (Base)" };

function geocode(place) {
  if (!place) return null;
  if (typeof place === "object" && place.lat != null) return place;
  const l = String(place).toLowerCase().trim();
  for (const [k,v] of Object.entries(UK_CITIES))
    if (l.includes(k)) return { lat:v[0], lng:v[1], name:String(place) };
  let h = 0;
  for (let i=0;i<l.length;i++) h=((h<<5)-h+l.charCodeAt(i))|0;
  return { lat:51.4+(Math.abs(h)%600)/200, lng:-2.2+(Math.abs(h>>8)%500)/180, name:String(place) };
}

function haversineKm(a, b) {
  if (!a||!b) return 60;
  const R=6371, dLa=(b.lat-a.lat)*Math.PI/180, dLo=(b.lng-a.lng)*Math.PI/180;
  const s=Math.sin(dLa/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLo/2)**2;
  return R*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s))*1.32;
}

// ── Default database ──────────────────────────────────────────────────────────
const DEFAULT_DB = {
  googleApiKey: "",
  vehicles: [
    { id:"minibus", name:"Executive Minibus", emoji:"minibus", desc:"Small groups & airport transfers",
      capacity:16, fleetCount:2, utilisationDays:225,
      annualCosts:[
        { id:1, label:"Vehicle Excise Duty (VED)",  cost:580  },
        { id:2, label:"Annual Insurance",            cost:3200 },
        { id:3, label:"Annual Depreciation",         cost:7975 },
      ],
      fuelKpl:9.5, maintenanceCostPerKm:0.08, tyreSetCost:1200, expectedTyreLifeKm:60000 },

    { id:"bus", name:"Standard Bus", emoji:"bus", desc:"Mid-size groups & day trips",
      capacity:35, fleetCount:2, utilisationDays:225,
      annualCosts:[
        { id:1, label:"Vehicle Excise Duty (VED)",  cost:820  },
        { id:2, label:"Annual Insurance",            cost:5800 },
        { id:3, label:"Annual Depreciation",         cost:13220 },
      ],
      fuelKpl:7.2, maintenanceCostPerKm:0.12, tyreSetCost:2800, expectedTyreLifeKm:80000 },

    { id:"coach", name:"Premium Coach", emoji:"coach", desc:"Full-size luxury for large groups",
      capacity:53, fleetCount:1, utilisationDays:225,
      annualCosts:[
        { id:1, label:"Vehicle Excise Duty (VED)",  cost:1150  },
        { id:2, label:"Annual Insurance",            cost:9200  },
        { id:3, label:"Annual Depreciation",         cost:23317 },
      ],
      fuelKpl:5.8, maintenanceCostPerKm:0.15, tyreSetCost:5200, expectedTyreLifeKm:100000 },
  ],
  globalVars: {
    fuelPricePerLitre:1.52, driverHourlyWage:17.50,
    holidayPayPct:12.07,    profitMarginPct:28,
  },
  annualOverheads: [
    { id:1, label:"Office & premises rent",        cost:18000 },
    { id:2, label:"Administration & staffing",     cost:14400 },
    { id:3, label:"Accountancy & legal",           cost:5200  },
    { id:4, label:"IT, phones & communications",   cost:2400  },
    { id:5, label:"Marketing & website",           cost:3600  },
    { id:6, label:"Fleet operator licence & fees", cost:1800  },
    { id:7, label:"Miscellaneous overheads",       cost:4600  },
  ],
  surcharges: {
    m6Toll:6.50, dartford:2.50, ulez:12.50,
    birminghamCaz:9.00, driverOvernightSubsistence:55.00,
  },
  blockedDates: [],
};

// ── Fleet economics engine ────────────────────────────────────────────────────
function fleetEconomics(db) {
  const companyOverheads = db.annualOverheads.reduce((s,o) => s + Number(o.cost), 0);
  const totalFleetUnits  = db.vehicles.reduce((s,v) => s + (Number(v.fleetCount)||1), 0);
  const overheadPerUnit  = totalFleetUnits > 0 ? companyOverheads / totalFleetUnits : 0;

  const vehicleBreakdown = db.vehicles.map(v => {
    const count      = Number(v.fleetCount) || 1;
    const utilDays   = Number(v.utilisationDays) || 225;
    const totalAnnualFixed = (v.annualCosts||[]).reduce((s,c) => s + Number(c.cost), 0);
    const annualFixed = totalAnnualFixed / count;
    const dailyStanding = utilDays > 0 ? annualFixed / utilDays : 0;
    const dailyOverhead = utilDays > 0 ? overheadPerUnit / utilDays : 0;
    const minHirePerDay = dailyStanding + dailyOverhead;

    return {
      id: v.id, name: v.name, emoji: v.emoji,
      count, utilDays, annualFixed,
      totalFixed:     Math.round(annualFixed * count),
      dailyStanding:  Math.round(dailyStanding  * 100) / 100,
      dailyOverhead:  Math.round(dailyOverhead   * 100) / 100,
      minHirePerDay:  Math.round(minHirePerDay   * 100) / 100,
      utilRate:       Math.round((utilDays / 365) * 100),
    };
  });

  const totalVehicleFixed = vehicleBreakdown.reduce((s,v) => s + v.totalFixed, 0);
  const grandTotal        = totalVehicleFixed + companyOverheads;

  return {
    vehicleBreakdown, companyOverheads, overheadPerUnit: Math.round(overheadPerUnit),
    totalFleetUnits, grandTotal,
  };
}

// ── Costing engine ────────────────────────────────────────────────────────────
function buildChain(type, pts, depotGeo) {
  if (pts.length < 2) return [];
  const o = pts[0], d = pts[pts.length-1];
  if (type === "one-way") {
    const legs = [{ from:depotGeo, to:o, dead:true, label:"Yard → Pickup" }];
    for (let i=0; i<pts.length-1; i++) legs.push({ from:pts[i], to:pts[i+1], dead:false, label:`Leg ${i+1}` });
    legs.push({ from:d, to:depotGeo, dead:true, label:"Drop-off → Yard" });
    return legs;
  }
  if (type === "return") return [
    { from:depotGeo, to:o, dead:true,  label:"Yard → Pickup" },
    { from:o, to:d,        dead:false, label:"Outbound"       },
    { from:d, to:o,        dead:false, label:"Return leg"     },
    { from:o, to:depotGeo, dead:true,  label:"Return → Yard"  },
  ];
  const legs = [{ from:depotGeo, to:pts[0], dead:true, label:"Yard → First stop" }];
  for (let i=0; i<pts.length-1; i++) legs.push({ from:pts[i], to:pts[i+1], dead:false, label:`Stop ${i+1}→${i+2}` });
  legs.push({ from:pts[pts.length-1], to:depotGeo, dead:true, label:"Last stop → Yard" });
  return legs;
}

function calcFare(journey, vehicle, db) {
  const { journeyType, waypoints, departureDate, returnDate, waitingMins } = journey;
  const { globalVars:gv, surcharges:sr } = db;

  const pts = waypoints.map((w,i) =>
    (journey.wpCoords?.[i]) ? journey.wpCoords[i] : geocode(w)
  ).filter(Boolean);
  if (pts.length < 2) return null;

  const depotGeo = {
    lat: Number(gv.yardLat) || 52.5863,
    lng: Number(gv.yardLng) || -1.9817,
    name: gv.yardAddress || "Walsall Yard (Base)"
  };

  const chain    = buildChain(journeyType, pts, depotGeo);
  const totalKm  = chain.reduce((s,c) => s + haversineKm(c.from,c.to), 0);
  const revKm    = chain.filter(c=>!c.dead).reduce((s,c) => s + haversineKm(c.from,c.to), 0);
  // We use 78 km/h or 48.5 mph but realistically, 60km/h is closer to actual bus speeds. 
  // However, since this is a UI fallback, we will just divide by 65 km/h to approximate better.
  const drivHrs = totalKm / (gv?.distanceUnit === "miles" ? 40 : 65);
  const waitHrs  = (Number(waitingMins)||0) / 60;
  const shiftHrs = drivHrs + waitHrs;
  const dualCrew = shiftHrs > 9;

  let opDays = 1;
  const multiDay = returnDate && departureDate && new Date(returnDate) > new Date(departureDate);
  if (multiDay) opDays = Math.max(1, Math.ceil((new Date(returnDate).getTime() - new Date(departureDate).getTime()) / 86400000) + 1);

  const totalAnnualFixed = (vehicle.annualCosts||[]).reduce((s,c) => s + Number(c.cost), 0);
  const fleetCount = vehicle.fleetCount || 1;
  const annualFixed = totalAnnualFixed / fleetCount;
  const rStanding   = annualFixed / (vehicle.utilisationDays || 225);

  const fuelPerKm  = (vehicle.fuelPricePerLitre ?? gv.fuelPricePerLitre) / vehicle.fuelKpl;
  const tyrePerKm  = vehicle.tyreCostPerKm ?? (vehicle.tyreSetCost / vehicle.expectedTyreLifeKm);
  const cRunning   = fuelPerKm + tyrePerKm + vehicle.maintenanceCostPerKm;

  const baseWage   = (vehicle.driverHourlyWage ?? gv.driverHourlyWage) * shiftHrs * opDays;
  const holPay     = baseWage * ((vehicle.holidayPayPct ?? gv.holidayPayPct) / 100);
  const driverCost = (baseWage + holPay) * (dualCrew ? 2 : 1);

  let surchargeTotal=0, surchargeLines=[];
  const goesLondon   = pts.some(p=>haversineKm(p,{lat:51.5074,lng:-0.1278})<40);
  const goesBirm     = pts.some(p=>haversineKm(p,{lat:52.4862,lng:-1.8904})<14) && !pts.every(p=>haversineKm(p,{lat:52.4862,lng:-1.8904})<14);
  const goesDartford = pts.some(p=>haversineKm(p,{lat:51.46,lng:0.30})<18);
  const goesM6       = pts.some(p=>p.lat>53.2) && pts.some(p=>p.lat<52.8) && pts.some(p=>p.lng>-2.3&&p.lng<-1.5);
  if (goesLondon)   { surchargeTotal+=sr.ulez;          surchargeLines.push({label:"London ULEZ / CAZ",cost:sr.ulez}); }
  if (goesBirm)     { surchargeTotal+=sr.birminghamCaz; surchargeLines.push({label:"Birmingham CAZ",cost:sr.birminghamCaz}); }
  if (goesDartford) { surchargeTotal+=sr.dartford;       surchargeLines.push({label:"Dartford Crossing",cost:sr.dartford}); }
  if (goesM6)       { surchargeTotal+=sr.m6Toll;         surchargeLines.push({label:"M6 Toll (PSV)",cost:sr.m6Toll}); }
  if (multiDay && opDays>1) {
    const sub = sr.driverOvernightSubsistence*(opDays-1);
    surchargeTotal+=sub; surchargeLines.push({label:`Driver subsistence ×${opDays-1}`,cost:sub});
  }

  const subtotal = (rStanding*opDays) + (cRunning*totalKm) + driverCost + surchargeTotal;
  const eco      = fleetEconomics(db);
  const vEco     = eco.vehicleBreakdown.find(b => b.id === vehicle.id);
  const minHire  = vEco ? vEco.minHirePerDay : 0;
  let finalPrice = subtotal * (1 + (vehicle.profitMarginPct ?? gv.profitMarginPct)/100);
  const belowMin = finalPrice < minHire;
  if (belowMin) finalPrice = minHire;

  return {
    totalKm:Math.round(totalKm), revenueKm:Math.round(revKm),
    totalShiftHrs:Math.round(shiftHrs*10)/10, opDays, dualCrew, belowMin,
    rStanding:Math.round(rStanding*100)/100,
    cRunning:Math.round(cRunning*1000)/1000,
    fuelCost:Math.round(fuelPerKm*totalKm*100)/100,
    standingCost:Math.round(rStanding*opDays*100)/100,
    driverCost:Math.round(driverCost*100)/100,
    surchargeLines, surchargeTotal:Math.round(surchargeTotal*100)/100,
    subtotal:Math.round(subtotal*100)/100,
    finalPrice:Math.round(finalPrice*100)/100,
    minHire, chain, pts,
  };
}

// ── UI Atoms ──────────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant="primary", size="md", disabled, full, style:sx={} }) {
  const v = {
    primary: {background:PX.brandRed,  color:"#fff", border:"none"},
    amber:   {background:PX.amber500,  color:"#fff", border:"none"},
    ghost:   {background:"transparent",color:PX.navy800, border:`1px solid ${PX.gray300}`},
    teal:    {background:PX.teal700,   color:"#fff", border:"none"},
    danger:  {background:PX.red700,    color:"#fff", border:"none"},
  };
  const pad = size==="sm" ? "7px 16px" : size==="lg" ? "12px 28px" : "9px 20px";
  const fs  = size==="sm" ? 12 : size==="lg" ? 14.5 : 13;
  return (
    <button onClick={!disabled?onClick:undefined} disabled={disabled}
      style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6,
        cursor:disabled?"not-allowed":"pointer", fontWeight:700, borderRadius:6,
        transition:"all .2s cubic-bezier(0.4, 0, 0.2, 1)", letterSpacing:.3, opacity:disabled?.55:1,
        padding:pad, fontSize:fs, width:full?"100%":"auto",
        boxShadow: variant==="primary" && !disabled ? "0 4px 12px rgba(205,32,44,0.18)" :
                   variant==="teal"    && !disabled ? "0 4px 12px rgba(12,110,85,0.15)" : "none",
        ...v[variant], ...sx }}
      onMouseEnter={e=>{ if(!disabled){ e.currentTarget.style.opacity=".9"; e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow = variant==="primary" ? "0 6px 16px rgba(205,32,44,0.24)" : variant==="teal" ? "0 6px 16px rgba(12,110,85,0.22)" : "none"; } }}
      onMouseLeave={e=>{ if(!disabled){ e.currentTarget.style.opacity="1";   e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow = variant==="primary" ? "0 4px 12px rgba(205,32,44,0.18)" : variant==="teal" ? "0 4px 12px rgba(12,110,85,0.15)" : "none"; } }}>
      {children}
    </button>
  );
}

function Card({ children, style={} }) {
  return (
    <div style={{ 
      background: "#ffffff", 
      borderRadius: 12, 
      padding: "1.5rem",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(13, 14, 72, 0.03)",
      border: `1px solid rgba(226, 232, 240, 0.8)`, 
      ...style 
    }}>
      {children}
    </div>
  );
}

function SectionHead({ children, sub, light = false }) {
  return (
    <div style={{ marginBottom:"1.25rem" }}>
      <h2 style={{ fontSize:17, fontWeight:800, color: light ? "#fff" : PX.navy800, letterSpacing:.5, textTransform:"uppercase" }}>{children}</h2>
      {sub && <p style={{ fontSize:12.5, color: light ? "rgba(255,255,255,0.65)" : PX.gray600, marginTop:5, fontWeight:500 }}>{sub}</p>}
    </div>
  );
}

function Field({ label, required, children, hint }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ display:"block", fontSize:11, fontWeight:800, color:PX.gray600, textTransform:"uppercase", letterSpacing:.35 }}>
        {label}{required && <span style={{ color:PX.brandRed, marginLeft:2 }}>*</span>}
      </label>}
      {children}
      {hint && <p style={{ fontSize:11, color:PX.gray400, marginTop:2 }}>{hint}</p>}
    </div>
  );
}

function Badge({ children, color="blue" }) {
  const C = {
    blue:  {bg:"#eff6ff", tx:"#1e40af", border:"1px solid #bfdbfe"},
    amber: {bg:"#fffbeb", tx:"#b45309", border:"1px solid #fef3c7"},
    red:   {bg:"#fef2f2", tx:PX.red700, border:"1px solid #fee2e2"},
    green: {bg:"#f0fdf4", tx:"#15803d", border:"1px solid #bbf7d0"},
    gray:  {bg:"#f8fafc", tx:"#475569", border:"1px solid #e2e8f0"}
  };
  const c = C[color]||C.blue;
  return <span style={{ 
    display:"inline-flex", 
    alignItems:"center", 
    fontSize:10.5, 
    fontWeight:700,
    padding:"3px 8px", 
    borderRadius:6, 
    background:c.bg, 
    color:c.tx, 
    border:c.border,
    letterSpacing: "0.2px",
    textTransform: "uppercase",
    whiteSpace:"nowrap" 
  }}>{children}</span>;
}

function Divider({ label }) {
  return <div style={{ display:"flex", alignItems:"center", gap:12, margin:"1.5rem 0" }}>
    <div style={{ flex:1, height:1, background:"#e2e8f0" }}/>
    {label && <span style={{ fontSize:10.5, fontWeight: 800, color:PX.gray400, textTransform:"uppercase", letterSpacing: 1 }}>{label}</span>}
    <div style={{ flex:1, height:1, background:"#e2e8f0" }}/>
  </div>;
}

function fmt(n)  { return Number(n).toLocaleString("en-GB",{minimumFractionDigits:2,maximumFractionDigits:2}); }
function fmtK(n) { return "£"+Number(n).toLocaleString("en-GB"); }

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ pct, color }) {
  return <div style={{ height:6, background:PX.gray200, borderRadius:10, overflow:"hidden" }}>
    <div style={{ width:`${Math.min(100,pct)}%`, height:"100%", background:color, borderRadius:10, transition:"width .4s" }}/>
  </div>;
}

// ── Route map ─────────────────────────────────────────────────────────────────
function GoogleMapPreview({ result, gv }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    if (window.google?.maps && mapRef.current && !map) {
      const m = new window.google.maps.Map(mapRef.current, {
        zoom: 7,
        center: { lat: 52.5, lng: -1.5 },
        disableDefaultUI: true,
      });
      const renderer = new window.google.maps.DirectionsRenderer({ map: m });
      setMap(m);
      setDirectionsRenderer(renderer);
    }
  }, [mapRef]);

  useEffect(() => {
    if (map && directionsRenderer && window.google?.maps && result?.pts && result.pts.length >= 2) {
      const directionsService = new window.google.maps.DirectionsService();
      
      const pts = result.pts;
      const origin = new window.google.maps.LatLng(pts[0].lat, pts[0].lng);
      const destination = new window.google.maps.LatLng(pts[pts.length - 1].lat, pts[pts.length - 1].lng);
      
      const waypoints = pts.slice(1, -1).map(pt => ({
        location: new window.google.maps.LatLng(pt.lat, pt.lng),
        stopover: true
      }));

      directionsService.route(
        {
          origin,
          destination,
          waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(response);
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );
    }
  }, [map, directionsRenderer, result]);

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: 320, borderRadius: 12, border: `1.5px solid ${PX.gray200}` }}></div>
      {result && <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8, marginTop:12 }}>
        {[["Total route",result.totalKm+" "+(gv?.distanceUnit === "miles" ? "mi" : "km")],["Live km",result.revenueKm+" "+(gv?.distanceUnit === "miles" ? "mi" : "km")],
          ["Duration",result.totalShiftHrs+"h"],["Est. Days",result.opDays]].map(([l,v])=>(
          <div key={l} style={{ background:PX.gray50, border:`1px solid ${PX.gray200}`, borderRadius:8, padding:"8px", textAlign:"center" }}>
            <div style={{ fontSize:10, fontWeight:700, color:PX.gray400, textTransform:"uppercase", marginBottom:2 }}>{l}</div>
            <div style={{ fontSize:13, fontWeight:800, color:PX.navy800 }}>{v}</div>
          </div>
        ))}
      </div>}
    </div>
  );
}

function RouteMap({ result, journey, gv }) {
  if (window.google?.maps && result?.pts?.length >= 2) return <GoogleMapPreview result={result} gv={gv} />;

  if (!result?.pts?.length || result.pts.length < 2)
    return <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", height:320, gap:10, color:PX.gray400, border:`1.5px dashed ${PX.gray200}`, borderRadius:12 }}>
      <SvgMap size={36} color={PX.gray400} />
      <p style={{ fontSize:13, fontWeight:500 }}>Enter pickup & drop-off locations to generate route map</p>
    </div>;

  const W=370, H=310, PAD=32;
  const { pts, chain } = result;
  const all = [YARD_GEO, ...pts];
  const lats=all.map(p=>p.lat), lngs=all.map(p=>p.lng);
  const minLat=Math.min(...lats)-.9, maxLat=Math.max(...lats)+.9;
  const minLng=Math.min(...lngs)-.9, maxLng=Math.max(...lngs)+.9;
  const tx=lng=>((lng-minLng)/(maxLng-minLng))*(W-PAD*2)+PAD;
  const ty=lat=>(1-(lat-minLat)/(maxLat-minLat))*(H-PAD*2)+PAD;
  const segs=chain.map(s=>({ x1:tx(s.from.lng), y1:ty(s.from.lat), x2:tx(s.to.lng), y2:ty(s.to.lat), dead:s.dead }));
  const named=[
    { geo:YARD_GEO, color:PX.navy800, label:"Walsall Base", yard:true },
    ...pts.map((p,i)=>({ geo:p, color:i===0?PX.teal700:i===pts.length-1?PX.brandRed:PX.navy600,
      label:(p.name||"").split(",")[0].substring(0,16), yard:false })),
  ];
  return <div>
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display:"block", background:PX.gray50, borderRadius:12, border:`1.5px solid ${PX.gray200}` }}>
      <defs>
        <marker id="a1" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M1,1 L6,3.5 L1,6Z" fill={PX.navy600}/>
        </marker>
        <marker id="a2" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <path d="M1,1 L6,3.5 L1,6Z" fill="#c8d0e0"/>
        </marker>
      </defs>
      {[0,1,2,3,4,5].map(i=>(
        <g key={i}>
          <line x1={PAD} y1={PAD+i*(H-PAD*2)/5} x2={W-PAD} y2={PAD+i*(H-PAD*2)/5} stroke="#edf0f7" strokeWidth="1"/>
          <line x1={PAD+i*(W-PAD*2)/5} y1={PAD} x2={PAD+i*(W-PAD*2)/5} y2={H-PAD} stroke="#edf0f7" strokeWidth="1"/>
        </g>
      ))}
      {segs.map((s,i)=>(
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke={s.dead?"#cbd5e1":PX.navy600} strokeWidth={s.dead?1.5:2.5}
          strokeDasharray={s.dead?"6,4":"none"} markerEnd={s.dead?"url(#a2)":"url(#a1)"} strokeLinecap="round"/>
      ))}
      {named.map((p,i)=>{
        const x=tx(p.geo.lng), y=ty(p.geo.lat), above=y<H/2;
        return <g key={i}>
          {p.yard
            ? <polygon points={`${x},${y-8} ${x+8},${y} ${x},${y+8} ${x-8},${y}`} fill={p.color} stroke="#fff" strokeWidth={2}/>
            : <circle cx={x} cy={y} r={6} fill={p.color} stroke="#fff" strokeWidth={2}/>}
          <text x={x} y={above?y+17:y-11} textAnchor="middle" fontSize={9.5} fill="#374151" fontWeight="600">
            {p.label.length>16?p.label.substring(0,14)+"…":p.label}
          </text>
        </g>;
      })}
    </svg>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8, marginTop:12 }}>
      {[["Total route",`${result.totalKm} ${gv?.distanceUnit === "miles" ? "mi" : "km"}`],["Revenue km",`${result.revenueKm} ${gv?.distanceUnit === "miles" ? "mi" : "km"}`],
        ["Duration",`${result.totalShiftHrs}h`],["Days",result.opDays]].map(([l,v])=>(
        <div key={l} style={{ background:PX.gray50, border:`1px solid ${PX.gray200}`, borderRadius:8, padding:"8px", textAlign:"center" }}>
          <div style={{ fontSize:10, fontWeight:700, color:PX.gray400, textTransform:"uppercase", marginBottom:2 }}>{l}</div>
          <div style={{ fontSize:13, fontWeight:800, color:PX.navy700 }}>{v}</div>
        </div>
      ))}
    </div>
    <div style={{ display:"flex", gap:14, marginTop:10, justifyContent:"center", fontSize:11, color:PX.gray600 }}>
      <span style={{ display:"flex",alignItems:"center",gap:5 }}><span style={{ width:12,height:3,background:PX.navy600,borderRadius:2,display:"inline-block" }}/>Live Route</span>
      <span style={{ display:"flex",alignItems:"center",gap:5 }}><span style={{ width:12,height:1.5,background:"#cbd5e1",borderRadius:2,borderTop:"1.5px dashed #cbd5e1",display:"inline-block" }}/>Dead Mileage</span>
      <span style={{ display:"flex",alignItems:"center",gap:5 }}><span style={{ width:8,height:8,background:PX.navy800,transform:"rotate(45deg)",display:"inline-block" }}/>Depot</span>
    </div>
  </div>;
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <header style={{ background: PX.navy800, borderTop: `4px solid ${PX.brandRed}`, position:"sticky", top:0, zIndex:100, boxShadow:"0 4px 20px rgba(0,0,0,.15)" }}>
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 1.5rem",
        display:"flex", alignItems:"center", justifyContent:"space-between", height:72 }}>
        
        {/* Logo and Brand Title */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <SvgCoach size={28} color={PX.brandRed} />
          <div>
            <div style={{ color:"#fff", fontFamily:"'Outfit', sans-serif", fontWeight:900, fontSize:19, letterSpacing:-0.3, lineHeight:1.1 }}>Carolean Coaches</div>
            <div style={{ color: PX.amber500, fontSize:9, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase", marginTop: 1 }}>Premium Travel</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ── VehicleCard (Step 2 equivalent) ──────────────────────────────────────────
function VehicleCard({ vehicle, result, selected, onSelect, passengers, suitcaseCount, handbagCount }) {
  const requiredVehicles = Math.ceil((passengers || 1) / (vehicle.capacity || 1));
  const totalCapacity = (vehicle.capacity || 1) * requiredVehicles;
  const paxOk = requiredVehicles === 1;
  const lugOk = true;
  const ok=true, isSel=selected===vehicle.id;
  const pct=Math.min(100,Math.round((passengers/totalCapacity)*100));
  const capColor=pct>85?PX.red700:pct>65?PX.amber500:PX.teal700;

  const lugParts = [];
  if (suitcaseCount > 0) lugParts.push(`${suitcaseCount} suitcase${suitcaseCount!==1?"s":""}`);
  if (handbagCount > 0) lugParts.push(`${handbagCount} hand carry`);
  const lugLabel = lugParts.length > 0 ? lugParts.join(" & ") : "Zero baggage";

  const renderVehicleIcon = () => {
    const col = isSel ? PX.brandRed : PX.navy800;
    const iconType = vehicle.emoji || vehicle.id || "";
    if (iconType === "minibus") return <SvgMinibus size={30} color={col} />;
    if (iconType === "coach") return <SvgCoach size={30} color={col} />;
    return <SvgBus size={30} color={col} />;
  };

  return (
    <div onClick={()=>ok&&onSelect(vehicle.id)}
      style={{ borderRadius:12, padding:"1.25rem", cursor:ok?"pointer":"default",
        border:`2px solid ${isSel?PX.navy800:PX.gray200}`,
        background:isSel?"#f0f5ff":ok?"#fff":"#f8fafc", opacity:!ok?.5:1,
        transition:"all .2s ease", boxShadow:isSel?"0 4px 12px rgba(13,14,72,0.06)":"none", marginBottom:12 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12 }}>
        <div style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
          <div style={{ width:54,height:54,borderRadius:10,
            background:isSel?"#dbeafe":PX.gray100,
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            {renderVehicleIcon()}
          </div>
          <div>
            <div style={{ fontWeight:800,fontSize:16,color:PX.navy800 }}>{vehicle.name}</div>
            <div style={{ fontSize:12,color:PX.gray600,marginTop:2 }}>{vehicle.desc}</div>
            <div style={{ fontSize:12,color:PX.gray900,marginTop:4,fontWeight:600 }}>
              Up to {vehicle.capacity} seats
            </div>
            <div style={{ fontSize:12,color:PX.gray600,marginTop:2,fontWeight:500 }}>🧳 {lugLabel}</div>
          </div>
        </div>
        <div style={{ textAlign:"right",flexShrink:0 }}>
          {result ? <>
            <div style={{ fontSize:22,fontWeight:800,color:PX.navy800,lineHeight:1 }}>
              £{fmt(result.finalPrice)}
            </div>
            <div style={{ fontSize:11,color:PX.gray400,fontWeight:600,marginTop:2,textTransform:"uppercase" }}>total fare</div>
            {result.belowMin && <div style={{ fontSize:10,color:PX.amber500,marginTop:2,fontWeight:600 }}>▲ Min. hire applied</div>}
          </> : <span style={{ fontSize:13,color:PX.gray400 }}>—</span>}
        </div>
      </div>
      <div style={{ marginTop:12 }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
          <span style={{ fontSize:11,color:PX.gray600,fontWeight:500 }}>Passenger load</span>
          <span style={{ fontSize:11,fontWeight:700,color:capColor }}>{passengers}/{totalCapacity} seats ({pct}%)</span>
        </div>
        <ProgressBar pct={pct} color={capColor}/>
      </div>
      <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginTop:12 }}>
        {isSel && <Badge color="green"><SvgCheck size={10} style={{ marginRight: 3 }} /> Selected</Badge>}
        {!paxOk && <Badge color="amber"><SvgAlert size={10} style={{ marginRight: 3 }} /> {requiredVehicles} Vehicles Required</Badge>}
        {!lugOk && <Badge color="amber">Limited luggage capacity</Badge>}
        {result?.dualCrew && <Badge color="amber">⚡ Dual crew required (9h+)</Badge>}
        {result?.surchargeLines?.map(s=><Badge key={s.label} color="gray">{s.label}</Badge>)}
      </div>
    </div>
  );
}

// ── Admin Dashboard ────────────────────────────────────────────────────────────
function AdminDashboard({ db, setDb, mapsLoaded }) {
  const [tab, setTab]       = useState("pricing");
  const [vehicles, setV]    = useState(db.vehicles.map(v=>({...v})));
  const [activeVehicleId, setActiveVehicleId] = useState(vehicles[0]?.id || "");
  const [selectedWageVehicleId, setSelectedWageVehicleId] = useState(vehicles[0]?.id || "");
  const [gv, setGv]         = useState({...db.globalVars});
  const [depotLoc, setDepotLoc] = useState({ address: gv.yardAddress || "", lat: gv.yardLat, lng: gv.yardLng });
  const [overheads, setOH]  = useState(db.annualOverheads.map(o=>({...o})));
  const [sr, setSr]         = useState({...db.surcharges});
  const [blocks, setBl]     = useState([...db.blockedDates]);
  const [newBlock, setNB]   = useState({id:'', vehicleId:db.vehicles[0]?.id || "",from:"",to:"",reason:"Contract booking"});
  
  const blankTemplate = {id:'', pickupArea:"", dropArea:"", vehicleId:db.vehicles[0]?.id, tripType:"one-way", price:0, radiusKm:15};
  const [newTemplate, setNT] = useState(blankTemplate);

  const blankMatrix = {id:'', pickupArea:"", dropArea:"", tripType:"one-way", vehicleId:db.vehicles[0]?.id, baseFare:0, includedLiveMileage:0, includedDeadMileage:0, waitingChargePerHour:0, extraMileageRate:0, nightRateMultiplier:1, weekendRateMultiplier:1, status:'active'};
  const [newMatrix, setNM] = useState(blankMatrix);

  const blankSeasonal = {id:'', name:"Holiday Surge", startDate:"", endDate:"", multiplier:1.2, status:'active'};
  const [newSeasonal, setNS] = useState(blankSeasonal);
  const [toast, setToast]   = useState("");

  useEffect(() => {
    if (db) {
      if (db.vehicles) {
        setV(db.vehicles.map(v=>({...v})));
        setActiveVehicleId(activeId => {
          if (!activeId || !db.vehicles.some(v => v.id === activeId)) {
            return db.vehicles[0]?.id || "";
          }
          return activeId;
        });
      }
      if (db.globalVars) {
        setGv({...db.globalVars});
        setDepotLoc({ address: db.globalVars.yardAddress || "", lat: db.globalVars.yardLat, lng: db.globalVars.yardLng });
      }
      if (db.annualOverheads) setOH(db.annualOverheads.map(o=>({...o})));
      if (db.surcharges) setSr({...db.surcharges});
      if (db.blockedDates) setBl([...db.blockedDates]);
      if (db.vehicles && db.vehicles[0]) setNB(nb => ({ ...nb, vehicleId: db.vehicles[0].id }));
    }
  }, [db]);

  const [matrixData, setMatrixData] = useState([]);
  const [templatesData, setTemplatesData] = useState([]);
  const [seasonalData, setSeasonalData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [reportDate, setReportDate] = useState("");
  const [searchNameRef, setSearchNameRef] = useState("");
  const [searchVehicle, setSearchVehicle] = useState("");
  const [searchFareFrom, setSearchFareFrom] = useState("");
  const [searchFareTo, setSearchFareTo] = useState("");
  const [searchRoute, setSearchRoute] = useState("");
  const [apisLoaded, setApisLoaded] = useState(false);

  useEffect(() => {
    if (!apisLoaded && (tab === "pricing" || tab === "fleet" || tab === "bookings")) {
      Promise.all([
        fetch('/api/admin/pricing-matrix').then(r=>r.json()).catch(()=>[]),
        fetch('/api/admin/route-templates').then(r=>r.json()).catch(()=>[]),
        fetch('/api/admin/seasonal').then(r=>r.json()).catch(()=>[]),
        fetch('/api/bookings').then(r=>r.json()).catch(()=>({bookings:[]}))
      ]).then(([m, t, s, b]) => {
        setMatrixData(Array.isArray(m) ? m : []);
        setTemplatesData(Array.isArray(t) ? t : []);
        setSeasonalData(Array.isArray(s) ? s : []);
        setBookingsData(b.bookings && Array.isArray(b.bookings) ? b.bookings : []);
        setApisLoaded(true);
      });
    }
  }, [tab, apisLoaded]);

  const filteredBookingsData = useMemo(() => {
    let list = bookingsData;
    if (reportDate) {
      const rd = new Date(reportDate);
      list = list.filter(b => {
        const bd = new Date(b.createdAt);
        return bd.getFullYear() === rd.getFullYear() && bd.getMonth() === rd.getMonth() && bd.getDate() === rd.getDate();
      });
    }
    if (searchNameRef) {
      const q = searchNameRef.toLowerCase().trim();
      list = list.filter(b => 
        String(b.id || '').toLowerCase().includes(q) ||
        String(b.customer?.name || '').toLowerCase().includes(q) ||
        String(b.customer?.email || '').toLowerCase().includes(q) ||
        String(b.customer?.phone || '').toLowerCase().includes(q) ||
        String(b.customer?.company || '').toLowerCase().includes(q)
      );
    }
    if (searchVehicle) {
      const q = searchVehicle.toLowerCase().trim();
      list = list.filter(b => 
        String(b.quote?.vehicle?.name || '').toLowerCase().includes(q)
      );
    }
    if (searchFareFrom || searchFareTo) {
      const fromVal = searchFareFrom !== "" ? parseFloat(searchFareFrom) : null;
      const toVal   = searchFareTo   !== "" ? parseFloat(searchFareTo)   : null;
      list = list.filter(b => {
        const fare = Number(b.quote?.result?.finalPrice || b.quote?.result?.finalFare || 0);
        // Exact match: only From is filled and To is empty
        if (fromVal !== null && toVal === null) return Math.round(fare) === Math.round(fromVal);
        // Range: both filled
        if (fromVal !== null && toVal !== null) return fare >= fromVal && fare <= toVal;
        // Only To filled: fares up to that amount
        if (fromVal === null && toVal !== null) return fare <= toVal;
        return true;
      });
    }
    if (searchRoute) {
      const q = searchRoute.toLowerCase().trim();
      list = list.filter(b => 
        String(b.journey?.origin || '').toLowerCase().includes(q) ||
        String(b.journey?.destination || '').toLowerCase().includes(q)
      );
    }
    
    // Sort the list so it's not random
    let sortedList = [...list];
    if (searchFareFrom || searchFareTo) {
      // Sort numerically by fare when searching by fare
      sortedList.sort((a, b) => {
        const fareA = Number(a.quote?.result?.finalPrice || a.quote?.result?.finalFare || 0);
        const fareB = Number(b.quote?.result?.finalPrice || b.quote?.result?.finalFare || 0);
        return fareA - fareB;
      });
    } else {
      // Sort chronologically by date (newest first) otherwise
      sortedList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return sortedList;
  }, [bookingsData, reportDate, searchNameRef, searchVehicle, searchFareFrom, searchFareTo, searchRoute]);

  const exportBookingsToCSV = () => {
    const unit = db.globalVars?.distanceUnit === 'miles' ? 'mile' : 'km';
    const headers = [
      "Booking ID", "Date", "Customer Name", "Email", "Phone", "Company",
      "Origin", "Destination", "Trip Type", "Vehicle Name", "Passengers",
      "Luggage Type", "Luggage Count", "Distance Unit",
      `Live Mileage (${unit}s)`, `Dead Mileage (${unit}s)`, `Total Mileage (${unit}s)`,
      "Est. Driving Hours", "Waiting Time (mins)", "Total Shift Hours", "Dual Crew?", "Operation Days",
      "Base Standing Cost (£/day)", "Total Standing Cost (£)",
      "Overhead Allocation (£/day)", "Total Overhead Cost (£)",
      "Min Daily Hire Charge (£/day)", "Total Min Hire (£)",
      "Fuel Price (£/litre)", "Fuel Consumption (kpl)", "Total Fuel Cost (£)",
      `Tyre Cost (£/${unit})`, "Total Tyre Cost (£)",
      `Maintenance Cost (£/${unit})`, "Total Maintenance Cost (£)",
      "Total Variable Cost (£)", "Driver Hourly Wage (£/hr)", "Holiday Pay (%)", "Total Driver Cost (£)",
      "London ULEZ Surcharge (£)", "Birmingham CAZ Surcharge (£)",
      "Dartford Crossing Surcharge (£)", "M6 Toll Surcharge (£)", "Driver Subsistence (£)",
      "Total Surcharges (£)", "Profit Margin (%)", "Profit Margin (£)", "Seasonal Multiplier",
      "Subtotal (£)", "Total Fare (£)"
    ];

    const rows = filteredBookingsData.map((b, index) => {
      const vehicle = b.quote?.vehicle || db.vehicles.find(v => v.id === b.journey?.vehicleId) || db.vehicles[0] || {};
      const result = b.quote?.result || calcFare(b.journey, vehicle, db) || {};
      
      const ulezCost = result.surchargeLines?.find(s => s.label.toLowerCase().includes("ulez"))?.cost || 0;
      const cazCost = result.surchargeLines?.find(s => s.label.toLowerCase().includes("birmingham"))?.cost || 0;
      const dartfordCost = result.surchargeLines?.find(s => s.label.toLowerCase().includes("dartford"))?.cost || 0;
      const m6TollCost = result.surchargeLines?.find(s => s.label.toLowerCase().includes("m6"))?.cost || 0;
      const subsistenceCost = result.surchargeLines?.find(s => s.label.toLowerCase().includes("subsistence"))?.cost || 0;

      const liveKm = result.revenueKm || 0;
      const totalKm = result.totalKm || 0;
      const deadKm = Math.max(0, totalKm - liveKm);

      const fuelPrice = vehicle.fuelPricePerLitre ?? db.globalVars?.fuelPricePerLitre ?? 1.52;
      const fuelKpl = vehicle.fuelKpl || 5;
      const fuelPerKm = fuelPrice / fuelKpl;
      const tyreCost = vehicle.tyreCostPerKm ?? 0.05;
      const maintCost = vehicle.maintenanceCostPerKm || 0.15;

      const totalAnnualFixed = (vehicle.annualCosts||[]).reduce((s,c)=>s+Number(c.cost),0);
      const fleetCount = vehicle.fleetCount || 1;
      const annualFixed = totalAnnualFixed / fleetCount;
      const rStanding = (vehicle.utilisationDays || 225) > 0 ? annualFixed / (vehicle.utilisationDays || 225) : 0;
      const dailyStanding = rStanding;

      const companyOverheads = db.annualOverheads?.reduce((s,o)=>s+Number(o.cost),0) || 0;
      const totalFleetUnits = db.vehicles?.reduce((s,v)=>s+(Number(v.fleetCount)||1),0) || 1;
      const overheadPerUnit = companyOverheads / totalFleetUnits;
      const dailyOverhead = (vehicle.utilisationDays || 225) > 0 ? overheadPerUnit / (vehicle.utilisationDays || 225) : 0;
      const minDailyHire = rStanding + dailyOverhead;

      const profitMarginPct = vehicle.profitMarginPct ?? db.globalVars?.profitMarginPct ?? 28;

      const driverCost = result.driverCost || 0;
      const driverWage = vehicle.driverHourlyWage ?? db.globalVars?.driverHourlyWage ?? 17.50;
      const holPayPct = vehicle.holidayPayPct ?? db.globalVars?.holidayPayPct ?? 12.07;

      const rNum = index + 2;

      return [
        b.id,
        new Date(b.createdAt).toLocaleString("en-GB"),
        b.customer?.name,
        b.customer?.email,
        b.customer?.phone,
        b.customer?.company,
        String(b.journey?.origin || '').split(',')[0],
        String(b.journey?.destination || '').split(',')[0],
        b.journey?.journeyType,
        vehicle.name,
        b.journey?.passengers,
        b.journey?.largeLuggage,
        b.journey?.luggageCount,
        db.globalVars?.distanceUnit || 'km',
        Math.round(liveKm),
        Math.round(deadKm),
        `=O${rNum}+P${rNum}`,
        result.totalShiftHrs ? Math.round((result.totalShiftHrs - (Number(b.journey?.waitingMins)||0)/60)*10)/10 : 0,
        Number(b.journey?.waitingMins)||0,
        `=R${rNum}+(S${rNum}/60)`,
        result.dualCrew ? "Yes" : "No",
        result.opDays || 1,
        dailyStanding.toFixed(2),
        `=W${rNum}*V${rNum}`,
        dailyOverhead.toFixed(2),
        `=Y${rNum}*V${rNum}`,
        `=W${rNum}+Y${rNum}`,
        `=AA${rNum}*V${rNum}`,
        fuelPrice.toFixed(2),
        fuelKpl,
        `=(AC${rNum}/AD${rNum})*Q${rNum}`,
        tyreCost.toFixed(2),
        `=AF${rNum}*Q${rNum}`,
        maintCost.toFixed(2),
        `=AH${rNum}*Q${rNum}`,
        `=AE${rNum}+AG${rNum}+AI${rNum}`,
        driverWage.toFixed(2),
        holPayPct,
        `=(AK${rNum}*T${rNum}*V${rNum})*(1+(AL${rNum}/100))*IF(U${rNum}="Yes",2,1)`,
        ulezCost.toFixed(2),
        cazCost.toFixed(2),
        dartfordCost.toFixed(2),
        m6TollCost.toFixed(2),
        subsistenceCost.toFixed(2),
        `=AN${rNum}+AO${rNum}+AP${rNum}+AQ${rNum}+AR${rNum}`,
        profitMarginPct,
        `=(AW${rNum}+AS${rNum})*(AT${rNum}/100)`,
        (b.quote?.result?.seasonalMultiplier || 1).toFixed(2),
        `=IF(AT${rNum}>0,X${rNum}+AJ${rNum}+AM${rNum},${(result.subtotal || 0).toFixed(2)})`,
        `=IF(AT${rNum}>0,IF((AW${rNum}+AS${rNum}+AU${rNum})*AV${rNum}<AB${rNum},AB${rNum},(AW${rNum}+AS${rNum}+AU${rNum})*AV${rNum}),(AW${rNum}+AS${rNum}+AU${rNum})*AV${rNum})`
      ];
    });

    const csvString = "\uFEFF" + [headers, ...rows].map(e => e.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const saveApi = async (type, item, isDelete=false) => {
    const ep = type === 'matrix' ? '/api/admin/pricing-matrix' :
               type === 'templates' ? '/api/admin/route-templates' : '/api/admin/seasonal';
    if (isDelete) {
      await fetch(`${ep}?id=${item.id}`, { method: 'DELETE' });
    } else {
      const isNew = !item.id || item.id.startsWith('new_');
      const res = await fetch(ep, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? { ...item, id: undefined } : item)
      });
      return await res.json();
    }
  };

  const save = async () => {
    const newGv = { ...gv, yardAddress: depotLoc.address, yardLat: depotLoc.lat, yardLng: depotLoc.lng };
    const newDb = {...db,globalVars:newGv,annualOverheads:overheads,
      surcharges:sr,vehicles,blockedDates:blocks};
    setDb(newDb);
    try {
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDb)
      });
      setToast("All changes saved"); setTimeout(()=>setToast(""),2500);
    } catch(e) {
      setToast("Error saving changes"); setTimeout(()=>setToast(""),2500);
    }
  };
  
  const updateV = (id,field,val) =>
    setV(vs=>vs.map(v=>v.id===id?{...v,[field]:isNaN(Number(val))?val:Number(val)}:v));

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    const oldUnit = gv.distanceUnit || 'km';
    if (newUnit === oldUnit) return;

    const isToMiles = newUnit === 'miles';
    const distFactor = isToMiles ? 0.621371 : 1.60934;
    const rateFactor = isToMiles ? 1.60934 : 0.621371;

    setGv(g => ({ ...g, distanceUnit: newUnit }));
    
    setTemplatesData(d => d.map(t => ({ ...t, radiusKm: Math.round(t.radiusKm * distFactor * 10) / 10 })));

    setMatrixData(d => d.map(m => ({ 
      ...m, 
      radiusKm: Math.round(m.radiusKm * distFactor * 10) / 10,
      extraMileageRate: Math.round(m.extraMileageRate * rateFactor * 100) / 100
    })));

    setV(vs => vs.map(v => ({
      ...v,
      maintenanceCostPerKm: Math.round(v.maintenanceCostPerKm * rateFactor * 100) / 100,
      tyreCostPerKm: Math.round(v.tyreCostPerKm * rateFactor * 100) / 100,
      fuelKpl: Math.round(v.fuelKpl * distFactor * 10) / 10
    })));
  };

  const previewDb  = { ...db, globalVars:gv, annualOverheads:overheads, vehicles };
  const eco        = fleetEconomics(previewDb);
  const totalOverheads = overheads.reduce((s,o)=>s+Number(o.cost),0);

  const tabMeta = {
    pricing: { label: "Custom Fares & Rules", desc: "Set exact prices from location A to B, or configure pricing rules." },
    fleet:   { label: "Pricing (Fixed & Variable)", desc: "Set fleet economics, overheads, and variable costs." },
    bookings:{ label: "Searchings & Reports", desc: "Browse quote requests and export CSV reports." },
    settings:{ label: "System Settings", desc: "Global calculator settings and surcharges." },
  };

  const navItems = [
    { k: "pricing", label: "Custom Route Prices",      icon: <SvgPricing size={17} color="currentColor" /> },
    { k: "fleet",   label: "Pricing",                  icon: <SvgBus size={17} color="currentColor" /> },
    { k: "bookings",label: "Reports",                  icon: <SvgBookings size={17} color="currentColor" /> },
    { k: "settings",label: "Settings",                 icon: <SvgSettings size={17} color="currentColor" /> },
  ];

  return (
    <div className="adm-root">
      {toast && (
        <div style={{ position:"fixed",top:20,right:20,background:"#101828",color:"#fff",
          padding:"12px 20px",borderRadius:10,fontSize:13,fontWeight:600,zIndex:9999,
          boxShadow:"0 4px 24px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", gap: 8 }}>
          <SvgCheck size={14} color="#4ade80" /> {toast}
        </div>
      )}

      {/* ── White Sidebar ─────────────────────────────── */}
      <aside style={{
        width: 220,
        minWidth: 220,
        background: "#ffffff",
        borderRight: "1px solid #eaecf0",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
      }}>
        {/* Logo area */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f2f4f7" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ background: PX.brandRed, borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <SvgCoach size={17} color="#fff" />
            </div>
            <div>
              <div style={{ color: "#101828", fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 13.5, lineHeight: 1.2, letterSpacing: -0.2 }}>Carolean</div>
              <div style={{ color: "#98a2b3", fontSize: 10, fontWeight: 500 }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav group label */}
        <div style={{ padding: "20px 16px 6px" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#98a2b3", letterSpacing: 1, textTransform: "uppercase" }}>Navigation</span>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "4px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {navItems.map(({ k, label, icon }) => {
            const isSel = tab === k;
            return (
              <button key={k} onClick={() => setTab(k)} style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 7,
                border: "none",
                cursor: "pointer",
                background: isSel ? "#fff1f2" : "transparent",
                color: isSel ? PX.brandRed : "#667085",
                fontSize: 13.5,
                fontWeight: isSel ? 600 : 500,
                textAlign: "left",
                width: "100%",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => { if(!isSel){ e.currentTarget.style.background="#f9fafb"; e.currentTarget.style.color="#101828"; }}}
              onMouseLeave={e => { if(!isSel){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#667085"; }}}
              >
                <span style={{ color: isSel ? PX.brandRed : "#98a2b3", display: "flex", flexShrink: 0, transition: "color 0.15s" }}>{icon}</span>
                {label}
              </button>
            );
          })}
        </nav>

        {/* Save button at bottom */}
        <div style={{ padding: "14px 12px 20px", borderTop: "1px solid #f2f4f7" }}>
          <button onClick={save} style={{
            width: "100%",
            padding: "10px 0",
            background: PX.brandRed,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: 0.2,
            transition: "opacity 0.2s"
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >Save All Changes</button>
          <p style={{ color: "#d0d5dd", fontSize: 10, marginTop: 10, textAlign: "center" }}>Fare Engine v3.0</p>
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────── */}
      <div style={{ flex: 1, marginLeft: 220, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Top header */}
        <div style={{ background: "#ffffff", borderBottom: "1px solid #eaecf0", padding: "0 2rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
          <div>
            <h1 style={{ fontSize: 15, fontWeight: 700, color: "#101828", margin: 0 }}>{tabMeta[tab]?.label}</h1>
            <p style={{ fontSize: 11.5, color: "#98a2b3", margin: 0, marginTop: 1 }}>{tabMeta[tab]?.desc}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f2f4f7", border: "1px solid #eaecf0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SvgUser size={15} color="#667085" />
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: "1.5rem 2rem 4rem", background: "#f7f8fa" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* ════════════════════════ BOOKINGS ════════════════════════ */}
          {tab === "bookings" && (
            <div className="adm-section">
              <div className="adm-section-head">
                <div>
                  <h2>Searchings & Reports</h2>
                  <p>Browse quote requests and export CSV reports.</p>
                </div>
              </div>

              <div className="adm-search-bar">
                <input type="text" placeholder="Name / Ref ID" value={searchNameRef} onChange={e=>setSearchNameRef(e.target.value)} />
                <input type="text" placeholder="Vehicle" value={searchVehicle} onChange={e=>setSearchVehicle(e.target.value)} />
                {/* Fare range: £ From → To */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, maxWidth: 280, minWidth: 200 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#667085", whiteSpace: "nowrap" }}>£ Fare</span>
                  <input
                    type="number"
                    placeholder="From"
                    value={searchFareFrom}
                    onChange={e => setSearchFareFrom(e.target.value)}
                    style={{ flex: 1, minWidth: 70, maxWidth: 100 }}
                    min="0"
                  />
                  <span style={{ fontSize: 11, color: "#98a2b3", fontWeight: 600 }}>—</span>
                  <input
                    type="number"
                    placeholder="To"
                    value={searchFareTo}
                    onChange={e => setSearchFareTo(e.target.value)}
                    style={{ flex: 1, minWidth: 70, maxWidth: 100 }}
                    min="0"
                  />
                </div>
                <input type="text" placeholder="Route" value={searchRoute} onChange={e=>setSearchRoute(e.target.value)} />
                <input type="date" value={reportDate} onChange={e=>setReportDate(e.target.value)} style={{maxWidth:160}} />
                <Btn variant="primary" size="sm" onClick={exportBookingsToCSV}>↓ Export CSV</Btn>
              </div>
              
              {filteredBookingsData.length === 0 ? (
                <div className="adm-empty" style={{ margin: "2rem 0" }}>
                  No bookings found matching your search/date filters.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Ref ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Route</th>
                        <th>Vehicle</th>
                        <th>Total Fare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookingsData.map((b: any) => (
                        <tr key={b.id}>
                          <td style={{ fontWeight: 700, color: PX.navy800 }}>{b.id}</td>
                          <td style={{ color: PX.gray600 }}>
                            {new Date(b.createdAt).toLocaleDateString("en-GB")}
                          </td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{b.customer?.name}</div>
                            <div style={{ fontSize: 11, color: PX.gray400 }}>{b.customer?.email} · {b.customer?.phone}</div>
                          </td>
                          <td>
                            <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180, fontWeight: 500 }} title={b.journey?.origin}>
                              {String(b.journey?.origin).split(',')[0]}
                            </div>
                            <div style={{ fontSize: 11, color: PX.gray400 }}>→ {String(b.journey?.destination).split(',')[0]}</div>
                          </td>
                          <td style={{ color: PX.gray600 }}>
                            {b.quote?.vehicle?.name} ({b.journey?.passengers} pax)
                          </td>
                          <td style={{ fontWeight: 800, color: PX.brandRed }}>
                            £{fmt(b.quote?.result?.finalPrice || b.quote?.result?.finalFare || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════ PRICING & ROUTES ════════════════════════ */}
          {tab === "pricing" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              {/* FIXED ROUTES */}
              <div className="adm-section">
                <div className="adm-section-head">
                  <div>
                    <h2>Custom Route Prices (From A to B)</h2>
                    <p>Preset routes with a flat fixed price (e.g. airport transfers).</p>
                  </div>
                  <span className="adm-badge adm-badge-gray">{templatesData.length} routes</span>
                </div>
                <div className="adm-form-panel" id="form-templates">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:"#101828" }}>{newTemplate.id ? "Edit Route" : "Add New Route"}</span>
                    {newTemplate.id && <button onClick={()=>setNT({...blankTemplate, vehicleId:db.vehicles[0]?.id})} style={{ background:"none",border:"none",color:"#667085",fontSize:12,cursor:"pointer",fontWeight:600 }}>Cancel</button>}
                  </div>
                  <div className="adm-form-grid">
                    <div className="span2">
                      <label className="field-label">Pickup Location</label>
                      <PlacesInput value={newTemplate.pickupArea||""} mapsLoaded={mapsLoaded} onChange={(v,geo)=>setNT(x=>({...x,pickupArea:v,pickupGeo:geo}))} icon={<SvgMapPinGreen />} />
                    </div>
                    <div className="span2">
                      <label className="field-label">Drop-off Location</label>
                      <PlacesInput value={newTemplate.dropArea||""} mapsLoaded={mapsLoaded} onChange={(v,geo)=>setNT(x=>({...x,dropArea:v,dropGeo:geo}))} icon={<SvgMapPinRed />} />
                    </div>
                    <div>
                      <label className="field-label">Trip Type</label>
                      <select value={newTemplate.tripType||"one-way"} onChange={e=>setNT(x=>({...x,tripType:e.target.value}))}>
                        <option value="one-way">One Way</option>
                        <option value="return">Return</option>
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Eligible Vehicle</label>
                      <select value={newTemplate.vehicleId||""} onChange={e=>setNT(x=>({...x,vehicleId:e.target.value}))}>
                        {db.vehicles.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Fixed Cost Price (£)</label>
                      <input type="number" value={newTemplate.price||0} onChange={e=>setNT(x=>({...x,price:Number(e.target.value)}))} />
                    </div>
                    <div>
                      <label className="field-label">Radius Margin ({gv?.distanceUnit === "miles" ? "miles" : "km"})</label>
                      <input type="number" value={newTemplate.radiusKm??15} onChange={e=>setNT(x=>({...x,radiusKm:Number(e.target.value)}))} />
                    </div>
                  </div>
                  <div>
                    <Btn variant="primary" size="sm" onClick={async ()=>{
                      if(!newTemplate.pickupArea || !newTemplate.dropArea) return setToast("Pickup and dropoff required.");
                      const itemToSave = newTemplate.id ? newTemplate : {...newTemplate, id: 'new_'+Date.now()};
                      const saved = await saveApi('templates', itemToSave);
                      setTemplatesData(d => { const exists = d.some(x => x.id === saved.id); if (exists) return d.map(x => x.id === saved.id ? saved : x); return [saved, ...d]; });
                      setNT({...blankTemplate, vehicleId:db.vehicles[0]?.id});
                      setToast("Route saved!"); setTimeout(()=>setToast(""),2000);
                    }}>{newTemplate.id ? "Update Route" : "+ Add Route"}</Btn>
                  </div>
                </div>

                <div className="adm-list">
                  {templatesData.length === 0 && <div className="adm-empty">No fixed price routes configured yet.</div>}
                  {templatesData.map(t=>(
                    <div key={t.id} className="adm-row">
                      <div>
                        <div className="adm-row-title">
                          <span>{String(t.pickupArea).split(',')[0]} → {String(t.dropArea).split(',')[0]}</span>
                          <span className="adm-badge adm-badge-blue">{t.tripType === 'return' ? 'Return' : 'One Way'}</span>
                        </div>
                        <div className="adm-row-sub">{db.vehicles.find(v=>v.id===t.vehicleId)?.name} · <span className="adm-badge adm-badge-green" style={{fontSize:11}}>£{t.price} fixed</span></div>
                      </div>
                      <div className="adm-row-actions">
                        <button className="adm-btn-ghost" onClick={()=>{ setNT(t); document.getElementById('form-templates')?.scrollIntoView({behavior:'smooth', block:'center'}); }}>Edit</button>
                        <button className="adm-btn-danger" onClick={async ()=>{ if(window.confirm("Delete this route?")) { await saveApi('templates', t, true); setTemplatesData(d=>d.filter(x=>x.id!==t.id)); } }}><SvgClose size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TWO COLUMN GRID FOR MILEAGE & SEASONAL */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: "1.5rem", alignItems: "start" }}>

                {/* SUBSECTION 2: MILEAGE MATRIX */}
                <div className="adm-section">
                  <div className="adm-section-head">
                    <div>
                      <h2>Mileage Pricing Rules</h2>
                      <p>Define dynamic mileage rules for zone-to-zone custom routing matrix.</p>
                    </div>
                  </div>
                  
                  <div className="adm-form-panel" id="form-matrix">
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:"#101828" }}>{newMatrix.id ? "Edit Matrix Rule" : "Add New Matrix Rule"}</span>
                      {newMatrix.id && <button onClick={()=>setNM({...blankMatrix, vehicleId:db.vehicles[0]?.id})} style={{ background:"none",border:"none",color:"#667085",fontSize:12,cursor:"pointer",fontWeight:600 }}>Cancel</button>}
                    </div>
                    <div className="adm-form-grid">
                      <div className="span2">
                        <label className="field-label">Pickup Area</label>
                        <PlacesInput value={newMatrix.pickupArea||""} mapsLoaded={mapsLoaded} onChange={(v,geo)=>setNM(x=>({...x,pickupArea:v,pickupGeo:geo}))} icon={<SvgMapPinGreen />} />
                      </div>
                      <div className="span2">
                        <label className="field-label">Drop Area</label>
                        <PlacesInput value={newMatrix.dropArea||""} mapsLoaded={mapsLoaded} onChange={(v,geo)=>setNM(x=>({...x,dropArea:v,dropGeo:geo}))} icon={<SvgMapPinRed />} />
                      </div>
                      <div>
                        <label className="field-label">Trip Type</label>
                        <select value={newMatrix.tripType||"one-way"} onChange={e=>setNM(x=>({...x,tripType:e.target.value}))}>
                          <option value="one-way">One Way</option>
                          <option value="return">Return</option>
                        </select>
                      </div>
                      <div>
                        <label className="field-label">Vehicle</label>
                        <select value={newMatrix.vehicleId||""} onChange={e=>setNM(x=>({...x,vehicleId:e.target.value}))}>
                          {db.vehicles.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="field-label">Base Matrix Fare (£)</label>
                        <input type="number" value={newMatrix.baseFare||0} onChange={e=>setNM(x=>({...x,baseFare:Number(e.target.value)}))} />
                      </div>
                      <div>
                        <label className="field-label">Extra Mileage Rate (£)</label>
                        <input type="number" step="0.01" value={newMatrix.extraMileageRate||0} onChange={e=>setNM(x=>({...x,extraMileageRate:Number(e.target.value)}))} />
                      </div>
                    </div>
                    <div>
                      <Btn variant="primary" size="sm" full={false} onClick={async ()=>{
                        if(!newMatrix.pickupArea || !newMatrix.dropArea) return setToast("Pickup and dropoff required.");
                        const itemToSave = newMatrix.id ? newMatrix : {...newMatrix, id: 'new_'+Date.now()};
                        const saved = await saveApi('matrix', itemToSave);
                        setMatrixData(d => {
                          const exists = d.some(x => x.id === saved.id);
                          if (exists) return d.map(x => x.id === saved.id ? saved : x);
                          return [saved, ...d];
                        });
                        setNM({...blankMatrix, vehicleId:db.vehicles[0]?.id});
                        setToast("Matrix rule saved!"); setTimeout(()=>setToast(""),2000);
                      }}>{newMatrix.id ? "Update Matrix Rule" : "+ Add Matrix Rule"}</Btn>
                    </div>
                  </div>

                  <div className="adm-list">
                    {matrixData.length === 0 && <div className="adm-empty">No pricing matrix rules configured yet.</div>}
                    {matrixData.map(m=>(
                      <div key={m.id} className="adm-row">
                        <div>
                          <div className="adm-row-title">
                            <span>{String(m.pickupArea).split(',')[0]} → {String(m.dropArea).split(',')[0]}</span>
                            <span className="adm-badge adm-badge-blue">{m.tripType === 'return' ? 'Return' : 'One Way'}</span>
                          </div>
                          <div className="adm-row-sub">{db.vehicles.find(v=>v.id===m.vehicleId)?.name} · <span className="adm-badge adm-badge-amber" style={{fontSize:11}}>Base £{m.baseFare}</span> · £{m.extraMileageRate}/unit extra</div>
                        </div>
                        <div className="adm-row-actions">
                          <button className="adm-btn-ghost" onClick={()=>{ setNM(m); document.getElementById('form-matrix')?.scrollIntoView({behavior:'smooth', block:'center'}); }}>Edit</button>
                          <button className="adm-btn-danger" onClick={async ()=>{ if(window.confirm("Delete this rule?")) { await saveApi('matrix', m, true); setMatrixData(d=>d.filter(x=>x.id!==m.id)); } }}><SvgClose size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SUBSECTION 4: SEASONAL DEMAND PERIODS */}
                <div className="adm-section">
                  <div className="adm-section-head">
                    <div>
                      <h2>Seasonal Demand Multipliers</h2>
                      <p>Configure demand factors based on calendar dates and times (e.g. peak holiday periods).</p>
                    </div>
                  </div>
                  
                  <div className="adm-form-panel" id="form-seasonal">
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:"#101828" }}>{newSeasonal.id ? "Edit Demand Period" : "Add Demand Period"}</span>
                      {newSeasonal.id && <button onClick={()=>setNS(blankSeasonal)} style={{ background:"none",border:"none",color:"#667085",fontSize:12,cursor:"pointer",fontWeight:600 }}>Cancel</button>}
                    </div>
                    <div className="adm-form-grid">
                      <div className="span2">
                        <label className="field-label">Period Name</label>
                        <input type="text" value={newSeasonal.name||""} onChange={e=>setNS(x=>({...x,name:e.target.value}))} />
                      </div>
                      <div>
                        <label className="field-label">Start Date & Time</label>
                        <input type="datetime-local" value={newSeasonal.startDate||""} onChange={e=>setNS(x=>({...x,startDate:e.target.value}))} />
                      </div>
                      <div>
                        <label className="field-label">End Date & Time</label>
                        <input type="datetime-local" value={newSeasonal.endDate||""} onChange={e=>setNS(x=>({...x,endDate:e.target.value}))} />
                      </div>
                      <div>
                        <label className="field-label">Multiplier (e.g. 1.2)</label>
                        <input type="number" step="0.05" value={newSeasonal.multiplier||1} onChange={e=>setNS(x=>({...x,multiplier:Number(e.target.value)}))} />
                      </div>
                    </div>
                    <div>
                      <Btn variant="primary" size="sm" full={false} onClick={async ()=>{
                        if(!newSeasonal.name || !newSeasonal.startDate || !newSeasonal.endDate) return setToast("Please fill all fields.");
                        const itemToSave = newSeasonal.id ? newSeasonal : {...newSeasonal, id: 'new_'+Date.now()};
                        const saved = await saveApi('seasonal', itemToSave);
                        setSeasonalData(d => {
                          const exists = d.some(x => x.id === saved.id);
                          if (exists) return d.map(x => x.id === saved.id ? saved : x);
                          return [saved, ...d];
                        });
                        setNS(blankSeasonal);
                        setToast("Demand Period saved!"); setTimeout(()=>setToast(""),2000);
                      }}>{newSeasonal.id ? "Update Period" : "+ Add Period"}</Btn>
                    </div>
                  </div>

                  <div className="adm-list">
                    {seasonalData.length === 0 && <div className="adm-empty">No seasonal multipliers configured yet.</div>}
                    {seasonalData.map(s=>(
                      <div key={s.id} className="adm-row">
                        <div>
                          <div className="adm-row-title">
                            <span>{s.name}</span>
                            <span className="adm-badge adm-badge-amber">{s.multiplier}× multiplier</span>
                          </div>
                          <div className="adm-row-sub">{s.startDate?.replace('T',' ')} → {s.endDate?.replace('T',' ')}</div>
                        </div>
                        <div className="adm-row-actions">
                          <button className="adm-btn-ghost" onClick={()=>{ setNS(s); document.getElementById('form-seasonal')?.scrollIntoView({behavior:'smooth', block:'center'}); }}>Edit</button>
                          <button className="adm-btn-danger" onClick={async ()=>{ if(window.confirm("Delete this period?")) { await saveApi('seasonal', s, true); setSeasonalData(d=>d.filter(x=>x.id!==s.id)); } }}><SvgClose size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Blocked dates section removed as requested */}

            </div>
          )}

{/* ════════════════════════ FLEET & AVAILABILITY ════════════════════════ */}
          {tab === "fleet" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* SUBSECTION 2: VEHICLE WAGE & RUN RATES */}
              <div className="adm-section">
                <div className="adm-section-head">
                  <div>
                    <h2>Operating Wage Rates & Profit Margins</h2>
                    <p>Manage driver wages, holidays, and base margins.</p>
                  </div>
                  <select 
                    value={selectedWageVehicleId} 
                    onChange={e => setSelectedWageVehicleId(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${PX.gray200}`, fontWeight: 600, fontSize: 13, background: "#fff", cursor: "pointer", width: "100%", maxWidth: 220 }}
                  >
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                {(() => {
                  const sv = vehicles.find(v => v.id === selectedWageVehicleId) || vehicles[0];
                  if (!sv) return null;
                  return (
                    <div className="adm-form-panel">
                      <div className="adm-form-grid">
                      <div>
                        <label style={{ fontSize:11,fontWeight:700,color:PX.gray600,display:"block",marginBottom:4 }}>Fuel Price (£/Litre)</label>
                        <input type="number" step="0.001" value={sv.fuelPricePerLitre ?? gv.fuelPricePerLitre ?? 1.52} onChange={e=>updateV(sv.id, "fuelPricePerLitre", Number(e.target.value))}/>
                      </div>
                      <div>
                        <label style={{ fontSize:11,fontWeight:700,color:PX.gray600,display:"block",marginBottom:4 }}>Driver Wage (£/hr)</label>
                        <input type="number" step="0.5" value={sv.driverHourlyWage ?? gv.driverHourlyWage ?? 17.5} onChange={e=>updateV(sv.id, "driverHourlyWage", Number(e.target.value))}/>
                      </div>
                      <div>
                        <label style={{ fontSize:11,fontWeight:700,color:PX.gray600,display:"block",marginBottom:4 }}>Holiday Pay Addition (%)</label>
                        <input type="number" step="0.1" value={sv.holidayPayPct ?? gv.holidayPayPct ?? 12.07} onChange={e=>updateV(sv.id, "holidayPayPct", Number(e.target.value))}/>
                      </div>
                      <div>
                        <label style={{ fontSize:11,fontWeight:700,color:PX.gray600,display:"block",marginBottom:4 }}>Profit Margin (%)</label>
                        <input type="number" value={sv.profitMarginPct ?? gv.profitMarginPct ?? 28} onChange={e=>updateV(sv.id, "profitMarginPct", Number(e.target.value))}/>
                      </div>
                      </div>
                      </div>
                  );
                })()}
              </div>

              {/* SUBSECTION 3: TOLL SURCHARGES */}
              <div className="adm-section">
                <div className="adm-section-head">
                  <div>
                    <h2>Operational Toll Surcharges</h2>
                    <p>Additional costs added per journey.</p>
                  </div>
                </div>
                <div className="adm-form-panel">
                  <div className="adm-form-grid">
                  {[
                    ["m6Toll","M6 Toll (PSV)"],["dartford","Dartford Crossing"],
                    ["ulez","London ULEZ/CAZ"],["birminghamCaz","Birmingham CAZ"],
                    ["driverOvernightSubsistence","Driver overnight subsistence"]
                  ].map(([k,l])=>(
                    <div key={k}>
                      <label style={{ fontSize:11,fontWeight:700,color:PX.gray600,display:"block",marginBottom:4 }}>{l} (£)</label>
                      <input type="number" value={sr[k] ?? 0} onChange={e=>setSr(s=>({...s,[k]:Number(e.target.value)}))}/>
                    </div>
                  ))}
                  </div>
                </div>
              </div>

              {/* SUBSECTION 1: VEHICLE SPECIFICATIONS */}
              <div className="adm-section">
                <div className="adm-section-head">
                  <div>
                    <h2>Fleet Vehicles Specifications & Costs</h2>
                    <p>Edit standing rates, capacity constraints, insurance overheads, and run costs.</p>
                  </div>
                  <Btn variant="primary" size="sm" onClick={()=>{
                    const newId = "tier_"+Date.now();
                    setV(vs=>[...vs, {
                      id: newId, name:"New Tier", emoji:"bus", desc:"Description", capacity:30, fleetCount:1, utilisationDays:220,
                      annualCosts: [{ id:1, label:"Depreciation", cost:5000 }, { id:2, label:"Insurance", cost:2000 }],
                      fuelKpl:8, maintenanceCostPerKm:0.12, tyreCostPerKm:0.05, extraLuggageProfitPct:0.2
                    }]);
                    setActiveVehicleId(newId);
                  }}>＋ Add New Vehicle</Btn>
                </div>

                <div style={{ padding: "20px 24px" }}>
                {vehicles.filter(v => v.id === (vehicles.find(x => x.id === activeVehicleId) ? activeVehicleId : vehicles[0]?.id)).map(v => {
                  const count = Number(v.fleetCount) || 1;
                  const totalAnnualFixed = (v.annualCosts||[]).reduce((s,c)=>s+Number(c.cost),0);
                  const annualFixed = totalAnnualFixed / count;
                  const rs = Math.round(annualFixed / v.utilisationDays * 100) / 100;
                  const utilRate = Math.round((v.utilisationDays/365)*100);
                  return (
                    <div key={v.id} style={{ border:`1.5px solid ${PX.gray200}`,borderRadius:12,padding:"1.25rem",marginBottom:"1rem",background: PX.gray50 }}>
                      <div style={{ display:"grid", gridTemplateColumns:"auto 1fr auto", gap:20, alignItems:"start", marginBottom:"1.25rem" }}>
                        {/* Icon display box */}
                        <div style={{ width: 62, height: 62, borderRadius: 12, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${PX.gray200}`, marginTop: 18 }}>
                          {v.emoji === "minibus" ? <SvgMinibus size={32} color={PX.navy800} /> : v.emoji === "coach" ? <SvgCoach size={32} color={PX.navy800} /> : <SvgBus size={32} color={PX.navy800} />}
                        </div>
                        
                        {/* Middle section with selectors and inputs */}
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:16 }}>
                          <div>
                            <label style={{ fontSize:10,fontWeight:700,color:PX.gray400,display:"block",marginBottom:4,textTransform:"uppercase" }}>Select Vehicle to Edit</label>
                            <select 
                              value={v.id} 
                              onChange={e=>setActiveVehicleId(e.target.value)} 
                            >
                              {vehicles.map(vx => <option key={vx.id} value={vx.id}>{vx.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize:10,fontWeight:700,color:PX.gray400,display:"block",marginBottom:4,textTransform:"uppercase" }}>Tier Name</label>
                            <input 
                              type="text" 
                              value={v.name} 
                              onChange={e=>updateV(v.id,"name",e.target.value)} 
                              style={{ fontWeight: 700 }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize:10,fontWeight:700,color:PX.gray400,display:"block",marginBottom:4,textTransform:"uppercase" }}>Card Icon</label>
                            <select 
                              value={v.emoji} 
                              onChange={e=>updateV(v.id,"emoji",e.target.value)} 
                            >
                              <option value="minibus">Minibus Icon</option>
                              <option value="bus">Standard Bus Icon</option>
                              <option value="coach">Coach Icon</option>
                            </select>
                          </div>
                          <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{ fontSize:10,fontWeight:700,color:PX.gray400,display:"block",marginBottom:4,textTransform:"uppercase" }}>Description</label>
                            <input 
                              type="text" 
                              value={v.desc} 
                              onChange={e=>updateV(v.id,"desc",e.target.value)} 
                            />
                          </div>
                        </div>

                        {/* Right action & state summary */}
                        <div style={{ display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end" }}>
                          <button onClick={()=>{ if(vehicles.length<=1) return; if(window.confirm(`Delete ${v.name}?`)) setV(vs=>vs.filter(x=>x.id!==v.id)); }} style={{ padding:"8px 14px",background:PX.red100,color:PX.red700,border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:700, display:"flex", alignItems:"center", gap:4 }}><SvgTrash size={12} /> Remove</button>
                          <div style={{ background:"#fff",borderRadius:8,padding:"8px 14px",border:`1.5px solid ${PX.gray200}`,textAlign:"right" }}>
                            <span style={{ fontSize:10,fontWeight:700,color:PX.gray400,display:"block",textTransform:"uppercase" }}>Standing rate</span>
                            <span style={{ fontSize:14,fontWeight:800,color:PX.navy800 }}>£{rs}/day</span>
                            <span style={{ fontSize:10,fontWeight:700,color:PX.gray400,display:"block",textTransform:"uppercase",marginTop:8 }}>Annual Total</span>
                            <span style={{ fontSize:14,fontWeight:800,color:PX.navy800 }}>£{totalAnnualFixed.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"1rem",marginBottom:"1rem" }}>
                        <div>
                          <label style={{ fontSize:11,fontWeight:700,color:PX.gray600,display:"block",marginBottom:4 }}>Capacity (Seats)</label>
                          <input type="number" value={v.capacity} onChange={e=>updateV(v.id,"capacity",Number(e.target.value))} />
                        </div>
                        <div>
                          <label style={{ fontSize:11,fontWeight:700,color:PX.gray600,display:"block",marginBottom:4 }}>Fleet Count</label>
                          <input type="number" value={v.fleetCount} onChange={e=>updateV(v.id,"fleetCount",Number(e.target.value))} />
                        </div>
                        <div>
                          <label style={{ fontSize:11,fontWeight:700,color:PX.gray600,display:"block",marginBottom:4 }}>Utilisation (days/yr)</label>
                          <input type="number" value={v.utilisationDays} onChange={e=>updateV(v.id,"utilisationDays",Number(e.target.value))} />
                        </div>
                        <div>
                          <label style={{ fontSize:11,fontWeight:700,color:PX.gray600,display:"block",marginBottom:4 }}>Utilisation Rate</label>
                          <div style={{ padding:"12px 14px",background:"#fff",borderRadius:8,border:`1.5px solid ${PX.gray200}`,display:"flex",alignItems:"center",gap:8 }}>
                            <ProgressBar pct={utilRate} color={utilRate>80?PX.teal700:PX.amber500} />
                            <span style={{ fontSize:12,fontWeight:700,color:PX.navy800 }}>{utilRate}%</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ background:"#fff9e6",border:`1.5px solid #ffe8cc`,borderRadius:8,padding:"12px 16px",marginBottom:"1rem" }}>
                        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                          <span style={{ fontWeight:700,fontSize:13,color:"#b25e00" }}>Annual Fixed Costs Line Items</span>
                          <button onClick={()=>updateV(v.id,"annualCosts",[...(v.annualCosts||[]),{id:Date.now(),label:"New cost item",cost:0}])} style={{ padding:"4px 10px",background:"#fff",border:`1px solid #ffe8cc`,borderRadius:6,fontSize:11,cursor:"pointer",fontWeight:600 }}>＋ Add Cost</button>
                        </div>
                        {(v.annualCosts||[]).map(c=>(
                          <div key={c.id} style={{ display:"grid",gridTemplateColumns:"1fr 140px auto",gap:8,alignItems:"center",marginBottom:6 }}>
                            <input type="text" value={c.label} onChange={e=>updateV(v.id,"annualCosts",v.annualCosts.map(x=>x.id===c.id?{...x,label:e.target.value}:x))} />
                            <input type="number" value={c.cost} onChange={e=>updateV(v.id,"annualCosts",v.annualCosts.map(x=>x.id===c.id?{...x,cost:Number(e.target.value)}:x))} />
                            <button onClick={()=>updateV(v.id,"annualCosts",v.annualCosts.filter(x=>x.id!==c.id))} style={{ color:PX.red700,background:"none",border:"none",fontWeight:800,cursor:"pointer",fontSize:18, display:"flex", alignItems:"center" }}><SvgClose size={16} /></button>
                          </div>
                        ))}
                      </div>

                      <details>
                        <summary style={{ cursor:"pointer",fontSize:13,fontWeight:700,color:PX.navy800 }}>⚙ Variable Cost Parameters (Fuel, Tyres, Maintenance)</summary>
                        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginTop:10 }}>
                          <div>
                            <label style={{ fontSize:11,color:PX.gray600 }}>Fuel efficiency (kpl)</label>
                            <input type="number" step="0.1" value={v.fuelKpl} onChange={e=>updateV(v.id,"fuelKpl",e.target.value)} />
                          </div>
                          <div>
                            <label style={{ fontSize:11,color:PX.gray600 }}>Maintenance (£/{gv?.distanceUnit === "miles" ? "mi" : "km"})</label>
                            <input type="number" step="0.01" value={v.maintenanceCostPerKm} onChange={e=>updateV(v.id,"maintenanceCostPerKm",e.target.value)} />
                          </div>
                          <div>
                            <label style={{ fontSize:11,color:PX.gray600 }}>Tyre cost (£/{gv?.distanceUnit === "miles" ? "mi" : "km"})</label>
                            <input type="number" step="0.01" value={v.tyreCostPerKm ?? 0.05} onChange={e=>updateV(v.id,"tyreCostPerKm",e.target.value)} />
                          </div>
                          <div>
                            <label style={{ fontSize:11,color:PX.gray600 }}>Extra profit per bag {">"} 16 (%)</label>
                            <input type="number" step="0.1" value={v.extraLuggageProfitPct ?? 0.2} onChange={e=>updateV(v.id,"extraLuggageProfitPct",e.target.value)} />
                          </div>
                          
                        </div>
                      </details>
                    </div>
                  );
                })}
                </div>
              </div>
              {/* SUBSECTION 2: COMPANY ANNUAL OVERHEADS */}
              <div className="adm-section">
                <div className="adm-section-head">
                  <div>
                    <h2>🏢 Company annual overheads</h2>
                    <p>Added to fleet vehicle costs to form the grand total annual fixed cost</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <span style={{ fontSize:10,fontWeight:700,color:PX.gray400,display:"block",textTransform:"uppercase", letterSpacing:1 }}>Total</span>
                    <span style={{ fontSize:18,fontWeight:800,color:"#6366f1" }}>£{totalOverheads.toLocaleString()}</span>
                  </div>
                </div>

                <div className="adm-form-panel">
                  <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem", marginBottom:"1.25rem" }}>
                  {overheads.map(oh => (
                    <div key={oh.id} style={{ display:"flex", gap:"1rem", alignItems:"center" }}>
                      <input 
                        type="text" 
                        value={oh.label} 
                        onChange={e => setOH(os => os.map(x => x.id === oh.id ? {...x, label: e.target.value} : x))}
                        style={{ flex:1, fontWeight: 500 }}
                      />
                      <div style={{ position:"relative", width:"140px" }}>
                        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:PX.gray400, fontWeight: 700, fontSize: 13.5 }}>£</span>
                        <input 
                          type="number" 
                          value={oh.cost} 
                          onChange={e => setOH(os => os.map(x => x.id === oh.id ? {...x, cost: Number(e.target.value)} : x))}
                          style={{ paddingLeft: 28, fontWeight: 500 }}
                        />
                      </div>
                      <button 
                        onClick={() => setOH(os => os.filter(x => x.id !== oh.id))}
                        style={{ width:44, height:44, borderRadius:8, background:PX.red100, color:PX.brandRed, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition: "0.2s" }}
                        title="Remove overhead item"
                      >
                        <SvgTrash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => setOH(os => [...os, {id: Date.now(), label:"New Overhead", cost:0}])}
                  style={{ background: "#fff", border:`1.5px solid ${PX.gray200}`, padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, color: PX.navy700, cursor: "pointer" }}
                >
                  ＋ Add overhead item
                </button>
                </div>
              </div>

              {/* SUBSECTION 3: FLEET ECONOMICS SUMMARY */}
              <div className="adm-section">
                <div className="adm-section-head">
                  <div>
                    <h2>Fleet economics summary</h2>
                    <p>Vehicle annual costs ÷ utilisation days = standing rate • Company overheads ÷ total fleet units = overhead per unit</p>
                  </div>
                </div>
                <div style={{ padding: "24px" }}>
                  <FleetEconomicsPanel eco={eco} />
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════ SYSTEM SETTINGS ════════════════════════ */}
          {tab === "settings" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              
              {/* SUBSECTION 1: CREDENTIALS */}
              <div className="adm-section">
                <div className="adm-section-head">
                  <div>
                    <h2>Base Station & Map Credentials</h2>
                    <p>System globals and distance settings.</p>
                  </div>
                </div>
                <div className="adm-form-panel" style={{ display:"grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <div style={{ background:"#f0f7ff",border:"1px solid #bfdbfe",borderRadius:12,padding:"1.25rem" }}>
                    <div style={{ fontWeight:700,color:PX.navy800,marginBottom:6,fontSize:14, display:"flex", alignItems:"center", gap:4 }}><SvgDepot /> Depot Address Location</div>
                    <p style={{ fontSize:11,color:PX.gray600,marginBottom:10 }}>Calculates empty 'dead mileage' routing runs to and from base.</p>
                    <PlacesInput 
                      value={depotLoc.address} 
                      mapsLoaded={mapsLoaded} 
                      onChange={(addr, coords)=>setDepotLoc({ address: addr, lat: coords?.lat, lng: coords?.lng })} 
                      placeholder="Yard address..." 
                      icon={<SvgDepot size={14} />} 
                    />
                  </div>
                  
                  <div style={{ background:PX.gray50,border:`1px solid ${PX.gray200}`,borderRadius:12,padding:"1.25rem" }}>
                    <div style={{ fontWeight:700,color:PX.navy800,marginBottom:6,fontSize:14 }}>Global Distance System</div>
                    <p style={{ fontSize:11,color:PX.gray600,marginBottom:10 }}>Convert all pricing variables dynamically between Kilometers and Miles.</p>
                    <div style={{ display:"flex", alignItems:"center", gap: 10, marginTop: "1rem" }}>
                      <select 
                        value={gv.distanceUnit || 'km'} 
                        onChange={handleUnitChange}
                        style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${PX.gray200}`, fontWeight: 700, fontSize: 14, background: "#fff", cursor: "pointer", outline:"none", width: "100%", color: PX.navy800 }}
                      >
                        <option value="km">Kilometers (km)</option>
                        <option value="miles">Miles (mi)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              


              {/* SUBSECTION 4: OPERATOR BUSINESS DETAILS */}
              <div className="adm-section">
                <div className="adm-section-head">
                  <div>
                    <h2>Operator Business & Licensing</h2>
                    <p>Company registered details.</p>
                  </div>
                </div>
                <div className="adm-form-panel">
                  <div className="adm-form-grid">
                    <div>
                    <label style={{ fontSize:11,fontWeight:700,color:PX.gray600,display:"block",marginBottom:4 }}>Company Registered Name</label>
                    <input type="text" defaultValue="Carolean Coaches Ltd" />
                  </div>
                  <div>
                    <label style={{ fontSize:11,fontWeight:700,color:PX.gray600,display:"block",marginBottom:4 }}>PSV Operator Licence No.</label>
                    <input type="text" defaultValue="PM0003456" />
                  </div>
                  <div>
                    <label style={{ fontSize:11,fontWeight:700,color:PX.gray600,display:"block",marginBottom:4 }}>Depot Yard Postcode</label>
                    <input type="text" defaultValue="WS2 8TL" />
                  </div>
                  <div>
                    <label style={{ fontSize:11,fontWeight:700,color:PX.gray600,display:"block",marginBottom:4 }}>Default Admin Notification Email</label>
                    <input type="email" defaultValue="bookings@caroleancoaches.co.uk" />
                  </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Fleet Economics Panel ──────────────────────────────────────────────────────
function FleetEconomicsPanel({ eco }) {
  const COLORS = [PX.navy600, PX.teal700, "#8b5cf6", PX.amber500];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Per-vehicle breakdown table */}
      <div style={{ border:`1.5px solid ${PX.gray200}`,borderRadius:12,overflow:"hidden" }}>
        <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1.2fr",gap:0,
          background:PX.gray50,padding:"12px 14px",fontSize:11,fontWeight:800,
          color:PX.gray600,textTransform:"uppercase",letterSpacing:.4 }}>
          <span>Vehicle tier</span>
          <span style={{ textTransform:"uppercase", textAlign:"center" }}>Units</span>
          <span style={{ textTransform:"uppercase", textAlign:"right" }}>Annual costs</span>
          <span style={{ textTransform:"uppercase", textAlign:"right" }}>Standing /day</span>
          <span style={{ textTransform:"uppercase", textAlign:"right" }}>Overhead /day</span>
          <span style={{ textTransform:"uppercase", textAlign:"right" }}>Min hire /day</span>
        </div>
        {eco.vehicleBreakdown.map((v,i)=>(
          <div key={v.id} style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr 1.2fr",gap:0,
            padding:"14px",borderTop:`1.5px solid ${PX.gray200}`,alignItems:"center", background: "#fff" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ width:10,height:10,borderRadius:"50%",background:COLORS[i%4],display:"inline-block",flexShrink:0 }}/>
              <div>
                <div style={{ fontSize:13,fontWeight:700,color:PX.navy800 }}>
                  {v.emoji === "minibus" ? <SvgMinibus size={18} style={{ marginRight: 6 }} /> : v.emoji === "coach" ? <SvgCoach size={18} style={{ marginRight: 6 }} /> : <SvgBus size={18} style={{ marginRight: 6 }} />}
                  {v.name}
                </div>
                <div style={{ fontSize:11,color:PX.gray400,fontWeight:600, marginLeft: 24 }}>{v.utilDays} days · {v.utilRate}% utilisation</div>
              </div>
            </div>
            <div style={{ textAlign:"center" }}>
              <span style={{ fontSize:12,fontWeight:800,color:PX.navy800,
                background:PX.gray100,padding:"4px 10px",borderRadius:6 }}>{v.count}</span>
            </div>
            <div style={{ textAlign:"right",fontSize:13,color:PX.gray600,fontWeight:600 }}>{fmtK(v.annualFixed)}</div>
            <div style={{ textAlign:"right",fontSize:13,fontWeight:700,color:PX.navy800 }}>£{v.dailyStanding.toFixed(2)}</div>
            <div style={{ textAlign:"right",fontSize:13,color:"#5b21b6",fontWeight:600 }}>£{v.dailyOverhead.toFixed(2)}</div>
            <div style={{ textAlign:"right" }}>
              <span style={{ fontSize:15,fontWeight:800,color:PX.amber500 }}>£{v.minHirePerDay.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Overhead allocation cards */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:12 }}>
        {[
          ["Total company overheads",fmtK(eco.companyOverheads),"annual total","#f5f3ff","#ede9fe","#5b21b6","#7c3aed"],
          ["Overhead per unit",fmtK(eco.overheadPerUnit),`÷ ${eco.totalFleetUnits} total units`,"#f5f3ff","#ede9fe","#5b21b6","#7c3aed"],
          ["Total fleet units",`${eco.totalFleetUnits}`,`across ${eco.vehicleBreakdown.length} tiers`,PX.gray50,PX.gray200,PX.navy800,PX.gray400],
        ].map(([l,v,sub,bg,br,tc,sc])=>(
          <div key={l} style={{ background:bg,border:`1.5px solid ${br}`,borderRadius:9,padding:"14px" }}>
            <div style={{ fontSize:10,color:sc,fontWeight:800,textTransform:"uppercase",letterSpacing:.4,marginBottom:4 }}>{l}</div>
            <div style={{ fontSize:18,fontWeight:800,color:tc }}>{v}</div>
            <div style={{ fontSize:11,color:sc,marginTop:2,fontWeight:500 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background:`linear-gradient(135deg,${PX.navy800},${PX.navy700})`,borderRadius:12,padding:"1.25rem 1.5rem" }}>
        <div style={{ fontSize:11,color:"#7baed4",fontWeight:800,textTransform:"uppercase",letterSpacing:.5,marginBottom:"1rem" }}>
          Calculated Standing Min Hire Charge / Day
        </div>
        <div style={{ display:"flex",gap:12,flexWrap:"wrap",marginBottom:"1rem" }}>
          {eco.vehicleBreakdown.map(v=>(
            <div key={v.id} style={{ flex:1,minWidth:135,background:"rgba(255,255,255,.08)",
              borderRadius:9,padding:"10px 14px",textAlign:"center" }}>
              <div style={{ fontSize:18,marginBottom:4 }}>
                {v.emoji === "minibus" ? <SvgMinibus size={22} color="#fff" /> : v.emoji === "coach" ? <SvgCoach size={22} color="#fff" /> : <SvgBus size={22} color="#fff" />}
              </div>
              <div style={{ fontSize:11,color:"#7baed4",marginBottom:6,fontWeight:600 }}>{v.name}</div>
              <div style={{ fontSize:20,fontWeight:800,color:PX.amber400 }}>£{v.minHirePerDay.toFixed(2)}</div>
              <div style={{ fontSize:10,color:"rgba(255,255,255,.35)",marginTop:4 }}>
                £{v.dailyStanding.toFixed(2)} + £{v.dailyOverhead.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ height:1,background:"rgba(255,255,255,.12)",marginBottom:"0.75rem" }}/>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8 }}>
          <div style={{ fontSize:12,color:"rgba(255,255,255,.6)" }}>
            Total Annual Operating Standing Fleet Cost: <strong style={{ color:"#fff" }}>{fmtK(eco.grandTotal)}</strong>
          </div>
          <div style={{ fontSize:11,color:"#7baed4",fontWeight:600 }}>
            Allocated Overhead: {fmtK(eco.overheadPerUnit)}/unit/yr · {eco.totalFleetUnits} units
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App({ initialMode = 'admin' }: { initialMode?: 'admin' | 'customer' }) {
  const [db, setDb]         = useState(DEFAULT_DB);
  const [adminMode, setAdm] = useState(initialMode === 'admin');
  const [journey, setJ]     = useState({
    journeyType:"one-way", origin:"", destination:"",
    departureDate:"", returnDate:"",
    passengers:16, suitcaseCount:16, handbagCount:16, waitingMins:0,
    waypoints:[], wpCoords:[], stops:[],
    name: "", phone: "", email: "", company: "", specialRequests: ""
  });
  
  const [quotes, setQ]             = useState([]);
  const [selected, setSel]         = useState(null);
  const [showQuotes, setShowQuotes] = useState(false);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [validationError, setValidationError] = useState("");

  const { loaded: mapsLoaded } = useGoogleMaps(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "");

  // Load configuration config
  useEffect(() => {
    fetch('/api/admin/config').then(r=>r.json()).then(data => {
      if (data && data.vehicles && data.vehicles.length > 0) {
        setDb(d => ({ ...d, ...data }));
      }
    }).catch(console.error);
  }, []);

  const buildQuotes = useCallback(async (currentJourney = journey) => {
    const wp = currentJourney.journeyType === "multi-stop"
      ? [currentJourney.origin, ...currentJourney.stops.map(s => s.place).filter(Boolean), currentJourney.destination]
      : [currentJourney.origin, currentJourney.destination];

    const wc = currentJourney.journeyType === "multi-stop"
      ? [currentJourney.wpCoords?.[0], ...currentJourney.stops.map(s => s.coords || null), currentJourney.wpCoords?.[currentJourney.wpCoords.length - 1]]
      : [currentJourney.wpCoords?.[0], currentJourney.wpCoords?.[1]];

    if (!wp[0] || !wp[wp.length-1]) return;
    setLoadingQuotes(true);
    try {
      const res = await fetch('/api/quotes/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...currentJourney, waypoints: wp, wpCoords: wc})
      });
      const data = await res.json();
      if (data.quotes && data.quotes.length > 0) {
        setQ(data.quotes);
        if (!selected) {
          const firstAvail = data.quotes.find(q => q.vehicle.capacity >= currentJourney.passengers);
          if (firstAvail) setSel(firstAvail.vehicle.id);
        }
      } else {
        const localQuotes = db.vehicles.map(vehicle => ({
          vehicle,
          result: calcFare({...currentJourney, waypoints: wp, wpCoords: wc}, vehicle, db)
        }));
        setQ(localQuotes);
        if (!selected) {
          const firstAvail = localQuotes.find(q => q.vehicle.capacity >= currentJourney.passengers);
          if (firstAvail) setSel(firstAvail.vehicle.id);
        }
      }
    } catch(err) {
      const localQuotes = db.vehicles.map(vehicle => ({
        vehicle,
        result: calcFare({...currentJourney, waypoints: wp, wpCoords: wc}, vehicle, db)
      }));
      setQ(localQuotes);
      if (!selected) {
        const firstAvail = localQuotes.find(q => q.vehicle.capacity >= currentJourney.passengers);
        if (firstAvail) setSel(firstAvail.vehicle.id);
      }
    } finally {
      setLoadingQuotes(false);
    }
  }, [journey, db, selected]);

  // Reactive updates for parameters once calculation layout is shown
  useEffect(() => {
    if (showQuotes && journey.origin && journey.destination) {
      const delayDebounce = setTimeout(() => {
        buildQuotes();
      }, 400);
      return () => clearTimeout(delayDebounce);
    }
  }, [
    journey.passengers,
    journey.suitcaseCount,
    journey.handbagCount,
    journey.waitingMins,
    journey.journeyType,
    journey.departureDate,
    journey.returnDate,
    showQuotes
  ]);

  const handleCalculateClick = () => {
    setValidationError("");
    if (!journey.origin || !journey.destination || !journey.departureDate || !journey.name || !journey.email || !journey.phone) {
      setValidationError("Please fill in all required fields (Name, Email, Phone, Date, Pickup, and Destination).");
      return;
    }

    const destIdx = journey.journeyType === "multi-stop" ? 1 + (journey.stops || []).length : 1;
    const hasOriginCoords = journey.wpCoords && journey.wpCoords[0];
    const hasDestCoords = journey.wpCoords && journey.wpCoords[destIdx];
    
    let allStopsHaveCoords = true;
    if (journey.journeyType === "multi-stop" && journey.stops) {
      allStopsHaveCoords = journey.stops.every(s => s.coords);
    }

    if (!hasOriginCoords || !hasDestCoords || !allStopsHaveCoords) {
      setValidationError("❌ Our service is exclusively available within the UK. Please select a valid UK location from the dropdown suggestions or use the map pin icon.");
      return;
    }

    setShowQuotes(true);
    buildQuotes();
  };

  const handleFinalBookingSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    const quote = quotes.find(q => q.vehicle.id === selected);
    try {
      const payload = {
        customer: {
          name: journey.name,
          phone: journey.phone,
          email: journey.email,
          company: journey.company
        },
        journey: journey,
        quote: quote
      };
      
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setBookingRef(data.booking.id);
        setSubmitted(true);
      } else {
        alert("Booking request failed: " + (data.error || "Unknown error"));
      }
    } catch(e) {
      alert("Network error occurred while submitting quote request.");
    } finally {
      setSubmitting(false);
    }
  };

  const setOrigin = (val,coords) => setJ(j=>({ ...j, origin:val, wpCoords: setAt(j.wpCoords, 0, coords, 2) }));
  const setDest   = (val,coords) => setJ(j=>({ ...j, destination:val, wpCoords: setAt(j.wpCoords, j.journeyType==="multi-stop"?1+(j.stops||[]).length:1, coords, j.journeyType==="multi-stop"?2+(j.stops||[]).length:2) }));
  
  const setAt = (arr, idx, val, len) => {
    const a = arr ? [...arr] : Array(len).fill(null);
    while (a.length < len) a.push(null);
    a[idx] = val; return a;
  };

  const addStop    = () => setJ(j => ({ ...j, stops: [...(j.stops||[]), { place: "", coords: null, wait: 30 }] }));
  const updateStop = (i, k, v) => setJ(j => ({ ...j, stops: j.stops.map((st, idx) => idx === i ? { ...st, [k]: v } : st) }));
  const removeStop = i => setJ(j => ({ ...j, stops: j.stops.filter((_, idx) => idx !== i) }));

  const selectedQuote = quotes.find(q => q.vehicle.id === selected);
  const activeResult = selectedQuote?.result || quotes[0]?.result;

  const showReturnDate = journey.journeyType === "return";
  const showLuggageCount = journey.largeLuggage !== "none";

  return (
    <>
      <GlobalStyle/>
      <div style={{ minHeight:"100vh", background:"#f4f6f9" }}>
        {!adminMode && <Navbar />}
        
        {adminMode ? (
          <AdminDashboard db={db} setDb={setDb} mapsLoaded={mapsLoaded} />
        ) : (
          <div className="fade-up">
            
            {!showQuotes ? (
              /* PAGE 1: SEARCH & INPUT FORM WITH HERO */
              <div>
                {/* Full-width brand hero banner */}
                <div style={{ 
                  background: `radial-gradient(circle at 80% 20%, #13155c 0%, ${PX.navy800} 100%)`,
                  padding: "5.5rem 1.5rem 7.5rem",
                  color: "#fff",
                  textAlign: "center"
                }}>
                  <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <span style={{ 
                      background: "rgba(255,255,255,0.06)", 
                      border: "1px solid rgba(255,255,255,0.15)", 
                      padding: "5px 14px", 
                      borderRadius: 30, 
                      fontSize: 10.5, 
                      fontWeight: 800, 
                      letterSpacing: 1.5, 
                      textTransform: "uppercase", 
                      color: PX.amber500 
                    }}>
                      Instant fleet fare calculator
                    </span>
                    <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "3.25rem", fontWeight: 950, marginTop: 16, letterSpacing: -0.8, lineHeight: 1.1 }}>
                      Your Journey, Our Priority
                    </h1>
                    <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "1.1rem", color: "rgba(255,255,255,0.75)", fontWeight: 500, maxWidth: 650, margin: "1rem auto 0", lineHeight: 1.5 }}>
                      With our modern fleet, professional drivers, and flexible booking options, Carolean Coaches makes every journey smooth, safe, and enjoyable.
                    </p>
                  </div>
                </div>

                {/* Overlaid booking form card */}
                <div style={{ maxWidth: 1040, margin: "-4.5rem auto 5rem", padding: "0 1.5rem", position: "relative", zIndex: 10 }}>
                  <div style={{ 
                    background: "#ffffff", 
                    borderRadius: 16, 
                    padding: "2.5rem", 
                    border: "1px solid #e2e8f0", 
                    boxShadow: "0 12px 40px rgba(13,14,72,0.06)" 
                  }}>
                    <div style={{ textAlign: "center", marginBottom: "2rem", paddingBottom: "1.25rem", borderBottom: "1px solid #f1f5f9" }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: PX.brandRed, letterSpacing: 4, textTransform: "uppercase" }}>
                        Your Perfect Ride
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      
                      {/* Segmented Journey Type Controller */}
                      <div>
                        <label style={{ display:"block", fontSize:11, fontWeight:800, color:PX.gray600, textTransform:"uppercase", letterSpacing:.35, marginBottom: 8 }}>
                          Journey Type
                        </label>
                        <div style={{ display: "flex", gap: "6px", background: "#f1f5f9", padding: "4px", borderRadius: 8, width: "fit-content" }}>
                          {[
                            {id: "return", label: "Return Trip"},
                            {id: "one-way", label: "One-Way"},
                            {id: "multi-stop", label: "Multi-Stop"}
                          ].map(type => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setJ(j => ({ ...j, journeyType: type.id }))}
                              style={{
                                background: journey.journeyType === type.id ? PX.brandRed : "transparent",
                                color: journey.journeyType === type.id ? "#fff" : PX.navy800,
                                border: "none",
                                borderRadius: 6,
                                padding: "8px 18px",
                                fontSize: 13,
                                fontWeight: 800,
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Route Input fields */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
                        <Field label="Pickup Address" required>
                          <PlacesInput value={journey.origin} placeholder="e.g. Heathrow Airport" icon={<SvgMapPinGreen />} mapsLoaded={mapsLoaded} onChange={setOrigin}/>
                        </Field>
                        <Field label="Destination" required>
                          <PlacesInput value={journey.destination} placeholder="e.g. Derby Arena" icon={<SvgMapPinRed />} mapsLoaded={mapsLoaded} onChange={setDest}/>
                        </Field>
                      </div>

                      {/* Timing details */}
                      <div style={{ display: "grid", gridTemplateColumns: showReturnDate ? "repeat(auto-fit, minmax(240px, 1fr))" : "1fr", gap: "1.25rem" }}>
                        <Field label="Travel Date & Time" required>
                          <input type="datetime-local" value={journey.departureDate} onChange={e=>setJ(j=>({...j,departureDate:e.target.value}))}/>
                        </Field>
                        {showReturnDate && (
                          <Field label="Return Date & Time" required>
                            <input type="datetime-local" value={journey.returnDate} onChange={e=>setJ(j=>({...j,returnDate:e.target.value}))}/>
                          </Field>
                        )}
                      </div>

                      {/* DYNAMIC MULTI-STOP ROW */}
                      {journey.journeyType === "multi-stop" && (
                        <div style={{ padding:"1.25rem", background:"#f8fafc", borderRadius:8, border:`1.5px dashed #dde0e8` }}>
                          <div style={{ fontSize:12, fontWeight:800, color:PX.navy800, marginBottom:"0.75rem", textTransform:"uppercase" }}>Intermediate stops</div>
                          {(journey.stops || []).map((s,i)=>(
                            <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr auto auto", gap:8, marginBottom:8, alignItems:"center" }}>
                              <PlacesInput value={s.place} placeholder={`Stop ${i+1}`} icon={<SvgMapPinBlue />} mapsLoaded={mapsLoaded}
                                onChange={(val,coords)=>{ updateStop(i,"place",val); if(coords) updateStop(i,"coords",coords); }}/>
                              <select value={s.wait} style={{ width:120 }} onChange={e=>updateStop(i,"wait",e.target.value)}>
                                {[15,30,45,60,90,120,180].map(m=><option key={m} value={m}>{m} min wait</option>)}
                              </select>
                              <button type="button" onClick={()=>removeStop(i)} style={{ width:44,height:44,borderRadius:8,border:"none",
                                background:PX.red100,color:PX.red700,cursor:"pointer",fontWeight:700,fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}><SvgClose size={18} /></button>
                            </div>
                          ))}
                          <Btn variant="ghost" size="sm" onClick={addStop}>＋ Add stop</Btn>
                        </div>
                      )}

                      {/* ROW 4: Load & Luggage */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
                          <Field label="Number of Passengers" required>
                            <div style={{ display:"flex", height: 42 }}>
                              <button type="button" onClick={()=>{
                                const p = Math.max(1,journey.passengers-1);
                                setJ(j=>({...j,passengers:p, suitcaseCount:p, handbagCount:p}));
                              }}
                                style={{ width:40,border:`1.5px solid #dde0e8`,borderRight:"none",
                                  borderRadius:"6px 0 0 6px",background:"#fff",cursor:"pointer",fontSize:16,fontWeight:700,color:PX.navy800 }}>−</button>
                              <input type="number" min={1} max={70} value={journey.passengers}
                                onChange={e=>{
                                  const p = parseInt(e.target.value)||16;
                                  setJ(j=>({...j,passengers:p, suitcaseCount:p, handbagCount:p}));
                                }}
                                style={{ width:60,textAlign:"center",borderRadius:0,borderLeft:"none",borderRight:"none",height:"100%",fontWeight:700, border:`1.5px solid #dde0e8`, borderLeftWidth:0, borderRightWidth:0 }}/>
                              <button type="button" onClick={()=>{
                                const p = Math.min(70,journey.passengers+1);
                                setJ(j=>({...j,passengers:p, suitcaseCount:p, handbagCount:p}));
                              }}
                                style={{ width:40,border:`1.5px solid #dde0e8`,borderLeft:"none",
                                  borderRadius:"0 6px 6px 0",background:"#fff",cursor:"pointer",fontSize:16,fontWeight:700,color:PX.navy800 }}>＋</button>
                            </div>
                          </Field>
                          <Field label="Luggage Requirements">
                            <div style={{ display:"flex", height: 42 }}>
                              <select 
                                value={journey.activeLuggageType || 'none'} 
                                onChange={e=>setJ(j=>({...j,activeLuggageType:e.target.value}))}
                                style={{ flex: 1, borderRadius:"6px 0 0 6px", borderRight:"none", border:`1.5px solid #dde0e8`, borderRightWidth:0 }}
                              >
                                <option value="none">None</option>
                                <option value="suitcase">Suitcase (23kg)</option>
                                <option value="handbag">Hand carry</option>
                              </select>
                              
                              <button type="button" 
                                disabled={!journey.activeLuggageType || journey.activeLuggageType === 'none'}
                                onClick={()=>{
                                  if (journey.activeLuggageType === 'suitcase') setJ(j=>({...j,suitcaseCount:Math.max(0,(j.suitcaseCount||0)-1)}));
                                  else if (journey.activeLuggageType === 'handbag') setJ(j=>({...j,handbagCount:Math.max(0,(j.handbagCount||0)-1)}));
                                }}
                                style={{ width:40,border:`1.5px solid #dde0e8`,borderRight:"none", borderLeft:"none",
                                  background: (!journey.activeLuggageType || journey.activeLuggageType === 'none') ? "#f9fafb" : "#fff",
                                  cursor:(!journey.activeLuggageType || journey.activeLuggageType === 'none')?"default":"pointer",fontSize:16,fontWeight:700,color:PX.navy800 }}>−</button>
                              
                              <input type="number" min={0} 
                                disabled={!journey.activeLuggageType || journey.activeLuggageType === 'none'}
                                value={(!journey.activeLuggageType || journey.activeLuggageType === 'none') ? 0 : (journey.activeLuggageType === 'suitcase' ? (journey.suitcaseCount||0) : (journey.handbagCount||0))}
                                onChange={e=>{
                                  const v = parseInt(e.target.value)||0;
                                  if (journey.activeLuggageType === 'suitcase') setJ(j=>({...j,suitcaseCount:v}));
                                  else if (journey.activeLuggageType === 'handbag') setJ(j=>({...j,handbagCount:v}));
                                }}
                                style={{ width:46,textAlign:"center",borderRadius:0,borderLeft:"none",borderRight:"none",height:"100%", padding:0, border:`1.5px solid #dde0e8`, borderLeftWidth:0, borderRightWidth:0,
                                  background: (!journey.activeLuggageType || journey.activeLuggageType === 'none') ? "#f9fafb" : "#fff" }}/>
                              
                              <button type="button" 
                                disabled={!journey.activeLuggageType || journey.activeLuggageType === 'none'}
                                onClick={()=>{
                                  if (journey.activeLuggageType === 'suitcase') setJ(j=>({...j,suitcaseCount:(j.suitcaseCount||0)+1}));
                                  else if (journey.activeLuggageType === 'handbag') setJ(j=>({...j,handbagCount:(j.handbagCount||0)+1}));
                                }}
                                style={{ width:40,border:`1.5px solid #dde0e8`,borderLeft:"none",
                                  borderRadius:"0 6px 6px 0",
                                  background: (!journey.activeLuggageType || journey.activeLuggageType === 'none') ? "#f9fafb" : "#fff",
                                  cursor:(!journey.activeLuggageType || journey.activeLuggageType === 'none')?"default":"pointer",fontSize:16,fontWeight:700,color:PX.navy800 }}>＋</button>
                            </div>
                          </Field>
                        </div>

                        {/* ROW 4: Special Requests */}
                        <div>
                          <Field label="Special Requests">
                            <input type="text" placeholder="e.g. Wheelchair access, extra stops" value={journey.specialRequests} onChange={e=>setJ(j=>({...j,specialRequests:e.target.value}))}/>
                          </Field>
                        </div>

                        {/* ROW 5: Customer Contact Info */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
                          <Field label="Full Name" required>
                            <input type="text" placeholder="e.g. John Doe" value={journey.name} onChange={e=>setJ(j=>({...j,name:e.target.value}))}/>
                          </Field>
                          <Field label="Email Address" required>
                            <input type="email" placeholder="e.g. john@example.com" value={journey.email} onChange={e=>setJ(j=>({...j,email:e.target.value}))}/>
                          </Field>
                          <Field label="Phone" required>
                            <input type="text" placeholder="e.g. +44 7700 900077" value={journey.phone} onChange={e=>setJ(j=>({...j,phone:e.target.value}))}/>
                          </Field>
                        </div>

                        {validationError && (
                          <div style={{ background: PX.red100, border: `1px solid ${PX.red700}`, color: PX.red700, borderRadius: 8, padding: "10px 14px", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                            <SvgAlert size={14} /> {validationError}
                          </div>
                        )}

                        {/* CALCULATION TRIGGERS */}
                        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:10 }}>
                          <Btn variant="primary" size="lg" onClick={handleCalculateClick} disabled={loadingQuotes}>
                            {loadingQuotes ? <><span className="spinning" style={{ marginRight: 6 }}>⟳</span> Re-calculating...</> : "Get instant quote →"}
                          </Btn>
                        </div>

                      </div>

                    </div>

                  </div>
                </div>
              ) : (
                /* PAGE 2: QUOTATION PRICE SCREEN */
                <main style={{ maxWidth:1160, margin:"0 auto", padding:"2.5rem 1.5rem 5rem" }} className="fade-up">
                  
                  {/* Sleek Horizontal Dark Journey Summary Header */}
                  <div style={{ 
                    background: `linear-gradient(135deg, ${PX.navy800} 0%, ${PX.navy700} 100%)`,
                    borderRadius: 12,
                    padding: "20px 24px",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.75rem",
                    boxShadow: "0 4px 20px rgba(13,14,72,0.12)",
                    flexWrap: "wrap",
                    gap: 12
                  }}>
                    <div>
                      <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
                        <span>{journey.origin.split(',')[0]}</span>
                        <span style={{ color: PX.brandRed }}>→</span>
                        <span>{journey.destination.split(',')[0]}</span>
                      </div>
                      <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", marginTop: 4, fontWeight: 500 }}>
                        {journey.departureDate ? new Date(journey.departureDate).toLocaleString("en-GB") : ""} · {journey.passengers} Passengers · {journey.journeyType === "one-way" ? "One-way" : journey.journeyType === "return" ? "Return" : "Multi-stop"}
                      </div>
                    </div>
                    <Btn variant="ghost" size="sm" onClick={() => setShowQuotes(false)} style={{ color: "#fff", borderColor: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.06)", borderRadius: 30 }}>
                      ← Edit details
                    </Btn>
                  </div>

                  {/* 2-Column Responsive Dashboard Layout */}
                  <div className="results-layout">
                    
                    {/* LEFT COLUMN: Available Options */}
                    <div className="left-panel-options">
                      <Card style={{ padding: "2rem" }}>
                        <SectionHead sub={`${journey.passengers} passengers · ${(journey.journeyType).replace("-"," ")}`}>
                          Available Options
                        </SectionHead>
                        
                        {loadingQuotes && quotes.length === 0 ? (
                          <div style={{ padding: "2.5rem", textAlign: "center", color: PX.gray600 }}>
                            <span className="spinning" style={{ marginRight: 8 }}>⟳</span> Fetching live options...
                          </div>
                        ) : (
                          quotes.map(({vehicle, result}) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} result={result}
                              selected={selected} onSelect={setSel}
                              passengers={journey.passengers} suitcaseCount={journey.suitcaseCount}
                              handbagCount={journey.handbagCount}/>
                          ))
                        )}
                      </Card>
                    </div>

                    {/* RIGHT COLUMN: Map Card & Stacked Checkout Form */}
                    <div className="right-panel-map" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      
                      {/* Map Card */}
                      <Card style={{ padding: "1.5rem" }}>
                        <div style={{ fontSize:14, fontWeight:800, color:PX.navy800, marginBottom:"0.75rem", display:"flex", alignItems:"center", gap:8 }}>
                          <SvgMap /> Route Planning & Dead Mileage
                        </div>
                        
                        <RouteMap result={activeResult} journey={journey} gv={db.globalVars} />
                      </Card>

                      {/* Checkout Card */}
                      {selected && (
                        <Card style={{ border: `1.5px solid #10b981`, background: "#f0fdf4", padding: "1.5rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                            <div>
                              <span style={{ fontSize: 11, fontWeight: 800, color: "#15803d", textTransform: "uppercase", letterSpacing: 0.5 }}>Selected Category</span>
                              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 900, color: PX.navy800, marginTop: 2 }}>{selectedQuote?.vehicle?.name}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span style={{ fontSize: 11, fontWeight: 800, color: PX.gray500, textTransform: "uppercase" }}>Est. Fare</span>
                              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 900, color: PX.brandRed, marginTop: 2 }}>£{fmt(activeResult?.finalPrice || 0)}</div>
                            </div>
                          </div>
                          
                          {submitted ? (
                            <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
                              <div style={{ display: "inline-flex", background: PX.teal100, borderRadius: "50%", padding: 8, marginBottom: 8, color: PX.teal700 }}>
                                <SvgCheck size={24} />
                              </div>
                              <h3 style={{ fontSize: 16, fontWeight: 800, color: PX.teal700, marginBottom: 4 }}>Request Successfully Sent!</h3>
                              <p style={{ fontSize: 12, color: PX.gray600 }}>We will contact you at <strong>{journey.email}</strong> within 2 hours.</p>
                              <div style={{ background: PX.gray100, padding: "6px 12px", borderRadius: 6, display: "inline-block", fontFamily: "monospace", fontWeight: 700, fontSize: 12, color: PX.navy800, marginTop: 8 }}>
                                REF: {bookingRef}
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                              <Field label="Company / Organisation Name (Optional)">
                                <input type="text" placeholder="e.g. Acme Corporation" value={journey.company} onChange={e=>setJ(j=>({...j,company:e.target.value}))}/>
                              </Field>
                              <Btn variant="teal" size="md" full onClick={handleFinalBookingSubmit} disabled={submitting}>
                                {submitting ? <><span className="spinning" style={{ marginRight: 6 }}>⟳</span> Sending...</> : "Submit Quote Request"}
                              </Btn>
                              <p style={{ fontSize: 9.5, color: PX.gray400, textAlign: "center" }}>
                                This request is non-binding and subject to final vehicle/driver dispatch confirmation.
                              </p>
                            </div>
                          )}
                        </Card>
                      )}

                      {/* Operational Base Depot Box */}
                      <div style={{ padding:"12px 16px", background:"#fff", borderRadius:8, fontSize:11.5, color:PX.gray600, border:`1px solid #dde0e8`, lineHeight: 1.4 }}>
                        <strong>Operational Base Depot:</strong> Unit 1, Bentley Lane, Walsall WS2 8TL<br/>
                        <span style={{ color:PX.gray500, fontSize:10.5, marginTop:3, display:"inline-block" }}>All coach hires require calculation of dead mileage (empty routing from and to the Walsall depot base). Included above.</span>
                      </div>

                    </div>

                  </div>
                </main>
              )}

            </div>
        )}
        
        <footer style={{ background: PX.offWhite, borderTop: `1px solid ${PX.gray200}`, padding: "2rem 1.5rem", textAlign: "center", fontSize: 12, color: PX.gray600 }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <strong>Carolean Coaches Ltd</strong> · Unit 1, Bentley Lane, Walsall WS2 8TL
            </div>
            <div>
              PSV Operator License: PM0003456 · Fare Engine v3.0
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
