const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('garage_demo.sqlite');
const tables = ['customers','vehicles','job_cards','invoices','invoice_items','inventory_items','expenses','garage_settings'];
let pending = tables.length;
for (const t of tables) {
  db.get(`SELECT COUNT(*) as c FROM ${t}`, (err,row) => {
    if (err) console.log(t, 'ERR', err.message);
    else console.log(t, row.c);
    pending--; if (pending===0) db.close();
  });
}
