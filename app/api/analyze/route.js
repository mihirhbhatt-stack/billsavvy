import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '../../../lib/supabase/server';
import { EXTRACTION_SYSTEM_PROMPT, ANALYSIS_SYSTEM_PROMPT, DISCLAIMER, DISCLAIMER_VERSION } from '../../../lib/ai/prompts';
import { complianceViolations } from '../../../lib/ai/compliance';

export const maxDuration = 120;
const MODEL = 'claude-sonnet-5';
const REQUIRED_CONSENTS = ['terms', 'privacy', 'ai_processing', 'document_processing'];
const MIME_OK = ['application/pdf', 'image/jpeg', 'image/png'];
const FREE_LIMIT = 999; // testing phase: effectively unlimited for everyone

function parseJson(text) {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('AI returned no JSON');
  const cleaned = m[0].replace(/,\s*([}\]])/g, '$1');
  return JSON.parse(cleaned);
}

async function emailReport(origin, email, provider, summary, analysisId) {
  if (!process.env.RESEND_API_KEY || !email) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'BillSavvy AI <onboarding@resend.dev>',
        to: [email],
        subject: 'Your BillSavvy report: ' + (provider || 'your bill'),
        html: '<h2>Your bill report is ready</h2><p>' + summary + '</p>' +
          '<p><a href="' + origin + '/report/' + analysisId + '" style="background:#ea6a1f;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block">View full report</a></p>' +
          '<hr><p style="font-size:12px;color:#888">' + DISCLAIMER + '</p>',
      }),
    });
  } catch (e) { /* email best-effort */ }
}

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });

    const { data: consents } = await supabase.from('consents').select('consent_type');
    const have = new Set((consents || []).map((c) => c.consent_type));
    if (!REQUIRED_CONSENTS.every((c) => have.has(c)))
      return NextResponse.json({ error: 'Please accept the terms first.' }, { status: 403 });

    const { data: sub } = await supabase.from('subscriptions').select('plan').maybeSingle();
    const { count } = await supabase.from('bill_analysis').select('id', { count: 'exact', head: true });
    if ((!sub || sub.plan === 'free') && (count || 0) >= FREE_LIMIT)
      return NextResponse.json({ error: 'Your free analysis is used. Premium is coming very soon!' }, { status: 402 });

    const form = await request.formData();
    const file = form.get('file');
    if (!file || typeof file === 'string') return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    if (!MIME_OK.includes(file.type)) return NextResponse.json({ error: 'Please upload a PDF, JPEG or PNG.' }, { status: 400 });
    if (file.size > 20 * 1024 * 1024) return NextResponse.json({ error: 'File is over 20 MB.' }, { status: 400 });

    const bytes = Buffer.from(await file.arrayBuffer());
    const docId = crypto.randomUUID();
    const path = user.id + '/' + docId;
    const { error: upErr } = await supabase.storage.from('documents').upload(path, bytes, { contentType: file.type });
    if (upErr) return NextResponse.json({ error: 'Storage: ' + upErr.message }, { status: 500 });
    const { error: docErr } = await supabase.from('documents').insert({
      id: docId, user_id: user.id, storage_path: path, file_name: file.name,
      mime_type: file.type, file_size: file.size, status: 'processing',
    });
    if (docErr) return NextResponse.json({ error: docErr.message }, { status: 500 });

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const b64 = bytes.toString('base64');
    const contentBlock = file.type === 'application/pdf'
      ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: b64 } }
      : { type: 'image', source: { type: 'base64', media_type: file.type, data: b64 } };

    const ext = await anthropic.messages.create({
      model: MODEL, max_tokens: 3000, system: EXTRACTION_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: [contentBlock, { type: 'text', text: 'Extract this bill.' }] }],
    });
    const extracted = parseJson(ext.content.map((c) => c.text || '').join(''));

    const { data: bill, error: billErr } = await supabase.from('bills').insert({
      user_id: user.id, document_id: docId,
      category: extracted.category || 'other',
      provider_name: extracted.provider_name,
      account_number: extracted.account_number,
      issue_date: extracted.issue_date, due_date: extracted.due_date,
      period_start: extracted.period_start, period_end: extracted.period_end,
      amount_due: extracted.amount_due,
      usage_json: extracted.usage || {}, fees_json: extracted.fees || {},
      discounts_json: extracted.discounts || {},
      contract_end: extracted.contract_end, renewal_date: extracted.renewal_date,
      confidence: Math.max(0, Math.min(1, extracted.confidence ?? 0.5)),
    }).select().single();
    if (billErr) return NextResponse.json({ error: billErr.message }, { status: 500 });

    let analysis, tries = 0;
    while (tries < 2) {
      tries++;
      const ana = await anthropic.messages.create({
        model: MODEL, max_tokens: 5000, system: ANALYSIS_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: 'Extracted bill:\n' + JSON.stringify(extracted) }],
      });
      const text = ana.content.map((c) => c.text || '').join('');
      if (complianceViolations(text).length) continue;
      try { analysis = parseJson(text); break; } catch (e) { /* malformed JSON, retry */ }
    }
    if (!analysis) return NextResponse.json({ error: 'Analysis failed, please try again.' }, { status: 500 });

    const { data: saved, error: anaErr } = await supabase.from('bill_analysis').insert({
      bill_id: bill.id, user_id: user.id,
      summary: analysis.summary, explanation: analysis.explanation,
      cost_breakdown: analysis.cost_breakdown || [],
      annual_estimate: analysis.annual_estimate,
      trends: analysis.trends || {},
      savings_opps: analysis.savings_opportunities || [],
      provider_questions: analysis.questions_for_provider || [],
      model_version: MODEL, disclaimer_version: DISCLAIMER_VERSION,
    }).select().single();
    if (anaErr) return NextResponse.json({ error: anaErr.message }, { status: 500 });

    await supabase.from('documents').update({ status: 'complete' }).eq('id', docId);
    const origin = new URL(request.url).origin;
    await emailReport(origin, user.email, bill.provider_name, analysis.summary, saved.id);
    return NextResponse.json({ analysis_id: saved.id });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Unexpected error' }, { status: 500 });
  }
}
