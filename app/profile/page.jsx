import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '../../lib/supabase/server';

export const dynamic = 'force-dynamic';

async function save(formData) {
  'use server';
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const first = (formData.get('first_name') || '').toString().trim();
  await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email,
    first_name: first,
    last_name: (formData.get('last_name') || '').toString().trim(),
    phone: (formData.get('phone') || '').toString().trim(),
    full_name: first,
  });
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export default async function Profile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: p } = await supabase.from('profiles').select('first_name, last_name, phone').maybeSingle();

  const input = { padding: '11px 14px', borderRadius: 10, border: '2px solid #d5c9be', fontSize: 15, width: '100%', boxSizing: 'border-box', marginBottom: 14 };
  const label = { display: 'block', fontSize: 13, fontWeight: 700, color: '#4a3f36', margin: '0 0 6px' };

  return (
    <div style={{ maxWidth: 460, margin: '30px auto' }}>
      <h1 style={{ marginBottom: 4 }}>Your details</h1>
      <p style={{ color: '#6e6058', marginTop: 0 }}>This is the name we'll greet you with. Update it any time.</p>

      <form action={save} style={{ background: '#fff', border: '1px solid #eadfd5', borderRadius: 14, padding: 22, marginTop: 16 }}>
        <label style={label}>First name</label>
        <input name="first_name" type="text" required defaultValue={p?.first_name || ''} placeholder="e.g. Mihir" style={input} />

        <label style={label}>Last name</label>
        <input name="last_name" type="text" defaultValue={p?.last_name || ''} placeholder="Last name" style={input} />

        <label style={label}>Phone number</label>
        <input name="phone" type="tel" defaultValue={p?.phone || ''} placeholder="Phone number" style={input} />

        <label style={label}>Email</label>
        <input type="email" value={user.email} disabled style={{ ...input, background: '#f6f1ea', color: '#8a7d70' }} />

        <button type="submit" style={{ width: '100%', background: '#ea6a1f', color: '#fff', border: 0, padding: '12px', borderRadius: 999, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Save my details</button>
      </form>

      <p style={{ marginTop: 16 }}><a href="/dashboard" style={{ color: '#ea6a1f', fontWeight: 700 }}>← Back to dashboard</a></p>
    </div>
  );
}
