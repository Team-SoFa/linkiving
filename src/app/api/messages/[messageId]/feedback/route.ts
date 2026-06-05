import { handleApiError } from '@/hooks/util/api';
import { serverApiClient } from '@/lib/server/apiClient';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const feedbackBodySchema = z.object({
  sentiment: z.enum(['LIKE', 'DISLIKE', 'NONE']),
  text: z.string().max(20).optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ messageId: string }> }) {
  try {
    const { messageId } = await params;
    const rawBody = await req.json();
    const body = feedbackBodySchema.parse(rawBody);
    const data = await serverApiClient(`/v1/messages/${messageId}/feedback`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
