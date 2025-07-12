import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, signAccessToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken) as { userId: number };
    const accessToken = signAccessToken(String(decoded.userId));

    return NextResponse.json({ accessToken });
  } catch (err) {
    return NextResponse.json({ message: 'Invalid refresh token' }, { status: 403 });
  }
}
