'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';

const VERSION = '2026-07-10';

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
  const label = { terms: 'the Terms and Conditions', privacy: 'the Privacy Policy', ai_processing: 'AI processing of my information', document_processing: 'processing of documents I upload' };
  return (
    <div style={{ maxWidth: 520, margin: '40px auto' }}>
      <h1>Before you start</h1>
      <p style={{ color: '#6e6058' }}>Please accept the following (version {VERSION}):</p>
      {Object.keys(checks).map((t) => (
        <label key={t} style={{ display: 'block', padding: '10px 0', fontSize: 15 }}>
          <input type="checkbox" checked={checks[t]} onChange={(e) => setChecks({ ...checks, [t]: e.target.checked })} />{' '}
          I accept {label[t]}
        </label>
      ))}
      <button disabled={!all || busy} onClick={accept}
        style={{ marginTop: 12, background: all ? '#ea6a1f' : '#d5c9be', color: '#fff', border: 0, padding: '12px 26px', borderRadius: 999, fontWeight: 700, cursor: all ? 'pointer' : 'not-allowed' }}>
        {busy ? 'Saving...' : 'Accept and continue'}
      </button>
    </div>
  );
}
