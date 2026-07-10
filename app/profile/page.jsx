import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '../../lib/supabase/server';

export const dynamic = 'force-dynamic';

const FUEL_TYPES = [
  { v: 'U91', t: 'Unleaded 91' },
  { v: 'E10', t: 'E10' },
  { v: 'P95', t: 'Premium 95' },
  { v: 'P98', t: 'Premium 98' },
  { v: 'DL', t: 'Diesel' },
  { v: 'LPG', t: 'LPG' },
];

function stateFromPostcode(pc) {
  const n = parseInt(pc, 10);
  if (!n) return null;
  if ((n >= 2600 && n <= 2618) || (n >= 2900 && n <= 2920) || (n >= 200 && n <= 299)) return 'ACT';
  if ((n >= 2000 && n <= 2599) || (n >= 2619 && n <= 2899) || (n >= 2921 && n <= 2999)) return 'NSW';
  if ((n >= 3000 && n <= 3999) || (n >= 8000 && n <= 8999)) return 'VIC';
  if ((n >= 4000 && n <= 4999) || (n >= 9000 && n <= 9999)) return 'QLD';
  if (n >= 5000 && n <= 5999) return 'SA';
  if (n >= 6000 && n <= 6999) return 'WA';
  if (n >= 7000 && n <= 7999) return 'TAS';
  if (n >= 800 && n <= 999) return 'NT';
  return null;
}

async function save(formData) {
  'use server';
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const first = (formData.get('first_name') || '').toString().trim();
  const postcode = (formData.get('postcode') || '').toString().trim();
  await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email,
    first_name: first,
    last_name: (formData.get('last_name') || '').toString().trim(),
    phone: (formData.get('phone') || '').toString().trim(),
    full_name: first,
    postcode,
    fuel_type: (formData.get('fuel_type') || 'U91').toString(),
    fuel_alerts: formData.get('fuel_alerts') === 'on',
    fuel_alert_state: stateFromPostcode(postcode),
  });
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export default async function Profile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: p } = await supabase.from('profiles').select('first_name, last_name, phone, postcode, fuel_type, fuel_alerts').maybeSingle();

  const input = { padding: '11px 14px', borderRadius: 12, border: '2px solid #e3d9cd', fontSize: 15, width: '100%', boxSizing: 'border-box', marginBottom: 14, background: '#fffdfb' };
  const label = { display: 'block', fontSize: 13, fontWeight: 700, color: '#4a3f36', margin: '0 0 6px' };
  const card = { background: '#fff', border: '1px solid #f0e7dc', borderRadius: 18, padding: 22, marginBottom: 16, boxShadow: '0 4px 18px rgba(36,26,18,0.06)' };

  return (
    <div style={{ maxWidth: 480, margin: '10px auto' }}>
      <h1 style={{ marginBottom: 4, fontSize: 'clamp(24px,5vw,30px)' }}>Your details</h1>
      <p style={{ color: '#6e6058', marginTop: 0 }}>This is the name we'll greet you with, and where your fuel alerts are set. Update any time.</p>

      <form action={save}>
        <div style={card}>
          <label style={label}>First name</label>
          <input name="first_name" type="text" required defaultValue={p?.first_name || ''} placeholder="e.g. Mihir" style={input} />
          <label style={label}>Last name</label>
          <input name="last_name" type="text" defaultValue={p?.last_name || ''} placeholder="Last name" style={input} />
          <label style={label}>Phone number (for SMS alerts)</label>
          <input name="phone" type="tel" defaultValue={p?.phone || ''} placeholder="04xx xxx xxx" style={input} />
          <label style={label}>Email</label>
          <input type="email" value={user.email} disabled style={{ ...input, background: '#f6f1ea', color: '#8a7d70' }} />
        </div>

        <div style={{ ...card, borderColor: '#1f9d8b', background: 'linear-gradient(160deg,#fff 60%,#e9f8f3 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>⛽</span>
            <h2 style={{ margin: 0, fontSize: 18 }}>Weekly fuel alerts</h2>
          </div>
          <p style={{ fontSize: 13.5, color: '#4a6b64', marginTop: 0 }}>Get the cheapest fuel near you texted once a week. Free government price data.</p>
          <label style={label}>Postcode</label>
          <input name="postcode" type="text" inputMode="numeric" maxLength={4} defaultValue={p?.postcode || ''} placeholder="e.g. 6000" style={input} />
          <label style={label}>Preferred fuel</label>
          <select name="fuel_type" defaultValue={p?.fuel_type || 'U91'} style={input}>
            {FUEL_TYPES.map((f) => <option key={f.v} value={f.v}>{f.t}</option>)}
          </select>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#4a3f36', cursor: 'pointer', marginTop: 4 }}>
            <input name="fuel_alerts" type="checkbox" defaultChecked={p?.fuel_alerts || false} style={{ marginTop: 3, width: 17, height: 17, accentColor: '#1f9d8b', flexShrink: 0 }} />
            <span>Yes, text me the cheapest fuel near my postcode once a week. I can reply STOP anytime to opt out.</span>
          </label>
        </div>

        <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg,#ea6a1f,#c14f0a)', color: '#fff', border: 0, padding: '13px', borderRadius: 999, fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 6px 16px rgba(234,106,31,0.3)' }}>Save my details</button>
      </form>

      <p style={{ marginTop: 16 }}><a href="/dashboard" style={{ color: '#ea6a1f', fontWeight: 700 }}>← Back to dashboard</a></p>
    </div>
  );
}
