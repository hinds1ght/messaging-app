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
    if (isNaN(conversationId)) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

    const isParticipant = await prisma.participant.findFirst({
      where: {
        conversationId,
        userId,
      },
    });

    if (!isParticipant) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });

    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(
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
    if (isNaN(conversationId)) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });

    const { content } = await req.json();
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ message: 'Invalid content' }, { status: 400 });
    }

    const isParticipant = await prisma.participant.findFirst({
      where: {
        conversationId,
        userId,
      },
    });

    if (!isParticipant) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: userId,
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });

    await fetch(`https://github.com/hinds1ght/sse-backend/send/${conversationId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
