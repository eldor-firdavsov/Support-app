const fs = require('fs');
const path = require('path');

const rawData = fs.readFileSync(path.join(__dirname, 'raw_students.txt'), 'utf8');
const lines = rawData.split(/\r?\n/);

const students = [];
const groupsSeen = new Set();

for (let line of lines) {
  if (!line.trim()) continue;
  const parts = line.split('\t').map(p => p.trim());
  if (parts.length < 3) continue;

  const fullName = parts[1];
  const groupStr = parts[2];
  
  const hasActive = parts.some(p => p.toLowerCase() === 'active');
  if (!hasActive) continue;

  // Extract A or B group
  const groupNames = groupStr.split(',').map(g => g.trim());
  let targetGroup = '';
  for (let g of groupNames) {
    if (g.startsWith('A') || g.startsWith('B')) {
      targetGroup = g;
      break;
    }
  }

  if (!targetGroup) continue;

  students.push({
    full_name: fullName,
    group: targetGroup
  });
  groupsSeen.add(targetGroup);
}

console.log('Total students found:', students.length);
console.log('Unique groups:', Array.from(groupsSeen).sort((a,b) => {
  // Sort alphabetically and numerically: A6, A7, A9, A10, A12, etc.
  const aPrefix = a[0];
  const bPrefix = b[0];
  if (aPrefix !== bPrefix) return aPrefix.localeCompare(bPrefix);
  const aNum = parseInt(a.substring(1));
  const bNum = parseInt(b.substring(1));
  return aNum - bNum;
}));
console.log(JSON.stringify(students, null, 2));
