import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

// WA FuelWatch product codes for each fuel type.
const FUEL_PRODUCT = { U91: 1, E10: 12, P95: 2, P98: 6, DL: 4, LPG: 5 };

function auMobile(p) {
  let s = (p || '').replace(/[^0-9]/g, '');
  if (s.startsWith('0')) s = '61' + s.slice(1);
  else if (s.length === 9) s = '61' + s;
  if (!s.startsWith('61')) return null;
  return '+' + s;
}

async function getCheapestFuel(suburb, fuelType) {
  if (!suburb) return null;
  const product = FUEL_PRODUCT[fuelType] || 1;
  const url = 'https://www.fuelwatch.wa.gov.au/fuelwatch/fuelWatchRSS?Product=' + product +
    '&Suburb=' + encodeURIComponent(suburb.trim()) + '&Surrounding=yes';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'BillSavvy/1.0', Accept: 'application/rss+xml, application/xml, text/xml' } });
    if (!res.ok) return null;
    const xml = await res.text();
    const item = xml.split('<item>')[1];
    if (!item) return null;
    const grab = (tag) => {
      const m = item.match(new RegExp('<' + tag + '>([\\s\\S]*?)<\\/' + tag + '>', 'i'));
      return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '';
    };
    const title = grab('title');
    const price = grab('price') || (title.match(/[\d.]+/) || [''])[0];
    const station = grab('trading-name') || grab('brand') || title.replace(/^[\d.]+[:\s-]*/, '') || 'a nearby station';
    const address = grab('address') || grab('location') || '';
    if (!price) return null;
    return { price, station, address };
  } catch { return null; }
}

async function sendSms(to, bodyRaw) {
  const num = auMobile(to);
  if (!num) return false;

  const mmUser = process.env.MOBILEMESSAGE_USERNAME;
  const mmPass = process.env.MOBILEMESSAGE_PASSWORD;
  const mmSender = process.env.MOBILEMESSAGE_SENDER;
  if (mmUser && mmPass && mmSender) {
    try {
      const auth = Buffer.from(mmUser + ':' + mmPass).toString('base64');
      const res = await fetch('https://api.mobilemessage.com.au/v1/messages', {
        method: 'POST',
        headers: { Authorization: 'Basic ' + auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ to: num, message: bodyRaw, sender: mmSender }] }),
      });
      return res.ok;
    } catch { return false; }
  }

  const body = bodyRaw.replace('{optout}', 'Reply STOP to opt out.');

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const tfrom = process.env.TWILIO_FROM;
  if (sid && token && tfrom) {
    try {
      const auth = Buffer.from(sid + ':' + token).toString('base64');
      const res = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + sid + '/Messages.json', {
        method: 'POST',
        headers: { Authorization: 'Basic ' + auth, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ To: num, From: tfrom, Body: body }).toString(),
      });
      return res.ok;
    } catch { return false; }
  }

  const cu = process.env.CLICKSEND_USERNAME;
  const ck = process.env.CLICKSEND_API_KEY;
  if (cu && ck) {
    try {
      const auth = Buffer.from(cu + ':' + ck).toString('base64');
      const res = await fetch('https://rest.clicksend.com/v3/sms/send', {
        method: 'POST',
        headers: { Authorization: 'Basic ' + auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ from: 'BillSavvy', to: num, body }] }),
      });
      return res.ok;
    } catch { return false; }
  }
  return false;
}

async function run() {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
  const { data: users } = await admin
    .from('profiles')
    .select('phone, suburb, fuel_type, first_name')
    .eq('fuel_alerts', true);

  let sent = 0, skipped = 0;
  for (const u of (users || [])) {
    if (!u.phone || !u.suburb) { skipped++; continue; }
    const cheapest = await getCheapestFuel(u.suburb, u.fuel_type || 'U91');
    if (!cheapest) { skipped++; continue; }
    const hi = u.first_name ? u.first_name + ', ' : '';
    const body = 'BillSavvy: Hi ' + hi + 'cheapest ' + (u.fuel_type || 'U91') + ' near ' + u.suburb + ' is ' + cheapest.price + 'c at ' + cheapest.station + (cheapest.address ? ', ' + cheapest.address : '') + '. {optout}';
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
