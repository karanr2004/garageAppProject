import { useEffect, useState } from 'react';
import { customersApi, vehiclesApi } from '../api';
import type { Customer, Vehicle } from '../types';
import { Button, EmptyState, Field, inputClass, PageHeader, Panel } from '../components/ui';

const emptyForm = {
  customerId: '',
  registrationNo: '',
  make: '',
  model: '',
  odometerKm: '0',
};

export function VehiclesPage() {
  const [items, setItems] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [vehicleList, customerList] = await Promise.all([vehiclesApi.list(), customersApi.list()]);
      setItems(vehicleList);
      setCustomers(customerList);
    } catch {
      setError('Failed to load vehicles');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const payload = {
      customerId: Number(form.customerId),
      registrationNo: form.registrationNo,
      make: form.make || undefined,
      model: form.model || undefined,
      odometerKm: Number(form.odometerKm || 0),
    };
    try {
      if (editingId) {
        await vehiclesApi.update(editingId, payload);
      } else {
        await vehiclesApi.create(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch {
      setError('Could not save vehicle');
    }
  };

  const startEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setForm({
      customerId: String(vehicle.customerId),
      registrationNo: vehicle.registrationNo,
      make: vehicle.make || '',
      model: vehicle.model || '',
      odometerKm: String(vehicle.odometerKm ?? 0),
    });
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this vehicle?')) return;
    await vehiclesApi.remove(id);
    await load();
  };

  return (
    <div>
      <PageHeader title="Vehicles" subtitle="Two-wheelers linked to customers" />
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Panel>
          <h3 className="mb-4 text-sm font-semibold">{editingId ? 'Edit vehicle' : 'Add vehicle'}</h3>
          <form className="space-y-3" onSubmit={submit}>
            <Field label="Customer">
              <select
                className={inputClass}
                required
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Registration No">
              <input
                className={inputClass}
                required
                value={form.registrationNo}
                onChange={(e) => setForm({ ...form, registrationNo: e.target.value })}
              />
            </Field>
            <Field label="Make">
              <input
                className={inputClass}
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
              />
            </Field>
            <Field label="Model">
              <input
                className={inputClass}
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
              />
            </Field>
            <Field label="Odometer (km)">
              <input
                className={inputClass}
                type="number"
                min={0}
                value={form.odometerKm}
                onChange={(e) => setForm({ ...form, odometerKm: e.target.value })}
              />
            </Field>
            <div className="flex gap-2 pt-2">
              <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
              {editingId && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Panel>

        <Panel>
          {!items.length ? (
            <EmptyState message="No vehicles yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-stone-200 text-stone-500">
                  <tr>
                    <th className="pb-2 font-medium">Reg. No</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Make / Model</th>
                    <th className="pb-2 font-medium">Odo</th>
                    <th className="pb-2 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b border-stone-100">
                      <td className="py-2.5 font-medium">{vehicle.registrationNo}</td>
                      <td className="py-2.5">{vehicle.customer?.name ?? '—'}</td>
                      <td className="py-2.5">
                        {[vehicle.make, vehicle.model].filter(Boolean).join(' ') || '—'}
                      </td>
                      <td className="py-2.5">{vehicle.odometerKm} km</td>
                      <td className="py-2.5 text-right">
                        <button className="mr-3 text-teal-700 hover:underline" onClick={() => startEdit(vehicle)}>
                          Edit
                        </button>
                        <button className="text-red-600 hover:underline" onClick={() => remove(vehicle.id)}>
                          Delete
                        </button>
                      </td>
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
