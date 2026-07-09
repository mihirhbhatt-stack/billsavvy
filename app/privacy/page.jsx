export const metadata = { title: 'Privacy Policy — BillSavvy AI' };

const card = { background: '#fff', border: '1px solid #f0e7dc', borderRadius: 18, padding: 'clamp(22px,4vw,34px)', boxShadow: '0 4px 18px rgba(36,26,18,0.06)', lineHeight: 1.6, color: '#3a322b' };
const h2 = { fontSize: 19, margin: '22px 0 6px' };

export default function Privacy() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'clamp(26px,5vw,34px)', marginBottom: 6 }}>Privacy Policy</h1>
      <p style={{ color: '#6e6058', marginTop: 0 }}>Version 2026-07-10 · effective 9 July 2026</p>

      <div style={card}>
        <p>RANDAL SARKAR PTY LTD (ACN 683 867 996) as trustee for RANDAL SARKAR (ABN 15 682 866 008), trading as BillSavvy AI (&ldquo;we&rdquo;, &ldquo;us&rdquo;), operates the BillSavvy AI platform. This policy explains how we handle personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).</p>

        <h2 style={h2}>1. What we collect</h2>
        <p>Account information (name, email, phone, hashed password); documents you upload (bills and statements) and the information our AI extracts from them (provider, masked account numbers, amounts, usage, dates, rates); payment information (handled by our payment provider — we never store card details); technical information (IP address, device/browser, privacy-friendly usage analytics); and consent records (which policies you accepted, when).</p>

        <h2 style={h2}>2. Why we collect it (APP 3, APP 6)</h2>
        <p>Only to: analyse your bills and give you plain-English insights; operate features you enable; process any subscription; send service messages; meet legal obligations; and keep the platform secure. <strong>We do not use your documents to train AI models, and we never sell your personal information.</strong></p>

        <h2 style={h2}>3. Automated / AI processing (transparency)</h2>
        <p>Your documents are processed by artificial intelligence (Anthropic&rsquo;s Claude models) to read and explain your billing information. AI outputs are general information only, may contain errors, and should be checked against your original documents. No significant decision is made about you by automated means — the AI produces information for you to act on as you choose.</p>

        <h2 style={h2}>4. Overseas disclosure (APP 8)</h2>
        <p>We use trusted service providers to run the platform: Supabase (database and encrypted file storage), Anthropic (AI processing), Vercel (hosting) and Resend (email). <strong>Some of these providers process and store data outside Australia, including in the United States.</strong> By accepting this policy and choosing to upload a document, you consent to your information being processed overseas for these purposes. We take reasonable steps to ensure overseas recipients handle your information consistently with the APPs, and we use providers whose terms confirm your data is not used to train their AI models. We may also disclose information where required by law.</p>

        <h2 style={h2}>5. Security (APP 11)</h2>
        <p>Documents are held in private, access-controlled storage. Data is encrypted in transit (TLS) and at rest (AES-256). Row-level security means only you can access your own records by default. We maintain backups and restrict internal access.</p>

        <h2 style={h2}>6. Retention and deletion</h2>
        <p>You can delete individual documents or your whole account at any time from the app. Deleted documents and extracted data are purged from storage within 30 days. Consent and audit records are kept for 7 years for legal compliance; payment records are kept for 7 years for tax purposes.</p>

        <h2 style={h2}>7. Access and correction (APP 12, APP 13)</h2>
        <p>You may access or correct your personal information in the app or by emailing <a href="mailto:privacy@getbillsavvy.ai" style={{ color: '#ea6a1f', fontWeight: 700 }}>privacy@getbillsavvy.ai</a>. We respond within 30 days.</p>

        <h2 style={h2}>8. Data breaches</h2>
        <p>We comply with the Notifiable Data Breaches scheme (Part IIIC, Privacy Act 1988). If a breach is likely to result in serious harm, we will notify you and the Office of the Australian Information Commissioner (OAIC).</p>

        <h2 style={h2}>9. Complaints</h2>
        <p>Email <a href="mailto:privacy@getbillsavvy.ai" style={{ color: '#ea6a1f', fontWeight: 700 }}>privacy@getbillsavvy.ai</a> first; we respond within 30 days. You may also complain to the OAIC at <a href="https://www.oaic.gov.au" style={{ color: '#ea6a1f', fontWeight: 700 }}>oaic.gov.au</a> or 1300 363 992.</p>

        <h2 style={h2}>10. Changes</h2>
        <p>We will notify you of material changes and ask you to re-accept the updated policy on your next login.</p>
      </div>

      <p style={{ marginTop: 18 }}><a href="/dashboard" style={{ color: '#ea6a1f', fontWeight: 700 }}>← Back</a> · <a href="/terms" style={{ color: '#ea6a1f', fontWeight: 700 }}>Terms &amp; Conditions</a></p>
    </div>
  );
}
