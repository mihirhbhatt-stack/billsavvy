'use client';

export default function DownloadButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{ background: '#ea6a1f', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
    >
      ⬇ Download / Save as PDF
    </button>
  );
}
