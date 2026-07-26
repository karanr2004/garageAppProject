import { useEffect, useState } from 'react';
import { customersApi } from '../api';
import type { Customer } from '../types';
import { Button, EmptyState, Field, inputClass, PageHeader, Panel } from '../components/ui';

const emptyForm = { name: '', phone: '', address: '' };

export function CustomersPage() {
  const [items, setItems] = useState<Customer[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = () =>
    customersApi
      .list()
      .then(setItems)
      .catch(() => setError('Failed to load customers'));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await customersApi.update(editingId, form);
      } else {
        await customersApi.create(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch {
      setError('Could not save customer');
    }
  };

  const startEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      phone: customer.phone,
      address: customer.address || '',
    });
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this customer?')) return;
    await customersApi.remove(id);
    await load();
  };

  return (
    <div>
      <PageHeader title="Customers" subtitle="Owners and contact details" />
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Panel>
          <h3 className="mb-4 text-sm font-semibold">{editingId ? 'Edit customer' : 'Add customer'}</h3>
          <form className="space-y-3" onSubmit={submit}>
            <Field label="Name">
              <input
                className={inputClass}
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="Phone">
              <input
                className={inputClass}
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Field>
            <Field label="Address">
              <textarea
                className={inputClass}
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
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
            <EmptyState message="No customers yet." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-stone-200 text-stone-500">
                  <tr>
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Phone</th>
                    <th className="pb-2 font-medium">Address</th>
                    <th className="pb-2 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((customer) => (
                    <tr key={customer.id} className="border-b border-stone-100">
                      <td className="py-2.5 font-medium">{customer.name}</td>
                      <td className="py-2.5">{customer.phone}</td>
                      <td className="py-2.5 text-stone-600">{customer.address || '—'}</td>
                      <td className="py-2.5 text-right">
                        <button className="mr-3 text-teal-700 hover:underline" onClick={() => startEdit(customer)}>
                          Edit
                        </button>
                        <button className="text-red-600 hover:underline" onClick={() => remove(customer.id)}>
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
