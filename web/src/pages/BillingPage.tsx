import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoicesApi, jobCardsApi, settingsApi, vehiclesApi } from '../api';
import type { GarageSetting, InvoiceItem, JobCard, Vehicle } from '../types';
import { PaperReceipt } from '../components/PaperReceipt';
import { Button, Field, inputClass, PageHeader, Panel } from '../components/ui';

export function BillingPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [settings, setSettings] = useState<GarageSetting | null>(null);
  const [jobCardId, setJobCardId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [nextServiceKm, setNextServiceKm] = useState('3000');
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: 'Engine Oil', amount: 350 },
    { description: 'Brake Service', amount: 200 },
    { description: 'Labour', amount: 150 },
  ]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([jobCardsApi.list('COMPLETED'), vehiclesApi.list(), settingsApi.get()])
      .then(([jobList, vehicleList, garage]) => {
        setJobs(jobList);
        setVehicles(vehicleList);
        setSettings(garage);
      })
      .catch(() => setError('Failed to load billing data'));
  }, []);

  const selectedJob = useMemo(
    () => jobs.find((j) => String(j.id) === jobCardId),
    [jobs, jobCardId]
  );

  const totalAmount = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const updateItem = (index: number, patch: Partial<InvoiceItem>) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const addItem = () => setItems((prev) => [...prev, { description: '', amount: 0 }]);
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) {
      setError('Select a job card');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const invoice = await invoicesApi.create({
        jobCardId: selectedJob.id,
        customerId: selectedJob.customerId,
        vehicleId: selectedJob.vehicleId,
        paymentMethod,
        nextServiceKm: Number(nextServiceKm) || undefined,
        items: items.filter((i) => i.description.trim()),
      });
      navigate(`/invoices/${invoice.id}`);
    } catch {
      setError('Could not create invoice');
    } finally {
      setSaving(false);
    }
  };

  const vehicle =
    selectedJob?.vehicle ||
    vehicles.find((v) => v.id === selectedJob?.vehicleId);

  const receiptData = {
    garage: {
      garageName: settings?.garageName || 'S G BABU AUTO GARAGE',
      location: settings?.location || 'Thiruvannamalai',
      phone: settings?.phone || '98765 43210',
    },
    invoiceNumber: 'INV-PREVIEW',
    invoiceDate: new Date().toISOString().slice(0, 10),
    vehicleNo: vehicle?.registrationNo || '—',
    customerName: selectedJob?.customer?.name || '—',
    items,
    totalAmount,
    paymentMethod,
    nextServiceKm: Number(nextServiceKm) || undefined,
  };

  return (
    <div>
      <PageHeader title="Billing" subtitle="Create invoice from a job card" />
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Panel>
          <form className="space-y-4" onSubmit={submit}>
            <Field label="Completed job card">
              <select
                className={inputClass}
                required
                value={jobCardId}
                onChange={(e) => setJobCardId(e.target.value)}
              >
                <option value="">Select completed job card</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    JC-{job.id} · {job.customer?.name} · {job.vehicle?.registrationNo} · {job.status}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Payment method">
                <select
                  className={inputClass}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Card</option>
                </select>
              </Field>
              <Field label="Next service after (km)">
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  value={nextServiceKm}
                  onChange={(e) => setNextServiceKm(e.target.value)}
                />
              </Field>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Line items</p>
                <Button variant="ghost" onClick={addItem}>
                  Add item
                </Button>
              </div>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-[1fr_120px_auto] gap-2">
                    <input
                      className={inputClass}
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, { description: e.target.value })}
                      required
                    />
                    <input
                      className={inputClass}
                      type="number"
                      min={0}
                      value={item.amount}
                      onChange={(e) => updateItem(index, { amount: Number(e.target.value) })}
                      required
                    />
                    <Button variant="ghost" onClick={() => removeItem(index)} disabled={items.length === 1}>
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-stone-200 pt-4">
              <p className="text-sm text-stone-600">
                Total: <span className="text-lg font-semibold text-stone-900">₹{totalAmount}</span>
              </p>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Create invoice'}
              </Button>
            </div>
          </form>
        </Panel>

        <div>
          <p className="mb-3 text-center text-xs uppercase tracking-wide text-stone-500">Live preview</p>
          <PaperReceipt data={receiptData} />
        </div>
      </div>
    </div>
  );
}
