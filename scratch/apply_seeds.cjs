const fs = require('fs');
const path = require('path');

// 1. Read seeds_output.txt
const seedsData = JSON.parse(fs.readFileSync('C:\\Users\\RT\\.gemini\\antigravity\\brain\\6b60411b-cdfb-4a8b-bcfd-591f1c2f78ee\\scratch\\seeds_output.txt', 'utf8'));

// 2. Write migration file 0003_seed_students.sql
const migrationDir = path.join(__dirname, '..', 'supabase', 'migrations');
if (!fs.existsSync(migrationDir)) {
  fs.mkdirSync(migrationDir, { recursive: true });
}
const sqlPath = path.join(migrationDir, '0003_seed_students.sql');
fs.writeFileSync(sqlPath, seedsData.sql, 'utf8');
console.log('Wrote migration file:', sqlPath);

// 3. Update src/lib/supabase.ts
const supabaseTsPath = path.join(__dirname, '..', 'src', 'lib', 'supabase.ts');
let supabaseTsContent = fs.readFileSync(supabaseTsPath, 'utf8');

const startMarker = '  private execute() {';
const endMarker = '    let list = db[this.table] || []';

const startIndex = supabaseTsContent.indexOf(startMarker);
const endIndex = supabaseTsContent.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find markers in supabase.ts');
  process.exit(1);
}

const before = supabaseTsContent.substring(0, startIndex);
const after = supabaseTsContent.substring(endIndex);

const newGroups = [
  { id: 'g1', name: 'A6', status: 'active' },
  { id: 'g2', name: 'A7', status: 'active' },
  { id: 'g3', name: 'A9', status: 'active' },
  { id: 'g4', name: 'A10', status: 'active' },
  { id: 'g5', name: 'A12', status: 'active' },
  { id: 'g6', name: 'B1', status: 'active' },
  { id: 'g7', name: 'B2', status: 'active' },
  { id: 'g8', name: 'B3', status: 'active' },
  { id: 'g9', name: 'A13', status: 'active' },
  { id: 'g10', name: 'A14', status: 'active' },
  { id: 'g11', name: 'A15', status: 'active' },
  { id: 'g12', name: 'A16', status: 'active' },
  { id: 'g13', name: 'B8', status: 'active' },
  { id: 'g14', name: 'B9', status: 'active' },
];

const newStudents = seedsData.js;

const replacementBlock = `  private execute() {
    const dbStr = localStorage.getItem('support_teacher_mock_db')
    let db: any = dbStr ? JSON.parse(dbStr) : null
    if (db && db.students && db.students.length <= 5) {
      db = null
    }
    if (!db) {
      db = {
        groups: ${JSON.stringify(newGroups, null, 8).replace(/\n/g, '\n      ')},
        students: ${JSON.stringify(newStudents, null, 8).replace(/\n/g, '\n      ')},
        attendance: [],
        homework: [],
      }
      localStorage.setItem('support_teacher_mock_db', JSON.stringify(db))
    }

`;

fs.writeFileSync(supabaseTsPath, before + replacementBlock + after, 'utf8');
console.log('Successfully updated supabase.ts!');
