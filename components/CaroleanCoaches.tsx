
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
function GoogleMapPreview({ result, journey, gv }) {
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
  if (window.google?.maps && (result?.pts?.length >= 2 || journey?.origin)) return <GoogleMapPreview result={result} journey={journey} gv={gv} />;

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
            <div style={{ fontSize:18,fontWeight:800,color:PX.navy800,lineHeight:1 }}>Available</div>
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
  

  const handleCalculateClick = async () => {
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
      setValidationError("📍 Our service is exclusively available within the UK. Please select a valid UK location from the dropdown suggestions or use the map pin icon.");
      return;
    }

    setSubmitting(true);
    try {
      const wp = journey.journeyType === "multi-stop"
        ? [journey.origin, ...journey.stops.map(s => s.place).filter(Boolean), journey.destination]
        : [journey.origin, journey.destination];

      const wc = journey.journeyType === "multi-stop"
        ? [journey.wpCoords?.[0], ...journey.stops.map(s => s.coords || null), journey.wpCoords?.[journey.wpCoords.length - 1]]
        : [journey.wpCoords?.[0], journey.wpCoords?.[1]];

      const calcRes = await fetch(API_BASE_URL + '/api/quotes/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...journey, waypoints: wp, wpCoords: wc})
      });
      const calcData = await calcRes.json();
      
      if (calcData.quotes && calcData.quotes.length > 0) {
        setQ(calcData.quotes);
        const preferred = calcData.quotes.find(q => q.vehicle.id === journey.vehiclePreference);
        const bestQuote = preferred || calcData.quotes.find(q => q.vehicle.capacity >= journey.passengers) || calcData.quotes[0];
        setSel(bestQuote.vehicle.id);
        
        const payload = {
          customer: {
            name: journey.name,
            phone: journey.phone,
            email: journey.email,
            company: journey.company
          },
          journey: journey,
          quote: bestQuote
        };
        
        const bookRes = await fetch(API_BASE_URL + '/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const bookData = await bookRes.json();
        
        if (bookData.success) {
          setBookingRef(bookData.booking.id);
          setSubmitted(true);
        }
        setShowQuotes(true);
      } else {
        setValidationError('No quotes could be generated for this route.');
      }
    } catch(err) {
      console.error(err);
      setValidationError('Network error occurred while submitting quote request.');
    } finally {
      setSubmitting(false);
    }
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
  const filteredQuotes = quotes.filter(({vehicle}) => !journey.vehiclePreference || vehicle.id === journey.vehiclePreference);
  const selectedQuote = filteredQuotes.find(q => q.vehicle.id === selected) || filteredQuotes[0];
  const activeResult = selectedQuote?.result;

  const showReturnDate = journey.journeyType === "return";
  const showLuggageCount = journey.largeLuggage !== "none";

  return (
    <>
      <GlobalStyle/>
      <div style={{ minHeight:"100vh", background:"#f4f6f9" }}>
        <Navbar />
        
        <div className="fade-up">
            
            {!showQuotes ? (
              /* PAGE 1: SEARCH & INPUT FORM WITH HERO */
              <div>
                {/* Full-width brand hero banner */}
                <div style={{ 
                  backgroundImage: "linear-gradient(rgba(19, 21, 92, 0.65), rgba(19, 21, 92, 0.65)), url('/header-bg.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  padding: "5.5rem 1.5rem 7.5rem",
                  color: "#fff",
                  textAlign: "center"
                }}>
                  <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <span style={{ 
                      background: "rgba(19, 21, 92, 0.8)", 
                      border: "1px solid rgba(255,255,255,0.2)", 
                      padding: "5px 14px", 
                      borderRadius: 30, 
                      fontSize: 10.5, 
                      fontWeight: 800, 
                      letterSpacing: 1.5, 
                      textTransform: "uppercase", 
                      color: PX.amber500,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
                    }}>
                      Instant fleet fare calculator
                    </span>
                    <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "3.25rem", fontWeight: 950, marginTop: 16, letterSpacing: -0.8, lineHeight: 1.1, textShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
                      Your Journey, Our Priority
                    </h1>
                    <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: "1.1rem", color: "rgba(255,255,255,0.9)", fontWeight: 500, maxWidth: 650, margin: "1rem auto 0", lineHeight: 1.5, textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>
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
                          <Field label="Vehicle Preference (Optional)">
                            <div style={{ height: 42 }}>
                              <select
                                value={journey.vehiclePreference || db.vehicles?.[0]?.id || ''}
                                onChange={e => { const vid = e.target.value; const selectedVehicle = db.vehicles?.find(v => v.id === vid); const newPass = selectedVehicle ? selectedVehicle.capacity : 16; setJ(j => ({...j, vehiclePreference: vid, passengers: newPass, suitcaseCount: newPass, handbagCount: newPass, activeLuggageType: 'suitcase'})); }}
                                style={{ width: "100%", height: "100%", boxSizing: "border-box", margin: 0, padding: "8px 12px", borderRadius: 6, border: `1.5px solid #dde0e8`, fontSize: 14, color: PX.navy800, background: "#fff", cursor: "pointer" }}
                              >
                                
                                {db.vehicles?.map(v => (
                                  <option key={v.id} value={v.id}>{v.name} ({v.capacity} Seats)</option>
                                ))}
                              </select>
                            </div>
                          </Field>
                          <Field label="Number of Passengers" required>
                            <div style={{ display:"flex", height: 42, alignItems: "stretch" }}>
                              <button type="button" onClick={()=>{
                                const current = Number(journey.passengers) || 1;
                                const p = Math.max(1, current - 1);
                                setJ(j=>({...j,passengers:p, suitcaseCount:p, handbagCount:p}));
                              }}
                                style={{ width:40, height: "100%", boxSizing: "border-box", margin: 0, border:`1.5px solid #dde0e8`,borderRight:"none",
                                  borderRadius:"6px 0 0 6px",background:"#fff",cursor:"pointer",fontSize:16,fontWeight:700,color:PX.navy800 }}>−</button>
                              <input type="number" min={1} value={journey.passengers}
                                onChange={e=>{
                                  const val = e.target.value;
                                  const p = val === "" ? "" : (parseInt(val) || 1);
                                  setJ(j=>({...j,passengers:p as any, suitcaseCount:Number(p)||0, handbagCount:Number(p)||0}));
                                }}
                                style={{ width:60, height: "100%", boxSizing: "border-box", margin: 0, textAlign:"center",borderRadius:0,borderLeft:"none",borderRight:"none",fontWeight:700, border:`1.5px solid #dde0e8`, borderLeftWidth:0, borderRightWidth:0 }}/>
                              <button type="button" onClick={()=>{
                                const current = Number(journey.passengers) || 0;
                                const p = current + 1;
                                setJ(j=>({...j,passengers:p, suitcaseCount:p, handbagCount:p}));
                              }}
                                style={{ width:40, height: "100%", boxSizing: "border-box", margin: 0, border:`1.5px solid #dde0e8`,borderLeft:"none",
                                  borderRadius:"0 6px 6px 0",background:"#fff",cursor:"pointer",fontSize:16,fontWeight:700,color:PX.navy800 }}>＋</button>
                            </div>
                          </Field>
                          <Field label="Luggage Requirements">
                            <div style={{ display:"flex", height: 42, alignItems: "stretch" }}>
                              <select 
                                value={journey.activeLuggageType || 'none'} 
                                onChange={e=>setJ(j=>({...j,activeLuggageType:e.target.value}))}
                                style={{ flex: 1, height: "100%", boxSizing: "border-box", margin: 0, borderRadius:"6px 0 0 6px", borderRight:"none", border:`1.5px solid #dde0e8`, borderRightWidth:0 }}
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
                                style={{ width:40, height: "100%", boxSizing: "border-box", margin: 0, border:`1.5px solid #dde0e8`,borderRight:"none", borderLeft:"none",
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
                                style={{ width:46, height: "100%", boxSizing: "border-box", margin: 0, textAlign:"center",borderRadius:0,borderLeft:"none",borderRight:"none", padding:0, border:`1.5px solid #dde0e8`, borderLeftWidth:0, borderRightWidth:0,
                                  background: (!journey.activeLuggageType || journey.activeLuggageType === 'none') ? "#f9fafb" : "#fff" }}/>
                              
                              <button type="button" 
                                disabled={!journey.activeLuggageType || journey.activeLuggageType === 'none'}
                                onClick={()=>{
                                  if (journey.activeLuggageType === 'suitcase') setJ(j=>({...j,suitcaseCount:(j.suitcaseCount||0)+1}));
                                  else if (journey.activeLuggageType === 'handbag') setJ(j=>({...j,handbagCount:(j.handbagCount||0)+1}));
                                }}
                                style={{ width:40, height: "100%", boxSizing: "border-box", margin: 0, border:`1.5px solid #dde0e8`,borderLeft:"none",
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
                          <Btn variant="primary" size="lg" onClick={handleCalculateClick} disabled={submitting}>
                            {submitting ? <><span className="spinning" style={{ marginRight: 6 }}>⟳</span> Sending...</> : "Submit Quote Request"}
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
                          filteredQuotes.map(({vehicle, result}) => (
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
                              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 900, color: PX.navy800, marginTop: 2 }}>{selectedQuote?.vehicle?.name} {selectedQuote?.vehicle?.capacity} seats</div>
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

                            </div>
                          )}
                        </Card>
                      )}

                      {/* Contact Message Box */}
                      <div style={{ padding:"12px 16px", background:"#eff6ff", borderRadius:8, fontSize:12, color:PX.navy800, border:`1px solid #bfdbfe`, lineHeight: 1.4, textAlign: "center" }}>
                        <strong>Thank you for your inquiry.</strong> Our dedicated team will reach out to you shortly to discuss your requirements and provide the best possible quotation for your journey.
                      </div>

                    </div>

                  </div>
                </main>
              )}
            </div>
        
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
