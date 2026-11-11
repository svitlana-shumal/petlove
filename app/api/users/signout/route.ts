import { api } from '../../api';
import { NextResponse } from 'next/server';
import {
  ACCESS_TOKEN_COOKIE,
  apiErrorResponse,
  bearerHeaders,
  getAccessToken,
  withoutToken,
} from '../../auth';

export async function POST() {
  const token = await getAccessToken();

  if (!token) {
    const response = NextResponse.json({ message: 'Signed out' });
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    return response;
  }

  try {
    const apiRes = await api.post('/users/signout', {}, { headers: bearerHeaders(token) });
    const response = NextResponse.json(withoutToken(apiRes.data), { status: apiRes.status });
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    return response;
  } catch (error) {
    const response = apiErrorResponse(error);
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    return response;
  }
}
