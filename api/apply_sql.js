const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbFile = path.join(__dirname, 'garage_demo.sqlite');
const sqlFile = path.join(__dirname, 'garage_demo.sql');

if (!fs.existsSync(sqlFile)) {
  console.error('SQL file not found:', sqlFile);
  process.exit(1);
}

const sql = fs.readFileSync(sqlFile, 'utf8');

console.log('Opening DB:', dbFile);
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Failed to open DB:', err.message);
    process.exit(1);
  }
  console.log('Applying SQL...');
  db.exec(sql, (execErr) => {
    if (execErr) {
      console.error('Failed to execute SQL:', execErr.message);
      process.exit(1);
    }
    console.log('SQL applied successfully.');
    db.close((closeErr) => {
      if (closeErr) console.error('Error closing DB:', closeErr.message);
      process.exit(0);
    });
  });
});
