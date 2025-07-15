import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/jwt';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ conversationId?: string }> }
) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = verifyAccessToken(token) as { userId: number };
    const userId = decoded.userId;

    const { conversationId: conversationIdRaw } = await context.params;
    const conversationId = parseInt(conversationIdRaw || '');
    if (isNaN(conversationId)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    // Check if the user is part of the conversation
    const isParticipant = await prisma.participant.findFirst({
      where: {
        userId,
        conversationId,
      },
    });

    if (!isParticipant) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Fetch other participants in the conversation
    const otherParticipants = await prisma.participant.findMany({
      where: {
        conversationId,
        NOT: {
          userId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });

    const users = otherParticipants.map(p => p.user);

    return NextResponse.json(users);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
