export const metadata = { title: 'BillSavvy AI', description: 'AI-powered bill analysis and household expense insights' };
const DISCLAIMER = 'AI-generated information is provided for general informational purposes only and does not constitute financial, credit, mortgage, insurance, legal, or professional advice. Savings estimates are not guaranteed. Customers should make their own decisions.';
export default function RootLayout({ children }) {
  return (
    <html lang="en-AU">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, background: '#fdfaf7', color: '#241a12' }}>
        <header style={{ padding: '14px 24px', borderBottom: '1px solid #eadfd5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/dashboard" style={{ fontWeight: 800, fontSize: 20, color: '#ea6a1f', textDecoration: 'none' }}>BillSavvy AI</a>
          <a href="/upload" style={{ background: '#ea6a1f', color: '#fff', padding: '8px 18px', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>Upload a bill</a>
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
