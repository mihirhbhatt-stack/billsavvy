'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';

export default function Login() {
const router = useRouter();
const [mode, setMode] = useState('signin');
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [phone, setPhone] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [agree, setAgree] = useState(false);
const [busy, setBusy] = useState(false);
const [err, setErr] = useState(null);
const [msg, setMsg] = useState(null);

async function submit(e) {
e.preventDefault();
setErr(null); setMsg(null);
if (mode === 'signup' && !agree) { setErr('Please tick the box to agree to the Terms and Privacy Policy.'); return; }
setBusy(true);
const supabase = createClient();
if (mode === 'signup') {
const { data, error } = await supabase.auth.signUp({
  email, password,
  options: { data: { first_name: firstName, last_name: lastName, phone } },
});
if (error) { setErr(error.message); setBusy(false); return; }
if (data.session && data.user) {
  await supabase.from('profiles').upsert({
    id: data.user.id, email,
    first_name: firstName, last_name: lastName, phone,
    full_name: firstName,
  });
  router.push('/consent'); return;
}
setMsg('Account created. You can now sign in.'); setMode('signin'); setBusy(false);
} else {
const { error } = await supabase.auth.signInWithPassword({ email, password });
if (error) { setErr(error.message); setBusy(false); return; }
router.push('/consent');
}
}

const input = { padding: '11px 14px', borderRadius: 10, border: '2px solid #d5c9be', fontSize: 15, width: '100%', boxSizing: 'border-box', marginBottom: 12 };
const isSignup = mode === 'signup';
return (
<div style={{ maxWidth: 400, margin: '44px auto', textAlign: 'center' }}>
<h1 style={{ marginBottom: 4 }}>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
<p style={{ color: '#6e6058', marginTop: 0 }}>{isSignup ? 'A few quick details and you\'re in — it takes less than a minute.' : 'Sign in to pick up where you left off.'}</p>
<form onSubmit={submit} style={{ marginTop: 18, textAlign: 'left' }}>
{isSignup && (
<>
<div style={{ display: 'flex', gap: 10 }}>
<input type="text" required placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={input} />
<input type="text" required placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} style={input} />
</div>
<input type="tel" required placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} style={input} />
</>
)}
<input type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} style={input} />
<input type="password" required minLength={6} placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} style={input} />
{isSignup && (
<label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#4a3f36', margin: '2px 0 14px', cursor: 'pointer' }}>
<input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ marginTop: 3 }} />
<span>I agree to BillSavvy AI's Terms of Service and Privacy Policy. You'll see the full terms before your first analysis.</span>
</label>
)}
<button type="submit" disabled={busy} style={{ width: '100%', background: '#ea6a1f', color: '#fff', border: 0, padding: '12px', borderRadius: 999, fontWeight: 700, fontSize: 16, cursor: busy ? 'not-allowed' : 'pointer' }}>
{busy ? 'Please wait...' : (isSignup ? 'Create my account' : 'Sign in')}
</button>
</form>
{err && <p style={{ color: '#c0392b' }}>{err}</p>}
{msg && <p style={{ color: '#1f9d8b' }}>{msg}</p>}
<p style={{ marginTop: 16, fontSize: 14 }}>
{isSignup ? 'Already have an account? ' : 'New to BillSavvy? '}
<a onClick={() => { setErr(null); setMsg(null); setMode(isSignup ? 'signin' : 'signup'); }} style={{ color: '#ea6a1f', fontWeight: 700, cursor: 'pointer' }}>
{isSignup ? 'Sign in' : 'Create an account'}
</a>
</p>
</div>
);
}
