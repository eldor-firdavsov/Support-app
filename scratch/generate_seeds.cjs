const fs = require('fs');

const rawData = fs.readFileSync('C:\\Users\\RT\\.gemini\\antigravity\\brain\\6b60411b-cdfb-4a8b-bcfd-591f1c2f78ee\\scratch\\raw_students.txt', 'utf8');
const lines = rawData.split(/\r?\n/);

const groupMapping = {
  'A6': 'g1',
  'A7': 'g2',
  'A9': 'g3',
  'A10': 'g4',
  'A12': 'g5',
  'B1': 'g6',
  'B2': 'g7',
  'B3': 'g8',
  'A13': 'g9',
  'A14': 'g10',
  'A15': 'g11',
  'A16': 'g12',
  'B8': 'g13',
  'B9': 'g14',
};

const students = [];
let studentCount = 0;

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

  const groupId = groupMapping[targetGroup];
  if (!groupId) {
    console.error(`Group ID not found for group: ${targetGroup}`);
    continue;
  }

  studentCount++;
  students.push({
    id: `s${studentCount}`,
    full_name: fullName,
    group_id: groupId,
    status: 'active'
  });
}

console.log('--- JS SEED ---');
console.log(JSON.stringify(students, null, 2));

console.log('\n--- SQL SEED ---');
const sqlLines = [];
sqlLines.push('-- Seed additional groups if not exist');
sqlLines.push(`insert into groups (name) values`);
sqlLines.push(Object.keys(groupMapping).map(name => `  ('${name}')`).join(',\n') + '\non conflict (name) do nothing;');

sqlLines.push('\n-- Seed active A & B students');
sqlLines.push('insert into students (full_name, group_id, status) values');
const sqlValues = students.map(s => {
  const gName = Object.keys(groupMapping).find(k => groupMapping[k] === s.group_id);
  // Escaping single quotes in name (e.g. Bo'ronov -> Bo''ronov)
  const escapedName = s.full_name.replace(/'/g, "''");
  return `  ('${escapedName}', (select id from groups where name = '${gName}'), 'active')`;
});
sqlLines.push(sqlValues.join(',\n') + ';');

console.log(sqlLines.join('\n'));
fs.writeFileSync('C:\\Users\\RT\\.gemini\\antigravity\\brain\\6b60411b-cdfb-4a8b-bcfd-591f1c2f78ee\\scratch\\seeds_output.txt', JSON.stringify({ js: students, sql: sqlLines.join('\n') }, null, 2));
