import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/oauth2/authorization/google`
  );
}
