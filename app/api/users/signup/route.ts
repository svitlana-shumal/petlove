import { NextRequest, NextResponse } from 'next/server';
import {
  ACCESS_TOKEN_COOKIE,
  accessTokenCookieOptions,
  apiErrorResponse,
  withoutToken,
} from '../../auth';
import { api } from '../../api';

type AuthResponse = { token?: string; name: string; email: string };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post<AuthResponse>('/users/signup', body);

    if (!apiRes.data.token) {
      return NextResponse.json(
        { error: 'Backend did not return an access token' },
        { status: 502 }
      );
    }

    const res = NextResponse.json(withoutToken(apiRes.data), { status: apiRes.status });
    res.cookies.set(ACCESS_TOKEN_COOKIE, apiRes.data.token, accessTokenCookieOptions);
    return res;
  } catch (error: unknown) {
    return apiErrorResponse(error);
  }
}
