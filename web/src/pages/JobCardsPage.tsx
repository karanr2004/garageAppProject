import { useEffect, useMemo, useState } from 'react';
import { customersApi, jobCardsApi, vehiclesApi } from '../api';
import type { Customer, JobCard, JobCardStatus, Vehicle } from '../types';
import { Button, EmptyState, Field, inputClass, PageHeader, Panel } from '../components/ui';

const statuses: JobCardStatus[] = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'BILLED'];

export function JobCardsPage() {
  const [items, setItems] = useState<JobCard[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [form, setForm] = useState({ customerId: '', vehicleId: '', notes: '' });
  const [error, setError] = useState('');

  const filteredVehicles = useMemo(
    () => vehicles.filter((v) => !form.customerId || String(v.customerId) === form.customerId),
    [vehicles, form.customerId]
  );

  const load = async () => {
    try {
      const [jobs, customerList, vehicleList] = await Promise.all([
        jobCardsApi.list(),
        customersApi.list(),
        vehiclesApi.list(),
      ]);
      setItems(jobs);
      setCustomers(customerList);
      setVehicles(vehicleList);
    } catch {
      setError('Failed to load job cards');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await jobCardsApi.create({
        customerId: Number(form.customerId),
        vehicleId: Number(form.vehicleId),
        notes: form.notes || undefined,
        status: 'OPEN',
      });
      setForm({ customerId: '', vehicleId: '', notes: '' });
      await load();
    } catch {
      setError('Could not create job card');
    }
  };

  const updateStatus = async (id: number, status: JobCardStatus) => {
    if (status === 'COMPLETED') {
      await jobCardsApi.complete(id);
    } else {
      await jobCardsApi.update(id, { status });
    }
    await load();
  };

  return (
    <div>
      <PageHeader title="Job Cards" subtitle="Track workshop jobs" />
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Panel>
          <h3 className="mb-4 text-sm font-semibold">New job card</h3>
          <form className="space-y-3" onSubmit={submit}>
            <Field label="Customer">
              <select
                className={inputClass}
                required
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value, vehicleId: '' })}
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Vehicle">
              <select
                className={inputClass}
                required
                value={form.vehicleId}
                onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              >
                <option value="">Select vehicle</option>
                {filteredVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.registrationNo}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Notes">
              <textarea
                className={inputClass}
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </Field>
            <Button type="submit">Create</Button>
          </form>
        </Panel>

        <Panel>
          {!items.length ? (
            <EmptyState message="No job cards yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-stone-200 text-stone-500">
                  <tr>
                    <th className="pb-2 font-medium">#</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Vehicle</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((job) => (
                    <tr key={job.id} className="border-b border-stone-100">
                      <td className="py-2.5 font-medium">JC-{job.id}</td>
                      <td className="py-2.5">{job.customer?.name ?? '—'}</td>
                      <td className="py-2.5">{job.vehicle?.registrationNo ?? '—'}</td>
                      <td className="py-2.5">
                        <select
                          className="rounded border border-stone-300 px-2 py-1 text-xs"
                          value={job.status}
                          onChange={(e) => updateStatus(job.id, e.target.value as JobCardStatus)}
                          disabled={job.status === 'BILLED'}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2.5 text-stone-600">{job.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
