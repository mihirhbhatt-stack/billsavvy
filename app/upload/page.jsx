'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Upload() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [err, setErr] = useState(null);

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
    <div style={{ maxWidth: 520, margin: '40px auto', textAlign: 'center' }}>
      <h1>Upload a bill</h1>
      <p style={{ color: '#6e6058' }}>PDF, JPEG or PNG · max 20 MB · analysed in about a minute</p>
      <form onSubmit={go}>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files[0])}
          style={{ display: 'block', margin: '20px auto' }} />
        <button disabled={!file || busy} type="submit"
          style={{ background: file && !busy ? '#ea6a1f' : '#d5c9be', color: '#fff', border: 0, padding: '12px 28px', borderRadius: 999, fontWeight: 700, fontSize: 16, cursor: file && !busy ? 'pointer' : 'not-allowed' }}>
          {busy ? 'Working...' : 'Analyse my bill'}
        </button>
      </form>
      {status && busy && <p style={{ color: '#1f9d8b' }}>{status}</p>}
      {err && <p style={{ color: '#c0392b' }}>{err}</p>}
    </div>
  );
}
