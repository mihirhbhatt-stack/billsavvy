import { redirect } from 'next/navigation';
import { createClient } from '../../lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: bills } = await supabase
    .from('bills')
    .select('id, category, provider_name, amount_due, due_date, created_at, bill_analysis(id)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1>Your bills</h1>
      {(!bills || bills.length === 0) && (
        <div style={{ background: '#fdeede', border: '2px dashed #ea6a1f', borderRadius: 14, padding: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 17, fontWeight: 700 }}>No bills yet - your first analysis is free.</p>
          <a href="/upload" style={{ background: '#ea6a1f', color: '#fff', padding: '10px 22px', borderRadius: 999, textDecoration: 'none', fontWeight: 700 }}>Upload your first bill</a>
        </div>
      )}
      {bills?.map((b) => (
        <a key={b.id} href={b.bill_analysis?.length ? `/report/${b.bill_analysis[0].id}` : '#'}
          style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', background: '#fff', border: '1px solid #eadfd5', borderRadius: 12, marginBottom: 10, textDecoration: 'none', color: '#241a12' }}>
          <span style={{ fontWeight: 700 }}>{b.provider_name || b.category}</span>
          <span>{b.amount_due ? `$${Number(b.amount_due).toFixed(2)}` : ''} {b.due_date ? `· due ${b.due_date}` : ''}</span>
        </a>
      ))}
    </div>
  );
}
