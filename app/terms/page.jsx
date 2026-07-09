export const metadata = { title: 'Terms & Conditions — BillSavvy AI' };

const card = { background: '#fff', border: '1px solid #f0e7dc', borderRadius: 18, padding: 'clamp(22px,4vw,34px)', boxShadow: '0 4px 18px rgba(36,26,18,0.06)', lineHeight: 1.6, color: '#3a322b' };
const h2 = { fontSize: 19, margin: '22px 0 6px' };

export default function Terms() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'clamp(26px,5vw,34px)', marginBottom: 6 }}>Terms &amp; Conditions</h1>
      <p style={{ color: '#6e6058', marginTop: 0 }}>Version 2026-07-10 · effective 9 July 2026</p>

      <div style={{ ...card, borderColor: '#ea6a1f', background: 'linear-gradient(160deg,#fff 60%,#fff2e6 100%)', marginBottom: 16 }}>
        <h2 style={{ ...h2, marginTop: 0 }}>Our role — please read first</h2>
        <p style={{ margin: 0 }}>BillSavvy AI provides <strong>general, factual information only</strong> to help you understand your bills and negotiate with your existing provider. We are <strong>not a comparison or switching service</strong>. We are <strong>not a financial adviser, mortgage broker, insurance adviser, credit provider or legal adviser</strong>, we do <strong>not hold an Australian Financial Services Licence (AFSL) or Australian Credit Licence (ACL)</strong>, and nothing on the platform is financial product advice (general or personal), credit assistance, or insurance advice. We never recommend a specific product, lender or insurer, and every decision is yours.</p>
      </div>

      <div style={card}>
        <h2 style={{ ...h2, marginTop: 0 }}>1. The service</h2>
        <p>The BillSavvy AI platform is operated by RANDAL SARKAR PTY LTD (ACN 683 867 996) trading as BillSavvy AI. It is an AI-powered bill analysis and household expense insights platform providing general information only, as described above.</p>

        <h2 style={h2}>2. Eligibility</h2>
        <p>You must be 18 or older and located in Australia (during our launch period) to create an account.</p>

        <h2 style={h2}>3. Your account</h2>
        <p>You are responsible for keeping your login secure and for activity under your account, and for providing accurate information.</p>

        <h2 style={h2}>4. Plans and billing</h2>
        <p>Free: your first bill analysis is free. Premium (AUD $9.99/month) and Family (AUD $19.99/month) unlock additional features. Subscriptions renew monthly until cancelled; you can cancel anytime and access continues until the end of the paid period. Price changes take effect at your next renewal with at least 30 days&rsquo; notice. Refunds are handled in accordance with the Australian Consumer Law.</p>

        <h2 style={h2}>5. Acceptable use</h2>
        <p>Only upload documents you are entitled to upload. Do not upload another person&rsquo;s documents without their authority, attempt to breach security, reverse engineer the platform, or use it unlawfully.</p>

        <h2 style={h2}>6. AI outputs</h2>
        <p>AI-generated content may contain errors. Savings are described as potential opportunities only and are not guaranteed. You are responsible for verifying information against your original documents and for your own decisions.</p>

        <h2 style={h2}>7. Intellectual property</h2>
        <p>We own the platform. You own your documents. You grant us a licence to process your documents solely to provide the service to you.</p>

        <h2 style={h2}>8. Liability</h2>
        <p>Nothing in these terms excludes rights under the Australian Consumer Law. To the extent permitted by law, our liability is limited to re-supplying the service or the amount you paid us in the previous 12 months. We are not liable for decisions you make based on general information provided by the platform.</p>

        <h2 style={h2}>9. Termination</h2>
        <p>You may close your account anytime. We may suspend or terminate accounts for breach of these terms, with notice where practicable.</p>

        <h2 style={h2}>10. Governing law</h2>
        <p>These terms are governed by the laws of New South Wales, Australia.</p>

        <h2 style={h2}>11. Mortgage &amp; credit</h2>
        <p>Any mortgage or loan information is general information only. It is not credit assistance, credit advice, or a recommendation to refinance, switch lenders, or take any credit action. BillSavvy AI does not hold an Australian Credit Licence and is not a mortgage broker. Any comparison refers only to publicly available rates and may not reflect rates available to you. Before making any credit decision, consider contacting your lender or a licensed mortgage broker or financial adviser.</p>

        <h2 style={h2}>12. Insurance</h2>
        <p>Any insurance information is general information only. It is not insurance advice and does not consider your personal objectives, financial situation or needs. BillSavvy AI does not hold an Australian Financial Services Licence. Before making any decision about an insurance product, read the relevant Product Disclosure Statement (PDS) and Target Market Determination, and consider seeking advice from a licensed adviser.</p>

        <h2 style={h2}>13. Savings, deposits &amp; other financial products</h2>
        <p>Any information about savings accounts, term deposits or other financial products is general and factual only, is not financial product advice, and does not recommend any specific product. Rates change frequently — always confirm current terms with the provider.</p>

        <p style={{ marginTop: 22, fontSize: 13, color: '#6e6058' }}>Contact: <a href="mailto:support@getbillsavvy.ai" style={{ color: '#ea6a1f', fontWeight: 700 }}>support@getbillsavvy.ai</a> · RANDAL SARKAR PTY LTD (ACN 683 867 996) as trustee for RANDAL SARKAR (ABN 15 682 866 008), trading as BillSavvy AI.</p>
      </div>

      <p style={{ marginTop: 18 }}><a href="/dashboard" style={{ color: '#ea6a1f', fontWeight: 700 }}>← Back</a> · <a href="/privacy" style={{ color: '#ea6a1f', fontWeight: 700 }}>Privacy Policy</a></p>
    </div>
  );
}
