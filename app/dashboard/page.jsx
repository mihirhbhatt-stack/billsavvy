import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '../../lib/supabase/server';

export const dynamic = 'force-dynamic';

const ICONS = {
  electricity: '⚡', gas: '🔥', water: '💧', solar: '☀️', ev_charging: '🔌',
  internet: '🌐', mobile: '📱', phone: '☎️',
  home_insurance: '🏠', car_insurance: '🚗', health_insurance: '🏥', landlord_insurance: '🔑',
  mortgage: '🏦', personal_loan: '💵', credit_card: '💳',
  streaming: '📺', software: '💻', membership: '🎟️', other: '📄',
};

const GROUPS = [
  { title: 'Finance', cats: ['mortgage', 'personal_loan', 'credit_card'] },
  { title: 'General insurance', cats: ['home_insurance', 'car_insurance', 'landlord_insurance'] },
  { title: 'Health insurance', cats: ['health_insurance'] },
  { title: 'Energy & utilities', cats: ['electricity', 'gas', 'water', 'solar', 'ev_charging'] },
  { title: 'Mobile & internet', cats: ['internet', 'mobile', 'phone'] },
  { title: 'Subscriptions', cats: ['streaming', 'software', 'membership'] },
  { title: 'Other', cats: ['other'] },
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

  const stat = { flex: 1, minWidth: 160, background: '#fff', border: '1px solid #eadfd5', borderRadius: 14, padding: '18px 20px' };
  const statNum = { fontSize: 26, fontWeight: 800, margin: '4px 0 0' };

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>{greeting()}, {name} 👋</h1>
      <p style={{ color: '#6e6058', marginTop: 0 }}>Here is your household expense overview.</p>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', margin: '18px 0 28px' }}>
        <div style={stat}><span style={{ fontSize: 13, color: '#6e6058' }}>Bills analysed</span><p style={statNum}>{analysed.length}</p></div>
        <div style={stat}><span style={{ fontSize: 13, color: '#6e6058' }}>Estimated yearly spend</span><p style={statNum}>${annualTotal.toFixed(0)}</p></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Your bills</h2>
        <a href="/upload" style={{ background: '#ea6a1f', color: '#fff', padding: '9px 20px', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>+ Upload a bill</a>
      </div>

      {rows.length === 0 && (
        <div style={{ background: '#fdeede', border: '2px dashed #ea6a1f', borderRadius: 14, padding: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 17, fontWeight: 700 }}>No bills yet - your first analysis is free.</p>
          <a href="/upload" style={{ background: '#ea6a1f', color: '#fff', padding: '10px 22px', borderRadius: 999, textDecoration: 'none', fontWeight: 700 }}>Upload your first bill</a>
        </div>
      )}

      {GROUPS.map((g) => {
        const items = rows.filter((b) => g.cats.includes(b.category));
        if (items.length === 0) return null;
        return (
          <div key={g.title} style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#6e6058', textTransform: 'uppercase', letterSpacing: 0.5, margin: '4px 0 8px' }}>{g.title}</div>
            {items.map((b) => {
              const est = b.analysis ? b.analysis.annual_estimate : null;
              return (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#fff', border: '1px solid #eadfd5', borderRadius: 12, marginBottom: 10 }}>
                  <a href={b.analysis ? `/report/${b.analysis.id}` : '/upload'} style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, textDecoration: 'none', color: '#241a12' }}>
                    <span style={{ fontSize: 26 }}>{ICONS[b.category] || ICONS.other}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{b.provider_name || b.category.replace('_', ' ')}</div>
                      <div style={{ fontSize: 13, color: '#6e6058', textTransform: 'capitalize' }}>{b.category.replace('_', ' ')}{b.due_date ? ` · due ${b.due_date}` : ''}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700 }}>{b.amount_due ? `$${Number(b.amount_due).toFixed(2)}` : ''}</div>
                      <div style={{ fontSize: 12, color: b.analysis ? '#1f9d8b' : '#c98a00' }}>{b.analysis ? (est ? `~$${Number(est).toFixed(0)}/yr →` : 'View report →') : 'Re-upload to analyse'}</div>
                    </div>
                  </a>
                  <form action={deleteBill}>
                    <input type="hidden" name="id" value={b.id} />
                    <button type="submit" title="Delete this bill" style={{ background: 'none', border: '1px solid #eadfd5', borderRadius: 8, color: '#c0392b', cursor: 'pointer', padding: '6px 10px', fontSize: 14 }}>🗑️</button>
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
