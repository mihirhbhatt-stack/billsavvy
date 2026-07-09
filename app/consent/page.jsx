'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';

const VERSION = '2026-07-10';

const LABELS = {
  terms: <>I accept the <a href="/terms" target="_blank" style={{ color: '#ea6a1f', fontWeight: 700 }}>Terms &amp; Conditions</a></>,
  privacy: <>I accept the <a href="/privacy" target="_blank" style={{ color: '#ea6a1f', fontWeight: 700 }}>Privacy Policy</a></>,
  ai_processing: <>I consent to my documents being read and analysed by AI, including by trusted providers that may process data <strong>overseas (in the United States)</strong>, as explained in the <a href="/privacy" target="_blank" style={{ color: '#ea6a1f', fontWeight: 700 }}>Privacy Policy</a></>,
  document_processing: <>I confirm I am entitled to upload the documents I submit, and consent to their processing to generate my report</>,
};

export default function Consent() {
  const router = useRouter();
  const [checks, setChecks] = useState({ terms: false, privacy: false, ai_processing: false, document_processing: false });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const all = Object.values(checks).every(Boolean);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }
      await supabase.from('profiles').upsert({ id: user.id, email: user.email }, { onConflict: 'id' });
      await supabase.from('subscriptions').upsert({ user_id: user.id, plan: 'free' }, { onConflict: 'user_id' });
      const { data } = await supabase.from('consents').select('consent_type').eq('policy_version', VERSION);
      if (data && ['terms','privacy','ai_processing','document_processing'].every(t => data.some(r => r.consent_type === t))) {
        router.replace('/dashboard');
      } else setDone(true);
    })();
  }, [router]);

  async function accept() {
    setBusy(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const rows = Object.keys(checks).map((t) => ({
      user_id: user.id, consent_type: t, policy_version: VERSION,
      user_agent: navigator.userAgent, granted: true,
    }));
    const { error } = await supabase.from('consents').insert(rows);
    if (!error) router.replace('/dashboard'); else { alert(error.message); setBusy(false); }
  }

  if (!done) return <p>Loading...</p>;
  return (
    <div style={{ maxWidth: 560, margin: '20px auto' }}>
      <div style={{ background: '#fff', borderRadius: 22, padding: 'clamp(24px,4vw,32px)', boxShadow: '0 12px 40px rgba(36,26,18,0.10)', border: '1px solid #f0e7dc' }}>
        <h1 style={{ marginTop: 0, fontSize: 'clamp(24px,5vw,30px)' }}>Before you start</h1>
        <p style={{ color: '#6e6058', marginTop: 0 }}>A quick tick to confirm you're happy with how we handle your bills (version {VERSION}). You stay in control — general information only, never personal advice.</p>
        {Object.keys(checks).map((t) => (
          <label key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 0', fontSize: 14.5, lineHeight: 1.5, cursor: 'pointer', borderTop: '1px solid #f5ede4' }}>
            <input type="checkbox" checked={checks[t]} onChange={(e) => setChecks({ ...checks, [t]: e.target.checked })} style={{ marginTop: 3, width: 17, height: 17, accentColor: '#ea6a1f', flexShrink: 0 }} />
            <span>{LABELS[t]}</span>
          </label>
        ))}
        <button disabled={!all || busy} onClick={accept}
          style={{ marginTop: 16, width: '100%', background: all && !busy ? 'linear-gradient(135deg,#ea6a1f,#c14f0a)' : '#d5c9be', color: '#fff', border: 0, padding: '13px 26px', borderRadius: 999, fontWeight: 700, fontSize: 16, cursor: all && !busy ? 'pointer' : 'not-allowed', boxShadow: all && !busy ? '0 6px 16px rgba(234,106,31,0.3)' : 'none' }}>
          {busy ? 'Saving...' : 'Accept and continue'}
        </button>
      </div>
    </div>
  );
}
