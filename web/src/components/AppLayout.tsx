import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { clearToken } from '../auth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/customers', label: 'Customers', icon: '👥' },
  { to: '/vehicles', label: 'Vehicles', icon: '🏍' },
  { to: '/job-cards', label: 'Job Cards', icon: '📝' },
  { to: '/billing', label: 'Billing', icon: '🧾' },
  { to: '/invoices', label: 'Invoices', icon: '📄' },
  { to: '/inventory', label: 'Inventory', icon: '📦' },
  { to: '/expenses', label: 'Expenses', icon: '💰' },
  { to: '/reports', label: 'Reports', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

export function AppLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-stone-900/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-[var(--sidebar)] text-stone-100 transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-white/10 px-5 py-6">
          <p className="text-xs uppercase tracking-[0.2em] text-teal-300/80">Two Wheeler</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">Garage Manager</h1>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-teal-700 text-white'
                    : 'text-stone-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[var(--line)] bg-white/80 px-4 py-3 backdrop-blur lg:px-8">
          <button
            type="button"
            className="rounded-md border border-stone-300 px-3 py-1.5 text-sm lg:hidden"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
          <p className="text-sm text-[var(--muted)]">Workshop operations</p>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
              onClick={() => {
                clearToken();
                navigate('/login');
              }}
            >
              Logout
            </button>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
