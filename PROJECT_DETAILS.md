Two-Wheeler Garage Management — Project Details

Overview
--------
This repository implements a Two-Wheeler Garage Management application (Phase 1 + Phase 2 scaffolding). It provides a Node + TypeScript backend (api/) using a microframework + TypeORM and a React + Vite + Tailwind frontend (web/).

The app supports core garage operations in Phase 1:
- Customers, Vehicles, Job Cards (service work orders)
- Billing / Invoices (paper-receipt UI)
- Dashboard summary
- Single-row Garage Settings (branding for receipts)
- Simple JWT-based admin authentication (dummy admin / 1234 for demo)

Phase 2 scaffolding added:
- Inventory (stock items)
- Expenses
- Reports (summary numbers)

Why use this app
----------------
- Lightweight local/demo garage management system for small workshops.
- Clean admin UI for daily operations: create job cards, complete work, generate receipts/invoices.
- Extensible architecture: TypeORM entities, routing-controllers, Typedi service layer for easy extension to users/roles, inventory flows, reports, and multi-user features.
- Demo-ready: includes SQLite fallback, seed data, and a SQL dump for distribution.

Repository layout
-----------------
garageAppProject\
  api\          # Node + TypeScript backend (microframework, TypeORM)
  web\          # React + Vite + Tailwind frontend
  PROJECT_DETAILS.md  # (this file)

Key files & folders
- api/src/  — backend source
  - api/src/app.ts            — application bootstrap (loaders)
  - api/src/loaders/         — bootloader modules (winston, ioc, typeorm, express, monitor, public)
  - api/src/api/controllers/ — routing-controllers REST controllers
  - api/src/api/services/    — business logic services
  - api/src/api/models/      — TypeORM entities
  - api/src/api/registry.ts  — controllers & entities listing used by loaders
  - api/garage_demo.sqlite   — demo SQLite DB (generated/used locally)
  - api/garage_demo.sql      — SQL dump with sample data (created for demo)
  - api/apply_sql.js         — helper script to apply SQL dump to garage_demo.sqlite
- web/src/  — frontend source (React + Vite)
  - web/src/pages/           — pages (Dashboard, Customers, Vehicles, JobCards, Billing, Invoices, Inventory, Expenses, Reports, Settings)
  - web/src/components/      — shared UI pieces (layout, receipt, small components)
  - web/src/api/*.ts         — client wrappers for API

Prerequisites (local dev)
-------------------------
- Node.js (v18+ recommended; repo tested with Node v20+)
- npm (comes with Node)
- (Optional) MySQL if you want to use MySQL instead of the supplied SQLite demo
- Recommended: a SQLite browser (DB Browser for SQLite) to open api\garage_demo.sqlite if you want to inspect the DB directly

Important Windows notes
- Use cmd.exe (Command Prompt) to run npm scripts in this workspace when PowerShell's execution policy prevents running npm.ps1. Example: & $env:ComSpec /c "cd /d C:\path && npm run ...". The PROJECT contains helper instructions below.

Environment configuration
-------------------------
Copy and edit env examples:
- api/.env.example -> api/.env
- web/.env.example -> web/.env

Key environment variables (api/.env)
- APP_HOST (default 0.0.0.0)
- APP_PORT (default 3000)
- TYPEORM_CONNECTION (mysql | sqlite) — set to sqlite for local demo
- TYPEORM_DATABASE (when sqlite: path/name, e.g. garage_demo.sqlite)
- AUTH_USERNAME (default: admin)
- AUTH_PASSWORD (default: 1234)
- AUTH_JWT_SECRET (default: garage-secret)
- AUTH_JWT_EXPIRES_IN (default: 1h)

Running the backend (development)
---------------------------------
All commands assume Windows (cmd.exe) and repository root C:\garageAppProject.

1) Install backend dependencies (once):
   cd C:\garageAppProject\api
   npm install

2) Use SQLite local demo (recommended for quick start):
   cd C:\garageAppProject\api
   set TYPEORM_CONNECTION=sqlite
   set TYPEORM_DATABASE=garage_demo.sqlite
   npm run start

   - npm run start uses nodemon + ts-node in dev (watches changes)
   - If PowerShell blocks npm.ps1, run the above in Command Prompt (cmd.exe) or use:
     & $env:ComSpec /c "cd /d C:\garageAppProject\api && set TYPEORM_CONNECTION=sqlite && set TYPEORM_DATABASE=garage_demo.sqlite && npm run start"

3) To run the compiled build (production-like):
   cd C:\garageAppProject\api
   npm run build
   node dist/src/app.js   (or follow your preferred deployment flow)

Seeding data (SQL dump)
----------------------
- The repo includes api\garage_demo.sql with sample data and api\apply_sql.js to apply it to api\garage_demo.sqlite.
- To (re)apply the SQL dump to the local sqlite DB:
  cd C:\garageAppProject\api
  node apply_sql.js

  Notes: apply_sql.js executes the SQL file against api\garage_demo.sqlite. The SQL uses INSERT OR IGNORE for non-destructive reapplication.

Running the frontend (development)
---------------------------------
1) Install frontend dependencies (once):
   cd C:\garageAppProject\web
   npm install

2) Start Vite dev server (dev + HMR):
   cd C:\garageAppProject\web
   npm run dev -- --host

3) Build for production (bundles):
   cd C:\garageAppProject\web
   npm run build

Frontend dev server defaults:
- Vite dev server: http://localhost:5173
- The frontend expects the API at http://localhost:3000/api by default — override with VITE_API_URL in web/.env if needed.

Auth (demo)
-----------
- Demo admin credentials: username=admin password=1234
- Login via frontend /login. The backend issues a JWT and protected endpoints require Authorization: Bearer <token> header.

API Endpoints (subset)
----------------------
All API routes are prefixed with /api (e.g. http://localhost:3000/api/customers)

Customers
- GET /api/customers
- POST /api/customers
- GET /api/customers/:id
- PUT /api/customers/:id
- DELETE /api/customers/:id

Vehicles
- GET /api/vehicles (optional ?customerId=)
- POST /api/vehicles
- GET /api/vehicles/:id
- PUT /api/vehicles/:id
- DELETE /api/vehicles/:id

Job Cards
- GET /api/job-cards (optional ?status=)
- POST /api/job-cards
- GET /api/job-cards/:id
- PUT /api/job-cards/:id
- POST /api/job-cards/:id/complete

Invoices
- GET /api/invoices
- POST /api/invoices  (invoice must reference a COMPLETED job card if jobCardId provided)
- GET /api/invoices/:id

Inventory (Phase 2)
- GET /api/inventory
- POST /api/inventory
- GET /api/inventory/:id

Expenses (Phase 2)
- GET /api/expenses
- POST /api/expenses
- GET /api/expenses/:id

Reports (Phase 2)
- GET /api/reports/summary  => { totalInventoryValue, totalExpenses, totalRevenue }

Health & Monitor
- GET /health  (health check)
- Express status monitor available at /status when enabled by loader

How to work — typical dev / demo flow
-------------------------------------
1) Start backend (sqlite) and frontend (Vite).
2) Open http://localhost:5173 in browser.
3) Login using admin / 1234.
4) Create customers and vehicles (or use seeded data).
5) Create a Job Card for a vehicle (status: OPEN).
6) When work is finished, mark Job Card as COMPLETED (frontend: Job Cards page).
7) Go to Billing, create an Invoice from the completed Job Card, add line items, choose payment method, preview receipt and save.
8) View saved invoice on Invoices page (receipt-styled detail view).
9) Use Inventory to track parts/stock and Expenses to record shop spends. Reports summarizes totals.

Development notes & troubleshooting
-----------------------------------
- If PowerShell blocks npm commands, use cmd.exe as shown earlier.
- For local demo, the app runs against SQLite. To use MySQL, set TYPEORM_CONNECTION=mysql and provide TYPEORM_HOST, TYPEORM_PORT, TYPEORM_USERNAME, TYPEORM_PASSWORD and TYPEORM_DATABASE in api/.env and restart the backend.
- If endpoints return 500s related to class-validator/typedi Validator: the code temporarily disabled automatic validation at express loader to avoid a version mismatch during development. Recommended fix: register the Validator instance in Typedi or align class-validator + routing-controllers versions. If you want, I can re-enable validation properly.
- Inspect or edit DB directly with DB Browser for SQLite: file api\garage_demo.sqlite.

Packaging & distribution
------------------------
- The repository includes api\garage_demo.sql which can be used to recreate sample data. The actual DB file api\garage_demo.sqlite is generated locally and can be zipped for distribution if needed.

Next recommended steps
----------------------
- Harden auth: add a users table, bcrypt hashed passwords, and role-based access (admin/staff) for production use.
- Re-enable class-validator properly so DTO validation works server-side.
- Add unit and integration tests for services (InvoiceService billing rules) and middleware (auth).
- Improve frontend Inventory and Expenses UI (edit/delete, stock adjustments, thresholds) — I can implement these on request.

Contact / support
-----------------
If you want changes to workflows, additional seed data, or automated seed scripts (npm run seed), say the word and I will add them and update this documentation.

-- End of project details
