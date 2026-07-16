const fs = require('fs');
const path = require('path');

const bPath = (p) => path.join('c:/Users/Taimoor/Desktop/C2O/Admin Fare Calculator/Admin/backend/src', p);

// 1. Fix auth.ts
const authPath = bPath('auth/auth.ts');
if (fs.existsSync(authPath)) {
  let content = fs.readFileSync(authPath, 'utf8');
  content = content.replace("import { User } from '../services/user';", "import { User, findUserById } from '../services/user';");
  fs.writeFileSync(authPath, content);
}

// 2. Fix user service export
const userPath = bPath('services/user.ts');
if (fs.existsSync(userPath)) {
  let content = fs.readFileSync(userPath, 'utf8');
  content = content.replace("type User =", "export type User =");
  fs.writeFileSync(userPath, content);
}

// 3. Fix admin_route-templatesController.ts
const rTemplatePath = bPath('controllers/admin_route-templatesController.ts');
if (fs.existsSync(rTemplatePath)) {
  let content = fs.readFileSync(rTemplatePath, 'utf8');
  // It has two postHandlers because of my dumb replace logic for findIndex vs push.
  // The second one has findIndex. It should be putHandler.
  let matches = [...content.matchAll(/export const postHandler/g)];
  if (matches.length > 1) {
    content = content.substring(0, matches[1].index) + 'export const putHandler' + content.substring(matches[1].index + 24);
  }
  fs.writeFileSync(rTemplatePath, content);
}

// 4. Fix bookingsController.ts
const bookingsPath = bPath('controllers/bookingsController.ts');
if (fs.existsSync(bookingsPath)) {
  let content = fs.readFileSync(bookingsPath, 'utf8');
  let matches = [...content.matchAll(/export const postHandler/g)];
  if (matches.length > 1) {
    content = content.substring(0, matches[1].index) + 'export const putHandler' + content.substring(matches[1].index + 24);
  }
  fs.writeFileSync(bookingsPath, content);
}

// 5. Fix NextResponse.json calls in auth controllers & sync-live-db
const controllersDir = bPath('controllers');
const files = fs.readdirSync(controllersDir);
files.forEach(f => {
  if (f.endsWith('.ts')) {
    let p = path.join(controllersDir, f);
    let content = fs.readFileSync(p, 'utf8');
    // replace NextResponse.json(X, { status: Y }) with res.status(Y).json(X)
    content = content.replace(/NextResponse\.json\(([^,]+),\s*\{\s*status:\s*(\d+)\s*\}\)/g, 'res.status($2).json($1)');
    // replace res.json(X, { status: Y }) - if it was converted that way
    content = content.replace(/res\.json\(([^,]+),\s*\{\s*status:\s*(\d+)\s*\}\)/g, 'res.status($2).json($1)');
    fs.writeFileSync(p, content);
  }
});

// 6. Fix db.ts
const dbPath = bPath('database/db.ts');
if (fs.existsSync(dbPath)) {
  let content = fs.readFileSync(dbPath, 'utf8');
  content = content.replace(/b\.quote\?\.result/g, '(b.quote as any)?.result');
  fs.writeFileSync(dbPath, content);
}

// 7. Fix mileageEngine.ts
const mileagePath = bPath('engines/mileageEngine.ts');
if (fs.existsSync(mileagePath)) {
  let content = fs.readFileSync(mileagePath, 'utf8');
  content = content.replace(/const data = await res\.json\(\);/g, 'const data: any = await res.json();');
  content = content.replace(/const liveDirections = await liveRes\.json\(\);/g, 'const liveDirections: any = await liveRes.json();');
  content = content.replace(/const deadOutDirections = await deadOutRes\.json\(\);/g, 'const deadOutDirections: any = await deadOutRes.json();');
  content = content.replace(/const deadBackDirections = await deadBackRes\.json\(\);/g, 'const deadBackDirections: any = await deadBackRes.json();');
  fs.writeFileSync(mileagePath, content);
}

// 8. Fix pricingEngine.ts export
const pricingPath = bPath('engines/pricingEngine.ts');
if (fs.existsSync(pricingPath)) {
  let content = fs.readFileSync(pricingPath, 'utf8');
  content = content.replace('function fleetEconomics', 'export function fleetEconomics');
  fs.writeFileSync(pricingPath, content);
}
console.log('Fixed backend TS errors.');
