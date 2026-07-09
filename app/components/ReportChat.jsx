'use client';
import { useState, useRef, useEffect } from 'react';

function Avatar({ name, emoji, size = 40 }) {
  const [err, setErr] = useState(false);
  const url = `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(name)}&backgroundColor=ffd9bf,ffe3d0,d7f2ec,dfe9ff`;
  const box = { width: size, height: size, borderRadius: '50%', flexShrink: 0, border: '2px solid #fff', boxShadow: '0 2px 6px rgba(36,26,18,0.18)' };
  if (err) return <span style={{ ...box, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fdeede', fontSize: size * 0.5 }}>{emoji}</span>;
  return <img src={url} alt={name} width={size} height={size} style={box} onError={() => setErr(true)} />;
}

export default function ReportChat({ analysisId, botName = 'Savvy', botEmoji = '💬' }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi, I'm ${botName} 👋 Think of me as a helpful friend who's good with bills. Ask me anything — what a charge means, how you might save, or exactly what to say when you call your provider. No question is too small.` },
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
    <div style={{ background: '#fff', border: '1px solid #f0e7dc', borderRadius: 18, padding: 20, marginBottom: 16, boxShadow: '0 4px 18px rgba(36,26,18,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <Avatar name={botName} emoji={botEmoji} size={48} />
        <div>
          <h3 style={{ margin: 0, fontSize: 18 }}>Chat with {botName}</h3>
          <div style={{ fontSize: 12.5, color: '#1f9d8b', fontWeight: 700 }}>● Online — here to help, not to judge</div>
        </div>
      </div>
      <p style={{ fontSize: 12, color: '#6e6058', margin: '8px 0 14px' }}>General information only — not personal financial advice.</p>
      <div style={{ maxHeight: 340, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14 }}>
        {messages.map((m, i) => (
          m.role === 'user' ? (
            <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '82%', background: 'linear-gradient(135deg,#ea6a1f,#c14f0a)', color: '#fff', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', fontSize: 14, whiteSpace: 'pre-wrap', lineHeight: 1.5, boxShadow: '0 2px 8px rgba(234,106,31,0.25)' }}>{m.content}</div>
          ) : (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end', maxWidth: '90%' }}>
              <Avatar name={botName} emoji={botEmoji} size={30} />
              <div style={{ background: '#f6f1ea', color: '#241a12', padding: '10px 14px', borderRadius: '16px 16px 16px 4px', fontSize: 14, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{m.content}</div>
            </div>
          )
        ))}
        {busy && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Avatar name={botName} emoji={botEmoji} size={30} />
            <div style={{ background: '#f6f1ea', color: '#6e6058', padding: '10px 14px', borderRadius: 14, fontSize: 13 }}>{botName} is typing…</div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      {messages.length <= 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => setInput(s)} style={{ background: '#fdeede', border: '1px solid #f3c9a6', color: '#c14f0a', borderRadius: 999, padding: '6px 13px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>{s}</button>
          ))}
        </div>
      )}
      <form onSubmit={send} style={{ display: 'flex', gap: 8 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Message ${botName}…`} style={{ flex: 1, padding: '11px 16px', borderRadius: 999, border: '2px solid #e3d9cd', fontSize: 14, boxSizing: 'border-box' }} />
        <button type="submit" disabled={busy || !input.trim()} style={{ background: busy || !input.trim() ? '#d5c9be' : 'linear-gradient(135deg,#ea6a1f,#c14f0a)', color: '#fff', border: 0, padding: '11px 20px', borderRadius: 999, fontWeight: 700, fontSize: 14, cursor: busy || !input.trim() ? 'not-allowed' : 'pointer' }}>Send</button>
      </form>
    </div>
  );
}
