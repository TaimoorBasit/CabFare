// @ts-nocheck
'use client';

import React, { useEffect, useRef, useState } from 'react';

const PX = {
  navy800: "#0D0E48",
  navy700: "#13155C",
  brandRed: "#CD202C",
  gray50: "#f8fafc",
  gray100: "#f1f5f9",
  gray200: "#e2e8f0",
  gray400: "#94a3b8",
  gray600: "#475569",
};

function decodePolyline(encoded: string): [number, number][] {
  if (!encoded || typeof encoded !== 'string') return [];
  const poly: [number, number][] = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    poly.push([lat / 1e5, lng / 1e5]);
  }
  return poly;
}

function normaliseRoutePoint(point: any) {
  if (!point) return null;
  const source = point.location || point;
  const rawLat = typeof source.lat === "function" ? source.lat() : source.lat;
  const rawLng = typeof source.lng === "function" ? source.lng() : source.lng;
  const lat = Number(rawLat);
  const lng = Number(rawLng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  if (lat === 0 && lng === 0) return null;
  return { lat, lng, name: point.name || point.address || "" };
}

function getJourneyStops(journey: any) {
  if (!journey?.stops) return [];
  return (Array.isArray(journey.stops) ? journey.stops : [journey.stops]).filter((stop: any) => stop?.place || stop?.name || stop?.coords);
}

function getSavedRoutePoints(result: any, journey: any) {
  const explicitPoints = (result?.pts || []).map(normaliseRoutePoint).filter(Boolean);
  const legs = Array.isArray(result?.chain) ? result.chain : [];
  const recoveredPoints: any[] = [];
  if (legs.length) {
    const start = normaliseRoutePoint(legs[0]?.start_location);
    if (start) recoveredPoints.push({ ...start, name: legs[0]?.start_address || start.name });
    legs.forEach((leg: any) => {
      const end = normaliseRoutePoint(leg?.end_location);
      if (end) recoveredPoints.push({ ...end, name: leg?.end_address || end.name });
    });
  }
  const journeyCoordinates = (journey?.wpCoords || []).map(normaliseRoutePoint).filter(Boolean);
  const stopPoints = getJourneyStops(journey).map((stop: any) => {
    const point = normaliseRoutePoint(stop?.coords || stop);
    return point ? { ...point, name: stop.place || stop.name || point.name, kind: "stop", wait: stop.wait } : null;
  }).filter(Boolean);

  const sourcePoints = explicitPoints.length >= 2 ? explicitPoints : recoveredPoints.length >= 2 ? recoveredPoints : journeyCoordinates;
  const origin = sourcePoints[0] || journeyCoordinates[0] || null;
  const destination = sourcePoints[sourcePoints.length - 1] || journeyCoordinates[journeyCoordinates.length - 1] || null;
  const middle = stopPoints.length ? stopPoints : sourcePoints.slice(1, -1);
  const points = [
    origin && { ...origin, name: journey?.origin || origin.name, kind: "origin" },
    ...middle,
    destination && { ...destination, name: journey?.destination || destination.name, kind: "destination" }
  ].filter(Boolean);
  return points.filter((point, index, allPoints) => index === 0 || point.lat !== allPoints[index - 1].lat || point.lng !== allPoints[index - 1].lng);
}

export default function LeafletRouteMap({ result, journey, gv, compact = false, showMetrics = true, RouteMetricsComponent }: any) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);

  useEffect(() => {
    let isCancelled = false;

    const initMap = async () => {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      const L = (await import("leaflet")).default;
      if (isCancelled) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [52.5, -1.5],
          zoom: 7,
          zoomControl: true,
        });
        mapInstanceRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        layerGroupRef.current = L.layerGroup().addTo(map);
      }

      const map = mapInstanceRef.current;
      const layerGroup = layerGroupRef.current;
      if (!map || !layerGroup) return;

      layerGroup.clearLayers();

      const pts = getSavedRoutePoints(result, journey);
      let path: [number, number][] = [];

      if (result?.geometry) {
        try {
          path = decodePolyline(result.geometry);
        } catch (_) {
          path = [];
        }
      }

      if (path.length < 2 && pts.length >= 2) {
        path = pts.map((p: any) => [p.lat, p.lng] as [number, number]);
      }

      if (path.length < 2) return;

      // Draw Main Route Polyline
      const routePolyline = L.polyline(path, {
        color: "#0D0E48",
        weight: 5,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round",
      });
      layerGroup.addLayer(routePolyline);

      // Return Route Polyline if return journey
      if (journey?.journeyType === "return") {
        const returnPath = [...path].reverse();
        const returnPolyline = L.polyline(returnPath, {
          color: "#CD202C",
          weight: 4,
          opacity: 0.85,
          dashArray: "8, 8",
          lineCap: "round",
        });
        layerGroup.addLayer(returnPolyline);
      }

      const createLetterIcon = (label: string, color: string = "#CD202C") => {
        return L.divIcon({
          className: 'custom-letter-marker',
          html: `
            <div style="position: relative; width: 32px; height: 42px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.35));">
              <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.16344 0 0 7.61116 0 16C0 27 16 42 16 42C16 42 32 27 32 16C32 7.16344 24.8366 0 16 0Z" fill="${color}"/>
                <circle cx="16" cy="15" r="9" fill="#ffffff"/>
              </svg>
              <span style="position: relative; z-index: 2; font-weight: 800; font-size: 11.5px; color: ${color}; margin-top: -12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${label}</span>
            </div>
          `,
          iconSize: [32, 42],
          iconAnchor: [16, 42],
          popupAnchor: [0, -38]
        });
      };

      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const bounds = L.latLngBounds(path);

      pts.forEach((point: any, index: number) => {
        const label = index < alphabet.length ? alphabet[index] : String(index + 1);
        const pinColor = index === 0 ? "#0D0E48" : index === pts.length - 1 ? "#CD202C" : "#E53E3E";
        const icon = createLetterIcon(label, pinColor);

        const marker = L.marker([point.lat, point.lng], { icon });
        const title = point.kind === "stop" ? `Stop ${index}: ${point.name}` : point.name || (index === 0 ? journey?.origin : journey?.destination);
        marker.bindPopup(`<div style="font-size:12px; font-weight:600; padding:2px 4px;"><strong>${label}:</strong> ${title || 'Location'}</div>`);
        layerGroup.addLayer(marker);
        bounds.extend([point.lat, point.lng]);
      });

      // Depot Marker
      if (gv?.yardLat != null && gv?.yardLat !== "" && Number.isFinite(Number(gv?.yardLat)) && gv?.yardLng != null && gv?.yardLng !== "" && Number.isFinite(Number(gv?.yardLng))) {
        const depotLat = Number(gv.yardLat);
        const depotLng = Number(gv.yardLng);
        const depotIcon = L.divIcon({
          className: 'custom-depot-marker',
          html: `
            <div style="width: 26px; height: 26px; border-radius: 50%; background: #A22D3A; border: 2.5px solid #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 800; font-size: 11px;">
              D
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
          popupAnchor: [0, -13],
        });
        const depotMarker = L.marker([depotLat, depotLng], { icon: depotIcon });
        depotMarker.bindPopup(`<div style="font-size:12px; font-weight:600; padding:2px 4px;"><strong>Depot:</strong> ${gv.yardAddress || "Configured Depot"}</div>`);
        layerGroup.addLayer(depotMarker);
        bounds.extend([depotLat, depotLng]);
      }

      map.fitBounds(bounds, { padding: [30, 30] });

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
    };

    initMap();

    return () => {
      isCancelled = true;
    };
  }, [result, journey, gv?.yardLat, gv?.yardLng, gv?.yardAddress]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.remove(); } catch (_) {}
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      <div 
        ref={mapContainerRef} 
        style={{ 
          width: '100%', 
          height: compact ? 160 : 280, 
          borderRadius: 12, 
          border: `1.5px solid ${PX.gray200}`,
          overflow: "hidden" 
        }} 
      />
      {showMetrics && RouteMetricsComponent && <RouteMetricsComponent result={result} journey={journey} />}
    </div>
  );
}
