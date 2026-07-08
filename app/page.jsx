import { redirect } from 'next/navigation';
import { createClient } from '../lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/dashboard');

  const wrap = { maxWidth: 820, margin: '0 auto' };
  const btn = { display: 'inline-block', background: '#ea6a1f', color: '#fff', padding: '13px 30px', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: 17 };
  const ghost = { display: 'inline-block', border: '2px solid #ea6a1f', color: '#ea6a1f', padding: '11px 26px', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: 16 };
  const card = { flex: 1, minWidth: 220, background: '#fff', border: '1px solid #eadfd5', borderRadius: 14, padding: 24 };
  const step = { width: 34, height: 34, borderRadius: '50%', background: '#ea6a1f', color: '#fff', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 };

  return (
    <div style={wrap}>
      <section style={{ textAlign: 'center', padding: '48px 0 32px' }}>
        <div style={{ display: 'inline-block', background: '#fdeede', color: '#c14f0a', fontWeight: 700, fontSize: 14, padding: '6px 16px', borderRadius: 999, marginBottom: 18 }}>
          Launching in Australia - first bill analysed free
        </div>
        <h1 style={{ fontSize: 42, lineHeight: 1.15, margin: '0 0 16px' }}>
          Your bills, explained.<br /><span style={{ color: '#ea6a1f' }}>Your savings, uncovered.</span>
        </h1>
        <p style={{ fontSize: 19, color: '#6e6058', maxWidth: 560, margin: '0 auto 28px' }}>
          Upload any household bill - electricity, internet, insurance, even your mortgage. Our AI reads it, explains every charge in plain English, and highlights potential savings opportunities.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/login" style={btn}>Sign in / Get started free</a>
        </div>
        <p style={{ fontSize: 13, color: '#6e6058', marginTop: 12 }}>No password needed - we email you a secure sign-in link.</p>
      </section>

      <section style={{ padding: '24px 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28 }}>How it works</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 20 }}>
          <div style={card}><div style={step}>1</div><h3 style={{ margin: '0 0 6px' }}>Upload your bill</h3><p style={{ color: '#6e6058', margin: 0 }}>Snap a photo or upload a PDF. Electricity, gas, water, internet, mobile, insurance, loans - we read them all.</p></div>
          <div style={card}><div style={step}>2</div><h3 style={{ margin: '0 0 6px' }}>AI breaks it down</h3><p style={{ color: '#6e6058', margin: 0 }}>Every charge explained in plain English: what you pay, why it changed, and your real yearly cost.</p></div>
          <div style={card}><div style={step}>3</div><h3 style={{ margin: '0 0 6px' }}>See potential savings</h3><p style={{ color: '#6e6058', margin: 0 }}>We flag potential savings opportunities and the questions to ask your provider. You stay in control.</p></div>
        </div>
      </section>

      <section style={{ padding: '24px 0 8px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28 }}>Simple pricing</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 20 }}>
          <div style={card}><h3 style={{ margin: '0 0 4px' }}>Free</h3><p style={{ fontSize: 30, fontWeight: 800, margin: '0 0 8px' }}>$0</p><p style={{ color: '#6e6058', margin: 0 }}>Your first bill analysed free. Full AI report. No card required.</p></div>
          <div style={{ ...card, borderColor: '#ea6a1f' }}><h3 style={{ margin: '0 0 4px' }}>Premium</h3><p style={{ fontSize: 30, fontWeight: 800, margin: '0 0 8px' }}>$9.99<span style={{ fontSize: 14, fontWeight: 400, color: '#6e6058' }}>/mo</span></p><p style={{ color: '#6e6058', margin: 0 }}>Unlimited uploads, AI chat, expense tracking, renewal reminders, mortgage health check.</p></div>
          <div style={card}><h3 style={{ margin: '0 0 4px' }}>Family</h3><p style={{ fontSize: 30, fontWeight: 800, margin: '0 0 8px' }}>$19.99<span style={{ fontSize: 14, fontWeight: 400, color: '#6e6058' }}>/mo</span></p><p style={{ color: '#6e6058', margin: 0 }}>Everything in Premium plus up to 5 household members and split-bill features.</p></div>
        </div>
        <p style={{ fontSize: 13, color: '#6e6058', textAlign: 'center', marginTop: 14 }}>Premium and Family coming soon. Start free today.</p>
      </section>

      <section style={{ textAlign: 'center', padding: '28px 0 8px' }}>
        <a href="/login" style={ghost}>Get started - it's free</a>
      </section>
    </div>
  );
}
