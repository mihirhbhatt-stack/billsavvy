import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// Normalise an Australian mobile to +61 E.164 form for SMS.
function auMobile(p) {
  let s = (p || '').replace(/[^0-9]/g, '');
  if (s.startsWith('0')) s = '61' + s.slice(1);
  else if (s.length === 9) s = '61' + s;
  if (!s.startsWith('61')) return null;
  return '+' + s;
}

// Look up the cheapest station near a postcode for a fuel type via a national fuel-price API.
// Configure FUEL_API_URL + FUEL_API_KEY in your environment (e.g. FuelPrice.io / CheckPetrol).
async function getCheapestFuel(postcode, fuelType) {
  const base = process.env.FUEL_API_URL;
  const key = process.env.FUEL_API_KEY;
  if (!base || !key || !postcode) return null;
  try {
    const url = base + (base.includes('?') ? '&' : '?') + 'postcode=' + encodeURIComponent(postcode) + '&fueltype=' + encodeURIComponent(fuelType);
    const res = await fetch(url, { headers: { Authorization: 'Bearer ' + key, Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.stations || data.prices || data.results || data.data || []);
    const norm = (list || []).map((s) => ({
      price: Number(s.price ?? s.Price ?? s.amount ?? s.value),
      station: s.station || s.name || s.Name || s.brand || 'a nearby station',
      address: s.address || s.Address || s.location || s.suburb || '',
    })).filter((s) => s.price > 0);
    if (!norm.length) return null;
    norm.sort((a, b) => a.price - b.price);
    return norm[0];
  } catch { return null; }
}

// Send an SMS via ClickSend.
async function sendSms(to, body) {
  const user = process.env.CLICKSEND_USERNAME;
  const key = process.env.CLICKSEND_API_KEY;
  const num = auMobile(to);
  if (!user || !key || !num) return false;
  try {
    const auth = Buffer.from(user + ':' + key).toString('base64');
    const res = await fetch('https://rest.clicksend.com/v3/sms/send', {
      method: 'POST',
      headers: { Authorization: 'Basic ' + auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ from: 'BillSavvy', to: num, body }] }),
    });
    return res.ok;
  } catch { return false; }
}

async function run() {
  // Service-role client so the cron can read all opted-in users (bypasses row-level security). Server-only.
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
  const { data: users } = await admin
    .from('profiles')
    .select('phone, postcode, fuel_type, first_name')
    .eq('fuel_alerts', true);

  let sent = 0, skipped = 0;
  for (const u of (users || [])) {
    if (!u.phone || !u.postcode) { skipped++; continue; }
    const cheapest = await getCheapestFuel(u.postcode, u.fuel_type || 'U91');
    if (!cheapest) { skipped++; continue; }
    const hi = u.first_name ? u.first_name + ', ' : '';
    const body = 'BillSavvy: Hi ' + hi + 'cheapest ' + (u.fuel_type || 'U91') + ' near ' + u.postcode + ' is ' + cheapest.price + 'c at ' + cheapest.station + (cheapest.address ? ', ' + cheapest.address : '') + '. Reply STOP to opt out.';
    if (await sendSms(u.phone, body)) sent++; else skipped++;
  }
  return { total: (users || []).length, sent, skipped };
}

function authed(request) {
  const secret = new URL(request.url).searchParams.get('secret');
  return process.env.CRON_SECRET && secret === process.env.CRON_SECRET;
}

export async function GET(request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await run());
}

export async function POST(request) {
  if (!authed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await run());
}
