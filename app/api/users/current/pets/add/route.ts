import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../../../api';
import { apiErrorResponse, bearerHeaders, getAccessToken, withoutToken } from '../../../../auth';

export async function POST(request: NextRequest) {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const response = await api.post('/users/current/pets/add', body, {
      headers: bearerHeaders(token),
    });
    return NextResponse.json(withoutToken(response.data), { status: response.status });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
