import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const careerUser = process.env.ZOHO_CAREER_USER || '';
  const mainUser = process.env.ZOHO_USER || '';
  return NextResponse.json({
    ZOHO_CAREER_USER_is_career: careerUser.toLowerCase().includes('career'),
    ZOHO_CAREER_USER_is_contact: careerUser.toLowerCase().includes('contact'),
    ZOHO_USER_is_career: mainUser.toLowerCase().includes('career'),
    ZOHO_USER_is_contact: mainUser.toLowerCase().includes('contact'),
  });
}
