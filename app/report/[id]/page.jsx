import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Report({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: a } = await supabase
    .from('bill_analysis')
    .select('*, bills(provider_name, category, amount_due, due_date, renewal_date, confidence)')
    .eq('id', id).single();
  if (!a) return <p>Report not found.</p>;
  const bill = a.bills;

  const card = { background: '#fff', border: '1px solid #eadfd5', borderRadius: 12, padding: 20, marginBottom: 16 };
  return (
    <div>
      <h1>{bill?.provider_name || 'Your bill'} - AI report</h1>
      {bill?.confidence != null && bill.confidence < 0.7 && (
        <p style={{ background: '#fff6e5', border: '1px solid #f0c36d', borderRadius: 8, padding: 10, fontSize: 14 }}>
          Some details were hard to read - please double-check figures against your original bill.
        </p>
      )}
      <div style={card}><h3>Summary</h3><p>{a.summary}</p></div>
      <div style={card}><h3>Plain-English explanation</h3><p style={{ whiteSpace: 'pre-wrap' }}>{a.explanation}</p></div>
      {a.cost_breakdown?.length > 0 && (
        <div style={card}><h3>Cost breakdown</h3>
          {a.cost_breakdown.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f5ede4' }}>
              <span>{c.label}</span><b>${Number(c.amount).toFixed(2)}</b>
            </div>
          ))}
        </div>
      )}
      {a.annual_estimate && (
        <div style={card}><h3>Yearly estimate</h3>
          <p style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>${Number(a.annual_estimate).toFixed(0)}<span style={{ fontSize: 14, fontWeight: 400, color: '#6e6058' }}> /year if this bill is typical</span></p>
        </div>
      )}
      {a.savings_opps?.length > 0 && (
        <div style={{ ...card, borderColor: '#1f9d8b' }}>
          <h3>Potential savings opportunities</h3>
          <p style={{ fontSize: 12, color: '#6e6058' }}>General information only - not guaranteed, not a recommendation.</p>
          {a.savings_opps.map((s, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <b>{s.title}</b>
              {s.indicative_range_aud_per_year && <span style={{ color: '#1f9d8b', fontWeight: 700 }}> - potentially ${s.indicative_range_aud_per_year[0]}-${s.indicative_range_aud_per_year[1]}/yr</span>}
              <p style={{ margin: '4px 0', color: '#4a3f36' }}>{s.detail}</p>
            </div>
          ))}
        </div>
      )}
      {a.provider_questions?.length > 0 && (
        <div style={card}><h3>Questions you can ask your provider</h3>
          <ol>{a.provider_questions.map((q, i) => <li key={i} style={{ marginBottom: 6 }}>{q}</li>)}</ol>
        </div>
      )}
      <a href="/dashboard" style={{ color: '#ea6a1f', fontWeight: 700 }}>Back to dashboard</a>
    </div>
  );
}
