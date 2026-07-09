import { redirect } from 'next/navigation';
import { createClient } from '../lib/supabase/server';

export const dynamic = 'force-dynamic';

const CHIPS = [
  { e: '⚡', t: 'Energy', c: '#ea6a1f' },
  { e: '🌐', t: 'Internet', c: '#3a86ff' },
  { e: '📱', t: 'Mobile', c: '#2ba7c4' },
  { e: '🛡️', t: 'Insurance', c: '#e0567a' },
  { e: '🏦', t: 'Home loan', c: '#7c5cff' },
  { e: '💰', t: 'Savings', c: '#1f9d8b' },
];

const FEATURES = [
  { e: '🔍', c: '#ea6a1f', t: 'Plain-English breakdown', d: 'Every charge explained simply — what you pay, why it changed, and your real yearly cost.' },
  { e: '📞', c: '#7c5cff', t: 'Who to call & what to say', d: 'The right number, the team to ask for, and a professional script to negotiate a better deal.' },
  { e: '💬', c: '#1f9d8b', t: 'Ask our AI helper', d: 'A friendly assistant answers your questions about your own bill, in plain words, any time.' },
  { e: '🔒', c: '#e0567a', t: 'Private & secure', d: 'Your documents are encrypted and only ever seen by you. We never sell your data.' },
];

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/dashboard');

  const card = { flex: 1, minWidth: 220, background: '#fff', borderRadius: 18, padding: 24, border: '1px solid #f0e7dc', boxShadow: '0 4px 18px rgba(36,26,18,0.06)' };
  const stepCircle = (bg) => ({ width: 40, height: 40, borderRadius: '50%', background: bg, color: '#fff', fontWeight: 800, fontSize: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, boxShadow: `0 4px 12px ${bg}55` });

  return (
    <div>
      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '54px 32px 46px', textAlign: 'center', color: '#fff', background: 'linear-gradient(135deg,#ff9a4d 0%,#ea6a1f 45%,#c14f0a 100%)', boxShadow: '0 20px 50px rgba(234,106,31,0.32)' }}>
        <div style={{ position: 'absolute', top: -60, right: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ position: 'absolute', bottom: -70, left: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }} />
        <div style={{ position: 'absolute', top: 40, left: 40, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'relative' }}>
          <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.20)', color: '#fff', fontWeight: 700, fontSize: 13.5, padding: '7px 18px', borderRadius: 999, marginBottom: 20, backdropFilter: 'blur(4px)' }}>🇦🇺 Made for Australian households · Your first bill is free</span>
          <h1 style={{ fontSize: 44, lineHeight: 1.12, margin: '0 0 16px', color: '#fff' }}>
            Your bills, explained.<br /><span style={{ color: '#fff3e6' }}>Your savings, uncovered.</span>
          </h1>
          <p style={{ fontSize: 18.5, color: 'rgba(255,255,255,0.94)', maxWidth: 580, margin: '0 auto 26px', lineHeight: 1.5 }}>
            Upload any household bill and our AI explains every charge in plain English, then shows you exactly how to negotiate a better deal with your provider. You always stay in control.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/login" style={{ display: 'inline-block', background: '#fff', color: '#c14f0a', padding: '14px 34px', borderRadius: 999, textDecoration: 'none', fontWeight: 800, fontSize: 17, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>Get started free →</a>
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
      <section style={{ padding: '44px 0 12px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 30, margin: '0 0 6px' }}>How it works</h2>
        <p style={{ textAlign: 'center', color: '#6e6058', margin: '0 auto 26px', maxWidth: 520 }}>Three simple steps — about a minute from upload to savings.</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={card}><div style={stepCircle('#ea6a1f')}>1</div><h3 style={{ margin: '0 0 6px' }}>Upload your bill</h3><p style={{ color: '#6e6058', margin: 0 }}>Snap a photo or upload a PDF. Energy, internet, mobile, insurance, loans, savings — we read them all.</p></div>
          <div style={card}><div style={stepCircle('#7c5cff')}>2</div><h3 style={{ margin: '0 0 6px' }}>AI breaks it down</h3><p style={{ color: '#6e6058', margin: 0 }}>Every charge explained in plain English: what you pay, why it changed, and your real yearly cost.</p></div>
          <div style={card}><div style={stepCircle('#1f9d8b')}>3</div><h3 style={{ margin: '0 0 6px' }}>Negotiate & save</h3><p style={{ color: '#6e6058', margin: 0 }}>We give you the number to call, who to ask for, and exactly what to say. You stay in control.</p></div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '32px 0 12px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 30, margin: '0 0 26px' }}>Why households love BillSavvy</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
          {FEATURES.map((f) => (
            <div key={f.t} style={{ ...card, borderTop: `4px solid ${f.c}` }}>
              <div style={{ fontSize: 30, width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${f.c}18`, borderRadius: 14, marginBottom: 12 }}>{f.e}</div>
              <h3 style={{ margin: '0 0 6px' }}>{f.t}</h3>
              <p style={{ color: '#6e6058', margin: 0 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '32px 0 12px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 30, margin: '0 0 6px' }}>Simple pricing</h2>
        <p style={{ textAlign: 'center', color: '#6e6058', margin: '0 auto 26px' }}>Start free. Upgrade only if you love it.</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'stretch' }}>
          <div style={card}><h3 style={{ margin: '0 0 4px' }}>Free</h3><p style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px' }}>$0</p><p style={{ color: '#6e6058', margin: 0 }}>Your first bill analysed free. Full AI report. No card required.</p></div>
          <div style={{ ...card, color: '#fff', background: 'linear-gradient(135deg,#ea6a1f,#c14f0a)', border: 'none', boxShadow: '0 12px 30px rgba(234,106,31,0.30)', position: 'relative' }}>
            <span style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.22)', fontSize: 11.5, fontWeight: 800, padding: '4px 10px', borderRadius: 999 }}>MOST POPULAR</span>
            <h3 style={{ margin: '0 0 4px', color: '#fff' }}>Premium</h3><p style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px' }}>$9.99<span style={{ fontSize: 14, fontWeight: 400, opacity: 0.9 }}>/mo</span></p><p style={{ margin: 0, opacity: 0.95 }}>Unlimited uploads, AI chat, expense tracking, renewal reminders, mortgage health check.</p></div>
          <div style={card}><h3 style={{ margin: '0 0 4px' }}>Family</h3><p style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px' }}>$19.99<span style={{ fontSize: 14, fontWeight: 400, color: '#6e6058' }}>/mo</span></p><p style={{ color: '#6e6058', margin: 0 }}>Everything in Premium plus up to 5 household members and split-bill features.</p></div>
        </div>
        <p style={{ fontSize: 13, color: '#6e6058', textAlign: 'center', marginTop: 14 }}>Premium and Family coming soon. Start free today.</p>
      </section>

      {/* FINAL CTA */}
      <section style={{ textAlign: 'center', padding: '10px 0 20px' }}>
        <div style={{ background: 'linear-gradient(135deg,#1f9d8b,#0f6f5c)', color: '#fff', borderRadius: 24, padding: '40px 28px', boxShadow: '0 16px 40px rgba(31,157,139,0.28)' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 28, color: '#fff' }}>Ready to take charge of your bills? 💪</h2>
          <p style={{ margin: '0 auto 22px', maxWidth: 520, opacity: 0.95, fontSize: 16 }}>Upload your first bill free and see how much you could save — no card, no catch, no pressure.</p>
          <a href="/login" style={{ display: 'inline-block', background: '#fff', color: '#0f6f5c', padding: '14px 34px', borderRadius: 999, textDecoration: 'none', fontWeight: 800, fontSize: 17, boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}>Get started free →</a>
        </div>
      </section>
    </div>
  );
}
