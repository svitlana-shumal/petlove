import { NextResponse } from 'next/server';
import { api } from '../../../../api';
import { apiErrorResponse, bearerHeaders, getAccessToken } from '../../../../auth';

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const response = await api.delete(`/notices/favorites/remove/${id}`, {
      headers: bearerHeaders(token),
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
