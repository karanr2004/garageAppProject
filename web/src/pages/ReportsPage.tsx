import React, { useEffect, useState } from 'react';
import { PageHeader, Panel, EmptyState } from '../components/ui';
import { reportsApi } from '../api/client';

export function ReportsPage() {
  const [summary, setSummary] = useState<{ totalInventoryValue: number; totalExpenses: number; totalRevenue: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await reportsApi.summary();
      setSummary(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="Reports" subtitle="Summary reports" />
      <Panel>
        {loading ? (
          <EmptyState message="Loading..." />
        ) : summary ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-stone-100 bg-stone-50 p-4">
              <div className="text-sm text-stone-500">Inventory value</div>
              <div className="mt-2 text-2xl font-semibold">₹{Number(summary.totalInventoryValue).toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-stone-100 bg-stone-50 p-4">
              <div className="text-sm text-stone-500">Total expenses</div>
              <div className="mt-2 text-2xl font-semibold">₹{Number(summary.totalExpenses).toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-stone-100 bg-stone-50 p-4">
              <div className="text-sm text-stone-500">Total revenue</div>
              <div className="mt-2 text-2xl font-semibold">₹{Number(summary.totalRevenue).toFixed(2)}</div>
            </div>
          </div>
        ) : (
          <EmptyState message="No report data" />
        )}
      </Panel>
    </div>
  );
}
