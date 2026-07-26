import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { invoicesApi } from '../api';
import type { Invoice } from '../types';
import { EmptyState, PageHeader, Panel } from '../components/ui';

export function InvoicesPage() {
  const [items, setItems] = useState<Invoice[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    invoicesApi
      .list()
      .then(setItems)
      .catch(() => setError('Failed to load invoices'));
  }, []);

  return (
    <div>
      <PageHeader title="Invoices" subtitle="All generated bills" />
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <Panel>
        {!items.length ? (
          <EmptyState message="No invoices yet. Create one from Billing." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 text-stone-500">
                <tr>
                  <th className="pb-2 font-medium">Bill No</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Vehicle</th>
                  <th className="pb-2 font-medium">Payment</th>
                  <th className="pb-2 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-stone-100">
                    <td className="py-2.5">
                      <Link className="font-medium text-teal-700 hover:underline" to={`/invoices/${invoice.id}`}>
                        {invoice.invoiceNumber}
                      </Link>
                    </td>
                    <td className="py-2.5">{invoice.invoiceDate}</td>
                    <td className="py-2.5">{invoice.customer?.name ?? '—'}</td>
                    <td className="py-2.5">{invoice.vehicle?.registrationNo ?? '—'}</td>
                    <td className="py-2.5">{invoice.paymentMethod}</td>
                    <td className="py-2.5 text-right">
                      ₹{Number(invoice.totalAmount).toLocaleString('en-IN')}
                    </td>
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
