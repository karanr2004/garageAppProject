import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { invoicesApi, settingsApi } from '../api';
import type { GarageSetting, Invoice } from '../types';
import { PaperReceipt } from '../components/PaperReceipt';
import { PageHeader } from '../components/ui';

export function InvoiceDetailPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [settings, setSettings] = useState<GarageSetting | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([invoicesApi.get(Number(id)), settingsApi.get()])
      .then(([inv, garage]) => {
        setInvoice(inv);
        setSettings(garage);
      })
      .catch(() => setError('Invoice not found'));
  }, [id]);

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!invoice || !settings) {
    return <p className="text-sm text-stone-500">Loading receipt…</p>;
  }

  return (
    <div>
      <PageHeader
        title={invoice.invoiceNumber}
        subtitle="Printable workshop receipt"
        action={
          <Link to="/invoices" className="text-sm text-teal-700 hover:underline">
            ← Back to invoices
          </Link>
        }
      />
      <div className="flex justify-center py-4">
        <PaperReceipt
          data={{
            garage: settings,
            invoiceNumber: invoice.invoiceNumber,
            invoiceDate: invoice.invoiceDate,
            vehicleNo: invoice.vehicle?.registrationNo || '—',
            customerName: invoice.customer?.name || '—',
            items: invoice.items || [],
            totalAmount: Number(invoice.totalAmount),
            paymentMethod: invoice.paymentMethod,
            nextServiceKm: invoice.nextServiceKm,
          }}
        />
      </div>
    </div>
  );
}
