import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/lib/jwt';

// GET ------------------------------------------------------
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
      return NextResponse.json({ message: 'Invalid conversation ID' }, { status: 400 });
    }

    // Make sure user is part of conversation
    const isParticipant = await prisma.participant.findFirst({
      where: { conversationId, userId },
    });
    if (!isParticipant) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const PAGE_SIZE = 20;
    const cursorParam = req.nextUrl.searchParams.get('cursor');
    let cursorId: number | null = null;

    if (cursorParam) {
      const parsed = parseInt(cursorParam);
      if (!isNaN(parsed)) {
        cursorId = parsed;
      }
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        ...(cursorId && {
          id: { lt: cursorId },
        }),
      },
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE + 1, 
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });

    const hasMore = messages.length > PAGE_SIZE;
    const paginated = hasMore ? messages.slice(0, -1) : messages;

    return NextResponse.json({
      messages: paginated.reverse(), 
      nextCursor: hasMore ? paginated[0].id : null,
    });
  } catch (err) {
    console.error('GET /messages error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// POST ---------------------------------------------------------
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
    if (isNaN(conversationId)) {
      return NextResponse.json({ message: 'Invalid conversation ID' }, { status: 400 });
    }

    const { content } = await req.json();
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ message: 'Invalid message content' }, { status: 400 });
    }

    const isParticipant = await prisma.participant.findFirst({
      where: { conversationId, userId },
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

    // Notify SSE server
    await fetch(`${process.env.NEXT_PUBLIC_SSE_URL}/send/${conversationId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message);
  } catch (err) {
    console.error('POST /messages error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
