// @ts-nocheck


'use client';
import { ApiRequestError, requestJson } from '../lib/api';

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import LeafletMapPickerModal from "./LeafletMapPickerModal";
import LeafletRouteMap from "./LeafletRouteMap";

declare global {
  interface Window {
    google: any;
    __gmCb: any;
  }
}


const PX = {
  navy800: "#0D0E48",       
  navy700: "#13155C",       
  navy600: "#1E228E",       
  brandRed: "#CD202C",      
  brandRedHover: "#b01c26", 
  amber500: "#E6A11D",      
  amber400: "#d4a832",
  amber100: "#fdf3dc",
  teal700: "#0c6e55",
  teal100: "#e0f5ef",
  red700: "#b91c1c",
  red100: "#fee2e2",
  gray50: "#f8fafc",        
  gray100: "#f1f5f9",
  gray200: "#e2e8f0",
  gray400: "#94a3b8",
  gray600: "#475569",
  gray900: "#0f172a",
  offWhite: "#f4f5f7",
};

const PUBLIC_CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || '';
const PUBLIC_CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || '';
const PUBLIC_CONTACT_ADDRESS = process.env.NEXT_PUBLIC_CONTACT_ADDRESS?.trim() || '';


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

function SvgCheck({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <polyline points="20 6 9 17 4 12" />
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


function GlobalStyle() {
  return <style dangerouslySetInnerHTML={{ __html: `
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

      /* â”€â”€ Base inputs â”€â”€ */
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

      /* Customer fast-quote fields are scoped so admin inputs stay compact. */
      #fast-quote .quote-location input[type="text"],
      #fast-quote input[type="datetime-local"] {
        width: 100% !important;
        height: 58px !important;
        min-height: 58px !important;
        padding: 0 52px !important;
        border: 1px solid #c7c5d1 !important;
        border-radius: 9999px !important;
        background: #fff !important;
        color: #1c1b1b !important;
        font-size: 16px !important;
        line-height: 58px !important;
        box-shadow: 0 1px 2px rgba(29, 34, 92, 0.06) !important;
      }
      #fast-quote .quote-location input[type="text"]::placeholder {
        color: #b8b7bd !important;
        opacity: 1;
      }
      #fast-quote .quote-location input[type="text"]:focus,
      #fast-quote input[type="datetime-local"]:focus {
        border-color: #1d225c !important;
        box-shadow: 0 0 0 4px rgba(29, 34, 92, 0.08) !important;
      }
      #fast-quote input[type="datetime-local"] {
        padding-right: 20px !important;
      }
      #fast-quote input[type="datetime-local"]::-webkit-calendar-picker-indicator {
        width: 20px;
        height: 20px;
        cursor: pointer;
        opacity: .85;
      }
      #fast-quote .luggage-select {
        display: block !important;
        width: auto !important;
        max-width: 70px !important;
        height: 20px !important;
        min-height: 20px !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 4px !important;
        background-color: transparent !important;
        color: #475569 !important;
        font-size: 9.5px !important;
        font-weight: 800 !important;
        line-height: 20px !important;
        text-align: center;
        text-align-last: center;
        text-transform: uppercase;
        box-shadow: none !important;
        cursor: pointer;
        appearance: none !important;
        -webkit-appearance: none !important;
      }
      #fast-quote .luggage-select:focus {
        background-color: #f1f5f9 !important;
        outline: 2px solid rgba(29, 34, 92, .18) !important;
      }
      #fast-quote .quote-details-field {
        width: 100% !important;
        height: 52px !important;
        padding: 0 18px !important;
        border: 1px solid #c7c5d1 !important;
        border-radius: 14px !important;
        background: #fff !important;
        color: #1c1b1b !important;
        font-size: 15px !important;
        text-align: left !important;
      }
      #fast-quote .quote-details-field:invalid:not(:placeholder-shown) {
        border-color: #ef4444 !important;
        background-color: #fef2f2 !important;
        color: #b91c1c !important;
      }
      #fast-quote textarea.quote-details-field {
        height: 104px !important;
        padding: 14px 18px !important;
        line-height: 1.45 !important;
        resize: vertical;
      }
      #fast-quote .quote-details-field:focus {
        border-color: #1d225c !important;
        box-shadow: 0 0 0 4px rgba(29, 34, 92, .08) !important;
        outline: none;
      }
      .newsletter-email {
        width: 100% !important;
        height: 54px !important;
        padding: 0 24px !important;
        border: 0 !important;
        border-radius: 9999px !important;
        background: transparent !important;
        color: #fff !important;
        font-size: 15px !important;
        box-shadow: none !important;
      }
      .newsletter-email::placeholder {
        color: rgba(255,255,255,.6) !important;
      }
      /* Form-only integration surface for embedding on the company website. */
      .booking-embed-root {
        min-height: 0 !important;
        background: transparent !important;
      }
      .booking-embed-root #main-nav,
      .booking-embed-root .booking-hero-background,
      .booking-embed-root .booking-hero-copy,
      .booking-embed-root main > section:not(:first-child),
      .booking-embed-root footer {
        display: none !important;
      }
      .booking-embed-root main {
        padding: 0 !important;
      }
      .booking-embed-root main > section:first-child {
        min-height: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
      }
      .booking-embed-root .booking-hero-grid {
        display: block !important;
        width: 100% !important;
        max-width: 520px !important;
        padding: 0 !important;
        margin: 0 auto !important;
      }
      .booking-embed-root .booking-form-column {
        display: block !important;
      }
      .booking-embed-root #fast-quote {
        transform: none !important;
        margin: 0 auto !important;
      }

      /* â”€â”€ Animations â”€â”€ */
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes spin { to { transform: rotate(360deg); } }

      .fade-up { animation: fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .spinning { animation: spin 1s linear infinite; display: inline-block; }

      /* â”€â”€ Google Places autocomplete â”€â”€ */
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

      /* â”€â”€ Scrollbar â”€â”€ */
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
      ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

      /* â”€â”€ Quotation results layout â”€â”€ */
      .results-layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.25rem;
        align-items: start;
      }
      .results-layout > * { min-width: 0; }
      .results-layout-empty { grid-template-columns: minmax(0, 1fr); }
      .customer-details-form { width: 100%; min-width: 0; }
      .customer-details-form > div { min-width: 0; }
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

      /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
         PREMIUM ADMIN DASHBOARD DESIGN SYSTEM
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

      /* Root wrapper â€” used to scope all admin overrides */
      .adm-root {
        display: flex;
        min-height: 100vh;
        background: #f7f8fa;
        font-family: 'Figtree', sans-serif;
      }

      /* â”€â”€ Admin-scoped input overrides â”€â”€ */
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

      /* Form panel inside a section â€” white background, proper padding */
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

      /* â”€â”€ Admin table â”€â”€ */
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
    ` }} />;
}


function useGoogleMaps(apiKey: string | undefined) {
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable' | 'failed'>(
    apiKey?.trim() ? 'loading' : 'unavailable'
  );
  useEffect(() => {
    if (!apiKey?.trim()) {
      setLoaded(false);
      setStatus('unavailable');
      return;
    }
    if (window.google?.maps?.places) {
      setLoaded(true);
      setStatus('ready');
      return;
    }
    setStatus('loading');
    const loadTimeout = window.setTimeout(() => {
      setLoaded(false);
      setStatus('failed');
    }, 10000);
    let existing = document.getElementById("gm-script") as HTMLScriptElement | null;
    const markReady = () => {
      if (window.google?.maps?.places) {
        window.clearTimeout(loadTimeout);
        setLoaded(true);
        setStatus('ready');
      } else {
        setLoaded(false);
        setStatus('failed');
      }
    };
    const markFailed = () => {
      window.clearTimeout(loadTimeout);
      setLoaded(false);
      setStatus('failed');
    };
    const existingKey = existing ? new URL(existing.src, window.location.href).searchParams.get('key') : '';
    if (existing && existingKey !== apiKey.trim()) {
      existing.remove();
      existing = null;
      delete window.google;
    }
    if (existing) {
      existing.addEventListener('load', markReady);
      existing.addEventListener('error', markFailed);
      return () => {
        window.clearTimeout(loadTimeout);
        existing.removeEventListener('load', markReady);
        existing.removeEventListener('error', markFailed);
      };
    }
    const s = document.createElement("script");
    s.id = "gm-script";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey.trim()}&libraries=places,geometry&callback=__gmCb`;
    s.async = true;
    window.__gmCb = markReady;
    s.onerror = markFailed;
    document.head.appendChild(s);
    return () => { window.clearTimeout(loadTimeout); delete window.__gmCb; };
  }, [apiKey]);
  return { loaded, status };
}


function MapPickerModal(props: any) {
  return <LeafletMapPickerModal {...props} />;
}


function PlacesInput({ value, onChange, placeholder, icon, mapsLoaded, mapsStatus, onIconClick }) {
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
      <button type="button" disabled={!mapsLoaded} onClick={()=>{ if (!mapsLoaded) return; if (onIconClick) onIconClick(); else setPickerOpen(true); }} title={mapsLoaded ? "Choose on map" : mapsStatus === 'loading' ? "Loading map..." : "Map service unavailable"}
        style={{ position:"absolute", left:6, top:"50%", transform:"translateY(-50%)",
          display:"flex", alignItems:"center", zIndex:1, background:"none", border:"none", cursor:mapsLoaded?"pointer":"not-allowed", opacity:mapsLoaded?1:0.45,
          padding:"6px", borderRadius:6, transition:"background .15s" }}
        onMouseOver={e=>e.currentTarget.style.background="#f1f5f9"} onMouseOut={e=>e.currentTarget.style.background="none"}>
        {icon}
      </button>
      <input ref={inputRef} type="text" placeholder={mapsLoaded ? placeholder : `${placeholder} (type address)`} value={localVal}
        style={{ paddingLeft:38, paddingRight: 12 }}
        onChange={e => handleTextChange(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
      />
      {mounted && typeof document !== 'undefined' ? createPortal(
        <MapPickerModal isOpen={pickerOpen} onClose={()=>setPickerOpen(false)} 
          initialSearch={localVal} onConfirm={(addr, geo)=>{ setLocalVal(addr); onChange(addr, geo); setPickerOpen(false); }} />,
        document.body
      ) : null}
    </div>
  );
}


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

function fmt(n)  { return Number(n).toLocaleString("en-GB",{minimumFractionDigits:2,maximumFractionDigits:2}); }

function RouteMetrics({ result, journey }) {
  if (!result) return null;
  const days = Number(result.opDays);
  const stopCount = Array.isArray(journey?.stops) ? journey.stops.filter(stop => stop?.place).length : 0;
  const metrics = [
    ["Stops", stopCount > 0 ? stopCount : "Direct"],
    ["Days", Number.isFinite(days) ? days : 1]
  ];

  return <div className="grid grid-cols-2 gap-3 mt-3">
    {metrics.map(([label, value]) => (
      <div key={label} style={{ background:PX.gray50, border:`1px solid ${PX.gray200}`, borderRadius:8, padding:"8px", textAlign:"center" }}>
        <div style={{ fontSize:10, fontWeight:700, color:PX.gray400, textTransform:"uppercase", marginBottom:2 }}>{label}</div>
        <div style={{ fontSize:13, fontWeight:800, color:PX.navy800 }}>{value}</div>
      </div>
    ))}
  </div>;
}


function ProgressBar({ pct, color }) {
  return <div style={{ height:6, background:PX.gray200, borderRadius:10, overflow:"hidden" }}>
    <div style={{ width:`${Math.min(100,pct)}%`, height:"100%", background:color, borderRadius:10, transition:"width .4s" }}/>
  </div>;
}


function GoogleMapPreview(props: any) {
  return <LeafletRouteMap {...props} RouteMetricsComponent={RouteMetrics} />;
}

function RouteMap({ result, journey, gv, compact = false, showMetrics = true }) {
  const mapsReady = typeof window !== 'undefined' && Boolean(window.google?.maps);
  if (mapsReady && (result?.pts?.length >= 2 || journey?.origin)) {
    return <GoogleMapPreview result={result} journey={journey} gv={gv} compact={compact} showMetrics={showMetrics} />;
  }

  const message = result
    ? "The map preview is unavailable. No substitute route or distance is being drawn."
    : "Select verified pickup and drop-off locations to calculate a route.";
  return <div>
    <div role="status" style={{ display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", height:compact ? 160 : 280, gap:10, color:PX.gray600, textAlign:"center", padding:20,
      border:`1.5px dashed ${PX.gray200}`, borderRadius:12, background:PX.gray50 }}>
      <SvgMap size={36} color={PX.gray400} />
      <p style={{ fontSize:13, fontWeight:600, maxWidth:340 }}>{message}</p>
    </div>
    {showMetrics && <RouteMetrics result={result} journey={journey}/>} 
  </div>;
}

function Navbar() {
  return (
    <header style={{ background: PX.navy800, borderTop: `4px solid ${PX.brandRed}`, position:"sticky", top:0, zIndex:100, boxShadow:"0 4px 20px rgba(0,0,0,.15)" }}>
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 1.5rem",
        display:"flex", alignItems:"center", justifyContent:"space-between", height:72 }}>
        
        {}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <img src="/carolean image.png" alt="Carolean Coaches Logo" style={{ height: 32, width: "auto" }} />
          <div>
            <div style={{ color:"#fff", fontFamily:"'Outfit', sans-serif", fontWeight:900, fontSize:19, letterSpacing:-0.3, lineHeight:1.1 }}>Carolean Coaches</div>
            <div style={{ color: PX.amber500, fontSize:9, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase", marginTop: 1 }}>Premium Travel</div>
          </div>
        </div>
      </div>
    </header>
  );
}


function VehicleCard({ vehicle, result, selected, onSelect, passengers, suitcaseCount, handbagCount }) {
  const usableCapacity = vehicle.capacity || 1;
  const requiredVehicles = Math.ceil((passengers || 1) / usableCapacity);
  const totalCapacity = usableCapacity * requiredVehicles;
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
            <div style={{ fontWeight:800,fontSize:16,color:PX.navy800 }}>{vehicle.name} {vehicle.capacity} seats</div>
            <div style={{ fontSize:12,color:PX.gray600,marginTop:2 }}>{vehicle.desc}</div>
            <div style={{ fontSize:12,color:PX.gray900,marginTop:4,fontWeight:600 }}>
              Up to {usableCapacity} seats
            </div>
            <div style={{ fontSize:12,color:PX.gray600,marginTop:2,fontWeight:500 }}>ðŸ§³ {lugLabel}</div>
          </div>
        </div>
        <div style={{ textAlign:"right",flexShrink:0 }}>
          {result ? <>
            <div style={{ fontSize:22,fontWeight:800,color:PX.navy800,lineHeight:1 }}>
              {result.upperBoundPrice && result.upperBoundPrice > result.finalPrice ? `£${fmt(result.finalPrice)} – £${fmt(result.upperBoundPrice)}` : `£${fmt(result.finalPrice)}`}
            </div>
            <div style={{ fontSize:11,color:PX.gray400,fontWeight:600,marginTop:2,textTransform:"uppercase" }}>total fare</div>
            {result.belowMin && <div style={{ fontSize:10,color:PX.amber500,marginTop:2,fontWeight:600 }}>â–² Min. hire applied</div>}
          </> : <span style={{ fontSize:13,color:PX.gray400 }}>â€”</span>}
        </div>
      </div>
      <div style={{ marginTop:12 }}>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
          <span style={{ fontSize:11,color:PX.gray600,fontWeight:500 }}>Passenger load</span>
          <span style={{ fontSize:11,fontWeight:700,color:capColor }}>{passengers}/{totalCapacity} seats ({pct}%)</span>
        </div>
        <ProgressBar pct={pct} color={capColor}/>
        {requiredVehicles > 1 && (
          <div style={{ fontSize: 11, color: PX.gray600, marginTop: 6, fontWeight: 500, background: "#f1f5f9", padding: "6px 10px", borderRadius: 6 }}>
             <strong style={{color: PX.navy800}}>Vehicle Breakdown:</strong> {Array.from({length: requiredVehicles}).map((_, i) => {
               const pax = i === requiredVehicles - 1 ? passengers - (usableCapacity * i) : usableCapacity;
               const vName = (vehicle.name || '').toLowerCase().includes('coach') ? 'Coach' : 'Vehicle';
               return `${vName} ${i+1}: ${pax} passengers`;
             }).join(" â€¢ ")}
          </div>
        )}
      </div>
      <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginTop:12 }}>
        {isSel && <Badge color="green"><SvgCheck size={10} style={{ marginRight: 3 }} /> Selected</Badge>}
        {!paxOk && <Badge color="amber"><SvgAlert size={10} style={{ marginRight: 3 }} /> {requiredVehicles} Vehicles Required</Badge>}
        {!lugOk && <Badge color="amber">Limited luggage capacity</Badge>}
        {result?.dualCrew && <Badge color="amber">âš¡ Dual crew required (9h+)</Badge>}
        {result?.surchargeLines?.map(s=><Badge key={s.label} color="gray">{s.label}</Badge>)}
      </div>
    </div>
  );
}

function isTrustedQuote(quote) {
  if (!quote || typeof quote !== 'object' || !quote.vehicle || !quote.result) return false;
  const vehicle = quote.vehicle;
  const result = quote.result;
  if (!String(vehicle.id || '').trim() || !String(vehicle.name || '').trim()) return false;
  if (!Number.isFinite(Number(vehicle.capacity)) || Number(vehicle.capacity) <= 0) return false;
  const requiredNumbers = [
    result.finalPrice,
    result.totalKm,
    result.revenueKm,
    result.totalShiftHrs,
    result.opDays,
  ];
  if (requiredNumbers.some(value => !Number.isFinite(Number(value)) || Number(value) < 0)) return false;
  if (result.upperBoundPrice !== undefined && result.upperBoundPrice !== null) {
    const upperBound = Number(result.upperBoundPrice);
    if (!Number.isFinite(upperBound) || upperBound < Number(result.finalPrice)) return false;
  }
  return true;
}

function quoteFailureMessage(error) {
  if (!(error instanceof ApiRequestError)) {
    return 'A verified quote could not be created. No estimated price has been shown.';
  }
  if (error.code === 'network') {
    return 'The pricing server is unavailable. No mileage or price has been estimated. Please try again when the service is connected.';
  }
  if (error.code === 'timeout') {
    return 'The pricing server did not respond in time. No mileage or price has been estimated.';
  }
  if (error.code === 'invalid-response') {
    return 'The pricing server returned an invalid response. No mileage or price has been estimated.';
  }
  const message = String(error.message || '').toLowerCase();
  if (/google maps|mileage|road route|depot|yard location/.test(message)) {
    return 'Live route calculation is unavailable. (Error: ' + error.message + ')';
  }
  if (/pricing configuration|database|not initialized|missing|invalid/.test(message)) {
    return 'Online pricing is unavailable because its business configuration is incomplete. No price has been estimated.';
  }
  if (error.status === 400 && error.message) return error.message;
  return 'The pricing service could not create a verified quote. No estimated price has been shown.';
}

function bookingFailureMessage(error) {
  if (error instanceof ApiRequestError) {
    if (error.code === 'network') return 'The booking server is unavailable. Your request has not been recorded.';
    if (error.code === 'timeout') return 'The booking server did not confirm the request in time. Your booking is not confirmed; please try again.';
    if (error.code === 'invalid-response') return 'The booking server did not provide a valid confirmation. Your booking is not confirmed.';
    if (error.status === 400 && error.message) return `${error.message} Your request has not been recorded.`;
  }
  return 'The server did not confirm that your booking was saved. Your booking is not confirmed.';
}

function localDateTimeTimestamp(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return Number.NaN;
  const [, year, month, day, hour, minute, second = '0'] = match;
  const timestamp = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
  const parsed = new Date(timestamp);
  if (
    parsed.getUTCFullYear() !== Number(year) ||
    parsed.getUTCMonth() !== Number(month) - 1 ||
    parsed.getUTCDate() !== Number(day) ||
    parsed.getUTCHours() !== Number(hour) ||
    parsed.getUTCMinutes() !== Number(minute)
  ) return Number.NaN;
  return timestamp;
}

function isReturnAfterDeparture(departureValue, returnValue) {
  const departure = localDateTimeTimestamp(departureValue);
  const returning = localDateTimeTimestamp(returnValue);
  return Number.isFinite(departure) && Number.isFinite(returning) && returning > departure;
}

function sameDayAfterDeparture(value) {
  const p = dateTimeParts(value);
  if (!p) return '';
  const minutes = p.h * 60 + p.mi + 30;
  if (minutes > 1439) return new Date(localDateTimeTimestamp(value) + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
  return dateTimeValue(p.y, p.mo, p.d, Math.floor(minutes / 60), minutes % 60);
}

function nowLocalDateTime() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

const WEEKDAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_LETTER = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function pad2(n) { return String(n).padStart(2, '0'); }

function dateTimeParts(value) {
  const m = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return null;
  return { y: +m[1], mo: +m[2], d: +m[3], h: +m[4], mi: +m[5] };
}

function dateTimeValue(y, mo, d, h, mi) {
  return `${y}-${pad2(mo)}-${pad2(d)}T${pad2(h)}:${pad2(mi)}`;
}

function weekdayOf(y, mo, d) {
  return new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
}

function daysInMonth(y, mo) {
  return new Date(Date.UTC(y, mo, 0)).getUTCDate();
}

function formatShortDateTime(value) {
  const p = dateTimeParts(value);
  if (!p) return '';
  return `${WEEKDAY_ABBR[weekdayOf(p.y, p.mo, p.d)]} ${p.d} ${MONTH_ABBR[p.mo - 1]} · ${pad2(p.h)}:${pad2(p.mi)}`;
}

const TIME_PRESET_GROUPS = [
  { label: 'Early morning presets', start: 0, end: 5 * 60 },
  { label: 'Morning presets', start: 5 * 60, end: 12 * 60 },
  { label: 'Afternoon presets', start: 12 * 60, end: 17 * 60 },
  { label: 'Evening presets', start: 17 * 60, end: 22 * 60 },
  { label: 'Night presets', start: 22 * 60, end: 24 * 60 },
];

function timePresets(startMin, endMin) {
  const out = [];
  for (let m = startMin; m < endMin; m += 30) out.push(m);
  return out;
}

function DateTimeField({ value, onOpen, accent = 'indigo', placeholder = 'Select date & time' }) {
  const accentBg = 'bg-gray-100 text-gray-500';
  return (
    <button type="button" onClick={onOpen} style={{ border: '1px solid #c7c5d1' }} className="capsule-input w-full flex items-center gap-3 pl-3 pr-4 py-2.5 bg-white hover:bg-surface-container/30 transition-all text-left shadow-sm">
      <span className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${accentBg}`}>
        <span className="material-symbols-outlined text-[18px]">calendar_month</span>
      </span>
      <span className={`text-[13px] font-semibold truncate ${value ? "text-on-surface" : "text-gray-400"}`}>
        {value ? formatShortDateTime(value) : placeholder}
      </span>
    </button>
  );
}

// Renders in place of the normal form, inside the same #fast-quote card - not a popup/modal, matches the design where the card itself becomes the calendar.
function DateTimePanel({ value, onChange, onBack, minValue }) {
  const minParts = dateTimeParts(minValue) || dateTimeParts(nowLocalDateTime());
  const todayParts = dateTimeParts(nowLocalDateTime());
  const minDayTs = Date.UTC(minParts.y, minParts.mo - 1, minParts.d);
  const existing = dateTimeParts(value);
  const initial = existing || minParts;

  const [viewY, setViewY] = useState(initial.y);
  const [viewMo, setViewMo] = useState(initial.mo);
  const [selDay, setSelDay] = useState(existing ? { y: initial.y, mo: initial.mo, d: initial.d } : null);
  const [hour, setHour] = useState(initial.h);
  const [minute, setMinute] = useState(initial.mi);

  const goMonth = delta => {
    let mo = viewMo + delta, y = viewY;
    if (mo < 1) { mo = 12; y -= 1; }
    if (mo > 12) { mo = 1; y += 1; }
    setViewY(y); setViewMo(mo);
  };

  const bumpMinute = delta => {
    const total = (((hour * 60 + minute + delta) % 1440) + 1440) % 1440;
    setHour(Math.floor(total / 60));
    setMinute(total % 60);
  };

  const firstWeekday = weekdayOf(viewY, viewMo, 1);
  const totalDays = daysInMonth(viewY, viewMo);
  const prevMonthDays = daysInMonth(viewMo === 1 ? viewY - 1 : viewY, viewMo === 1 ? 12 : viewMo - 1);
  // Always 42 cells (6 full weeks) so every row is complete and the grid is the same height every month.
  const cells = [];
  for (let i = firstWeekday - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, outside: true });
  for (let d = 1; d <= totalDays; d++) cells.push({ day: d, outside: false });
  for (let d = 1; cells.length < 42; d++) cells.push({ day: d, outside: true });

  return (
    <div className="fade-up flex flex-col rounded-[1.75rem] shadow-2xl border border-outline-variant/60 overflow-hidden bg-white" style={{ height: "min(380px, 78vh)" }}>
      <div className="bg-deep-navy text-white px-5 py-4 flex items-center gap-3 shrink-0">
        <button type="button" onClick={onBack} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-[18px]">arrow_back</span></button>
        <span className="font-bold text-[15px] flex-1">{MONTH_FULL[viewMo - 1]} {viewY}</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => goMonth(-1)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
          <button type="button" onClick={() => goMonth(1)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6 grid grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Left column: calendar + quick date presets - fixed, never scrolls */}
        <div className="min-w-0">
          <div className="grid grid-cols-7 gap-0.5 mb-2">
            {WEEKDAY_LETTER.map((w, i) => <div key={i} className="text-center text-[11px] font-bold text-gray-400">{w}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-x-0.5 gap-y-4">
            {cells.map(({ day: d, outside }, i) => {
              if (outside) {
                return <div key={i} className="aspect-square text-[13px] font-semibold flex items-center justify-center text-gray-300">{d}</div>;
              }
              const dayTs = Date.UTC(viewY, viewMo - 1, d);
              const disabled = dayTs < minDayTs;
              const isToday = todayParts && todayParts.y === viewY && todayParts.mo === viewMo && todayParts.d === d;
              const isSelected = selDay && selDay.y === viewY && selDay.mo === viewMo && selDay.d === d;
              return (
                <button key={i} type="button" disabled={disabled} onClick={() => setSelDay({ y: viewY, mo: viewMo, d })}
                  style={isToday && !isSelected ? { border: '1px solid #1D225C' } : undefined}
                  className={`aspect-square rounded-full text-[14px] font-semibold flex items-center justify-center transition-all
                    ${isSelected ? "bg-impact-red text-white" : isToday ? "text-deep-navy" : disabled ? "text-gray-300 cursor-not-allowed" : "text-on-surface hover:bg-surface-container"}`}>
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: label/stepper stay fixed, only the preset list below scrolls */}
        <div className="min-w-0 flex flex-col min-h-0">
          <div className="shrink-0">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-[14px] text-gray-400">schedule</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Pick-up time</span>
            </div>
            <div style={{ border: '1px solid #c7c5d1' }} className="flex items-center justify-center gap-1 bg-white rounded-xl px-2 py-1 mb-1 w-full">
              <input type="text" inputMode="numeric" aria-label="Hour" value={pad2(hour)} onFocus={e => e.target.select()}
                onChange={e => { const digits = e.target.value.replace(/\D/g, '').slice(-2); setHour(digits === '' ? 0 : Math.min(23, parseInt(digits, 10))); }}
                onKeyDown={e => { if (e.key === 'ArrowUp') { e.preventDefault(); setHour(h => (h + 1) % 24); } else if (e.key === 'ArrowDown') { e.preventDefault(); setHour(h => (h + 23) % 24); } }}
                style={{ fontSize: 14, lineHeight: 1, width: 24, padding: 0, margin: 0, border: 'none', background: 'transparent' }} className="font-bold text-deep-navy tabular-nums outline-none text-center" />
              <span style={{ fontSize: 14, lineHeight: 1 }} className="font-bold text-deep-navy">:</span>
              <input type="text" inputMode="numeric" aria-label="Minute" value={pad2(minute)} onFocus={e => e.target.select()}
                onChange={e => { const digits = e.target.value.replace(/\D/g, '').slice(-2); setMinute(digits === '' ? 0 : Math.min(59, parseInt(digits, 10))); }}
                onKeyDown={e => { if (e.key === 'ArrowUp') { e.preventDefault(); setMinute(m => (m + 1) % 60); } else if (e.key === 'ArrowDown') { e.preventDefault(); setMinute(m => (m + 59) % 60); } }}
                style={{ fontSize: 14, lineHeight: 1, width: 24, padding: 0, margin: 0, border: 'none', background: 'transparent' }} className="font-bold text-deep-navy tabular-nums outline-none text-center" />
              <div className="flex flex-col ml-0.5">
                <button type="button" aria-label="Later" onClick={() => bumpMinute(5)} style={{ height: 11, lineHeight: 1 }} className="text-gray-400 hover:text-deep-navy flex items-center"><span style={{ fontSize: 11, lineHeight: 1 }} className="material-symbols-outlined">keyboard_arrow_up</span></button>
                <button type="button" aria-label="Earlier" onClick={() => bumpMinute(-5)} style={{ height: 11, lineHeight: 1 }} className="text-gray-400 hover:text-deep-navy flex items-center"><span style={{ fontSize: 11, lineHeight: 1 }} className="material-symbols-outlined">keyboard_arrow_down</span></button>
              </div>
            </div>
            <div className="text-[10px] text-gray-400 mb-3">Any minute &middot; 24h</div>
          </div>

          <div className="overflow-y-auto min-h-0 pr-1 flex-1">
            {TIME_PRESET_GROUPS.map(group => (
              <div key={group.label} className="mb-3">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">{group.label}</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {timePresets(group.start, group.end).map(mins => {
                    const h = Math.floor(mins / 60), mi = mins % 60;
                    const active = hour === h && minute === mi;
                    return (
                      <button key={mins} type="button" onClick={() => { setHour(h); setMinute(mi); }}
                        style={{ border: active ? '1px solid #D2232A' : '1px solid #c7c5d1' }}
                        className={`h-7 rounded-full text-[10px] font-bold transition-all ${active ? "bg-impact-red text-white" : "text-deep-navy hover:bg-surface-container/40"}`}>
                        {pad2(h)}:{pad2(mi)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-2 border-t border-outline-variant flex items-center justify-between shrink-0 bg-white">
        <button type="button" onClick={() => { onChange(''); onBack(); }} className="text-[13px] font-bold text-gray-400 hover:text-impact-red">Clear</button>
        <button type="button" disabled={!selDay} onClick={() => { if (selDay) onChange(dateTimeValue(selDay.y, selDay.mo, selDay.d, hour, minute)); }}
          className="px-6 py-1.5 rounded-full bg-deep-navy text-white text-[13px] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">Done</button>
      </div>
    </div>
  );
}

function vehicleCapacity(vehiclePreference) {
  if (vehiclePreference === 'bus') return 33;
  if (vehiclePreference === 'coach') return 49;
  return 16;
}




export default function App({ embed = false }) {
  // Customer is a public app; admin-only business data is not available here.
  // Keep the existing public fallbacks so rendering never depends on an undefined db.
  const db = { globalVars: {}, operatorDetails: {} };

  useEffect(() => {
    if (!embed) return;
    const previousBackground = document.body.style.background;
    document.body.style.background = "transparent";
    return () => {
      document.body.style.background = previousBackground;
    };
  }, [embed]);

  const [journey, setJ]     = useState({
    journeyType:"one-way", origin:"", destination:"",
    departureDate:"", returnDate:"",
    passengers:16, suitcaseCount:16, handbagCount:0, waitingMins:0,
    vehiclePreference: "",
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
  const [submissionError, setSubmissionError] = useState("");
  const [bookingStep, setBookingStep] = useState(1);
  const [activeDatePicker, setActiveDatePicker] = useState(null); // 'departure' | 'return' | null - which field's calendar is showing in place of the form
  const fetchIdRef = useRef(0);
  const [validationError, setValidationError] = useState("");

  const [mapsApiKey, setMapsApiKey] = useState(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "");
  useEffect(() => {
    // Already have a build-time key, so the map/search box can start loading
    // immediately without waiting on this round-trip. Still fetched in the
    // background in case the server has a different (e.g. domain-restricted) key.
    let active = true;
    fetch('/api/maps-config')
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (active && typeof data?.key === 'string' && data.key.trim()) setMapsApiKey(data.key.trim());
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);
  const { loaded: mapsLoaded, status: mapsStatus } = useGoogleMaps(mapsApiKey);

  const buildQuotes = useCallback(async (currentJourney = journey) => {
    const hasStops = (currentJourney.stops || []).length > 0;
    const wp = hasStops
      ? [currentJourney.origin, ...currentJourney.stops.map(s => s.place).filter(Boolean), currentJourney.destination]
      : [currentJourney.origin, currentJourney.destination];

    const wc = hasStops
      ? [currentJourney.wpCoords?.[0], ...currentJourney.stops.map(s => s.coords || null), currentJourney.wpCoords?.[currentJourney.wpCoords.length - 1]]
      : [currentJourney.wpCoords?.[0], currentJourney.wpCoords?.[1]];

    if (!wp[0] || !wp[wp.length-1]) return;
    const currentFetchId = ++fetchIdRef.current;
    setLoadingQuotes(true);
    setQ([]);
    setSel(null);
    setValidationError("");
    try {
      const { data } = await requestJson('/api/quotes/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...currentJourney, waypoints: wp, wpCoords: wc})
      });
      if (currentFetchId !== fetchIdRef.current) return;
      if (!data || !Array.isArray(data.quotes)) {
        throw new ApiRequestError('The quote response is missing its quote list.', { code: 'invalid-response' });
      }
      if (data.quotes.some(quote => !isTrustedQuote(quote))) {
        throw new ApiRequestError('The quote response contains invalid mileage or pricing data.', { code: 'invalid-response' });
      }
      if (data.quotes.length === 0) {
        setQ([]);
        setValidationError('No configured vehicle is available for this journey. No price has been estimated.');
        return [];
      }
      // Keep the vehicle the customer explicitly selected. Previously this always
      // replaced their choice with the first vehicle large enough for the group,
      // so selecting a coach could incorrectly show an Executive Minibus here.
      const preferredVehicle = data.quotes.find(
        quote => quote.vehicle?.id === currentJourney.vehiclePreference
      );
      if (currentJourney.vehiclePreference && !preferredVehicle) {
        setQ(data.quotes);
        setSel(null);
        setValidationError('The selected vehicle is not available for these dates. Please choose another vehicle or change the journey dates.');
        return [];
      }
      const firstAvailable = preferredVehicle
        || data.quotes.find(quote => Number(quote?.vehicle?.capacity) >= Number(currentJourney.passengers))
        || data.quotes[0];
      setQ(data.quotes);
      setSel(firstAvailable.vehicle.id);
      return data.quotes;
    } catch(err) {
      if (currentFetchId !== fetchIdRef.current) return;
      console.error(err);
      setQ([]);
      setSel(null);
      setValidationError(quoteFailureMessage(err));
      return [];
    } finally {
      if (currentFetchId === fetchIdRef.current) {
        setLoadingQuotes(false);
      }
    }
  }, [journey]);

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
    journey.origin,
    journey.destination,
    journey.stops,
    journey.wpCoords,
    showQuotes
  ]);

  const handleCalculateClick = async () => {
    setValidationError("");
    setSubmissionError("");
    if (!journey.origin || !journey.destination || !journey.departureDate) {
      setValidationError("Please enter pickup location, destination, and departure date.");
      return;
    }
    if (localDateTimeTimestamp(journey.departureDate) < localDateTimeTimestamp(nowLocalDateTime())) {
      setValidationError('Please choose a departure date and time in the future.');
      return;
    }
    if (journey.journeyType === 'return' && !isReturnAfterDeparture(journey.departureDate, journey.returnDate)) {
      setValidationError('Please choose a return date after the departure date.');
      return;
    }

    const hasOriginCoords = journey.wpCoords && journey.wpCoords[0];
    const hasDestCoords = journey.wpCoords && (
      (journey.stops || []).length > 0
        ? journey.wpCoords[journey.wpCoords.length - 1]
        : journey.wpCoords[1]
    );
    
    let hasEmptyStops = false;
    let allStopsHaveCoords = true;
    if ((journey.stops || []).length > 0) {
      hasEmptyStops = journey.stops.some(s => !s.place || s.place.trim() === '');
      allStopsHaveCoords = journey.stops.every(s => s.coords);
    }

    if (hasEmptyStops) {
      setValidationError("âŒ Please enter a location for all added stops, or remove any empty stops before continuing.");
      return;
    }



    setBookingStep(2);
    void buildQuotes();
  };

  const handleFinalBookingSubmit = async () => {
    if (submitting) return;
    const quote = quotes.find(q => q?.vehicle?.id === selected);
    if (!quote || !isTrustedQuote(quote)) {
      setSubmissionError('A current, verified quote is required before a booking can be submitted. Please recalculate the journey.');
      return;
    }
    setSubmissionError("");
    setSubmitting(true);
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
      
      const { data, status } = await requestJson('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const persistedReference = String(data?.booking?.id || '').trim();
      if ((status === 201 || status === 200) && data?.success === true && persistedReference) {
        setBookingRef(persistedReference);
        setSubmitted(true);
        setBookingStep(4);
        
        fetch('/api/send-admin-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ booking: data.booking })
        }).catch(console.error);
        
      } else {
        throw new ApiRequestError('The server did not confirm that the booking was persisted.', { code: 'invalid-response', status });
      }
    } catch(e) {
      console.error(e);
      setSubmissionError(bookingFailureMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  const setOrigin = (val,coords) => { setValidationError(""); setJ(j=>({ ...j, origin:val, wpCoords: setAt(j.wpCoords, 0, coords, 2) })); };
  const setDest   = (val,coords) => { setValidationError(""); setJ(j=>({ ...j, destination:val, wpCoords: setAt(j.wpCoords, (j.stops||[]).length ? 1+(j.stops||[]).length : 1, coords, (j.stops||[]).length ? 2+(j.stops||[]).length : 2) })); };
  
  const setAt = (arr, idx, val, len) => {
    const a = arr ? [...arr] : Array(len).fill(null);
    while (a.length < len) a.push(null);
    a[idx] = val; return a;
  };

  const addStop    = () => setJ(j => ({ ...j, stops: [...(j.stops||[]), { place: "", coords: null, wait: 30 }] }));
  const updateStop = (i, k, v) => setJ(j => ({ ...j, stops: j.stops.map((st, idx) => idx === i ? { ...st, [k]: v } : st) }));
  const removeStop = i => setJ(j => {
    const stops = j.stops.filter((_, idx) => idx !== i);
    const wpCoords = stops.length
      ? j.wpCoords
      : [j.wpCoords?.[0] || null, j.wpCoords?.[j.wpCoords.length - 1] || null];
    return { ...j, stops, wpCoords };
  });
  const moveStop = (index, direction) => setJ(j => {
    const stops = [...(j.stops || [])];
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= stops.length) return j;
    [stops[index], stops[nextIndex]] = [stops[nextIndex], stops[index]];
    return { ...j, stops };
  });
  const filteredQuotes = quotes;
  const selectedQuote = quotes.find(q => q?.vehicle?.id === selected) || null;
  const activeResult = selectedQuote?.result;
  const selectedVehicleCount = selectedQuote
    ? Math.max(1, Math.ceil(journey.passengers / Math.max(1, selectedQuote.vehicle.capacity || 1)))
    : 1;

  const showReturnDate = journey.journeyType === "return";
  const showLuggageCount = journey.largeLuggage !== "none";

  return (
    <>
      <GlobalStyle/>
      <div className={embed ? "booking-embed-root" : ""} style={{ minHeight:"100vh", background:"#f4f6f9" }}>
        <div className="fade-up">
            
            {!showQuotes ? (
              <div className="bg-background text-on-surface font-body-md selection:bg-secondary selection:text-white overflow-x-hidden">
                <header className="fixed top-0 left-0 right-0 z-50 bg-surface h-20 border-b border-outline-variant transition-all duration-300 shadow-xl bg-white/95 backdrop-blur-md" id="main-nav">
                  <div className="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-full px-6">
                    <div className="flex items-center gap-4">
                      <img alt="Carolean Coaches" className="h-14 w-auto object-contain" src="/carolean%20image.png"/>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                      <a className="font-label-lg text-label-lg text-secondary border-b-2 border-secondary pb-1 transition-colors duration-200" href="#">Our Fleet</a>
                      <a className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary transition-colors duration-200" href="#">Services</a>
                      <a className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary transition-colors duration-200" href="#">About Us</a>
                      <a className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary transition-colors duration-200" href="#">Contact</a>
                    </nav>
                    <div className="flex items-center gap-4">
                      <a className="hidden lg:block font-label-lg text-label-lg text-on-surface-variant hover:text-secondary transition-colors" href="#">Login</a>
                      <button onClick={() => document.getElementById("fast-quote")?.scrollIntoView({behavior: "smooth", block: "center"})} className="bg-impact-red text-white font-label-lg px-5 sm:px-8 py-3 rounded-full hover:bg-secondary transition-all transform active:scale-95 shadow-lg shadow-impact-red/20">
                        Get a Quote
                      </button>
                    </div>
                  </div>
                </header>
                
                <main className="pt-20">
                  <section className="relative min-h-[95vh] flex items-center justify-center py-section-gap-md overflow-hidden">
                    <div className="booking-hero-background absolute inset-0 z-0">
                      <div className="absolute inset-0 hero-gradient-overlay z-10"></div>
                      <img alt="Carolean executive coach" className="w-full h-full object-cover" src="/header-bg.png"/>
                    </div>
                    <div className="booking-hero-grid relative z-20 w-full max-w-container-max px-gutter mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-6">
                      <div className="booking-hero-copy lg:col-span-6 text-stark-white mb-10 lg:mb-0">
                        <div className="inline-flex items-center gap-2 py-2 px-4 bg-white/10 backdrop-blur-md text-white text-label-sm font-label-sm mb-8 rounded-full border border-white/20 uppercase tracking-widest">
                          <span className="w-2 h-2 rounded-full bg-impact-red animate-pulse"></span>
                          Premium Travel Solutions
                        </div>
                        <h1 className="font-headline-xl text-headline-xl leading-[1.1] mb-6">Experience Executive Travel <br/>Defined by <span className="text-impact-red">Precision</span>.</h1>
                        <p className="text-body-lg font-body-lg max-w-xl opacity-90 leading-relaxed mb-10">From elite corporate events to bespoke group logistics, we provide high-fidelity transport solutions that keep your business moving with uncompromising excellence.</p>
                        <div className="flex items-center gap-8">
                          <div className="flex flex-col">
                            <span className="text-headline-lg font-headline-lg">UK</span>
                            <span className="text-label-sm font-label-sm opacity-70">Journey planning</span>
                          </div>
                          <div className="w-[1px] h-12 bg-stark-white/20"></div>
                          <div className="flex flex-col">
                            <span className="text-headline-lg font-headline-lg">Live</span>
                            <span className="text-label-sm font-label-sm opacity-70">Server pricing</span>
                          </div>
                          <div className="w-[1px] h-12 bg-stark-white/20"></div>
                          <div className="flex flex-col">
                            <span className="text-headline-lg font-headline-lg">No</span>
                            <span className="text-label-sm font-label-sm opacity-70">Fallback mileage</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="booking-form-column lg:col-span-6 flex justify-center lg:justify-end">
                        <div id="fast-quote" className={`w-full ${bookingStep === 3 ? "max-w-[490px] p-6" : "max-w-[445px] p-6 sm:p-7"} glass-panel rounded-[2.5rem] shadow-2xl transform lg:translate-x-16 transition-all duration-500 hover:shadow-deep-navy/20 border border-white/50`}>
                          <div className="flex justify-between items-start mb-8">
                            <div>
                              <h2 className="font-headline-md text-headline-md text-deep-navy">
                                {bookingStep === 1 ? "Fast Quote" : bookingStep === 2 ? "Your Details" : bookingStep === 3 ? "Review Booking" : "Booking Confirmed"}
                              </h2>
                              <p className="text-[11px] font-bold text-impact-red uppercase tracking-wide mt-1">
                                Step {bookingStep} of 4 &middot; {bookingStep === 1 ? "Journey" : bookingStep === 2 ? "Details" : bookingStep === 3 ? "Review" : "Confirmed"}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5 shrink-0">
                              {[1,2,3,4].map(step => <span key={step} className={`rounded-full transition-all ${bookingStep === step ? "w-6 h-1.5 bg-impact-red" : "w-1.5 h-1.5 bg-deep-navy/20"}`}></span>)}
                            </div>
                          </div>
                          {bookingStep === 1 && <div className="relative">
                          {/* Calendar overlays the still-mounted form below (absolute, out of flow) - the card's height never changes when this opens, and the toggle peeks through under the rounded corners like the reference */}
                          {activeDatePicker && (
                            <div className="absolute inset-x-0 top-0 z-20">
                              <DateTimePanel
                                value={activeDatePicker === 'departure' ? journey.departureDate : (journey.returnDate || '')}
                                minValue={activeDatePicker === 'departure' ? nowLocalDateTime() : journey.departureDate}
                                onBack={() => setActiveDatePicker(null)}
                                onChange={val => {
                                  setValidationError("");
                                  if (activeDatePicker === 'departure') {
                                    setJ(j => ({
                                      ...j,
                                      departureDate: val,
                                      returnDate: j.journeyType === 'return' && !isReturnAfterDeparture(val, j.returnDate) ? sameDayAfterDeparture(val) : j.returnDate
                                    }));
                                  } else {
                                    setJ(j => ({ ...j, returnDate: val }));
                                  }
                                  setActiveDatePicker(null);
                                }}
                              />
                            </div>
                          )}
                          <div className="flex p-1.5 bg-surface-container rounded-full mb-8">
                            <button type="button" onClick={()=>setJ(j=>({...j, journeyType: "one-way"}))} className={`flex-1 py-3 px-4 text-label-sm font-bold rounded-full transition-all ${journey.journeyType !== "return" ? "bg-impact-red text-white shadow-lg" : "text-on-surface-variant hover:bg-white/50"}`}>One-Way</button>
                            <button type="button" onClick={()=>setJ(j=>({
                              ...j,
                              journeyType: "return",
                              returnDate: isReturnAfterDeparture(j.departureDate, j.returnDate) ? j.returnDate : sameDayAfterDeparture(j.departureDate)
                            }))} className={`flex-1 py-3 px-4 text-label-sm font-bold rounded-full transition-all ${journey.journeyType === "return" ? "bg-impact-red text-white shadow-lg" : "text-on-surface-variant hover:bg-white/50"}`}>Return</button>
                          </div>
                          
                          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleCalculateClick(); }}>
                            {mapsStatus === 'error' && (
                              <div role="status" className="rounded-xl px-4 py-3 text-sm font-semibold bg-red-50 text-red-700">
                                Verified route pricing is unavailable because the map service is not configured or could not load.
                              </div>
                            )}
                            <div className="relative space-y-3">
                              <div className="relative group quote-location">
                                <PlacesInput
                                  value={journey.origin}
                                  onChange={setOrigin}
                                  placeholder="Pickup location"
                                  icon={<span className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center"><SvgMapPinGreen size={16}/></span>}
                                  mapsLoaded={mapsLoaded}
                                  mapsStatus={mapsStatus}
                                />
                              </div>
                              <div className="h-6 flex items-center justify-between px-1">
                                <span className="text-[11px] text-gray-400">
                                  {(journey.stops || []).length > 0 ? `${journey.stops.length} stop${journey.stops.length > 1 ? "s" : ""}` : ""}
                                </span>
                                <button type="button" onClick={addStop} className="h-7 px-3 rounded-full bg-white border border-outline-variant text-deep-navy text-[11px] font-bold flex items-center gap-1.5 hover:border-deep-navy hover:shadow-sm transition-all">
                                  <span className="material-symbols-outlined text-[16px]">add</span>
                                  Add stop
                                </button>
                              </div>
                              {(journey.stops || []).map((stop, index) => (
                                <div className="relative group flex items-center gap-2 quote-location" key={`stop-${index}`}>
                                  <div style={{ flex: "1 1 auto", minWidth: 0, width: "auto" }}>
                                    <PlacesInput
                                      value={stop.place}
                                      onChange={(val, geo) => {
                                        updateStop(index, "place", val);
                                        updateStop(index, "coords", geo);
                                      }}
                                      placeholder={`Stop ${index + 1} address or postcode`}
                                      icon={<span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[11px] font-bold">{index + 1}</span>}
                                      mapsLoaded={mapsLoaded}
                                      mapsStatus={mapsStatus}
                                    />
                                  </div>
                                  <div className="flex flex-col items-center gap-0.5 shrink-0">
                                    <button type="button" disabled={index === 0} aria-label={`Move stop ${index + 1} up`} onClick={()=>moveStop(index, -1)} className="w-6 h-5 rounded text-gray-400 hover:text-deep-navy hover:bg-surface-container disabled:opacity-20 flex items-center justify-center">
                                      <span className="material-symbols-outlined text-[14px]">keyboard_arrow_up</span>
                                    </button>
                                    <button type="button" disabled={index === journey.stops.length - 1} aria-label={`Move stop ${index + 1} down`} onClick={()=>moveStop(index, 1)} className="w-6 h-5 rounded text-gray-400 hover:text-deep-navy hover:bg-surface-container disabled:opacity-20 flex items-center justify-center">
                                      <span className="material-symbols-outlined text-[14px]">keyboard_arrow_down</span>
                                    </button>
                                  </div>
                                  <button type="button" aria-label={`Remove stop ${index + 1}`} onClick={() => removeStop(index)} className="w-8 h-8 shrink-0 rounded-full bg-red-50 text-impact-red flex items-center justify-center hover:bg-red-100 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                  </button>
                                </div>
                              ))}
                              <div className="relative group quote-location">
                                <PlacesInput
                                  value={journey.destination}
                                  onChange={setDest}
                                  placeholder="Destination"
                                  icon={<span className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center"><SvgMapPinRed size={16}/></span>}
                                  mapsLoaded={mapsLoaded}
                                  mapsStatus={mapsStatus}
                                />
                              </div>
                            </div>

                            {/* Departure/Return - trigger opens the calendar inline in this same card (see activeDatePicker below), not a popup */}
                            <div className={`grid grid-cols-1 ${journey.journeyType === "return" ? "sm:grid-cols-2" : ""} gap-4`}>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1 ml-2">Departure</label>
                                <DateTimeField accent="indigo" value={journey.departureDate} onOpen={() => setActiveDatePicker('departure')} />
                              </div>
                              {journey.journeyType === 'return' && (
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1 ml-2">Return</label>
                                <DateTimeField accent="red" value={journey.returnDate || ''} onOpen={() => setActiveDatePicker('return')} />
                              </div>
                              )}
                            </div>


                            {validationError && (
                              <div style={{ padding: "10px", background: "#fee2e2", color: "#b91c1c", borderRadius: "8px", fontSize: "14px" }}>
                                {validationError}
                              </div>
                            )}

                            
                            <button type="submit" disabled={loadingQuotes || mapsStatus !== 'ready'} className="w-full py-5 bg-impact-red disabled:opacity-50 disabled:cursor-not-allowed text-white font-headline-md rounded-full hover:bg-secondary transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 group shadow-xl shadow-impact-red/30 mt-4">
                              {loadingQuotes ? 'Calculating verified quote...' : 'Continue'}
                              <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">arrow_forward</span>
                            </button>
                            <p className="text-center text-[11px] text-gray-400 mt-3">Live pricing &middot; No obligation &middot; Response in minutes</p>
                          </form>
                          </div>}

                          {bookingStep === 2 && (
                            <form className="customer-details-form space-y-4 fade-up" onSubmit={e => {
                              e.preventDefault();
                              setValidationError("");

                              if (!journey.name.trim() || journey.name.trim().length < 2) {
                                setValidationError("Please enter a valid full name.");
                                return;
                              }

                              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                              if (!emailRegex.test(journey.email.trim())) {
                                setValidationError("Please enter a valid email address.");
                                return;
                              }
                              
                              const phoneRegex = /^[\+]?[0-9\s\-()]{10,20}$/;
                              if (!phoneRegex.test(journey.phone.trim())) {
                                setValidationError("Please enter a valid phone number (min. 10 digits).");
                                return;
                              }
                              if (!selectedQuote || !isTrustedQuote(selectedQuote)) {
                                if (loadingQuotes) {
                                  setValidationError('Refreshing your verified quote. Please wait a moment and continue again.');
                                  return;
                                }
                                setValidationError('The verified quote is no longer available. Please return to the journey step and calculate it again.');
                                return;
                              }
                              
                              setBookingStep(3);
                            }}>
                              <div>
                                <label className="field-label">Full name</label>
                                <input className="quote-details-field !text-left" style={{ textAlign: 'left' }} type="text" value={journey.name} onChange={e=>setJ(j=>({...j,name:e.target.value.trimStart()}))} placeholder="Your full name" required minLength={2}/>
                              </div>
                              <div>
                                <label className="field-label">Email address</label>
                                <input className="quote-details-field !text-left" style={{ textAlign: 'left' }} type="email" value={journey.email} onChange={e=>setJ(j=>({...j,email:e.target.value}))} placeholder="you@example.com" pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" required/>
                              </div>
                              <div>
                                <label className="field-label">Phone number</label>
                                <input className="quote-details-field !text-left" style={{ textAlign: 'left' }} type="tel" value={journey.phone} onChange={e=>{
                                  const val = e.target.value.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
                                  setJ(j=>({...j,phone:val}));
                                }} placeholder="+44 7700 900000" pattern="^[\+]?[0-9]{10,15}$" minLength={10} maxLength={15} required/>
                              </div>
                              <div>
                                <label className="field-label">Special requests <span className="normal-case font-normal">(optional)</span></label>
                                <textarea className="quote-details-field !text-left" value={journey.specialRequests} onChange={e=>setJ(j=>({...j,specialRequests:e.target.value}))} placeholder="Wheelchair access, mobility assistance, child seats, additional stops, or other instructions"/>
                              </div>
                            {/* Vehicle class - plain field matching the other inputs, "Up to N seats" on the same label row */}
                            <div>
                              <div className="flex items-center justify-between ml-2 mb-1">
                                <label className="field-label !mb-0">Vehicle class</label>
                                <span className="text-[11px] font-semibold text-gray-500">Up to {vehicleCapacity(journey.vehiclePreference)} seats</span>
                              </div>
                              <div className="relative group">
                                <select className="w-full h-[52px] !appearance-none pl-[18px] pr-10 border border-[#c7c5d1] rounded-[14px] bg-white focus:outline-none focus:border-deep-navy transition-all text-[15px] font-bold text-deep-navy cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                                  style={{ backgroundImage: 'none', textAlign: 'left' }}
                                  value={journey.vehiclePreference || "minibus"} onChange={e=>{
                                    const v = e.target.value;
                                    let p = 16;
                                    if (v === 'bus') p = 33;
                                    if (v === 'coach') p = 49;
                                    setJ(j=>({...j, vehiclePreference: v, passengers: p, handbagCount: 0, suitcaseCount: p}));
                                    setSel(v);
                                  }}>
                                  <option value="minibus">Executive Minibus (16 Seats)</option>
                                  <option value="bus">Standard Bus (33 Seats)</option>
                                  <option value="coach">Premium Coach (49 Seats)</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[18px]">expand_more</span>
                              </div>
                            </div>

                            {/* Passengers & Luggage - same plain field style as vehicle class, two columns */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="field-label">Passengers</label>
                                <div className="h-[52px] px-2 flex items-center justify-between border border-[#c7c5d1] rounded-[14px] bg-white">
                                  <button type="button" aria-label="Decrease passengers" onClick={()=>setJ(j=>({...j, passengers: Math.max(1, (j.passengers || 16) - 1)}))} className="shrink-0 text-gray-400 hover:text-impact-red rounded-full transition-all w-7 h-7 flex items-center justify-center focus:outline-none"><span className="material-symbols-outlined text-[18px]">remove</span></button>
                                  <span className="text-[15px] font-bold text-deep-navy leading-none">{journey.passengers || 16}</span>
                                  <button type="button" aria-label="Increase passengers" onClick={()=>setJ(j=>({...j, passengers: Math.min(100, (j.passengers || 16) + 1)}))} className="shrink-0 text-gray-400 hover:text-[#4ADE80] rounded-full transition-all w-7 h-7 flex items-center justify-center focus:outline-none"><span className="material-symbols-outlined text-[18px]">add</span></button>
                                </div>
                              </div>

                              <div>
                                <label className="field-label whitespace-nowrap">Suitcases 23kg+</label>
                                <div className="h-[52px] px-2 flex items-center justify-between border border-[#c7c5d1] rounded-[14px] bg-white">
                                  <button
                                    type="button"
                                    aria-label="Decrease 23kg suitcases"
                                    onClick={()=>setJ(j => ({...j, suitcaseCount: Math.max(0, (j.suitcaseCount ?? 0) - 1)}))}
                                    className="shrink-0 text-gray-400 hover:text-impact-red rounded-full transition-all w-7 h-7 flex items-center justify-center focus:outline-none"
                                  ><span className="material-symbols-outlined text-[18px]">remove</span></button>
                                  <span className="text-[15px] font-bold text-deep-navy leading-none">{journey.suitcaseCount ?? 0}</span>
                                  <button
                                    type="button"
                                      aria-label="Increase 23kg suitcases"
                                      onClick={()=>setJ(j => ({...j, suitcaseCount: (j.suitcaseCount ?? 0) + 1}))}
                                      className="shrink-0 text-gray-400 hover:text-[#4ADE80] rounded-full transition-all w-7 h-7 flex items-center justify-center focus:outline-none"
                                    ><span className="material-symbols-outlined text-[18px]">add</span></button>
                                  </div>
                                </div>
                              </div>
                            {validationError && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{validationError}</div>}
                              <div className="flex gap-3 pt-2">
                                <button type="button" onClick={()=>setBookingStep(1)} className="h-14 px-6 rounded-full border border-outline-variant text-deep-navy font-bold flex items-center justify-center gap-2">
                                  <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
                                </button>
                                <button type="submit" className="flex-1 h-14 bg-impact-red text-white rounded-full font-bold shadow-lg shadow-impact-red/20 flex items-center justify-center gap-2">
                                  Continue <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
                                </button>
                              </div>
                            </form>
                          )}

                          {bookingStep === 3 && (
                            <div className="space-y-3 fade-up">
                              <div className="rounded-2xl bg-primary text-white px-5 py-4 flex items-center justify-between gap-3">
                                <div>
                                  <div className="text-lg font-bold">{String(journey.origin || "").split(",")[0]} <span className="text-impact-red">→</span> {String(journey.destination || "").split(",")[0]}</div>
                                  <div className="text-xs opacity-75 mt-1">
                                    <div>Departure: {new Date(journey.departureDate).toLocaleString("en-GB")}</div>
                                    {journey.journeyType === "return" && journey.returnDate ? <div>Return: {new Date(journey.returnDate).toLocaleString("en-GB")}</div> : null}
                                    <div>{journey.passengers} passengers</div>
                                  </div>
                                </div>
                                <button type="button" onClick={()=>setBookingStep(1)} aria-label="Edit journey details" title="Edit journey details" className="w-9 h-9 shrink-0 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="rounded-xl bg-surface-container-low p-3 overflow-hidden">
                                  <span className="field-label">STOPS</span>
                                  {journey.stops?.length && journey.stops.some(s => s?.place) ? (
                                    <div className="flex flex-col mt-0.5 max-h-[60px] overflow-y-auto no-scrollbar">
                                      {journey.stops.filter(s => s?.place).map((s, i) => {
                                        const stopName = typeof s.place === 'string' ? s.place.split(',')[0] : (s.place?.name || s.place?.address?.split(',')[0] || "Stop");
                                        return (
                                          <strong key={i} className="truncate text-[11px] leading-tight block" title={stopName}>
                                            {i + 1}) {stopName}
                                          </strong>
                                        );
                                      })}
                                    </div>
                                  ) : journey.journeyType === "return" ? (
                                    <strong className="block">Return</strong>
                                  ) : (
                                    <strong className="block">One-way</strong>
                                  )}
                                </div>
                                <div className="rounded-xl bg-surface-container-low p-3 min-w-0"><span className="field-label">Contact</span><strong>{journey.name}</strong><br/><span className="text-[10px] break-all">{journey.email}</span></div>
                              </div>
                              {journey.specialRequests && <div className="rounded-xl border border-outline-variant p-4 text-sm"><span className="field-label">Special requests</span>{journey.specialRequests}</div>}
                              <div className="rounded-2xl border border-outline-variant bg-white p-3.5">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                  <div>
                                    <span className="field-label">Selected option</span>
                                    <strong className="text-deep-navy">{selectedQuote ? `${selectedVehicleCount} × ${selectedQuote.vehicle.name}` : "Verified option unavailable"}</strong>
                                    <p className="text-xs text-on-surface-variant mt-1">{journey.passengers} passengers</p>
                                  </div>
                                  {selectedQuote && (
                                    <div className="text-right shrink-0">
                                      <span className="field-label">Estimated price</span>
                                      <strong className="text-lg text-deep-navy">£{fmt(selectedQuote.result.finalPrice)}{Number(selectedQuote.result.upperBoundPrice) > Number(selectedQuote.result.finalPrice) ? `–£${fmt(selectedQuote.result.upperBoundPrice)}` : ""}</strong>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-deep-navy mb-2">
                                  <SvgMap size={18}/> Route planning & mileage
                                </div>
                                {loadingQuotes
                                  ? <div className="h-[280px] rounded-xl bg-surface-container-low flex items-center justify-center text-sm text-on-surface-variant">Calculating route and pricing...</div>
                                  : <RouteMap result={activeResult} journey={journey} showMetrics={false}/>
                                }
                              </div>
                              {submissionError && <div role="alert" className="p-3 bg-red-50 text-red-700 rounded-xl text-sm font-semibold">{submissionError}</div>}
                              <div className="flex gap-3 pt-2">
                                <button type="button" onClick={()=>setBookingStep(2)} className="h-14 px-6 rounded-full border border-outline-variant text-deep-navy font-bold flex items-center justify-center gap-2">
                                  <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
                                </button>
                                <button type="button" onClick={handleFinalBookingSubmit} disabled={submitting || loadingQuotes || !selectedQuote} className="flex-1 h-14 bg-impact-red disabled:opacity-50 text-white rounded-full font-bold shadow-lg shadow-impact-red/20 flex items-center justify-center gap-2">
                                  {submitting ? "Confirming..." : <>Confirm Booking <span className="material-symbols-outlined text-[19px]">arrow_forward</span></>}
                                </button>
                              </div>
                            </div>
                          )}

                          {bookingStep === 4 && (
                            <div className="text-center py-4 fade-up">
                              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-5"><SvgCheck size={34}/></div>
                              <h3 className="text-2xl font-bold text-deep-navy mb-2">Your booking request was saved</h3>
                              <p className="text-sm text-on-surface-variant mb-5">The booking server confirmed that your request was recorded for <strong>{journey.email}</strong>. This is a request record, not a final journey confirmation.</p>
                              <div className="rounded-2xl bg-surface-container-low p-5 mb-5">
                                <span className="field-label">Booking reference</span>
                                <strong className="text-xl tracking-wider text-deep-navy">{bookingRef}</strong>
                              </div>
                              <p className="text-xs text-on-surface-variant">Please keep this reference for any questions about your booking.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                  
                  <section className="bg-surface py-20 relative border-b border-outline-variant">
                    <div className="max-w-container-max mx-auto px-gutter px-6">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-xs text-center md:text-left">
                          <h3 className="font-headline-md text-deep-navy mb-2">Our Partnerships</h3>
                          <p className="text-label-sm text-on-surface-variant opacity-60">Providing logistics for the world&apos;s leading enterprises and sports organizations.</p>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-4 flex-1">
                          {["Corporate Events", "Sports Travel", "Airport Transfers", "Executive Groups"].map(partner => (
                            <span key={partner} className="px-5 py-3 rounded-full border border-outline-variant bg-white text-deep-navy text-sm font-bold">{partner}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                  
                  <section className="py-section-gap-lg px-gutter max-w-container-max mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20 mt-20">
                      <div>
                        <h2 className="font-headline-xl text-headline-xl text-deep-navy mb-6">Why Professionals <br/>Choose Carolean</h2>
                        <p className="text-body-lg text-on-surface-variant mb-8 leading-relaxed">For over a quarter-century, we have been the preferred choice for organizations that value reliability above all else. Our service isn&apos;t just about transport; it&apos;s about providing a seamless extension of your professional environment.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="flex gap-4">
                            <span className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined">verified_user</span>
                            </span>
                            <div>
                              <h4 className="font-headline-md text-body-md font-bold text-deep-navy mb-1">Vetted Drivers</h4>
                              <p className="text-label-sm text-on-surface-variant">Enhanced DBS checked & professional training.</p>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <span className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined">track_changes</span>
                            </span>
                            <div>
                              <h4 className="font-headline-md text-body-md font-bold text-deep-navy mb-1">Live Tracking</h4>
                              <p className="text-label-sm text-on-surface-variant">Real-time GPS updates for every journey.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative group">
                        <img alt="Our Executive Fleet" className="rounded-3xl shadow-2xl w-full object-cover h-[400px] transition-transform duration-700 group-hover:scale-105" src="/header-bg.png"/>
                        <div className="absolute -bottom-6 -left-6 bg-impact-red text-white p-8 rounded-2xl shadow-xl max-w-[240px]">
                          <p className="text-headline-lg font-bold mb-1">99.8%</p>
                          <p className="text-label-sm font-semibold uppercase tracking-wider opacity-90">On-Time Arrival Rate Across 10,000+ Trips</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                      <div className="md:col-span-2 relative overflow-hidden rounded-3xl group h-[500px]">
                        <img alt="Carolean executive coach" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" src="/header-bg.png"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-transparent to-transparent opacity-80"></div>
                        <div className="absolute bottom-0 left-0 p-10 text-stark-white">
                          <span className="material-symbols-outlined text-4xl mb-4 text-impact-red">airline_seat_recline_extra</span>
                          <h3 className="font-headline-lg text-headline-lg mb-4">Executive Cabin Comfort</h3>
                          <p className="font-body-md opacity-90 max-w-lg leading-relaxed">Reimagining on-road productivity with ergonomic leather seating, climate control, and enterprise-grade Wi-Fi in every vehicle.</p>
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-3xl group bg-primary-container p-10 flex flex-col justify-between">
                        <div className="relative z-10 text-stark-white">
                          <h4 className="font-headline-md text-headline-md mb-4">Corporate Group Travel</h4>
                          <p className="text-label-sm opacity-80 leading-relaxed mb-6">Bespoke logistics for large teams, conferences, and executive retreats. We handle the complexity, you enjoy the ride.</p>
                          <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-label-sm font-semibold">
                              <span className="material-symbols-outlined text-impact-red text-[18px]">check_circle</span>
                              Dedicated Account Manager
                            </li>
                            <li className="flex items-center gap-2 text-label-sm font-semibold">
                              <span className="material-symbols-outlined text-impact-red text-[18px]">check_circle</span>
                              Custom Branding Options
                            </li>
                          </ul>
                        </div>
                        <img alt="" aria-hidden="true" className="absolute right-[-12%] bottom-[-4%] w-[85%] opacity-10 rotate-[-8deg]" src="/carolean%20image.png"/>
                      </div>
                    </div>
                  </section>
                  
                  <section className="bg-surface-container-high py-section-gap-lg overflow-hidden relative">
                    <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-6 py-20">
                      <div className="relative pb-8 lg:pb-0">
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-impact-red/10 rounded-full blur-3xl"></div>
                        <img
                          alt="Sarah Jenkins, corporate travel client"
                          className="relative z-10 w-full max-w-md h-[396px] mx-auto rounded-[3rem] object-cover shadow-2xl grayscale"
                          src="/testimonial-client.jpg"
                        />
                        <div className="absolute bottom-0 right-0 z-20">
                          <div className="bg-white p-5 rounded-2xl shadow-xl flex items-center gap-4">
                            <div className="flex -space-x-3">
                              <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-dim"></div>
                              <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-dim"></div>
                              <div className="w-10 h-10 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[10px] font-bold">500+</div>
                            </div>
                            <span className="text-label-sm font-bold text-deep-navy">Happy Corporate Clients</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-6xl font-headline-lg text-impact-red mb-6 block opacity-25" aria-hidden="true">â€œ</span>
                        <h3 className="font-headline-lg text-headline-lg text-deep-navy mb-8">"Carolean Coaches has transformed how our executive team moves. Their punctuality and the sheer quality of the fleet are unmatched in the industry."</h3>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-1 gap-1 bg-impact-red rounded-full"></div>
                          <div>
                            <p className="font-headline-md text-body-md font-bold text-deep-navy">Sarah Jenkins</p>
                            <p className="text-label-sm text-on-surface-variant">Director of Logistics, Global Tech Corp</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  
                  <section className="bg-tertiary py-24 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
                      <span className="material-symbols-outlined text-[400px] leading-none select-none text-white">directions_bus</span>
                    </div>
                    <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row items-center justify-between gap-12 relative z-10 px-6">
                      <div className="md:max-w-xl">
                        <h2 className="font-headline-xl text-headline-lg text-stark-white mb-4">Stay Ahead of the Curve</h2>
                        <p className="text-body-lg text-surface-variant opacity-80">Join 5,000+ corporate travel managers. Receive priority fleet updates, industry insights, and specialized corporate rates.</p>
                      </div>
                      <div className="w-full md:w-auto">
                        <div className="bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/20 flex flex-col sm:flex-row gap-2">
                          <input className="newsletter-email sm:w-80" placeholder="Professional Email" type="email"/>
                          <button className="bg-impact-red text-white px-10 py-4 rounded-full font-headline-md hover:bg-white hover:text-tertiary transition-all shadow-lg shadow-impact-red/20">Subscribe</button>
                        </div>
                      </div>
                    </div>
                  </section>
                </main>
                
                <footer className="bg-tertiary text-tertiary-fixed py-20 border-t border-white/5">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-gutter max-w-container-max mx-auto px-6">
                    <div className="space-y-8">
                      <div className="flex items-center gap-3">
                        <img alt="Carolean Coaches" className="h-14 w-auto object-contain bg-white rounded-xl p-2" src="/carolean%20image.png"/>
                      </div>
                      <p className="text-body-md opacity-60 leading-relaxed">Executive group transport enquiries with route-based pricing supplied by the connected fare engine.</p>
                      <div className="flex gap-4">
                        <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-impact-red transition-all" href="#"><span className="material-symbols-outlined text-stark-white text-[20px]">public</span></a>
                        <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-impact-red transition-all" href="#"><span className="material-symbols-outlined text-stark-white text-[20px]">chat</span></a>
                        <a className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-impact-red transition-all" href="#"><span className="material-symbols-outlined text-stark-white text-[20px]">share</span></a>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-stark-white font-headline-md mb-8">Our Services</h5>
                      <ul className="space-y-4">
                        <li><a className="text-surface-variant opacity-80 hover:text-impact-red transition-colors" href="#">Corporate Travel</a></li>
                        <li><a className="text-surface-variant opacity-80 hover:text-impact-red transition-colors" href="#">Airport Transfers</a></li>
                        <li><a className="text-surface-variant opacity-80 hover:text-impact-red transition-colors" href="#">Special Events</a></li>
                        <li><a className="text-surface-variant opacity-80 hover:text-impact-red transition-colors" href="#">Fleet Overview</a></li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-stark-white font-headline-md mb-8">Quick Links</h5>
                      <ul className="space-y-4">
                        <li><a className="text-surface-variant opacity-80 hover:text-impact-red transition-colors" href="#">Privacy Policy</a></li>
                        <li><a className="text-surface-variant opacity-80 hover:text-impact-red transition-colors" href="#">Terms & Conditions</a></li>
                        <li><a className="text-surface-variant opacity-80 hover:text-impact-red transition-colors" href="#">Booking FAQs</a></li>
                        <li><a className="text-surface-variant opacity-80 hover:text-impact-red transition-colors" href="#">Contact Us</a></li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-stark-white font-headline-md mb-8">Contact</h5>
                      {(PUBLIC_CONTACT_ADDRESS || PUBLIC_CONTACT_PHONE || PUBLIC_CONTACT_EMAIL) ? (
                        <ul className="space-y-6">
                          {PUBLIC_CONTACT_ADDRESS && <li className="flex gap-4 text-surface-variant opacity-80"><span className="material-symbols-outlined text-impact-red">pin_drop</span>{PUBLIC_CONTACT_ADDRESS}</li>}
                          {PUBLIC_CONTACT_PHONE && <li className="flex gap-4 text-surface-variant opacity-80"><span className="material-symbols-outlined text-impact-red">call</span><a href={`tel:${PUBLIC_CONTACT_PHONE}`}>{PUBLIC_CONTACT_PHONE}</a></li>}
                          {PUBLIC_CONTACT_EMAIL && <li className="flex gap-4 text-surface-variant opacity-80"><span className="material-symbols-outlined text-impact-red">mail</span><a href={`mailto:${PUBLIC_CONTACT_EMAIL}`}>{PUBLIC_CONTACT_EMAIL}</a></li>}
                        </ul>
                      ) : (
                        <p className="text-surface-variant opacity-80">Submit the booking form and the team will respond using the contact details you provide.</p>
                      )}
                    </div>
                  </div>
                  <div className="max-w-container-max mx-auto px-gutter mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 px-6">
                    <p className="text-label-sm font-label-sm opacity-60">© 2026 Carolean Coaches. Executive Precision in Motion.</p>
                    <div className="flex gap-8">
                      <span className="text-label-sm font-label-sm opacity-40">Site by Precision Agency</span>
                    </div>
                  </div>
                </footer>
              </div>
            ) : (


                <main style={{ maxWidth:1160, margin:"0 auto", padding:"2.5rem 1.5rem 5rem" }} className="fade-up">
                  
                  {}
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
                          <span>{String(journey.origin || '').split(',')[0]}</span>
                        <span style={{ color: PX.brandRed }}>→</span>
                          <span>{String(journey.destination || '').split(',')[0]}</span>
                      </div>
                      <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", marginTop: 4, fontWeight: 500 }}>
                        {journey.departureDate ? new Date(journey.departureDate).toLocaleString("en-GB") : ""} · {journey.passengers} Passengers · {journey.journeyType === "one-way" ? "One-way" : journey.journeyType === "return" ? "Return" : "Multi-stop"}
                      </div>
                    </div>
                    <Btn variant="ghost" size="sm" onClick={() => setShowQuotes(false)} style={{ color: "#fff", borderColor: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.06)", borderRadius: 30 }}>
                      â† Edit details
                    </Btn>
                  </div>

                  {submitted ? (
                    <Card style={{ maxWidth: 640, margin: "3rem auto", padding: "3rem 2.5rem", textAlign: "center", border: `2px solid ${PX.teal500}`, background: "#f0fdf4" }}>
                      <div className="fade-up">
                        <div style={{ display: "inline-flex", background: PX.teal100, borderRadius: "50%", padding: 16, marginBottom: 20, color: PX.teal700 }}>
                          <SvgCheck size={48} />
                        </div>
                        <h2 style={{ fontSize: 26, fontWeight: 900, color: PX.teal700, marginBottom: 12 }}>Thank You! Request Successfully Sent.</h2>
                        <p style={{ fontSize: 15, color: PX.gray700, lineHeight: 1.6, marginBottom: 24 }}>
                          We will contact you at <strong>{journey.email}</strong> within 2 hours.
                        </p>
                        
                        <div style={{ background: "#fff", border: `1px solid #bfdbfe`, padding: "16px", borderRadius: 8, marginBottom: 24, fontSize: 14, color: PX.navy800, lineHeight: 1.5 }}>
                          Our dedicated team will reach out to you shortly to discuss your requirements and provide the best possible quotation for your journey.
                        </div>

                        <div style={{ background: PX.gray100, padding: "10px 20px", borderRadius: 8, display: "inline-block", fontFamily: "monospace", fontWeight: 800, fontSize: 16, color: PX.navy800, letterSpacing: 1 }}>
                          REF: {bookingRef}
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <div className={`results-layout${!loadingQuotes && filteredQuotes.length === 0 ? " results-layout-empty" : ""}`}>
                      
                      {}
                      <div className="left-panel-options">
                        <Card style={{ padding: "2rem" }}>
                          <SectionHead sub={`${journey.passengers} passengers · ${(journey.journeyType).replace("-"," ")}`}>
                            Available Options
                          </SectionHead>
                          
                          {loadingQuotes && quotes.length === 0 ? (
                            <div style={{ padding: "2.5rem", textAlign: "center", color: PX.gray600 }}>
                              <span className="spinning" style={{ marginRight: 8 }}>âŸ³</span> Fetching live options...
                            </div>
                          ) : filteredQuotes.length === 0 ? (
                            <div role="status" style={{ padding: "2rem 1rem", textAlign: "center", color: PX.gray600 }}>
                              <div style={{ fontSize: 16, fontWeight: 800, color: PX.navy800, marginBottom: 6 }}>Live options unavailable</div>
                              <div style={{ fontSize: 13, lineHeight: 1.5 }}>{validationError || "No verified vehicle options are available for this journey."}</div>
                            </div>
                          ) : (
                            <>
                              {filteredQuotes.map(({vehicle, result}) => (
                                <VehicleCard key={vehicle.id} vehicle={vehicle} result={result}
                                  selected={selected} onSelect={setSel}
                                  passengers={journey.passengers} suitcaseCount={journey.suitcaseCount}
                                  handbagCount={journey.handbagCount}/>
                              ))}
                              
                              {selected && (
                                <div style={{ marginTop: "2rem", borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem" }} className="fade-up">
                                  <Btn variant="teal" size="lg" full onClick={handleFinalBookingSubmit} disabled={submitting}>
                                    {submitting ? <><span className="spinning" style={{ marginRight: 8 }}>âŸ³</span> Confirming...</> : "Confirm Booking"}
                                  </Btn>
                                </div>
                              )}
                            </>
                          )}
                        </Card>
                      </div>

                      {}
                      {(loadingQuotes || filteredQuotes.length > 0) && <div className="right-panel-map" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        
                        {}
                        <Card style={{ padding: "1.5rem" }}>
                          <div style={{ fontSize:14, fontWeight:800, color:PX.navy800, marginBottom:"0.75rem", display:"flex", alignItems:"center", gap:8 }}>
                            <SvgMap /> Route Planning & Dead Mileage
                          </div>
                          
                          <RouteMap result={activeResult} journey={journey} gv={db.globalVars} />
                        </Card>

                        {}
                        <div style={{ padding:"12px 16px", background:"#eff6ff", borderRadius:8, fontSize:12, color:PX.navy800, border:`1px solid #bfdbfe`, lineHeight: 1.4, textAlign: "center" }}>
                          <strong>Thank you for your inquiry.</strong> Our dedicated team will reach out to you shortly to discuss your requirements and provide the best possible quotation for your journey.
                        </div>

                      </div>}

                    </div>
                  )}
                </main>
              )}
            </div>
          {showQuotes && <footer style={{ background: PX.offWhite, borderTop: `1px solid ${PX.gray200}`, padding: "2rem 1.5rem", textAlign: "center", fontSize: 12, color: PX.gray600 }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <strong>{db.operatorDetails?.companyName || "Carolean Coaches Ltd"}</strong> · {db.globalVars?.yardAddress || "Unit 1, Bentley Lane, Walsall WS2 8TL"}
            </div>
            <div>
              PSV Operator License: {db.operatorDetails?.operatorLicence || "PM0003456"} · Fare Engine v3.0
            </div>
          </div>
        </footer>}
      </div>
    </>
  );
}

