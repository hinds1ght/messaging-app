import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/jwt';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    verifyAccessToken(token);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
      },
      orderBy: {
        displayName: 'asc',
      },
    });

    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
}
