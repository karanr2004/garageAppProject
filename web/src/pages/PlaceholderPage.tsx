import { PageHeader, Panel } from '../components/ui';

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div>
      <PageHeader title={title} subtitle="Coming in Phase 2" />
      <Panel>
        <p className="text-sm text-stone-600">
          This module is planned for Phase 2. Core billing, customers, vehicles, and job cards are
          available now.
        </p>
      </Panel>
    </div>
  );
}
