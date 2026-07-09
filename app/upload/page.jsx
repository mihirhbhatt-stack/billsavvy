'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CATS = [
{ key: 'finance', emoji: '🏦', label: 'Finance', sub: 'Home loan · personal loan · credit card', tip: 'Your home loan is probably the biggest number in your life. Shave even a little off the rate and that\'s real money back in your pocket — we\'ll hand you the exact questions to ask.' },
{ key: 'savings', emoji: '💰', label: 'Savings & deposits', sub: 'Savings account · term deposit', tip: 'Your savings should be working as hard as you do. If the rate has quietly gone to sleep, we\'ll gently flag it and show you where to compare — no pressure, always your call.' },
{ key: 'general_insurance', emoji: '🛡️', label: 'General insurance', sub: 'Home · car · landlord', tip: 'Here\'s a little secret: loyalty rarely pays with insurers — the best prices often go to brand-new customers. We\'ll help you have a friendly chat at renewal.' },
{ key: 'health', emoji: '🏥', label: 'Health insurance', sub: 'Hospital & extras cover', tip: 'Paying for extras you never actually use? It happens to almost everyone. We\'ll point you to the free government tool so you only pay for what you need.' },
{ key: 'energy', emoji: '⚡', label: 'Energy & utilities', sub: 'Electricity · gas · water · solar', tip: 'Energy prices have a habit of creeping up while you\'re not looking. The free government Energy Made Easy tool shows in a couple of minutes if you\'re overpaying.' },
{ key: 'telco', emoji: '🌐', label: 'Phone & internet', sub: 'Mobile · internet · phone', tip: 'Most of us are paying for more data or speed than we\'ll ever use. We\'ll spot it on your bill so you can right-size and keep the difference.' },
{ key: 'subs', emoji: '📺', label: 'Subscriptions', sub: 'Streaming · software · memberships', tip: 'We\'ve all forgotten a subscription or two still quietly nibbling away each month. Let\'s catch the sneaky ones together.' },
];

const LOADING_MSGS = [
'Reading your statement with AI…',
'Every dollar saved is a dollar earned 🌱',
'Small changes today, big savings tomorrow 💪',
'You\'re taking charge of your money — love to see it!',
'Crunching the numbers so you don\'t have to…',
'A budget is just telling your money where to go 🧭',
'Hang tight — good things take a moment ✨',
];

export default function Upload() {
const router = useRouter();
const [file, setFile] = useState(null);
const [busy, setBusy] = useState(false);
const [err, setErr] = useState(null);
const [active, setActive] = useState(null);
const [msgI, setMsgI] = useState(0);

useEffect(() => {
  if (!busy) return;
  const t = setInterval(() => setMsgI((i) => (i + 1) % LOADING_MSGS.length), 3200);
  return () => clearInterval(t);
}, [busy]);

async function go(e) {
e.preventDefault();
if (!file) return;
setBusy(true); setErr(null); setMsgI(0);
const fd = new FormData();
fd.append('file', file);
const res = await fetch('/api/analyze', { method: 'POST', body: fd });
const json = await res.json();
if (!res.ok) { setErr(json.error || 'Something went wrong'); setBusy(false); return; }
router.push(`/report/${json.analysis_id}`);
}

return (
<div style={{ maxWidth: 720, margin: '20px auto' }}>
<h1 style={{ textAlign: 'center' }}>What would you like to check?</h1>
<p style={{ textAlign: 'center', color: '#6e6058' }}>Pick a category for a savings tip, then upload the bill or statement. Our AI reads it automatically.</p>

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, margin: '20px 0' }}>
{CATS.map((c) => (
<button key={c.key} onClick={() => setActive(active === c.key ? null : c.key)} type="button"
style={{ textAlign: 'left', cursor: 'pointer', background: active === c.key ? '#fdeede' : '#fff', border: active === c.key ? '2px solid #ea6a1f' : '1px solid #eadfd5', borderRadius: 14, padding: 16 }}>
<div style={{ fontSize: 26 }}>{c.emoji}</div>
<div style={{ fontWeight: 700, marginTop: 4 }}>{c.label}</div>
<div style={{ fontSize: 12, color: '#6e6058' }}>{c.sub}</div>
</button>
))}
</div>

{active && (
<div style={{ background: 'linear-gradient(135deg,#1f9d8b,#0f6f5c)', color: '#fff', borderRadius: 14, padding: '16px 20px', marginBottom: 18 }}>
<div style={{ fontWeight: 700, marginBottom: 4 }}>💡 A little tip for you</div>
<div style={{ fontSize: 14 }}>{CATS.find((c) => c.key === active).tip}</div>
</div>
)}

<form onSubmit={go} style={{ textAlign: 'center', background: '#fff', border: '1px solid #eadfd5', borderRadius: 14, padding: 24 }}>
<p style={{ color: '#6e6058', marginTop: 0 }}>PDF, JPEG or PNG · max 20 MB · analysed in about a minute</p>
<input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files[0])} style={{ display: 'block', margin: '16px auto' }} />
<button disabled={!file || busy} type="submit"
style={{ background: file && !busy ? '#ea6a1f' : '#d5c9be', color: '#fff', border: 0, padding: '12px 28px', borderRadius: 999, fontWeight: 700, fontSize: 16, cursor: file && !busy ? 'pointer' : 'not-allowed' }}>
{busy ? 'Working...' : 'Analyse my bill'}
</button>
{busy && <p style={{ color: '#1f9d8b', fontWeight: 600, minHeight: 22 }}>{LOADING_MSGS[msgI]}</p>}
{err && <p style={{ color: '#c0392b' }}>{err}</p>}
</form>
</div>
);
}
