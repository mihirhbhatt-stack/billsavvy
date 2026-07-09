import { redirect } from 'next/navigation';
import { createClient } from '../lib/supabase/server';

export const dynamic = 'force-dynamic';

const CHIPS = [
  { e: '⚡', t: 'Energy' }, { e: '🌐', t: 'Internet' }, { e: '📱', t: 'Mobile' },
  { e: '🛡️', t: 'Insurance' }, { e: '🏦', t: 'Home loan' }, { e: '💰', t: 'Savings' },
];

const STEPS = [
  { n: 1, e: '📤', c: '#ea6a1f', bg: 'linear-gradient(160deg,#fff 0%,#fff0e0 100%)', t: 'Upload your bill', d: 'Snap a photo or upload a PDF. Energy, internet, mobile, insurance, loans, savings — we read them all.' },
  { n: 2, e: '🤖', c: '#7c5cff', bg: 'linear-gradient(160deg,#fff 0%,#efeaff 100%)', t: 'AI breaks it down', d: 'Every charge explained in plain English: what you pay, why it changed, and your real yearly cost.' },
  { n: 3, e: '🤝', c: '#1f9d8b', bg: 'linear-gradient(160deg,#fff 0%,#e4f6f1 100%)', t: 'Negotiate & save', d: 'We give you the number to call, who to ask for, and exactly what to say. You stay in control.' },
];

const FEATURES = [
  { e: '🔍', c: '#ea6a1f', bg: '#fff3e8', t: 'Plain-English breakdown', d: 'Every charge explained simply — what you pay, why it changed, and your real yearly cost.' },
  { e: '📞', c: '#7c5cff', bg: '#f1ecff', t: 'Who to call & what to say', d: 'The right number, the team to ask for, and a professional script to negotiate a better deal.' },
  { e: '💬', c: '#1f9d8b', bg: '#e7f7f2', t: 'Ask our AI helper', d: 'A friendly assistant answers questions about your own bill, in plain words, any time.' },
  { e: '🔒', c: '#e0567a', bg: '#fdecf1', t: 'Private & secure', d: 'Your documents are encrypted and only ever seen by you. We never sell your data.' },
];

const TRUST = [
  { e: '🔒', c: '#22d3a6', t: 'Bank-level encryption', d: 'Your bills are encrypted end to end.' },
  { e: '🇦🇺', c: '#ffb84d', t: 'Made in Australia', d: 'Built for Aussie households and providers.' },
  { e: '🧭', c: '#ff6f9c', t: 'No personal advice', d: 'General info only — you always decide.' },
];

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/dashboard');

  const h2 = { textAlign: 'center', fontSize: 'clamp(24px,5vw,32px)', margin: '0 0 6px' };

  return (
    <div>
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: 'clamp(42px,7vw,60px) clamp(20px,4vw,34px)', textAlign: 'center', color: '#fff',
        background: 'radial-gradient(circle at 18% 22%, #ffc24d 0%, rgba(255,194,77,0) 42%), radial-gradient(circle at 82% 26%, #ff5e8a 0%, rgba(255,94,138,0) 48%), radial-gradient(circle at 62% 96%, #ff9a3d 0%, rgba(255,154,61,0) 46%), linear-gradient(135deg,#ee6a1c 0%,#d1560d 55%,#b6470a 100%)',
        boxShadow: '0 22px 55px rgba(209,86,13,0.34)' }}>
        <div style={{ position: 'absolute', top: -60, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ position: 'absolute', bottom: -70, left: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }} />
        <div style={{ position: 'relative' }}>
          <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.20)', color: '#fff', fontWeight: 700, fontSize: 13.5, padding: '7px 18px', borderRadius: 999, marginBottom: 20 }}>🇦🇺 Made for Australian households · Your first bill is free</span>
          <h1 style={{ fontSize: 'clamp(30px,7vw,50px)', lineHeight: 1.1, margin: '0 0 16px', color: '#fff' }}>
            Your bills, explained.<br /><span style={{ color: '#ffe9c7' }}>Your savings, uncovered.</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px,2.4vw,19px)', color: 'rgba(255,255,255,0.95)', maxWidth: 580, margin: '0 auto 26px', lineHeight: 1.55 }}>
            Upload any household bill and our AI explains every charge in plain English, then shows you exactly how to negotiate a better deal with your provider. You always stay in control.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/login" className="bs-link" style={{ display: 'inline-block', background: '#fff', color: '#c14f0a', padding: '14px 34px', borderRadius: 999, textDecoration: 'none', fontWeight: 800, fontSize: 17, boxShadow: '0 10px 24px rgba(0,0,0,0.18)' }}>Get started free →</a>
            <a href="/login" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.16)', color: '#fff', border: '2px solid rgba(255,255,255,0.55)', padding: '12px 28px', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: 16 }}>Sign in</a>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 14 }}>Free to start · no card required · not a comparison site</p>
          <div style={{ display: 'flex', gap: 9, justifyContent: 'center', flexWrap: 'wrap', marginTop: 24 }}>
            {CHIPS.map((c) => (
              <span key={c.t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', color: '#241a12', fontWeight: 700, fontSize: 13.5, padding: '7px 14px', borderRadius: 999, boxShadow: '0 3px 10px rgba(0,0,0,0.12)' }}><span>{c.e}</span>{c.t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: 'clamp(36px,6vw,48px) 0 12px' }}>
        <h2 style={h2}>How it works</h2>
        <p style={{ textAlign: 'center', color: '#6e6058', margin: '0 auto 26px', maxWidth: 520 }}>Three simple steps — about a minute from upload to savings.</p>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {STEPS.map((s) => (
            <div key={s.n} className="bs-card" style={{ flex: 1, minWidth: 230, background: s.bg, borderRadius: 20, padding: 26, border: `1px solid ${s.c}33`, borderTop: `5px solid ${s.c}`, boxShadow: `0 8px 24px ${s.c}1f` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ width: 46, height: 46, borderRadius: 14, background: s.c, color: '#fff', fontWeight: 800, fontSize: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 14px ${s.c}66` }}>{s.e}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: s.c, letterSpacing: 1, textTransform: 'uppercase' }}>Step {s.n}</span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: 19 }}>{s.t}</h3>
              <p style={{ color: '#5a5048', margin: 0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: 'clamp(28px,5vw,36px) 0 12px' }}>
        <h2 style={{ ...h2, marginBottom: 26 }}>Why households love BillSavvy</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 16 }}>
          {FEATURES.map((f) => (
            <div key={f.t} className="bs-card" style={{ background: `linear-gradient(160deg,#fff 55%,${f.bg} 100%)`, borderRadius: 18, padding: 24, border: `1px solid ${f.c}2e`, borderTop: `4px solid ${f.c}`, boxShadow: '0 4px 18px rgba(36,26,18,0.06)' }}>
              <div style={{ fontSize: 30, width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', background: f.bg, borderRadius: 14, marginBottom: 12 }}>{f.e}</div>
              <h3 style={{ margin: '0 0 6px' }}>{f.t}</h3>
              <p style={{ color: '#6e6058', margin: 0 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DARK TRUST BAND */}
      <section style={{ margin: '20px 0', borderRadius: 24, padding: 'clamp(30px,5vw,40px) clamp(20px,4vw,32px)', background: 'radial-gradient(circle at 15% 20%, #2a2350 0%, rgba(42,35,80,0) 55%), radial-gradient(circle at 90% 80%, #123b4a 0%, rgba(18,59,74,0) 55%), #14122a', color: '#fff', boxShadow: '0 18px 44px rgba(20,18,42,0.35)' }}>
        <h2 style={{ ...h2, color: '#fff', marginBottom: 22 }}>Built on trust ✨</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 18 }}>
          {TRUST.map((t) => (
            <div key={t.t} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, width: 58, height: 58, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${t.c}22`, border: `1px solid ${t.c}55`, borderRadius: 16 }}>{t.e}</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: t.c }}>{t.t}</div>
              <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{t.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: 'clamp(28px,5vw,36px) 0 12px' }}>
        <h2 style={h2}>Simple pricing</h2>
        <p style={{ textAlign: 'center', color: '#6e6058', margin: '0 auto 26px' }}>Start free. Upgrade only if you love it.</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'stretch' }}>
          <div className="bs-card" style={{ flex: 1, minWidth: 220, background: '#fff', borderRadius: 18, padding: 24, border: '1px solid #f0e7dc', boxShadow: '0 4px 18px rgba(36,26,18,0.06)' }}><h3 style={{ margin: '0 0 4px' }}>Free</h3><p style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px' }}>$0</p><p style={{ color: '#6e6058', margin: 0 }}>Your first bill analysed free. Full AI report. No card required.</p></div>
          <div className="bs-card" style={{ flex: 1, minWidth: 220, color: '#fff', background: 'linear-gradient(135deg,#ff8a3d,#ea6a1f,#c14f0a)', borderRadius: 18, padding: 24, border: 'none', boxShadow: '0 14px 32px rgba(234,106,31,0.32)', position: 'relative' }}>
            <span style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.22)', fontSize: 11.5, fontWeight: 800, padding: '4px 10px', borderRadius: 999 }}>MOST POPULAR</span>
            <h3 style={{ margin: '0 0 4px', color: '#fff' }}>Premium</h3><p style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px' }}>$9.99<span style={{ fontSize: 14, fontWeight: 400, opacity: 0.9 }}>/mo</span></p><p style={{ margin: 0, opacity: 0.95 }}>Unlimited uploads, AI chat, expense tracking, renewal reminders, mortgage health check.</p></div>
          <div className="bs-card" style={{ flex: 1, minWidth: 220, background: '#fff', borderRadius: 18, padding: 24, border: '1px solid #f0e7dc', boxShadow: '0 4px 18px rgba(36,26,18,0.06)' }}><h3 style={{ margin: '0 0 4px' }}>Family</h3><p style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px' }}>$19.99<span style={{ fontSize: 14, fontWeight: 400, color: '#6e6058' }}>/mo</span></p><p style={{ color: '#6e6058', margin: 0 }}>Everything in Premium plus up to 5 household members and split-bill features.</p></div>
        </div>
        <p style={{ fontSize: 13, color: '#6e6058', textAlign: 'center', marginTop: 14 }}>Premium and Family coming soon. Start free today.</p>
      </section>

      {/* FINAL CTA */}
      <section style={{ textAlign: 'center', padding: '10px 0 20px' }}>
        <div style={{ background: 'radial-gradient(circle at 20% 20%, #24c39f 0%, rgba(36,195,159,0) 55%), linear-gradient(135deg,#1f9d8b,#0f6f5c)', color: '#fff', borderRadius: 24, padding: 'clamp(32px,5vw,44px) 28px', boxShadow: '0 18px 44px rgba(31,157,139,0.30)' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 'clamp(22px,5vw,30px)', color: '#fff' }}>Ready to take charge of your bills? 💪</h2>
          <p style={{ margin: '0 auto 22px', maxWidth: 520, opacity: 0.95, fontSize: 16 }}>Upload your first bill free and see how much you could save — no card, no catch, no pressure.</p>
          <a href="/login" className="bs-link" style={{ display: 'inline-block', background: '#fff', color: '#0f6f5c', padding: '14px 34px', borderRadius: 999, textDecoration: 'none', fontWeight: 800, fontSize: 17, boxShadow: '0 10px 24px rgba(0,0,0,0.18)' }}>Get started free →</a>
        </div>
      </section>
    </div>
  );
}
