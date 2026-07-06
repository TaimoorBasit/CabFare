const fs = require('fs');

const path = 'components/CaroleanCoaches.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add geometry library to Google Maps
content = content.replace(
  'libraries=places&callback',
  'libraries=places,geometry&callback'
);

// 2. Add GoogleMapPreview component and update RouteMap
const googleMapPreviewCode = `
function GoogleMapPreview({ geometry, pts, result }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (window.google?.maps && mapRef.current && !map) {
      const m = new window.google.maps.Map(mapRef.current, {
        zoom: 7,
        center: { lat: 52.5, lng: -1.5 },
        disableDefaultUI: true,
      });
      setMap(m);
    }
  }, [mapRef]);

  useEffect(() => {
    if (map && window.google?.maps && geometry) {
      const path = window.google.maps.geometry?.encoding?.decodePath(geometry);
      if (path) {
        const poly = new window.google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: '#1a3f6b',
          strokeOpacity: 1.0,
          strokeWeight: 4,
        });
        poly.setMap(map);

        const bounds = new window.google.maps.LatLngBounds();
        path.forEach(p => bounds.extend(p));
        map.fitBounds(bounds);
      }
      
      pts.forEach((p, i) => {
        if (!p || !p.lat) return;
        new window.google.maps.Marker({
          position: p,
          map,
          label: i === 0 ? 'A' : i === pts.length - 1 ? 'B' : String(i),
        });
      });
    }
  }, [map, geometry, pts]);

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: 310, borderRadius: 10 }}></div>
      <div style={{ display:"flex", gap:8, marginTop:10 }}>
        {[["Total route",result.totalKm+" km"],["Live km",result.revenueKm+" km"],
          ["Shift",result.totalShiftHrs+"h"],["Days",result.opDays]].map(([l,v])=>(
          <div key={l} style={{ flex:1, background:PX.gray100, borderRadius:8, padding:"6px 10px", textAlign:"center" }}>
            <div style={{ fontSize:10, color:PX.gray400, marginBottom:2 }}>{l}</div>
            <div style={{ fontSize:13, fontWeight:700, color:PX.navy700 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
`;

content = content.replace(
  'function RouteMap({ result }) {',
  googleMapPreviewCode + '\nfunction RouteMap({ result }) {\n  if (result?.geometry) return <GoogleMapPreview geometry={result.geometry} pts={result.pts} result={result} />;\n'
);

// 3. Update buildQuotes
const oldBuildQuotes = `const buildQuotes = useCallback(() => {
    const wp = journey.waypoints?.length>=2
      ? journey.waypoints : [journey.origin,journey.destination];
    if (!wp[0]||!wp[wp.length-1]) return;
    setQ(db.vehicles.map(vehicle=>({
      vehicle,
      result: calcFare({...journey,waypoints:wp},vehicle,db),
    })));
  },[journey,db]);`;

const newBuildQuotes = `const buildQuotes = useCallback(async () => {
    const wp = journey.waypoints?.length>=2
      ? journey.waypoints : [journey.origin,journey.destination];
    if (!wp[0]||!wp[wp.length-1]) return;
    try {
      const res = await fetch('/api/quotes/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...journey, waypoints: wp})
      });
      const data = await res.json();
      if (data.quotes) {
        setQ(data.quotes);
      } else {
        setQ(db.vehicles.map(vehicle=>({ vehicle, result: calcFare({...journey,waypoints:wp},vehicle,db) })));
      }
    } catch(err) {
      setQ(db.vehicles.map(vehicle=>({ vehicle, result: calcFare({...journey,waypoints:wp},vehicle,db) })));
    }
  },[journey,db]);`;

content = content.replace(oldBuildQuotes, newBuildQuotes);

// 4. Step2 empty quotes check
content = content.replace(
  'function Step2({ journey, quotes, selected, setSelected, onBack, onNext }) {',
  'function Step2({ journey, quotes, selected, setSelected, onBack, onNext }) {\n  if (!quotes || quotes.length === 0) return <div style={{padding: "2rem", textAlign: "center"}}><span className="spinning">⟳</span> Fetching live availability & pricing...</div>;'
);

// 5. Update AdminDashboard TABS
const oldTabs = 'const TABS = [["fleet","🚌 Fleet size & costs"],["vars","📊 Rates & surcharges"],["settings","⚙ Settings & API"],["calendar","📅 Availability"]];';
const newTabs = 'const TABS = [["matrix","💷 Pricing Matrix"],["templates","🛣 Route Templates"],["seasonal","📅 Seasonal Pricing"],["fleet","🚌 Fleet & Cost Analytics"],["vars","📊 Surcharges"],["calendar","🚫 Availability Blockouts"],["settings","⚙ Settings & API"]];';
content = content.replace(oldTabs, newTabs);

// Add empty sections for new tabs
const fleetTabCode = '{tab==="fleet" && (';
const matrixTabCode = `
          {tab==="matrix" && (
            <div style={{ padding: "1.5rem" }}>
              <h2 style={{ fontSize:17, fontWeight:700, color:PX.navy800 }}>Pricing Matrix</h2>
              <p style={{ fontSize:13, color:PX.gray600, marginTop:4 }}>Configure primary quote rules here (managed via API endpoint).</p>
            </div>
          )}
          {tab==="templates" && (
            <div style={{ padding: "1.5rem" }}>
              <h2 style={{ fontSize:17, fontWeight:700, color:PX.navy800 }}>Route Templates</h2>
              <p style={{ fontSize:13, color:PX.gray600, marginTop:4 }}>Configure fixed price routes here (managed via API endpoint).</p>
            </div>
          )}
          {tab==="seasonal" && (
            <div style={{ padding: "1.5rem" }}>
              <h2 style={{ fontSize:17, fontWeight:700, color:PX.navy800 }}>Seasonal Pricing</h2>
              <p style={{ fontSize:13, color:PX.gray600, marginTop:4 }}>Configure date-based multipliers (managed via API endpoint).</p>
            </div>
          )}
          ` + fleetTabCode;

content = content.replace(fleetTabCode, matrixTabCode);

fs.writeFileSync(path, content);
console.log('Patched successfully');
