import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const accessToken = signAccessToken(user.id.toString());
  const refreshToken = signRefreshToken(user.id.toString());

  const res = NextResponse.json({ accessToken });

  res.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/api/refresh',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return res;
}
