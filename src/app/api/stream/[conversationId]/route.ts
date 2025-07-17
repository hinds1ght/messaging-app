import { NextRequest } from 'next/server';

const clients = new Map<string, Set<ReadableStreamDefaultController>>();

export async function GET(req: NextRequest, context: { params: { conversationId: string } }) {
  const { conversationId } = context.params;

  const stream = new ReadableStream({
    start(controller) {
      if (!clients.has(conversationId)) {
        clients.set(conversationId, new Set());
      }
      clients.get(conversationId)!.add(controller);

      controller.enqueue(`: connected to conversation ${conversationId}\n\n`);

      const keepAlive = setInterval(() => {
        controller.enqueue(`: keep-alive\n\n`);
      }, 30000);

      const close = () => {
        clients.get(conversationId)?.delete(controller);
        clearInterval(keepAlive);
        controller.close();
      };

      req.signal.addEventListener('abort', close);
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

export { clients };
