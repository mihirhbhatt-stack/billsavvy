'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATS = [
  { key: 'finance', emoji: '🏦', label: 'Finance', sub: 'Home loan · personal loan · credit card', tip: 'Even a 0.5% lower home-loan rate can save thousands a year. We will show you the questions to ask your lender.' },
  { key: 'general_insurance', emoji: '🛡️', label: 'General insurance', sub: 'Home · car · landlord', tip: 'Insurers often quote new customers less than loyal ones. Ask for a loyalty review at renewal.' },
  { key: 'health', emoji: '🏥', label: 'Health insurance', sub: 'Hospital & extras cover', tip: 'You may be paying for extras you never use. We will point you to the free government comparison tool.' },
  { key: 'energy', emoji: '⚡', label: 'Energy & utilities', sub: 'Electricity · gas · water · solar', tip: 'Energy plans change constantly. The government Energy Made Easy tool compares every retailer for free.' },
  { key: 'telco', emoji: '🌐', label: 'Phone & internet', sub: 'Mobile · internet · phone', tip: 'Many people pay for more data or speed than they use. We will flag it from your bill.' },
  { key: 'subs', emoji: '📺', label: 'Subscriptions', sub: 'Streaming · software · memberships', tip: 'Forgotten subscriptions are silent money-drains. We will help you spot them.' },
];

export default function Upload() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [err, setErr] = useState(null);
  const [active, setActive] = useState(null);

  async function go(e) {
    e.preventDefault();
    if (!file) return;
    setBusy(true); setErr(null); setStatus('Uploading your bill...');
    const fd = new FormData();
    fd.append('file', file);
    setStatus('Reading your bill with AI (30-60 seconds)...');
    const res = await fetch('/api/analyze', { method: 'POST', body: fd });
    const json = await res.json();
    if (!res.ok) { setErr(json.error || 'Something went wrong'); setBusy(false); return; }
    setStatus('Done! Opening your report...');
    router.push(`/report/${json.analysis_id}`);
  }

  return (
    <div style={{ maxWidth: 720, margin: '20px auto' }}>
      <h1 style={{ textAlign: 'center' }}>What would you like to check?</h1>
      <p style={{ textAlign: 'center', color: '#6e6058' }}>Pick a category for a savings tip, then upload the bill. Our AI reads it automatically.</p>

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
          <div style={{ fontWeight: 700, marginBottom: 4 }}>💡 Savings tip</div>
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
        {status && busy && <p style={{ color: '#1f9d8b' }}>{status}</p>}
        {err && <p style={{ color: '#c0392b' }}>{err}</p>}
      </form>
    </div>
  );
}
