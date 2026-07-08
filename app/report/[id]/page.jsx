import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';

export const dynamic = 'force-dynamic';

const BOTS = {
  electricity: { name: 'Watt', emoji: '⚡', role: 'your electricity analyst' },
  gas: { name: 'Blaze', emoji: '🔥', role: 'your gas analyst' },
  water: { name: 'Aqua', emoji: '💧', role: 'your water analyst' },
  solar: { name: 'Sunny', emoji: '☀️', role: 'your solar analyst' },
  ev_charging: { name: 'Volt', emoji: '🔌', role: 'your EV-charging analyst' },
  internet: { name: 'Fiona', emoji: '🌐', role: 'your internet analyst' },
  mobile: { name: 'Cell', emoji: '📱', role: 'your mobile analyst' },
  phone: { name: 'Rin', emoji: '☎️', role: 'your phone analyst' },
  home_insurance: { name: 'Guard', emoji: '🏠', role: 'your home-insurance analyst' },
  car_insurance: { name: 'Dash', emoji: '🚗', role: 'your car-insurance analyst' },
  health_insurance: { name: 'Doc', emoji: '🏥', role: 'your health-cover analyst' },
  landlord_insurance: { name: 'Keys', emoji: '🔑', role: 'your landlord-insurance analyst' },
  mortgage: { name: 'Morgan', emoji: '🏦', role: 'your home-loan analyst' },
  personal_loan: { name: 'Penny', emoji: '💵', role: 'your loan analyst' },
  credit_card: { name: 'Chip', emoji: '💳', role: 'your credit-card analyst' },
  streaming: { name: 'Reel', emoji: '📺', role: 'your streaming analyst' },
  software: { name: 'Byte', emoji: '💻', role: 'your software analyst' },
  membership: { name: 'Max', emoji: '🎟️', role: 'your membership analyst' },
  other: { name: 'Savvy', emoji: '📄', role: 'your bill analyst' },
};

const ENERGY = { label: 'Energy Made Easy — the Government tool that compares every retailer, free', url: 'https://www.energymadeeasy.gov.au' };
const COMPARE = {
  electricity: ENERGY, gas: ENERGY, solar: ENERGY, ev_charging: ENERGY,
  water: { label: 'MoneySmart — tips on managing utility bills', url: 'https://moneysmart.gov.au/managing-debt' },
  internet: { label: 'MoneySmart — phone & internet costs', url: 'https://moneysmart.gov.au/managing-debt/phone-and-internet' },
  mobile: { label: 'MoneySmart — phone & internet costs', url: 'https://moneysmart.gov.au/managing-debt/phone-and-internet' },
  phone: { label: 'MoneySmart — phone & internet costs', url: 'https://moneysmart.gov.au/managing-debt/phone-and-internet' },
  home_insurance: { label: 'MoneySmart — how to save on insurance', url: 'https://moneysmart.gov.au/how-to-save-on-insurance' },
  car_insurance: { label: 'MoneySmart — car insurance', url: 'https://moneysmart.gov.au/how-to-save-on-insurance/car-insurance' },
  landlord_insurance: { label: 'MoneySmart — how to save on insurance', url: 'https://moneysmart.gov.au/how-to-save-on-insurance' },
  health_insurance: { label: 'privatehealth.gov.au — the Government tool that compares every health policy', url: 'https://www.privatehealth.gov.au' },
  mortgage: { label: 'MoneySmart — home loans & mortgage calculator', url: 'https://moneysmart.gov.au/home-loans' },
  personal_loan: { label: 'MoneySmart — personal loans', url: 'https://moneysmart.gov.au/personal-loans' },
  credit_card: { label: 'MoneySmart — credit cards', url: 'https://moneysmart.gov.au/credit-cards' },
};

const TIPS = [
  'Be polite but firm — mention you are reviewing your options and considering switching.',
  'Ask directly: "Is this the best rate/plan you can offer me?" then stay quiet and let them answer.',
  'Reference a specific lower price you have seen — providers often match to keep you.',
  'Ask about loyalty discounts, waived fees, or any current promotions for existing customers.',
  'If they say no, ask to speak to the retention or "cancellations" team — they have more room to offer deals.',
];

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
  const bot = BOTS[bill?.category] || BOTS.other;
  const compare = COMPARE[bill?.category];

  const card = { background: '#fff', border: '1px solid #eadfd5', borderRadius: 14, padding: 22, marginBottom: 16 };
  const h3 = { margin: '0 0 10px', fontSize: 17 };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg,#ea6a1f,#c14f0a)', color: '#fff', borderRadius: 16, padding: '22px 26px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 44 }}>{bot.emoji}</div>
        <div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Hi, I'm {bot.name} — {bot.role}.</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{bill?.provider_name || 'Your bill'}</div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Here's what I found in your {bill?.category?.replace('_', ' ')} bill.</div>
        </div>
      </div>

      {bill?.confidence != null && bill.confidence < 0.7 && (
        <p style={{ background: '#fff6e5', border: '1px solid #f0c36d', borderRadius: 10, padding: 12, fontSize: 14 }}>
          A few details were hard to read — please double-check figures against your original bill.
        </p>
      )}

      <div style={card}><h3 style={h3}>📋 Summary</h3><p style={{ margin: 0 }}>{a.summary}</p></div>

      <div style={card}><h3 style={h3}>💬 In plain English</h3><p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{a.explanation}</p></div>

      {a.cost_breakdown?.length > 0 && (
        <div style={card}><h3 style={h3}>🧾 Where your money goes</h3>
          {a.cost_breakdown.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < a.cost_breakdown.length - 1 ? '1px solid #f5ede4' : 'none' }}>
              <span>{c.label}</span><b>${Number(c.amount).toFixed(2)}</b>
            </div>
          ))}
        </div>
      )}

      {a.annual_estimate && (
        <div style={{ ...card, background: '#fdf6ef', borderColor: '#ea6a1f' }}><h3 style={h3}>📅 Yearly estimate</h3>
          <p style={{ fontSize: 30, fontWeight: 800, margin: 0 }}>${Number(a.annual_estimate).toFixed(0)}<span style={{ fontSize: 14, fontWeight: 400, color: '#6e6058' }}> /year if this bill is typical</span></p>
        </div>
      )}

      {a.savings_opps?.length > 0 && (
        <div style={{ ...card, background: 'linear-gradient(135deg,#eafaf7,#d7f2ec)', borderColor: '#1f9d8b' }}>
          <h3 style={h3}>💰 Potential savings opportunities</h3>
          <p style={{ fontSize: 12, color: '#4a6b64', marginTop: 0 }}>General information only — not guaranteed, not a recommendation. You decide.</p>
          {a.savings_opps.map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 10, padding: 14, marginBottom: 10 }}>
              <b>{s.title}</b>
              {s.indicative_range_aud_per_year && <span style={{ color: '#1f9d8b', fontWeight: 700 }}> — potentially ${s.indicative_range_aud_per_year[0]}–${s.indicative_range_aud_per_year[1]}/yr</span>}
              <p style={{ margin: '4px 0 0', color: '#4a3f36' }}>{s.detail}</p>
            </div>
          ))}
        </div>
      )}

      {compare && (
        <div style={{ ...card, borderColor: '#1f9d8b' }}>
          <h3 style={h3}>🔍 Compare &amp; switch</h3>
          <p style={{ fontSize: 13, color: '#6e6058', marginTop: 0 }}>Want to check if there's a cheaper option? This free, independent resource compares providers with no commissions and no bias:</p>
          <a href={compare.url} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', background: '#1f9d8b', color: '#fff', padding: '11px 20px', borderRadius: 999, textDecoration: 'none', fontWeight: 700 }}>
            {compare.label} ↗
          </a>
          <p style={{ fontSize: 12, color: '#6e6058', marginTop: 12 }}>BillSavvy AI does not recommend any specific provider or product and does not receive commissions from these links. They are independent public resources. The decision is yours.</p>
        </div>
      )}

      <div style={{ ...card, borderColor: '#ea6a1f' }}>
        <h3 style={h3}>💪 How to negotiate a better deal</h3>
        <p style={{ fontSize: 13, color: '#6e6058', marginTop: 0 }}>General suggestions you may choose to use when you contact your provider. This is general information, not advice — the decision is yours.</p>
        <ul style={{ margin: '0 0 14px', paddingLeft: 20 }}>
          {TIPS.map((t, i) => <li key={i} style={{ marginBottom: 6 }}>{t}</li>)}
        </ul>
        {a.provider_questions?.length > 0 && (
          <>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Questions to ask them:</div>
            <ol style={{ margin: 0, paddingLeft: 20 }}>
              {a.provider_questions.map((q, i) => <li key={i} style={{ marginBottom: 6 }}>{q}</li>)}
            </ol>
          </>
        )}
      </div>

      <div style={{ background: '#faf7f3', border: '1px solid #e3d9cd', borderRadius: 12, padding: 18, marginBottom: 16, fontSize: 12.5, color: '#6e6058', lineHeight: 1.55 }}>
        <div style={{ fontWeight: 700, color: '#241a12', marginBottom: 6 }}>Important information</div>
        <p style={{ margin: '0 0 8px' }}>AI-generated information is provided for general informational purposes only and does not constitute financial, credit, mortgage, insurance, legal, or professional advice. Savings estimates are not guaranteed. Customers should make their own decisions.</p>
        {bill?.category === 'mortgage' && (
          <p style={{ margin: '0 0 8px' }}>This is not credit assistance or a recommendation to refinance or switch lenders. BillSavvy AI does not hold an Australian Credit Licence and is not a mortgage broker. Consider contacting your lender or a licensed mortgage broker or financial adviser.</p>
        )}
        {['home_insurance','car_insurance','health_insurance','landlord_insurance'].includes(bill?.category) && (
          <p style={{ margin: '0 0 8px' }}>This is not insurance advice and does not consider your personal objectives, financial situation or needs. BillSavvy AI does not hold an Australian Financial Services Licence. Read the relevant Product Disclosure Statement before making any decision.</p>
        )}
        <p style={{ margin: 0 }}>Report generated by AI on {new Date(a.created_at).toLocaleDateString('en-AU')} · Policy version {a.disclaimer_version}. BillSavvy AI is not a financial adviser, mortgage broker, insurance adviser, credit provider or legal adviser.</p>
      </div>

      <a href="/dashboard" style={{ color: '#ea6a1f', fontWeight: 700 }}>← Back to dashboard</a>
    </div>
  );
}
