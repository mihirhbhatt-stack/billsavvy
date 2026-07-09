import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import DownloadButton from '../../components/DownloadButton';
import ReportChat from '../../components/ReportChat';

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
  savings_account: { name: 'Nova', emoji: '💰', role: 'your savings analyst' },
  term_deposit: { name: 'Terra', emoji: '🔒', role: 'your term-deposit analyst' },
  streaming: { name: 'Reel', emoji: '📺', role: 'your streaming analyst' },
  software: { name: 'Byte', emoji: '💻', role: 'your software analyst' },
  membership: { name: 'Max', emoji: '🎟️', role: 'your membership analyst' },
  other: { name: 'Savvy', emoji: '📄', role: 'your bill analyst' },
};

// Major AU provider main lines. Numbers can change — always confirm against your bill.
const PROVIDER_PHONES = {
  'agl': '131 245', 'origin': '13 24 61', 'energyaustralia': '133 466', 'energy australia': '133 466',
  'red energy': '131 806', 'alinta': '13 37 02', 'simply energy': '13 88 08', 'momentum': '1300 662 778',
  'telstra': '13 22 00', 'optus': '133 937', 'vodafone': '1300 650 410', 'tpg': '13 14 23',
  'iinet': '13 22 58', 'aussie broadband': '1300 880 905', 'belong': '1300 235 664', 'dodo': '13 36 36',
  'commonwealth': '13 2221', 'commbank': '13 2221', 'westpac': '13 20 32', 'nab': '13 22 65',
  'anz': '13 13 14', 'ing': '133 464', 'bankwest': '13 17 18', 'macquarie': '13 62 27', 'st.george': '13 33 30', 'st george': '13 33 30',
  'nrma': '132 132', 'aami': '13 22 44', 'budget direct': '1300 139 591', 'allianz': '13 1000',
  'gio': '13 10 10', 'racv': '13 72 28', 'racq': '13 19 05', 'youi': '13 95 68', 'suncorp': '13 11 55',
  'bupa': '134 135', 'medibank': '132 331', 'hcf': '13 13 34', 'nib': '13 14 63', 'ahm': '134 246',
};

const NEGOTIATION = {
  energy: { team: 'customer retention or loyalty team', opener: "Hi, my energy plan is up for review and I've seen better offers around. What's the best plan and discount you can offer me as an existing customer before I look at switching?" },
  telco: { team: 'cancellations or retention team', opener: "Hi, I'm thinking about moving to another provider. Before I do, what's the best deal you can offer to keep me?" },
  mortgage: { team: 'home-loan pricing or "customer care" retention team', opener: "Hi, I've been reviewing my home loan and I've seen lower rates advertised elsewhere. Before I look at refinancing, what's the best rate you can offer to keep me as a customer?" },
  loan: { team: 'hardship or retention team', opener: "Hi, I'm reviewing my repayments and costs. Are there any lower-rate options or fee waivers available to me as an existing customer?" },
  insurance: { team: 'retention or loyalty team', opener: "Hi, my premium has gone up and I've received cheaper quotes elsewhere. Can you review my policy and let me know the best price you can do to keep me?" },
  health: { team: 'retention team', opener: "Hi, I'm reviewing my cover and cost. Are there any current offers, or a plan that better matches what I actually use, before I compare other funds?" },
  deposit: { team: 'customer care / savings team', opener: "Hi, I've noticed higher savings rates available elsewhere. Can you match or improve the rate on my account so I don't have to move my money?" },
  other: { team: 'retention or customer care team', opener: "Hi, I'm reviewing this account and I've seen better offers. What's the best you can do to keep me as a customer?" },
};

function negFor(cat) {
  if (['electricity', 'gas', 'water', 'solar', 'ev_charging'].includes(cat)) return NEGOTIATION.energy;
  if (['internet', 'mobile', 'phone'].includes(cat)) return NEGOTIATION.telco;
  if (cat === 'mortgage') return NEGOTIATION.mortgage;
  if (['personal_loan', 'credit_card'].includes(cat)) return NEGOTIATION.loan;
  if (['home_insurance', 'car_insurance', 'landlord_insurance'].includes(cat)) return NEGOTIATION.insurance;
  if (cat === 'health_insurance') return NEGOTIATION.health;
  if (['savings_account', 'term_deposit'].includes(cat)) return NEGOTIATION.deposit;
  return NEGOTIATION.other;
}

function phoneFor(provider) {
  if (!provider) return null;
  const p = provider.toLowerCase();
  for (const key of Object.keys(PROVIDER_PHONES)) {
    if (p.includes(key)) return PROVIDER_PHONES[key];
  }
  return null;
}

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
  const isDeposit = ['savings_account', 'term_deposit'].includes(bill?.category);
  const neg = negFor(bill?.category);
  const phone = phoneFor(bill?.provider_name);

  const card = { background: '#fff', border: '1px solid #f0e7dc', borderRadius: 18, padding: 22, marginBottom: 16, boxShadow: '0 4px 18px rgba(36,26,18,0.06)' };
  const h3 = { margin: '0 0 10px', fontSize: 17 };

  return (
    <div>
      <style>{`@media print { .no-print { display: none !important; } a { text-decoration: none !important; color: #241a12 !important; } }`}</style>

      <div style={{ background: 'linear-gradient(135deg,#ea6a1f,#c14f0a)', color: '#fff', borderRadius: 20, padding: '24px 28px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 10px 30px rgba(234,106,31,0.28)' }}>
        <div style={{ fontSize: 44, width: 66, height: 66, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.16)', borderRadius: 18 }}>{bot.emoji}</div>
        <div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Hi, I'm {bot.name} — {bot.role}.</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{bill?.provider_name || 'Your bill'}</div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Here's what I found in your {bill?.category?.replace('_', ' ')} statement.</div>
        </div>
      </div>

      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <DownloadButton />
      </div>

      {bill?.confidence != null && bill.confidence < 0.7 && (
        <p style={{ background: '#fff6e5', border: '1px solid #f0c36d', borderRadius: 10, padding: 12, fontSize: 14 }}>
          A few details were hard to read — please double-check figures against your original statement.
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
        <div style={{ ...card, background: 'linear-gradient(135deg,#fff,#fdf6ef)', borderColor: '#ea6a1f' }}><h3 style={h3}>📅 Yearly estimate</h3>
          <p style={{ fontSize: 30, fontWeight: 800, margin: 0 }}>${Number(a.annual_estimate).toFixed(0)}<span style={{ fontSize: 14, fontWeight: 400, color: '#6e6058' }}> {isDeposit ? '/year interest or value, if typical' : '/year if this bill is typical'}</span></p>
        </div>
      )}

      {a.savings_opps?.length > 0 && (
        <div style={{ ...card, background: 'linear-gradient(135deg,#eafaf7,#d7f2ec)', borderColor: '#1f9d8b' }}>
          <h3 style={h3}>💰 {isDeposit ? 'Ways you might do better' : 'Potential savings opportunities'}</h3>
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

      <div style={{ ...card, borderColor: '#ea6a1f' }}>
        <h3 style={h3}>📞 Who to call &amp; what to say</h3>
        <div style={{ background: '#fdf6ef', borderRadius: 10, padding: 14, marginBottom: 12 }}>
          {phone
            ? <p style={{ margin: 0, fontSize: 15 }}><b>{bill?.provider_name}:</b> <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: '#c14f0a', fontWeight: 800 }}>{phone}</a></p>
            : <p style={{ margin: 0, fontSize: 15 }}>Call the number printed on your <b>{bill?.category?.replace('_', ' ')}</b> statement or in your online account.</p>}
          <p style={{ margin: '6px 0 0', fontSize: 12.5, color: '#6e6058' }}>Ask to speak with the <b>{neg.team}</b>. Numbers can change — please confirm against your latest bill.</p>
        </div>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>A professional way to open the conversation:</div>
        <p style={{ margin: '0 0 12px', background: '#f6f1ea', borderLeft: '3px solid #ea6a1f', padding: '10px 14px', borderRadius: 8, fontStyle: 'italic' }}>&ldquo;{neg.opener}&rdquo;</p>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Tips to get a better outcome:</div>
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
        <p style={{ fontSize: 12, color: '#6e6058', margin: '12px 0 0' }}>General information only — the decision is always yours.</p>
      </div>

      <div className="no-print">
        <ReportChat analysisId={a.id} botName={bot.name} botEmoji={bot.emoji} />
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
        {isDeposit && (
          <p style={{ margin: '0 0 8px' }}>This is not financial product advice and does not consider your personal objectives, financial situation or needs. BillSavvy AI does not hold an Australian Financial Services Licence and does not recommend any specific savings account or term deposit. Interest rates change frequently — always confirm current rates and terms with the provider and read the relevant Product Disclosure Statement or Target Market Determination before making any decision.</p>
        )}
        <p style={{ margin: 0 }}>Report generated by AI on {new Date(a.created_at).toLocaleDateString('en-AU')} · Policy version {a.disclaimer_version}. BillSavvy AI is not a financial adviser, mortgage broker, insurance adviser, credit provider or legal adviser.</p>
      </div>

      <a className="no-print" href="/dashboard" style={{ color: '#ea6a1f', fontWeight: 700 }}>← Back to dashboard</a>
    </div>
  );
}
