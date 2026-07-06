const fs = require('fs');

const path = 'components/CaroleanCoaches.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace GoogleMapPreview
const oldPreviewStart = 'function GoogleMapPreview({ geometry, pts, result }) {';
const oldPreviewEndRegex = /function RouteMap\(\{ result \}\) \{/;

const newPreview = `function GoogleMapPreview({ journey, result }) {
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
    if (map && directionsRenderer && window.google?.maps && journey) {
      const directionsService = new window.google.maps.DirectionsService();
      
      const waypoints = (journey.waypoints || []).map(wp => {
        // Handle coordinate objects or strings
        const loc = (typeof wp === 'object' && wp.lat) ? wp : wp;
        return { location: loc, stopover: true };
      });

      if (waypoints.length >= 2) {
        const origin = waypoints.shift().location;
        const destination = waypoints.pop().location;

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
    }
  }, [map, directionsRenderer, journey]);

  return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: 310, borderRadius: 10 }}></div>
      {result && <div style={{ display:"flex", gap:8, marginTop:10 }}>
        {[["Total route",result.totalKm+" km"],["Live km",result.revenueKm+" km"],
          ["Shift",result.totalShiftHrs+"h"],["Days",result.opDays]].map(([l,v])=>(
          <div key={l} style={{ flex:1, background:PX.gray100, borderRadius:8, padding:"6px 10px", textAlign:"center" }}>
            <div style={{ fontSize:10, color:PX.gray400, marginBottom:2 }}>{l}</div>
            <div style={{ fontSize:13, fontWeight:700, color:PX.navy700 }}>{v}</div>
          </div>
        ))}
      </div>}
    </div>
  );
}

function RouteMap({ result, journey }) {
  if (result?.geometry || journey?.waypoints?.length >= 2) return <GoogleMapPreview journey={journey} result={result} />;
`;

content = content.replace(
  /function GoogleMapPreview\(\{ geometry, pts, result \}\) \{[\s\S]*?function RouteMap\(\{ result \}\) \{[\s\S]*?if \(result\?\.geometry\) return <GoogleMapPreview geometry=\{result\.geometry\} pts=\{result\.pts\} result=\{result\} \/>;/,
  newPreview
);

// 2. Update Step2 RouteMap call
content = content.replace(
  '<RouteMap result={selQ?.result||quotes[0]?.result}/>',
  '<RouteMap result={selQ?.result||quotes[0]?.result} journey={journey} />'
);

fs.writeFileSync(path, content);
console.log('Map patched successfully');
