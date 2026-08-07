import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  return NextResponse.json({
    has_ZOHO_USER: !!process.env.ZOHO_USER,
    has_ZOHO_CAREER_USER: !!process.env.ZOHO_CAREER_USER,
    has_ZOHO_CARRER_USER: !!process.env.ZOHO_CARRER_USER,
    has_ZOHO_CAREERS_USER: !!process.env.ZOHO_CAREERS_USER,
    has_CAREER_USER: !!process.env.CAREER_USER,
    raw_keys: Object.keys(process.env).filter(k => k.includes('ZOHO') || k.includes('CAREER'))
  });
}
