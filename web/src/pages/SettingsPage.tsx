import { useEffect, useState } from 'react';
import { settingsApi } from '../api';
import type { GarageSetting } from '../types';
import { Button, Field, inputClass, PageHeader, Panel } from '../components/ui';

export function SettingsPage() {
  const [form, setForm] = useState({ garageName: '', location: '', phone: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    settingsApi
      .get()
      .then((settings: GarageSetting) => {
        setForm({
          garageName: settings.garageName,
          location: settings.location,
          phone: settings.phone,
        });
      })
      .catch(() => setError('Failed to load settings'));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await settingsApi.update(form);
      setMessage('Settings saved. Receipt header will use these details.');
    } catch {
      setError('Could not save settings');
    }
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Garage branding for receipts" />
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {message && <p className="mb-4 text-sm text-teal-700">{message}</p>}
      <Panel className="max-w-lg">
        <form className="space-y-3" onSubmit={submit}>
          <Field label="Garage name">
            <input
              className={inputClass}
              required
              value={form.garageName}
              onChange={(e) => setForm({ ...form, garageName: e.target.value })}
            />
          </Field>
          <Field label="Location">
            <input
              className={inputClass}
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <input
              className={inputClass}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Button type="submit">Save settings</Button>
        </form>
      </Panel>
    </div>
  );
}
