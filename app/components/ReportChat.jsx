'use client';
import { useState, useRef, useEffect } from 'react';

export default function ReportChat({ analysisId, botName = 'Savvy', botEmoji = '💬' }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi, I'm ${botName}. Ask me anything about this bill — what a charge means, how you might save, or what to say when you call your provider.` },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, busy]);

  async function send(e) {
    e.preventDefault();
    const q = input.trim();
    if (!q || busy) return;
    const next = [...messages, { role: 'user', content: q }];
    setMessages(next); setInput(''); setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId, messages: next }),
      });
      const json = await res.json();
      setMessages([...next, { role: 'assistant', content: json.reply || json.error || 'Sorry, I could not answer that just now.' }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    }
    setBusy(false);
  }

  const suggestions = ['Why is my bill this high?', 'How can I lower it?', 'What should I say when I call them?'];

  return (
    <div style={{ background: '#fff', border: '1px solid #eadfd5', borderRadius: 14, padding: 18, marginBottom: 16 }}>
      <h3 style={{ margin: '0 0 4px', fontSize: 17 }}>{botEmoji} Ask {botName}</h3>
      <p style={{ fontSize: 12, color: '#6e6058', margin: '0 0 12px' }}>General information only — not personal financial advice.</p>
      <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', background: m.role === 'user' ? '#ea6a1f' : '#f6f1ea', color: m.role === 'user' ? '#fff' : '#241a12', padding: '9px 13px', borderRadius: 14, fontSize: 14, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{m.content}</div>
        ))}
        {busy && <div style={{ alignSelf: 'flex-start', color: '#6e6058', fontSize: 13 }}>{botName} is typing…</div>}
        <div ref={endRef} />
      </div>
      {messages.length <= 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => setInput(s)} style={{ background: '#fdeede', border: '1px solid #f3c9a6', color: '#c14f0a', borderRadius: 999, padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}>{s}</button>
          ))}
        </div>
      )}
      <form onSubmit={send} style={{ display: 'flex', gap: 8 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question…" style={{ flex: 1, padding: '10px 14px', borderRadius: 999, border: '2px solid #d5c9be', fontSize: 14, boxSizing: 'border-box' }} />
        <button type="submit" disabled={busy || !input.trim()} style={{ background: busy || !input.trim() ? '#d5c9be' : '#ea6a1f', color: '#fff', border: 0, padding: '10px 18px', borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: busy || !input.trim() ? 'not-allowed' : 'pointer' }}>Send</button>
      </form>
    </div>
  );
}
