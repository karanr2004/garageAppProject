import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { Button, Field, inputClass, Panel } from '../components/ui';
import { clearToken, isAuthenticated, setToken } from '../auth';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  const [form, setForm] = useState({ username: 'admin', password: '1234' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authApi.login(form.username, form.password);
      setToken(result.token);
      navigate(from, { replace: true });
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <Panel className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-teal-700">Garage manager</p>
          <h1 className="mt-3 text-2xl font-semibold text-stone-900">Sign in</h1>
          <p className="mt-2 text-sm text-stone-600">Use admin / 1234 to access the dashboard.</p>
        </div>

        {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field label="Username">
            <input
              className={inputClass}
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              required
            />
          </Field>

          <Field label="Password">
            <input
              className={inputClass}
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </Field>

          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </Panel>
    </div>
  );
}
