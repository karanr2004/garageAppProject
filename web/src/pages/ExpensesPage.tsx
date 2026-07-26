import React, { useEffect, useState } from 'react';
import { PageHeader, Panel, Button, Field, inputClass, EmptyState } from '../components/ui';
import { expensesApi } from '../api/client';

interface ExpenseItem {
  id: number;
  date: string;
  category: string;
  amount: number;
  notes?: string;
}

export function ExpensesPage() {
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: '', category: '', amount: 0, notes: '' });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await expensesApi.list();
      const data = Array.isArray(res) ? res : res?.value || [];
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    try {
      await expensesApi.create({
        date: form.date || undefined,
        category: form.category,
        amount: Number(form.amount),
        notes: form.notes || undefined,
      });
      setForm({ date: '', category: '', amount: 0, notes: '' });
      setShowForm(false);
      load();
    } catch (e) {
      console.error(e);
      alert('Failed to create expense');
    }
  }

  return (
    <div>
      <PageHeader
        title="Expenses"
        subtitle="Record shop expenses"
        action={<Button onClick={() => setShowForm((s) => !s)}>Add expense</Button>}
      />

      <Panel>
        {showForm && (
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
            <Field label="Date">
              <input type="date" className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
            <Field label="Category">
              <input className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </Field>
            <Field label="Amount (₹)">
              <input type="number" className={inputClass} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            </Field>
            <Field label="Notes">
              <input className={inputClass} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Field>
            <div className="col-span-1 sm:col-span-4 flex gap-2">
              <Button onClick={create}>Save</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {loading ? (
          <EmptyState message="Loading..." />
        ) : items.length === 0 ? (
          <EmptyState message="No expenses recorded" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr className="text-left text-stone-500">
                  <th className="w-1/4 py-2">Date</th>
                  <th className="w-1/3 py-2">Category</th>
                  <th className="w-1/4 py-2">Amount (₹)</th>
                  <th className="w-1/4 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-t border-stone-100">
                    <td className="py-3">{it.date}</td>
                    <td className="py-3">{it.category}</td>
                    <td className="py-3">{Number(it.amount).toFixed(2)}</td>
                    <td className="py-3">{it.notes}</td>
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
