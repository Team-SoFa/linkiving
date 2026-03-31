import { handleApiError } from '@/hooks/util/api';
import { serverApiClient } from '@/lib/server/apiClient';

export async function GET() {
  try {
    const data = await serverApiClient('/v1/links/count');
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return handleApiError(err);
  }
}
