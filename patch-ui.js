const fs = require('fs');
let code = fs.readFileSync('components/CaroleanCoaches.tsx', 'utf8');

// 1. Add distanceUnit to globalVars state defaults
code = code.replace(
  'profitMarginPct: 28,',
  'profitMarginPct: 28,\n    distanceUnit: "km",'
);

// 2. Add toggle in System Settings
const targetHeader = '<h3 style={{ fontSize:14, fontWeight:700, color:PX.navy800, marginBottom:".8rem" }}>Global Variables</h3>';
code = code.replace(
  targetHeader,
  `${targetHeader}\n
                          <div style={{ marginBottom: "1.5rem" }}>
                            <label style={{ fontSize:11,fontWeight:700,color:PX.gray600,display:"block",marginBottom:4,textTransform:"uppercase" }}>Distance Unit</label>
                            <div style={{ display:"flex", gap:"10px" }}>
                              <Btn variant={gv.distanceUnit === "miles" ? "primary" : "outline"} size="sm" onClick={(e) => { e.preventDefault(); setGv({...gv, distanceUnit: "miles"}); }}>Miles</Btn>
                              <Btn variant={gv.distanceUnit === "km" || !gv.distanceUnit ? "primary" : "outline"} size="sm" onClick={(e) => { e.preventDefault(); setGv({...gv, distanceUnit: "km"}); }}>Kilometers</Btn>
                            </div>
                          </div>`
);

// 3. Remove luggageMultiplier
code = code.replace(/luggageMultiplier:\s*[\d\.]+,\s*/g, '');
code = code.replace(/const lugOk = largeLuggage !== "large" \|\| vehicle\.luggageMultiplier \>\= 1\.0;/, 'const lugOk = true;');

code = code.replace(
  /<div>\s*<label style=\{\{ fontSize:11,color:PX\.gray600 \}\}\>Luggage multiplier\<\/label\>\s*\<input type=\"number\" step=\"0\.1\" value=\{v\.luggageMultiplier\} onChange=\{e\=\>updateV\(v\.id,\"luggageMultiplier\",e\.target\.value\)\} \/\>\s*\<\/div>/g,
  ''
);

// 4. Update UI labels
code = code.replace(/Radius Margin \(km\)/g, 'Radius Margin ({gv?.distanceUnit === "miles" ? "miles" : "km"})');
code = code.replace(/Extra Mileage Rate \(£\/km\)/g, 'Extra Mileage Rate (£/{gv?.distanceUnit === "miles" ? "mi" : "km"})');
code = code.replace(/Maintenance \(£\/km\)/g, 'Maintenance (£/{gv?.distanceUnit === "miles" ? "mi" : "km"})');
code = code.replace(/Tyre cost \(£\/km\)/g, 'Tyre cost (£/{gv?.distanceUnit === "miles" ? "mi" : "km"})');
code = code.replace(/result\.totalKm\+" km"/g, 'result.totalKm+" "+(gv?.distanceUnit === "miles" ? "mi" : "km")');
code = code.replace(/result\.revenueKm\+" km"/g, 'result.revenueKm+" "+(gv?.distanceUnit === "miles" ? "mi" : "km")');
code = code.replace(/`\$\{result.totalKm\} km`/g, '\\`${result.totalKm} \\${gv?.distanceUnit === "miles" ? "mi" : "km"}\\`');
code = code.replace(/`\$\{result.revenueKm\} km`/g, '\\`${result.revenueKm} \\${gv?.distanceUnit === "miles" ? "mi" : "km"}\\`');

// 5. Speed math in CaroleanCoaches.tsx
code = code.replace(/const drivHrs\s*=\s*totalKm \/ 78;/g, 'const drivHrs = totalKm / (gv?.distanceUnit === "miles" ? 48.5 : 78);');

fs.writeFileSync('components/CaroleanCoaches.tsx', code);
console.log('Patched CaroleanCoaches.tsx successfully');
