import { NextResponse } from 'next/server';
import { api } from '../../api';
import { apiErrorResponse, bearerHeaders, getAccessToken, withoutToken } from '../../auth';

export async function GET() {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const apiRes = await api.get('/users/current', { headers: bearerHeaders(token) });
    return NextResponse.json(withoutToken(apiRes.data), { status: apiRes.status });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
