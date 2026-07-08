'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setErr(null); setMsg(null); setBusy(true);
    const supabase = createClient();
    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setErr(error.message); setBusy(false); return; }
      if (data.session) { router.push('/consent'); return; }
      setMsg('Account created. You can now sign in.'); setMode('signin'); setBusy(false);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setErr(error.message); setBusy(false); return; }
      router.push('/consent');
    }
  }

  const input = { padding: '11px 14px', borderRadius: 10, border: '2px solid #d5c9be', fontSize: 15, width: '100%', boxSizing: 'border-box', marginBottom: 12 };
  return (
    <div style={{ maxWidth: 380, margin: '50px auto', textAlign: 'center' }}>
      <h1>{mode === 'signup' ? 'Create your account' : 'Sign in to BillSavvy AI'}</h1>
      <p style={{ color: '#6e6058' }}>{mode === 'signup' ? 'Use any email and a password (min 6 characters).' : 'Welcome back.'}</p>
      <form onSubmit={submit} style={{ marginTop: 18 }}>
        <input type="email" required placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={input} />
        <input type="password" required minLength={6} placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} style={input} />
        <button type="submit" disabled={busy} style={{ width: '100%', background: '#ea6a1f', color: '#fff', border: 0, padding: '12px', borderRadius: 999, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
          {busy ? 'Please wait...' : (mode === 'signup' ? 'Create account' : 'Sign in')}
        </button>
      </form>
      {err && <p style={{ color: '#c0392b' }}>{err}</p>}
      {msg && <p style={{ color: '#1f9d8b' }}>{msg}</p>}
      <p style={{ marginTop: 16, fontSize: 14 }}>
        {mode === 'signup' ? 'Already have an account? ' : 'New here? '}
        <a onClick={() => { setErr(null); setMsg(null); setMode(mode === 'signup' ? 'signin' : 'signup'); }} style={{ color: '#ea6a1f', fontWeight: 700, cursor: 'pointer' }}>
          {mode === 'signup' ? 'Sign in' : 'Create an account'}
        </a>
      </p>
    </div>
  );
}
