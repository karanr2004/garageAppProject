BEGIN TRANSACTION;

-- Garage setting (single row)
INSERT OR IGNORE INTO garage_settings (garage_name, location, phone, created_at, updated_at)
VALUES
('S G BABU AUTO GARAGE', 'Thiruvannamalai', '98765 43210', datetime('now'), datetime('now'));

-- Customers (12)
INSERT INTO customers (name, phone, address, created_at, updated_at) VALUES
('Ravi Kumar','9876500001','Near Temple, Thiruvannamalai', datetime('now','-30 day'), datetime('now','-30 day')),
('Mohan','9876500002','Station Road', datetime('now','-29 day'), datetime('now','-29 day')),
('Suresh','9876500003','Market Street', datetime('now','-28 day'), datetime('now','-28 day')),
('Anita','9876500004','Lake View', datetime('now','-27 day'), datetime('now','-27 day')),
('Priya','9876500005','Green Park', datetime('now','-26 day'), datetime('now','-26 day')),
('Kumar','9876500006','North Colony', datetime('now','-25 day'), datetime('now','-25 day')),
('Deepak','9876500007','South Colony', datetime('now','-24 day'), datetime('now','-24 day')),
('Lakshmi','9876500008','East End', datetime('now','-23 day'), datetime('now','-23 day')),
('Vikram','9876500009','West End', datetime('now','-22 day'), datetime('now','-22 day')),
('Ramesh','9876500010','Hill Road', datetime('now','-21 day'), datetime('now','-21 day')),
('Sita','9876500011','River Side', datetime('now','-20 day'), datetime('now','-20 day')),
('Gopi','9876500012','Main Bazaar', datetime('now','-19 day'), datetime('now','-19 day'));

-- Vehicles (one per customer, matching customer ids 1..12)
INSERT INTO vehicles (customer_id, registration_no, make, model, odometer_km, created_at, updated_at) VALUES
(1,'TN25 AA 0001','Honda','Activa',12000, datetime('now','-30 day'), datetime('now','-30 day')),
(2,'TN25 AA 0002','TVS','Jupiter',8000, datetime('now','-29 day'), datetime('now','-29 day')),
(3,'TN25 AA 0003','Bajaj','Discover',25000, datetime('now','-28 day'), datetime('now','-28 day')),
(4,'TN25 AA 0004','Hero','Splendor',30000, datetime('now','-27 day'), datetime('now','-27 day')),
(5,'TN25 AA 0005','Honda','CB Shine',15000, datetime('now','-26 day'), datetime('now','-26 day')),
(6,'TN25 AA 0006','Yamaha','FZ',20000, datetime('now','-25 day'), datetime('now','-25 day')),
(7,'TN25 AA 0007','Suzuki','Gixxer',5000, datetime('now','-24 day'), datetime('now','-24 day')),
(8,'TN25 AA 0008','Royal Enfield','Classic',45000, datetime('now','-23 day'), datetime('now','-23 day')),
(9,'TN25 AA 0009','TVS','Apache',18000, datetime('now','-22 day'), datetime('now','-22 day')),
(10,'TN25 AA 0010','Hero','Glanza',9000, datetime('now','-21 day'), datetime('now','-21 day')),
(11,'TN25 AA 0011','Honda','Dio',4000, datetime('now','-20 day'), datetime('now','-20 day')),
(12,'TN25 AA 0012','Bajaj','Pulsar',22000, datetime('now','-19 day'), datetime('now','-19 day'));

-- Job Cards (15) some OPEN, some COMPLETED, some BILLED
INSERT INTO job_cards (customer_id, vehicle_id, status, notes, opened_at, closed_at, created_at, updated_at) VALUES
(1,1,'COMPLETED','Oil change', datetime('now','-10 day'), datetime('now','-10 day','+1 hour'), datetime('now','-10 day'), datetime('now','-10 day')),
(2,2,'OPEN','Brake check', datetime('now','-9 day'), NULL, datetime('now','-9 day'), datetime('now','-9 day')),
(3,3,'BILLED','Full service', datetime('now','-8 day'), datetime('now','-7 day'), datetime('now','-8 day'), datetime('now','-7 day')),
(4,4,'COMPLETED','Chain adjustment', datetime('now','-7 day'), datetime('now','-7 day','+2 hour'), datetime('now','-7 day'), datetime('now','-7 day')),
(5,5,'OPEN','Tire puncture', datetime('now','-6 day'), NULL, datetime('now','-6 day'), datetime('now','-6 day')),
(6,6,'COMPLETED','Battery check', datetime('now','-5 day'), datetime('now','-5 day','+30 minutes'), datetime('now','-5 day'), datetime('now','-5 day')),
(7,7,'OPEN','Lighting issue', datetime('now','-4 day'), NULL, datetime('now','-4 day'), datetime('now','-4 day')),
(8,8,'BILLED','Engine tuning', datetime('now','-3 day'), datetime('now','-2 day'), datetime('now','-3 day'), datetime('now','-2 day')),
(9,9,'COMPLETED','Oil and filter', datetime('now','-2 day'), datetime('now','-2 day','+1 hour'), datetime('now','-2 day'), datetime('now','-2 day')),
(10,10,'OPEN','Inspection', datetime('now','-1 day'), NULL, datetime('now','-1 day'), datetime('now','-1 day')),
(11,11,'COMPLETED','Minor service', datetime('now','-12 day'), datetime('now','-11 day'), datetime('now','-12 day'), datetime('now','-11 day')),
(12,12,'OPEN','Clutch adjustment', datetime('now','-13 day'), NULL, datetime('now','-13 day'), datetime('now','-13 day')),
(1,1,'OPEN','Accessory fitment', datetime('now','-2 day'), NULL, datetime('now','-2 day'), datetime('now','-2 day')),
(2,2,'COMPLETED','Brake pad replacement', datetime('now','-15 day'), datetime('now','-14 day'), datetime('now','-15 day'), datetime('now','-14 day')),
(3,3,'BILLED','Accident repair', datetime('now','-18 day'), datetime('now','-17 day'), datetime('now','-18 day'), datetime('now','-17 day'));

-- Invoices (for some job cards) - note invoice_number unique
INSERT OR IGNORE INTO invoices (invoice_number, job_card_id, customer_id, vehicle_id, invoice_date, payment_method, total_amount, next_service_km, created_at, updated_at) VALUES
('INV-1001',1,1,1,date('now','-10 day'),'Cash',650,13000, datetime('now','-10 day'), datetime('now','-10 day')),
('INV-1002',3,3,3,date('now','-8 day'),'UPI',1800,26000, datetime('now','-8 day'), datetime('now','-8 day')),
('INV-1003',8,8,8,date('now','-3 day'),'Card',2400,46000, datetime('now','-3 day'), datetime('now','-3 day')),
('INV-1004',13,1,1,date('now','-2 day'),'Cash',300,12500, datetime('now','-2 day'), datetime('now','-2 day')),
('INV-1005',15,3,3,date('now','-18 day'),'UPI',5000,27000, datetime('now','-18 day'), datetime('now','-18 day'));

-- Invoice items (link to invoices above)
INSERT OR IGNORE INTO invoice_items (invoice_id, description, amount, created_at, updated_at) VALUES
(1,'Engine oil 1L',350, datetime('now','-10 day'), datetime('now','-10 day')),
(1,'Labour - Oil change',300, datetime('now','-10 day'), datetime('now','-10 day')),
(2,'Full service parts',1200, datetime('now','-8 day'), datetime('now','-8 day')),
(2,'Labour',600, datetime('now','-8 day'), datetime('now','-8 day')),
(3,'Engine tuning',2000, datetime('now','-3 day'), datetime('now','-3 day')),
(3,'Consumables',400, datetime('now','-3 day'), datetime('now','-3 day')),
(4,'Accessory fitment',200, datetime('now','-2 day'), datetime('now','-2 day')),
(4,'Small parts',100, datetime('now','-2 day'), datetime('now','-2 day')),
(5,'Accident parts',4500, datetime('now','-18 day'), datetime('now','-18 day')),
(5,'Labour',500, datetime('now','-18 day'), datetime('now','-18 day'));

-- Inventory items (3 initial, add more to reach ~10)
INSERT INTO inventory_items (name, sku, quantity, unitPrice, created_at, updated_at) VALUES
('Engine Oil (1L)','EO-1L',50,350.00, datetime('now','-30 day'), datetime('now','-30 day')),
('Brake Pads','BP-01',30,400.00, datetime('now','-28 day'), datetime('now','-28 day')),
('Air Filter','AF-99',25,150.00, datetime('now','-26 day'), datetime('now','-26 day')),
('Spark Plug','SP-10',40,120.00, datetime('now','-24 day'), datetime('now','-24 day')),
('Chain Lube','CL-1',60,180.00, datetime('now','-22 day'), datetime('now','-22 day')),
('Oil Filter','OF-11',20,250.00, datetime('now','-20 day'), datetime('now','-20 day')),
('Battery','BAT-12',10,2500.00, datetime('now','-18 day'), datetime('now','-18 day')),
('Headlight Bulb','HB-5',50,90.00, datetime('now','-16 day'), datetime('now','-16 day')),
('Brake Fluid','BF-3',35,130.00, datetime('now','-14 day'), datetime('now','-14 day')),
('Fuel Filter','FF-7',15,200.00, datetime('now','-12 day'), datetime('now','-12 day'));

-- Expenses (10 entries)
INSERT INTO expenses (date, category, amount, notes, created_at, updated_at) VALUES
(date('now','-30 day'),'Utilities',1200.00,'Electricity bill', datetime('now','-30 day'), datetime('now','-30 day')),
(date('now','-28 day'),'Supplies',2500.00,'Cleaning and rags', datetime('now','-28 day'), datetime('now','-28 day')),
(date('now','-25 day'),'Rent',15000.00,'Shop rent', datetime('now','-25 day'), datetime('now','-25 day')),
(date('now','-23 day'),'Staff',8000.00,'Daily wages', datetime('now','-23 day'), datetime('now','-23 day')),
(date('now','-20 day'),'Maintenance',2200.00,'Tool repair', datetime('now','-20 day'), datetime('now','-20 day')),
(date('now','-18 day'),'Transport',600.00,'Fuel for pickup', datetime('now','-18 day'), datetime('now','-18 day')),
(date('now','-15 day'),'Marketing',700.00,'Pamphlets', datetime('now','-15 day'), datetime('now','-15 day')),
(date('now','-12 day'),'Insurance',3000.00,'Shop insurance', datetime('now','-12 day'), datetime('now','-12 day')),
(date('now','-10 day'),'Supplies',900.00,'Lubricants', datetime('now','-10 day'), datetime('now','-10 day')),
(date('now','-5 day'),'Utilities',1100.00,'Water and power', datetime('now','-5 day'), datetime('now','-5 day'));

COMMIT;


