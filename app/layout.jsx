import { createClient } from '../lib/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'BillSavvy AI — Understand your bills, negotiate a better deal',
  description: 'BillSavvy AI reads your household bills and shows you how to negotiate and save with your current provider. Not a comparison site. No personal advice — you stay in control.',
};

async function signOut() {
  'use server';
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

const GLOBAL_CSS = `
  :root { --brand:#ea6a1f; --brand-deep:#c14f0a; --teal:#1f9d8b; --ink:#241a12; }
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; }
  body {
    font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
    color:var(--ink);
    background:
      radial-gradient(1100px 480px at 100% -8%, #ffe6d0 0%, rgba(255,230,208,0) 60%),
      radial-gradient(900px 460px at -10% -5%, #dff5ef 0%, rgba(223,245,239,0) 55%),
      #fdfaf7;
    background-attachment: fixed;
    -webkit-font-smoothing: antialiased;
  }
  h1 { font-weight:800; letter-spacing:-0.02em; }
  h2, h3 { font-weight:800; letter-spacing:-0.01em; }
  a { transition: all .15s ease; }
  button { font-family: inherit; transition: transform .08s ease, box-shadow .15s ease, filter .15s ease; }
  button:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.03); }
  .bs-link:hover { transform: translateY(-1px); }
  input:focus, textarea:focus { outline: none; border-color: var(--brand) !important; box-shadow: 0 0 0 3px rgba(234,106,31,0.15); }
  @media print { .no-print { display:none !important; } body { background:#fff !important; } }
`;

const pill = { padding:'9px 18px', borderRadius:999, textDecoration:'none', fontWeight:700, fontSize:14 };
const badge = { fontSize:12.5, fontWeight:700, color:'#4a3f36', background:'#fff', border:'1px solid #efe3d6', borderRadius:999, padding:'7px 14px', boxShadow:'0 1px 4px rgba(36,26,18,0.05)' };

export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <html lang="en-AU">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      </head>
      <body>
        <header style={{ position:'sticky', top:0, zIndex:50, backdropFilter:'saturate(180%) blur(8px)', WebkitBackdropFilter:'saturate(180%) blur(8px)', background:'rgba(255,253,251,0.82)', borderBottom:'1px solid #efe3d6', padding:'12px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <a href={user ? '/dashboard' : '/'} style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
            <span style={{ display:'inline-flex', width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#ea6a1f,#c14f0a)', color:'#fff', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:18, boxShadow:'0 4px 12px rgba(234,106,31,0.35)' }}>B</span>
            <span style={{ fontWeight:800, fontSize:20, color:'var(--ink)' }}>BillSavvy<span style={{ color:'var(--brand)' }}> AI</span></span>
          </a>
          {user && (
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <a href="/upload" className="bs-link" style={{ ...pill, background:'linear-gradient(135deg,#ea6a1f,#c14f0a)', color:'#fff', boxShadow:'0 4px 12px rgba(234,106,31,0.3)' }}>+ Upload a bill</a>
              <a href="/profile" className="bs-link" style={{ ...pill, background:'#fff', border:'1px solid #e3d9cd', color:'#6e6058' }}>My details</a>
              <form action={signOut} style={{ margin:0 }}>
                <button type="submit" style={{ ...pill, background:'#fff', border:'1px solid #e3d9cd', color:'#6e6058', cursor:'pointer' }}>Sign out</button>
              </form>
            </div>
          )}
        </header>
        <main style={{ maxWidth:900, margin:'0 auto', padding:'28px 24px 12px' }}>{children}</main>
        <footer style={{ maxWidth:900, margin:'28px auto 30px', padding:'22px 24px', borderTop:'1px solid #efe3d6' }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:14 }}>
            <span style={badge}>✅ We help you negotiate &amp; save</span>
            <span style={badge}>🚫 Not a comparison site</span>
            <span style={badge}>🧭 No personal advice — you stay in control</span>
          </div>
          <p style={{ fontSize:12, color:'#6e6058', lineHeight:1.55, margin:0 }}>
            BillSavvy AI reads your household bills and shows you how to understand them and negotiate a better deal with your existing provider. We are not a comparison or switching service, and we do not provide personal financial, credit, insurance or legal advice. AI-generated information is general only and savings are not guaranteed — you make your own decisions.
          </p>
          <p style={{ fontSize:12, color:'#8a7d70', margin:'10px 0 0' }}>Operated by RANDAL SARKAR PTY LTD (ACN 683 867 996) trading as BillSavvy AI · © {new Date().getFullYear()}</p>
        </footer>
      </body>
    </html>
  );
}
