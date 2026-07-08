import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') || 'email';
  const code = searchParams.get('code');
  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/consent`);
  }
  if (token_hash) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) return NextResponse.redirect(`${origin}/consent`);
  }
  return NextResponse.redirect(`${origin}/login?error=link`);
}
