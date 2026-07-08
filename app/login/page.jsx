'use client';
import { useState } from 'react';
import { createClient } from '../../lib/supabase/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(null);

  async function sendLink(e) {
    e.preventDefault();
    setErr(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });
    if (error) setErr(error.message); else setSent(true);
  }

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', textAlign: 'center' }}>
      <h1>Sign in to BillSavvy AI</h1>
      <p style={{ color: '#6e6058' }}>We will email you a magic sign-in link. No password needed.</p>
      {sent ? (
        <p style={{ color: '#1f9d8b', fontWeight: 700 }}>Check your email and click the link.</p>
      ) : (
        <form onSubmit={sendLink} style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            style={{ padding: '10px 14px', borderRadius: 999, border: '2px solid #d5c9be', fontSize: 15, width: 240 }} />
          <button type="submit" style={{ background: '#ea6a1f', color: '#fff', border: 0, padding: '10px 20px', borderRadius: 999, fontWeight: 700, cursor: 'pointer' }}>
            Send link
          </button>
        </form>
      )}
      {err && <p style={{ color: '#c0392b' }}>{err}</p>}
    </div>
  );
}
