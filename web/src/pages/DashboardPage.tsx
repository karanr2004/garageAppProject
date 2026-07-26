import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api';
import type { DashboardSummary } from '../types';
import { EmptyState, PageHeader, Panel } from '../components/ui';

export function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi
      .summary()
      .then(setData)
      .catch(() => setError('Could not load dashboard. Is the API running?'));
  }, []);

  const cards = [
    { label: 'Customers', value: data?.customers ?? '—' },
    { label: 'Vehicles', value: data?.vehicles ?? '—' },
    { label: 'Open jobs', value: data?.openJobs ?? '—' },
    { label: 'Invoices today', value: data?.todayInvoices ?? '—' },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Today’s workshop snapshot" />
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Panel key={card.label}>
            <p className="text-xs uppercase tracking-wide text-stone-500">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-stone-900">{card.value}</p>
          </Panel>
        ))}
      </div>

      <Panel className="mt-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Recent invoices
        </h3>
        {!data?.recentInvoices?.length ? (
          <EmptyState message="No invoices yet. Create one from Billing." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 text-stone-500">
                <tr>
                  <th className="pb-2 font-medium">Bill No</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Vehicle</th>
                  <th className="pb-2 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-stone-100">
                    <td className="py-2.5">
                      <Link className="text-teal-700 hover:underline" to={`/invoices/${invoice.id}`}>
                        {invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td className="py-2.5">{invoice.customer?.name ?? '—'}</td>
                    <td className="py-2.5">{invoice.vehicle?.registrationNo ?? '—'}</td>
                    <td className="py-2.5 text-right">₹{Number(invoice.totalAmount).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
