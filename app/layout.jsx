import { createClient } from '../lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
title: 'BillSavvy AI',
description: 'AI-powered bill analysis and household expense insights',
};

const DISCLAIMER = 'AI-generated information is provided for general informational purposes only and does not constitute financial, credit, mortgage, insurance, legal, or professional advice. Savings estimates are not guaranteed. Customers should make their own decisions.';

async function signOut() {
'use server';
const supabase = await createClient();
await supabase.auth.signOut();
redirect('/login');
}

export default async function RootLayout({ children }) {
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
return (
<html lang="en-AU">
<body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, background: '#fdfaf7', color: '#241a12' }}>
<header style={{ padding: '14px 24px', borderBottom: '1px solid #eadfd5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
<a href={user ? '/dashboard' : '/'} style={{ fontWeight: 800, fontSize: 20, color: '#ea6a1f', textDecoration: 'none' }}>
BillSavvy<span style={{ color: '#241a12' }}> AI</span>
</a>
{user && (
<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
<a href="/upload" style={{ background: '#ea6a1f', color: '#fff', padding: '8px 18px', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>Upload a bill</a>
<a href="/profile" style={{ background: 'none', border: '1px solid #d5c9be', color: '#6e6058', padding: '8px 16px', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>My details</a>
<form action={signOut}>
<button type="submit" style={{ background: 'none', border: '1px solid #d5c9be', color: '#6e6058', padding: '8px 16px', borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Sign out</button>
</form>
</div>
)}
</header>
<main style={{ maxWidth: 860, margin: '0 auto', padding: 24 }}>{children}</main>
<footer style={{ maxWidth: 860, margin: '40px auto 24px', padding: '16px 24px', fontSize: 12, color: '#6e6058', borderTop: '1px solid #eadfd5' }}>
{DISCLAIMER}
<div style={{ marginTop: 8 }}>Operated by RANDAL SARKAR PTY LTD (ACN 683 867 996) trading as BillSavvy AI</div>
</footer>
</body>
</html>
);
}
