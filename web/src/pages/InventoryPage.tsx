import React, { useEffect, useState } from 'react';
import { PageHeader, Panel, Button, Field, inputClass, EmptyState } from '../components/ui';
import { inventoryApi } from '../api/client';

interface InventoryItem {
  id: number;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
}

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', sku: '', quantity: 0, unitPrice: 0 });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await inventoryApi.list();
      // API returns { value, Count } in some cases; tolerate both
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
      await inventoryApi.create({
        name: form.name,
        sku: form.sku || undefined,
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
      });
      setForm({ name: '', sku: '', quantity: 0, unitPrice: 0 });
      setShowForm(false);
      load();
    } catch (e) {
      console.error(e);
      alert('Failed to create item');
    }
  }

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle="Manage spare parts and stock"
        action={<Button onClick={() => setShowForm((s) => !s)}>Add item</Button>}
      />

      <Panel>
        {showForm && (
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
            <Field label="Name">
              <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="SKU">
              <input className={inputClass} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </Field>
            <Field label="Quantity">
              <input type="number" className={inputClass} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
            </Field>
            <Field label="Unit Price (₹)">
              <input type="number" className={inputClass} value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })} />
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
          <EmptyState message="No inventory items found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr className="text-left text-stone-500">
                  <th className="w-1/2 py-2">Name</th>
                  <th className="w-1/6 py-2">SKU</th>
                  <th className="w-1/6 py-2">Quantity</th>
                  <th className="w-1/6 py-2">Unit Price (₹)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-t border-stone-100">
                    <td className="py-3">{it.name}</td>
                    <td className="py-3">{it.sku}</td>
                    <td className="py-3">{it.quantity}</td>
                    <td className="py-3">{Number(it.unitPrice).toFixed(2)}</td>
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
