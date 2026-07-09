import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '../../../lib/supabase/server';

export const maxDuration = 60;
const MODEL = 'claude-sonnet-5';

const CHAT_SYSTEM = [
  "You are a friendly, plain-English assistant for BillSavvy AI, an Australian household bill helper. You answer questions about the customer's specific bill and general money-saving topics.",
  "You are NOT a financial adviser, mortgage broker, insurance adviser, credit provider or legal adviser, and you provide general information only.",
  "HARD RULES: 1) Never guarantee savings. 2) Never give personal recommendations (no 'you should', 'we recommend', 'best for you', 'switch to X'). 3) Never tell the customer which specific provider or product to choose. 4) Frame everything as general options and questions they can ask their provider. 5) Keep answers short, warm and practical (2-5 sentences). 6) If asked for personal financial, credit, mortgage, insurance or legal advice, gently explain you can only give general information and suggest they speak to their provider or a licensed professional.",
  "Use the bill context provided to be specific about their actual numbers. If you don't know something, say so honestly rather than guessing.",
].join(' ');

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });

    const { analysisId, messages } = await request.json();
    if (!analysisId || !Array.isArray(messages)) return NextResponse.json({ error: 'Bad request.' }, { status: 400 });

    const { data: a } = await supabase
      .from('bill_analysis')
      .select('summary, explanation, annual_estimate, cost_breakdown, savings_opps, bills(provider_name, category, amount_due, due_date)')
      .eq('id', analysisId).single();
    if (!a) return NextResponse.json({ error: 'Report not found.' }, { status: 404 });

    const ctx = "BILL CONTEXT (the customer's own bill):\n" + JSON.stringify({
      provider: a.bills?.provider_name, category: a.bills?.category,
      amount_due: a.bills?.amount_due, due_date: a.bills?.due_date,
      summary: a.summary, annual_estimate: a.annual_estimate,
      cost_breakdown: a.cost_breakdown, savings_opportunities: a.savings_opps,
    });

    const clean = messages.slice(-12).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 2000),
    })).filter((m) => m.content);
    if (!clean.length) return NextResponse.json({ error: 'No message.' }, { status: 400 });

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const res = await anthropic.messages.create({
      model: MODEL, max_tokens: 700,
      system: CHAT_SYSTEM + '\n\n' + ctx,
      messages: clean,
    });
    const reply = res.content.map((c) => c.text || '').join('').trim();
    return NextResponse.json({ reply: reply || 'Sorry, I could not answer that just now.' });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Chat failed' }, { status: 500 });
  }
}
