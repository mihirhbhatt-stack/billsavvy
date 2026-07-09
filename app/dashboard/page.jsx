import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '../../lib/supabase/server';

export const dynamic = 'force-dynamic';

const ICONS = {
  electricity: '⚡', gas: '🔥', water: '💧', solar: '☀️', ev_charging: '🔌',
  internet: '🌐', mobile: '📱', phone: '☎️',
  home_insurance: '🏠', car_insurance: '🚗', health_insurance: '🏥', landlord_insurance: '🔑',
  mortgage: '🏦', personal_loan: '💵', credit_card: '💳',
  savings_account: '💰', term_deposit: '🔒',
  streaming: '📺', software: '💻', membership: '🎟️', other: '📄',
};

const GROUPS = [
  { title: 'Finance', color: '#7c5cff', cats: ['mortgage', 'personal_loan', 'credit_card'] },
  { title: 'Savings & deposits', color: '#1f9d8b', cats: ['savings_account', 'term_deposit'] },
  { title: 'General insurance', color: '#e0567a', cats: ['home_insurance', 'car_insurance', 'landlord_insurance'] },
  { title: 'Health insurance', color: '#2ba7c4', cats: ['health_insurance'] },
  { title: 'Energy & utilities', color: '#ea6a1f', cats: ['electricity', 'gas', 'water', 'solar', 'ev_charging'] },
  { title: 'Mobile & internet', color: '#3a86ff', cats: ['internet', 'mobile', 'phone'] },
  { title: 'Subscriptions', color: '#b5179e', cats: ['streaming', 'software', 'membership'] },
  { title: 'Other', color: '#8a7d70', cats: ['other'] },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

async function deleteBill(formData) {
  'use server';
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('bills').delete().eq('id', formData.get('id'));
  revalidatePath('/dashboard');
}

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('full_name').maybeSingle();
  const { data: billsData } = await supabase
    .from('bills')
    .select('id, category, provider_name, amount_due, due_date, created_at')
    .order('created_at', { ascending: false });
  const { data: analysesData } = await supabase
    .from('bill_analysis')
    .select('id, bill_id, annual_estimate');

  const byBill = {};
  for (const a of (analysesData || [])) { if (!byBill[a.bill_id]) byBill[a.bill_id] = a; }
  const rows = (billsData || []).map((b) => ({ ...b, analysis: byBill[b.id] || null }));

  const analysed = rows.filter((b) => b.analysis);
  let annualTotal = 0;
  for (const b of analysed) { if (b.analysis.annual_estimate) annualTotal += Number(b.analysis.annual_estimate); }

  let name = profile?.full_name;
  if (!name && user.email) {
    const raw = user.email.split('@')[0].replace(/[^a-zA-Z]/g, '');
    name = raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : 'there';
  }
  name = name || 'there';

  const statBase = { flex: 1, minWidth: 190, borderRadius: 18, padding: '20px 22px', color: '#fff', position: 'relative', overflow: 'hidden' };
  const statNum = { fontSize: 32, fontWeight: 800, margin: '6px 0 0', letterSpacing: '-0.02em' };

  return (
    <div>
      <div style={{ position: 'relative', overflow: 'hidden', background: 'radial-gradient(circle at 85% 15%, #ff9a4d 0%, rgba(255,154,77,0) 55%), linear-gradient(135deg,#ea6a1f 0%,#c14f0a 100%)', color: '#fff', borderRadius: 22, padding: '26px 28px', boxShadow: '0 14px 34px rgba(234,106,31,0.28)' }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }} />
        <div style={{ position: 'absolute', right: 70, bottom: -50, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <h1 style={{ margin: 0, fontSize: 'clamp(23px,5vw,30px)', color: '#fff' }}>{greeting()}, {name} 👋</h1>
        <p style={{ margin: '6px 0 0', fontSize: 15, opacity: 0.95, maxWidth: 560 }}>Here's your household money overview. We'll help you understand each bill and negotiate a better deal — you always stay in control.</p>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', margin: '18px 0 26px' }}>
        <div style={{ ...statBase, background: 'linear-gradient(135deg,#22c39f,#0f6f5c)', boxShadow: '0 10px 26px rgba(31,157,139,0.28)' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize: 13.5, fontWeight: 700, opacity: 0.95 }}>📄 Bills analysed</span>
          <p style={statNum}>{analysed.length}</p>
        </div>
        <div style={{ ...statBase, background: 'linear-gradient(135deg,#ff8a3d,#c14f0a)', boxShadow: '0 10px 26px rgba(234,106,31,0.28)' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
          <span style={{ fontSize: 13.5, fontWeight: 700, opacity: 0.95 }}>💸 Estimated yearly spend</span>
          <p style={statNum}>${annualTotal.toLocaleString('en-AU')}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 10, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Your bills</h2>
        <a href="/upload" className="bs-link" style={{ background: 'linear-gradient(135deg,#ea6a1f,#c14f0a)', color: '#fff', padding: '10px 22px', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 12px rgba(234,106,31,0.3)' }}>+ Upload a bill</a>
      </div>

      {rows.length === 0 && (
        <div style={{ background: 'linear-gradient(135deg,#fff,#fdeede)', border: '2px dashed #ea6a1f', borderRadius: 18, padding: 40, textAlign: 'center', boxShadow: '0 4px 18px rgba(234,106,31,0.10)' }}>
          <div style={{ fontSize: 46, marginBottom: 6 }}>📥</div>
          <p style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px' }}>Let's find you some savings</p>
          <p style={{ color: '#6e6058', margin: '0 0 16px' }}>Upload your first bill and we'll show you how to negotiate a better deal. Your first analysis is free.</p>
          <a href="/upload" className="bs-link" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#ea6a1f,#c14f0a)', color: '#fff', padding: '12px 26px', borderRadius: 999, textDecoration: 'none', fontWeight: 700, boxShadow: '0 4px 12px rgba(234,106,31,0.3)' }}>Upload your first bill</a>
        </div>
      )}

      {GROUPS.map((g) => {
        const items = rows.filter((b) => g.cats.includes(b.category));
        if (items.length === 0) return null;
        return (
          <div key={g.title} style={{ marginBottom: 24 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5, margin: '4px 0 10px', background: g.color, padding: '6px 14px', borderRadius: 999, boxShadow: `0 4px 12px ${g.color}55` }}>{g.title}</div>
            {items.map((b) => {
              const est = b.analysis ? b.analysis.annual_estimate : null;
              return (
                <div key={b.id} className="bs-card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: '#fff', border: '1px solid #f0e7dc', borderLeft: `5px solid ${g.color}`, borderRadius: 14, marginBottom: 10, boxShadow: '0 2px 10px rgba(36,26,18,0.05)' }}>
                  <a className="bs-link" href={b.analysis ? `/report/${b.analysis.id}` : '/upload'} style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, textDecoration: 'none', color: '#241a12' }}>
                    <span style={{ fontSize: 26, width: 48, height: 48, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: `${g.color}18`, borderRadius: 13 }}>{ICONS[b.category] || ICONS.other}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15.5 }}>{b.provider_name || b.category.replace('_', ' ')}</div>
                      <div style={{ fontSize: 13, color: '#6e6058', textTransform: 'capitalize' }}>{b.category.replace('_', ' ')}{b.due_date ? ` · due ${b.due_date}` : ''}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800 }}>{b.amount_due ? `$${Number(b.amount_due).toFixed(2)}` : ''}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: b.analysis ? '#1f9d8b' : '#c98a00' }}>{b.analysis ? (est ? `~$${Number(est).toFixed(0)}/yr →` : 'View report →') : 'Re-upload to analyse'}</div>
                    </div>
                  </a>
                  <form action={deleteBill} style={{ margin: 0 }}>
                    <input type="hidden" name="id" value={b.id} />
                    <button type="submit" title="Delete this bill" style={{ background: 'none', border: '1px solid #f0e7dc', borderRadius: 10, color: '#c0392b', cursor: 'pointer', padding: '8px 11px', fontSize: 14 }}>🗑️</button>
                  </form>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
