
// @ts-nocheck
'use client';
import { API_BASE_URL } from '../lib/api';

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

      /* Customer fast-quote fields are scoped so admin inputs stay compact. */
      #fast-quote input[type="text"],
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
      #fast-quote input[type="text"]::placeholder {
        color: #b8b7bd !important;
        opacity: 1;
      }
      #fast-quote input[type="text"]:focus,
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
      #fast-quote .quote-location > div {
        width: 100%;
      }
      #fast-quote .luggage-select {
        display: block !important;
        width: 82px !important;
        height: 20px !important;
        min-height: 20px !important;
        margin: 2px auto 0 !important;
        padding: 0 13px 0 2px !important;
        border: 0 !important;
        border-radius: 4px !important;
        background-color: transparent !important;
        color: #475569 !important;
        font-size: 9.5px !important;
        font-weight: 800 !important;
        line-height: 20px !important;
        text-align: center;
        text-transform: uppercase;
        box-shadow: none !important;
        cursor: pointer;
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
// ── Default database ──────────────────────────────────────────────────────────

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

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ pct, color }) {
  return <div style={{ height:6, background:PX.gray200, borderRadius:10, overflow:"hidden" }}>
    <div style={{ width:`${Math.min(100,pct)}%`, height:"100%", background:color, borderRadius:10, transition:"width .4s" }}/>
  </div>;
}

// ── Route map ─────────────────────────────────────────────────────────────────
function GoogleMapPreview({ result, journey, gv, compact = false }) {
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
    if (map && directionsRenderer && window.google?.maps && (result?.pts?.length >= 2 || journey?.origin)) {
      const directionsService = new window.google.maps.DirectionsService();
      
      const pts = result?.pts || [];
      let origin;
      if (pts[0] && pts[0].lat !== 0 && pts[0].lng !== 0) {
        origin = new window.google.maps.LatLng(pts[0].lat, pts[0].lng);
      } else {
        origin = journey?.origin;
      }

      let destination;
      if (pts.length >= 2 && pts[pts.length - 1].lat !== 0 && pts[pts.length - 1].lng !== 0) {
        destination = new window.google.maps.LatLng(pts[pts.length - 1].lat, pts[pts.length - 1].lng);
      } else {
        destination = journey?.destination;
      }
      
      let waypoints = [];
      if (pts.length > 2) {
        waypoints = pts.slice(1, -1).map(pt => ({
          location: pt.lat !== 0 ? new window.google.maps.LatLng(pt.lat, pt.lng) : pt.name,
          stopover: true
        }));
      } else if (journey?.stops?.length > 0) {
        waypoints = journey.stops.map(s => ({
          location: s.place, stopover: true
        })).filter(w => w.location);
      }

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
      <div ref={mapRef} style={{ width: '100%', height: compact ? 160 : 320, borderRadius: 12, border: `1.5px solid ${PX.gray200}` }}></div>
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

function RouteMap({ result, journey, gv, compact = false }) {
  if (window.google?.maps && (result?.pts?.length >= 2 || journey?.origin)) return <GoogleMapPreview result={result} journey={journey} gv={gv} compact={compact} />;

  if (!result?.pts?.length || result.pts.length < 2)
    return <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", height:compact ? 160 : 320, gap:10, color:PX.gray400, border:`1.5px dashed ${PX.gray200}`, borderRadius:12 }}>
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
    <svg width="100%" height={compact ? 160 : undefined} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ display:"block", background:PX.gray50, borderRadius:12, border:`1.5px solid ${PX.gray200}` }}>
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
      {[["Total route",`${result.totalKm} ${gv?.distanceUnit === "miles" ? "mi" : "km"}`],["Live km",`${result.revenueKm} ${gv?.distanceUnit === "miles" ? "mi" : "km"}`],
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

// ── VehicleCard (Step 2 equivalent) ──────────────────────────────────────────
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
            <div style={{ fontSize:12,color:PX.gray600,marginTop:2,fontWeight:500 }}>🧳 {lugLabel}</div>
          </div>
        </div>
        <div style={{ textAlign:"right",flexShrink:0 }}>
          {result ? <>
            <div style={{ fontSize:22,fontWeight:800,color:PX.navy800,lineHeight:1 }}>
              {result.upperBoundPrice && result.upperBoundPrice > result.finalPrice ? `£${fmt(result.finalPrice)} – £${fmt(result.upperBoundPrice)}` : `£${fmt(result.finalPrice)}`}
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
        {requiredVehicles > 1 && (
          <div style={{ fontSize: 11, color: PX.gray600, marginTop: 6, fontWeight: 500, background: "#f1f5f9", padding: "6px 10px", borderRadius: 6 }}>
             <strong style={{color: PX.navy800}}>Vehicle Breakdown:</strong> {Array.from({length: requiredVehicles}).map((_, i) => {
               const pax = i === requiredVehicles - 1 ? passengers - (usableCapacity * i) : usableCapacity;
               const vName = (vehicle.name || '').toLowerCase().includes('coach') ? 'Coach' : 'Vehicle';
               return `${vName} ${i+1}: ${pax} passengers`;
             }).join(" • ")}
          </div>
        )}
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
// ── Fleet Economics Panel ──────────────────────────────────────────────────────
// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [db, setDb]         = useState({ vehicles: [
    { id: 'minibus', name: 'Executive Minibus', capacity: 16 },
    { id: 'bus', name: 'Standard Bus', capacity: 33 },
    { id: 'coach', name: 'Premium Coach', capacity: 49 }
  ], globalVars: {}, annualOverheads: [], surcharges: {}, blockedDates: [] });
  const [journey, setJ]     = useState({
    journeyType:"one-way", origin:"", destination:"",
    departureDate:"", returnDate:"",
    passengers:16, suitcaseCount:16, handbagCount:16, waitingMins:0,
    vehiclePreference: "minibus",
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
  const [luggageType, setLuggageType] = useState("handbag");
  const [bookingStep, setBookingStep] = useState(1);
  const fetchIdRef = useRef(0);
  const [validationError, setValidationError] = useState("");

  const { loaded: mapsLoaded } = useGoogleMaps(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "");

  // Load configuration config
  useEffect(() => {
    fetch(API_BASE_URL + '/api/admin/config').then(r=>r.json()).then(data => {
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
    const currentFetchId = ++fetchIdRef.current;
    setLoadingQuotes(true);
    try {
      const res = await fetch(API_BASE_URL + '/api/quotes/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...currentJourney, waypoints: wp, wpCoords: wc})
      });
      const data = await res.json();
      if (currentFetchId !== fetchIdRef.current) return;
      if (data.quotes && data.quotes.length > 0) {
        setQ(data.quotes);
        if (!selected) {
          const preferred = data.quotes.find(q => q.vehicle.id === currentJourney.vehiclePreference);
          const firstAvail = preferred || data.quotes.find(q => q.vehicle.capacity >= currentJourney.passengers) || data.quotes[0];
          if (firstAvail) setSel(firstAvail.vehicle.id);
        }
      } else {
        setQ([]);
        setValidationError('No quotes could be generated for this route.');
      }
    } catch(err) {
      if (currentFetchId !== fetchIdRef.current) return;
      console.error(err);
      setQ([]);
      setValidationError('Failed to connect to the pricing server. Please ensure the backend is running.');
    } finally {
      if (currentFetchId === fetchIdRef.current) {
        setLoadingQuotes(false);
      }
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
    if (!journey.origin || !journey.destination || !journey.departureDate) {
      setValidationError("Please enter pickup location, destination, and departure date.");
      return;
    }

    const hasOriginCoords = journey.wpCoords && journey.wpCoords[0];
    const hasDestCoords = journey.wpCoords && (
      journey.journeyType === "multi-stop"
        ? journey.wpCoords[journey.wpCoords.length - 1]
        : journey.wpCoords[1]
    );
    
    let allStopsHaveCoords = true;
    if (journey.journeyType === "multi-stop" && journey.stops) {
      allStopsHaveCoords = journey.stops.every(s => s.coords);
    }

    if (!hasOriginCoords || !hasDestCoords || !allStopsHaveCoords) {
      setValidationError("❌ Our service is exclusively available within the UK. Please select a valid UK location from the dropdown suggestions or use the map pin icon.");
      return;
    }

    buildQuotes();
    setBookingStep(2);
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
      
      const res = await fetch(API_BASE_URL + '/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setBookingRef(data.booking.id);
        setSubmitted(true);
        setBookingStep(4);
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

  const addStop    = () => setJ(j => ({ ...j, journeyType: "multi-stop", stops: [...(j.stops||[]), { place: "", coords: null, wait: 30 }] }));
  const updateStop = (i, k, v) => setJ(j => ({ ...j, stops: j.stops.map((st, idx) => idx === i ? { ...st, [k]: v } : st) }));
  const removeStop = i => setJ(j => {
    const stops = j.stops.filter((_, idx) => idx !== i);
    const wpCoords = stops.length
      ? j.wpCoords
      : [j.wpCoords?.[0] || null, j.wpCoords?.[j.wpCoords.length - 1] || null];
    return { ...j, stops, wpCoords, journeyType: stops.length ? "multi-stop" : "one-way" };
  });
  const preferredId = journey.vehiclePreference || (quotes.length > 0 ? quotes[0].vehicle.id : null);
  const filteredQuotes = preferredId ? quotes.filter(({vehicle}) => vehicle.id === preferredId) : quotes;
  const selectedQuote = filteredQuotes.find(q => q.vehicle.id === selected) || filteredQuotes[0];
  const activeResult = selectedQuote?.result;
  const selectedVehicleCount = selectedQuote
    ? Math.max(1, Math.ceil(journey.passengers / Math.max(1, selectedQuote.vehicle.capacity || 1)))
    : 1;

  const showReturnDate = journey.journeyType === "return";
  const showLuggageCount = journey.largeLuggage !== "none";

  return (
    <>
      <GlobalStyle/>
      <div style={{ minHeight:"100vh", background:"#f4f6f9" }}>
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
                    <div className="absolute inset-0 z-0">
                      <div className="absolute inset-0 hero-gradient-overlay z-10"></div>
                      <img alt="Carolean executive coach" className="w-full h-full object-cover" src="/header-bg.png"/>
                    </div>
                    <div className="relative z-20 w-full max-w-container-max px-gutter mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-6">
                      <div className="lg:col-span-6 text-stark-white mb-10 lg:mb-0">
                        <div className="inline-flex items-center gap-2 py-2 px-4 bg-white/10 backdrop-blur-md text-white text-label-sm font-label-sm mb-8 rounded-full border border-white/20 uppercase tracking-widest">
                          <span className="w-2 h-2 rounded-full bg-impact-red animate-pulse"></span>
                          Premium Travel Solutions
                        </div>
                        <h1 className="font-headline-xl text-headline-xl leading-[1.1] mb-6">Experience Executive Travel <br/>Defined by <span className="text-impact-red">Precision</span>.</h1>
                        <p className="text-body-lg font-body-lg max-w-xl opacity-90 leading-relaxed mb-10">From elite corporate events to bespoke group logistics, we provide high-fidelity transport solutions that keep your business moving with uncompromising excellence.</p>
                        <div className="flex items-center gap-8">
                          <div className="flex flex-col">
                            <span className="text-headline-lg font-headline-lg">25+</span>
                            <span className="text-label-sm font-label-sm opacity-70">Years Excellence</span>
                          </div>
                          <div className="w-[1px] h-12 bg-stark-white/20"></div>
                          <div className="flex flex-col">
                            <span className="text-headline-lg font-headline-lg">150+</span>
                            <span className="text-label-sm font-label-sm opacity-70">Luxury Coaches</span>
                          </div>
                          <div className="w-[1px] h-12 bg-stark-white/20"></div>
                          <div className="flex flex-col">
                            <span className="text-headline-lg font-headline-lg">5★</span>
                            <span className="text-label-sm font-label-sm opacity-70">Safety Rating</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="lg:col-span-6 flex justify-center lg:justify-end">
                        <div id="fast-quote" className={`w-full ${bookingStep === 3 ? "max-w-[550px] p-6 sm:p-7" : "max-w-[520px] p-6 sm:p-10"} glass-panel rounded-[2.5rem] shadow-2xl transform transition-all duration-500 hover:shadow-deep-navy/20 border border-white/50`}>
                          <div className="flex justify-between items-center mb-8">
                            <h2 className="font-headline-md text-headline-md text-deep-navy">
                              {bookingStep === 1 ? "Fast Quote" : bookingStep === 2 ? "Your Details" : bookingStep === 3 ? "Review Booking" : "Booking Confirmed"}
                            </h2>
                            <div className="flex gap-1">
                              {[1,2,3,4].map(step => <span key={step} className={`w-1.5 h-1.5 rounded-full ${bookingStep === step ? "bg-impact-red" : "bg-deep-navy/20"}`}></span>)}
                            </div>
                          </div>
                          {bookingStep === 1 && <>
                          <div className="flex p-1.5 bg-surface-container rounded-full mb-8">
                            <button type="button" onClick={()=>setJ(j=>({...j, journeyType: "one-way", stops: [], wpCoords: [j.wpCoords?.[0] || null, j.wpCoords?.[j.wpCoords.length - 1] || null]}))} className={`flex-1 py-3 px-4 text-label-sm font-bold rounded-full transition-all ${journey.journeyType !== "return" ? "bg-impact-red text-white shadow-lg" : "text-on-surface-variant hover:bg-white/50"}`}>One-Way</button>
                            <button type="button" onClick={()=>setJ(j=>({...j, journeyType: "return", stops: [], wpCoords: [j.wpCoords?.[0] || null, j.wpCoords?.[j.wpCoords.length - 1] || null]}))} className={`flex-1 py-3 px-4 text-label-sm font-bold rounded-full transition-all ${journey.journeyType === "return" ? "bg-impact-red text-white shadow-lg" : "text-on-surface-variant hover:bg-white/50"}`}>Return</button>
                          </div>
                          
                          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleCalculateClick(); }}>
                            <div className="space-y-4">
                              <div className="relative group quote-location">
                                <PlacesInput 
                                  value={journey.origin} 
                                  onChange={setOrigin}
                                  placeholder="Pickup location" 
                                  icon={<SvgMapPinGreen size={22}/>}
                                  mapsLoaded={mapsLoaded} 
                                />
                              </div>
                              <div className="relative group quote-location">
                                <PlacesInput 
                                  value={journey.destination} 
                                  onChange={setDest}
                                  placeholder="Destination" 
                                  icon={<SvgMapPinRed size={22}/>}
                                  mapsLoaded={mapsLoaded} 
                                />
                              </div>
                              {(journey.stops || []).map((stop, index) => (
                                <div className="relative group flex gap-2 quote-location" key={`stop-${index}`}>
                                  <div className="flex-1">
                                    <PlacesInput
                                      value={stop.place}
                                      onChange={(val, geo) => {
                                        updateStop(index, "place", val);
                                        updateStop(index, "coords", geo);
                                      }}
                                      placeholder={`Stop ${index + 1}`}
                                      icon={<SvgMapPinBlue size={22}/>}
                                      mapsLoaded={mapsLoaded}
                                    />
                                  </div>
                                  <button type="button" aria-label={`Remove stop ${index + 1}`} onClick={() => removeStop(index)} className="w-12 h-12 rounded-full border border-outline-variant bg-white text-impact-red flex items-center justify-center">
                                    <span className="material-symbols-outlined">close</span>
                                  </button>
                                </div>
                              ))}
                              <button type="button" onClick={addStop} className="w-full h-11 rounded-full border border-dashed border-outline-variant bg-white/60 text-deep-navy text-sm font-bold flex items-center justify-center gap-2 hover:border-deep-navy hover:bg-white transition-all">
                                <span className="material-symbols-outlined text-[19px]">add_circle</span>
                                {(journey.stops || []).length ? "Add another stop" : "Add a stop"}
                              </button>
                            </div>

                            {/* Date / Return row */}
                            <div className={`grid grid-cols-1 ${journey.journeyType === "return" ? "sm:grid-cols-2" : ""} gap-4`}>
                              <div className="relative group">
                                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant z-10" style={{pointerEvents: "none"}}>calendar_month</span>
                                <input className="w-full pl-12 pr-6 py-4 bg-white border border-outline-variant capsule-input focus:outline-none focus:border-deep-navy transition-all font-body-md text-on-surface shadow-sm cursor-pointer" type="datetime-local" value={journey.departureDate} onClick={e=>e.currentTarget.showPicker?.()} onChange={e=>setJ(j=>({...j, departureDate: e.target.value}))} required />
                              </div>
                              {journey.journeyType === 'return' && (
                              <div className="relative group">
                                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant z-10" style={{pointerEvents: "none"}}>calendar_month</span>
                                <input className="w-full pl-12 pr-6 py-4 bg-white border border-outline-variant capsule-input focus:outline-none focus:border-deep-navy transition-all font-body-md text-on-surface shadow-sm cursor-pointer" type="datetime-local" value={journey.returnDate || ''} onClick={e=>e.currentTarget.showPicker?.()} onChange={e=>setJ(j=>({...j, returnDate: e.target.value}))} required />
                              </div>
                              )}
                            </div>

                            {/* Vehicle, Passengers & Luggage */}
                            <div className="flex gap-2 w-full">
                              {/* Vehicle ~45% */}
                              <div className="relative group" style={{flex:'0 0 40%'}}>
                                <select className="w-full h-[56px] !appearance-none pl-4 pr-8 bg-white border border-outline-variant rounded-full focus:outline-none focus:border-deep-navy transition-all text-[12px] font-bold text-deep-navy cursor-pointer shadow-sm"
                                  style={{ backgroundImage: 'none' }}
                                  value={journey.vehiclePreference || 'minibus'} onChange={e=>{
                                    const v = e.target.value;
                                    let p = 16;
                                    if (v === 'bus') p = 33;
                                    if (v === 'coach') p = 49;
                                    setJ(j=>({...j, vehiclePreference: v, passengers: p, handbagCount: p, suitcaseCount: p}));
                                  }}>
                                  <option value="minibus">Executive Minibus (16 Seats)</option>
                                  <option value="bus">Standard Bus (33 Seats)</option>
                                  <option value="coach">Premium Coach (49 Seats)</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[18px]">expand_more</span>
                              </div>

                              {/* Passengers ~27.5% */}
                              <div className="flex-1 relative h-[56px] bg-white border border-outline-variant rounded-full shadow-sm overflow-hidden">
                                <button type="button" onClick={()=>setJ(j=>({...j, passengers: Math.max(1, (j.passengers || 16) - 1)}))} className="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-impact-red rounded-full transition-all w-7 h-7 flex items-center justify-center focus:outline-none z-10"><span className="material-symbols-outlined text-[18px]">remove</span></button>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                  <span className="text-[17px] font-bold text-deep-navy leading-none">{journey.passengers || 16}</span>
                                  <div className="text-[9px] font-bold text-gray-500 uppercase tracking-tight leading-none mt-[2px]">Passengers</div>
                                </div>
                                <button type="button" onClick={()=>setJ(j=>({...j, passengers: Math.min(100, (j.passengers || 16) + 1)}))} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4ADE80] rounded-full transition-all w-7 h-7 flex items-center justify-center focus:outline-none z-10"><span className="material-symbols-outlined text-[18px]">add</span></button>
                              </div>

                              {/* Luggage ~27.5% — each type keeps its own quantity */}
                              <div className="relative h-[56px] bg-white border border-outline-variant rounded-full shadow-sm overflow-hidden" style={{flex: "0 0 27%"}}>
                                <button
                                  type="button"
                                  aria-label={`Decrease ${luggageType === "handbag" ? "handbags" : "23kg suitcases"}`}
                                  onClick={()=>setJ(j => luggageType === "handbag"
                                    ? {...j, handbagCount: Math.max(0, (j.handbagCount ?? 0) - 1)}
                                    : {...j, suitcaseCount: Math.max(0, (j.suitcaseCount ?? 0) - 1)}
                                  )}
                                  className="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-impact-red rounded-full transition-all w-7 h-7 flex items-center justify-center z-10 focus:outline-none"
                                ><span className="material-symbols-outlined text-[18px]">remove</span></button>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-[17px] font-bold text-deep-navy leading-none pointer-events-none">
                                    {luggageType === "handbag" ? (journey.handbagCount ?? 0) : (journey.suitcaseCount ?? 0)}
                                  </span>
                                  <select
                                    aria-label="Choose luggage type"
                                    value={luggageType}
                                    onChange={e=>setLuggageType(e.target.value)}
                                    className="luggage-select"
                                  >
                                    <option value="handbag">Handbags</option>
                                    <option value="suitcase">Suitcase 23kg</option>
                                  </select>
                                </div>
                                <button
                                  type="button"
                                  aria-label={`Increase ${luggageType === "handbag" ? "handbags" : "23kg suitcases"}`}
                                  onClick={()=>setJ(j => luggageType === "handbag"
                                    ? {...j, handbagCount: (j.handbagCount ?? 0) + 1}
                                    : {...j, suitcaseCount: (j.suitcaseCount ?? 0) + 1}
                                  )}
                                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4ADE80] rounded-full transition-all w-7 h-7 flex items-center justify-center z-10 focus:outline-none"
                                ><span className="material-symbols-outlined text-[18px]">add</span></button>
                              </div>
                            </div>

                            {validationError && (
                              <div style={{ padding: "10px", background: "#fee2e2", color: "#b91c1c", borderRadius: "8px", fontSize: "14px" }}>
                                {validationError}
                              </div>
                            )}

                            
                            <button type="submit" className="w-full py-5 bg-impact-red text-white font-headline-md rounded-full hover:bg-secondary transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 group shadow-xl shadow-impact-red/30 mt-4">
                              Continue
                              <span className="material-symbols-outlined transition-transform group-hover:translate-x-2">arrow_forward</span>
                            </button>
                          </form>
                          </>}

                          {bookingStep === 2 && (
                            <form className="space-y-4 fade-up" onSubmit={e => {
                              e.preventDefault();
                              setValidationError("");
                              if (!journey.name.trim() || !journey.email.trim() || !journey.phone.trim()) {
                                setValidationError("Please enter your name, email address, and phone number.");
                                return;
                              }
                              setBookingStep(3);
                            }}>
                              <div>
                                <label className="field-label">Full name</label>
                                <input className="quote-details-field" type="text" value={journey.name} onChange={e=>setJ(j=>({...j,name:e.target.value}))} placeholder="Your full name" required/>
                              </div>
                              <div>
                                <label className="field-label">Email address</label>
                                <input className="quote-details-field" type="email" value={journey.email} onChange={e=>setJ(j=>({...j,email:e.target.value}))} placeholder="you@example.com" required/>
                              </div>
                              <div>
                                <label className="field-label">Phone number</label>
                                <input className="quote-details-field" type="tel" value={journey.phone} onChange={e=>setJ(j=>({...j,phone:e.target.value}))} placeholder="+44 7700 900000" required/>
                              </div>
                              <div>
                                <label className="field-label">Special requests <span className="normal-case font-normal">(optional)</span></label>
                                <textarea className="quote-details-field" value={journey.specialRequests} onChange={e=>setJ(j=>({...j,specialRequests:e.target.value}))} placeholder="Wheelchair access, mobility assistance, child seats, additional stops, or other instructions"/>
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
                                  <div className="text-lg font-bold">{journey.origin.split(",")[0]} <span className="text-impact-red">→</span> {journey.destination.split(",")[0]}</div>
                                  <div className="text-xs opacity-75 mt-1">{new Date(journey.departureDate).toLocaleString("en-GB")} · {journey.passengers} passengers</div>
                                </div>
                                <button type="button" onClick={()=>setBookingStep(1)} aria-label="Edit journey details" title="Edit journey details" className="w-9 h-9 shrink-0 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="rounded-xl bg-surface-container-low p-3"><span className="field-label">Journey</span><strong>{journey.journeyType === "return" ? "Return" : (journey.stops?.length ? "With stops" : "One-way")}</strong></div>
                                <div className="rounded-xl bg-surface-container-low p-3"><span className="field-label">Luggage</span><strong>{journey.handbagCount} hand · {journey.suitcaseCount} cases</strong></div>
                                <div className="rounded-xl bg-surface-container-low p-3 min-w-0"><span className="field-label">Contact</span><strong>{journey.name}</strong><br/><span className="text-[10px] break-all">{journey.email}</span></div>
                              </div>
                              {journey.specialRequests && <div className="rounded-xl border border-outline-variant p-4 text-sm"><span className="field-label">Special requests</span>{journey.specialRequests}</div>}
                              <div className="rounded-2xl border border-outline-variant bg-white p-3.5">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                  <div>
                                    <span className="field-label">Selected option</span>
                                    <strong className="text-deep-navy">{selectedQuote ? `${selectedVehicleCount} × ${selectedQuote.vehicle.name}` : "Calculating vehicle option..."}</strong>
                                    <p className="text-xs text-on-surface-variant mt-1">{journey.passengers} passengers · {journey.suitcaseCount} suitcases · {journey.handbagCount} handbags</p>
                                  </div>
                                  {selectedQuote && (
                                    <div className="text-right shrink-0">
                                      <span className="field-label">Estimated price</span>
                                      <strong className="text-lg text-deep-navy">£{fmt(selectedQuote.result?.finalPrice || selectedQuote.result?.finalFare || 0)}{selectedQuote.result?.upperBoundPrice ? `–£${fmt(selectedQuote.result.upperBoundPrice)}` : ""}</strong>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-deep-navy mb-2">
                                  <SvgMap size={18}/> Route planning & mileage
                                </div>
                                {loadingQuotes
                                  ? <div className="h-[160px] rounded-xl bg-surface-container-low flex items-center justify-center text-sm text-on-surface-variant">Calculating route and pricing...</div>
                                  : <RouteMap result={activeResult} journey={journey} gv={db.globalVars} compact/>
                                }
                              </div>
                              <div className="flex gap-3 pt-2">
                                <button type="button" onClick={()=>setBookingStep(2)} className="h-14 px-6 rounded-full border border-outline-variant text-deep-navy font-bold flex items-center justify-center gap-2">
                                  <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
                                </button>
                                <button type="button" onClick={handleFinalBookingSubmit} disabled={submitting || loadingQuotes || !selected} className="flex-1 h-14 bg-impact-red disabled:opacity-50 text-white rounded-full font-bold shadow-lg shadow-impact-red/20 flex items-center justify-center gap-2">
                                  {submitting ? "Confirming..." : <>Confirm Booking <span className="material-symbols-outlined text-[19px]">arrow_forward</span></>}
                                </button>
                              </div>
                            </div>
                          )}

                          {bookingStep === 4 && (
                            <div className="text-center py-4 fade-up">
                              <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-5"><SvgCheck size={34}/></div>
                              <h3 className="text-2xl font-bold text-deep-navy mb-2">Your booking request is confirmed</h3>
                              <p className="text-sm text-on-surface-variant mb-5">Your request has been recorded for <strong>{journey.email}</strong>. Our team will contact you shortly to finalize the journey and assist with any special requirements.</p>
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
                        <span className="text-6xl font-headline-lg text-impact-red mb-6 block opacity-25" aria-hidden="true">“</span>
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
                      <p className="text-body-md opacity-60 leading-relaxed">Providing world-class transportation solutions since 1999. Precision, punctuality, and professionalism in every mile.</p>
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
                      <h5 className="text-stark-white font-headline-md mb-8">Headquarters</h5>
                      <ul className="space-y-6">
                        <li className="flex gap-4 text-surface-variant opacity-80">
                          <span className="material-symbols-outlined text-impact-red">pin_drop</span>
                          12-16 Corporate Drive, <br/>London, EC2A 4NE
                        </li>
                        <li className="flex gap-4 text-surface-variant opacity-80">
                          <span className="material-symbols-outlined text-impact-red">call</span>
                          +44 (0) 20 7834 1234
                        </li>
                        <li className="flex gap-4 text-surface-variant opacity-80">
                          <span className="material-symbols-outlined text-impact-red">mail</span>
                          bookings@carolean.com
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="max-w-container-max mx-auto px-gutter mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 px-6">
                    <p className="text-label-sm font-label-sm opacity-60">© 2026 Carolean Coaches. Executive Precision in Motion.</p>
                    <div className="flex gap-8">
                      <span className="text-label-sm font-label-sm opacity-40">ISO 9001 Certified</span>
                      <span className="text-label-sm font-label-sm opacity-40">Site by Precision Agency</span>
                    </div>
                  </div>
                </footer>
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
                                    {submitting ? <><span className="spinning" style={{ marginRight: 8 }}>⟳</span> Confirming...</> : "Confirm Booking"}
                                  </Btn>
                                </div>
                              )}
                            </>
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

                        {/* Contact Message Box */}
                        <div style={{ padding:"12px 16px", background:"#eff6ff", borderRadius:8, fontSize:12, color:PX.navy800, border:`1px solid #bfdbfe`, lineHeight: 1.4, textAlign: "center" }}>
                          <strong>Thank you for your inquiry.</strong> Our dedicated team will reach out to you shortly to discuss your requirements and provide the best possible quotation for your journey.
                        </div>

                      </div>

                    </div>
                  )}
                </main>
              )}
            </div>
          {showQuotes && <footer style={{ background: PX.offWhite, borderTop: `1px solid ${PX.gray200}`, padding: "2rem 1.5rem", textAlign: "center", fontSize: 12, color: PX.gray600 }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <strong>Carolean Coaches Ltd</strong> · Unit 1, Bentley Lane, Walsall WS2 8TL
            </div>
            <div>
              PSV Operator License: PM0003456 · Fare Engine v3.0
            </div>
          </div>
        </footer>}
      </div>
    </>
  );
}
