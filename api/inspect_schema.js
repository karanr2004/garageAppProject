const sqlite3 = require('sqlite3').verbose();
const dbFile = 'garage_demo.sqlite';
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) { console.error('Failed to open DB', err); process.exit(1); }
});

function showTable(table) {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info('${table}')`, (err, rows) => {
      if (err) return reject(err);
      console.log('Table:', table);
      console.log(JSON.stringify(rows, null, 2));
      resolve();
    });
  });
}

(async () => {
  try {
    await showTable('inventory_items');
    await showTable('expenses');
    await showTable('invoices');
    await showTable('invoice_items');
    await showTable('customers');
    db.close();
  } catch (e) {
    console.error(e);
    db.close();
    process.exit(1);
  }
})();
