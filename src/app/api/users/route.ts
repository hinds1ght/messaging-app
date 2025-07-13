import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search') || '';
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = verifyAccessToken(token) as { userId: number };
    const userId = decoded.userId;

    const users = await prisma.user.findMany({
      where: {
        displayName: {
          contains: search,
          mode: 'insensitive',
        },
        NOT: {
          id: userId,
        },
      },
      select: {
        id: true,
        displayName: true,
      },
      take: 10,
    });

    return NextResponse.json(users);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
