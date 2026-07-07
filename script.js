
const fs = require('fs');
let content = fs.readFileSync('components/CaroleanCoaches.tsx', 'utf8');

const seasonalMarker = '              {/* SUBSECTION 4: SEASONAL DEMAND PERIODS */}';
const seasonalIndex = content.indexOf(seasonalMarker);

let endTab = content.indexOf('{tab === \'settings\'');
if(endTab === -1) endTab = content.indexOf('{tab === \settings\}');
if(endTab === -1) endTab = content.indexOf('{tab === \u0022settings\u0022');

const fleetTabEndIndex = content.lastIndexOf('            </div>', endTab);

if (seasonalIndex === -1 || fleetTabEndIndex === -1) {
  console.log('Markers not found!');
  process.exit(1);
}

const blocksToMove = content.substring(seasonalIndex, fleetTabEndIndex);
const contentWithoutBlocks = content.substring(0, seasonalIndex) + content.substring(fleetTabEndIndex);

const insertMarker = '              {/* SUBSECTION 1: VEHICLE SPECIFICATIONS */}';
const insertIndex = contentWithoutBlocks.indexOf(insertMarker);

if (insertIndex === -1) {
  console.log('Insert marker not found!');
  process.exit(1);
}

let finalContent = contentWithoutBlocks.substring(0, insertIndex) + blocksToMove + '\n' + contentWithoutBlocks.substring(insertIndex);

fs.writeFileSync('components/CaroleanCoaches.tsx', finalContent);
console.log('Successfully moved Seasonal and Blocked to the top!');

