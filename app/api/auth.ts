import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isAxiosError } from 'axios';

export const ACCESS_TOKEN_COOKIE = 'accessToken';

export const accessTokenCookieOptions = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

export async function getAccessToken() {
  return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
}

export function bearerHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export function withoutToken<T extends { token?: unknown }>(data: T) {
  const safeData = { ...data };
  delete safeData.token;
  return safeData;
}

export function apiErrorResponse(error: unknown) {
  if (isAxiosError(error)) {
    const data: unknown = error.response?.data;
    let message = error.message;

    if (typeof data === 'string') {
      message = data;
    } else if (data && typeof data === 'object') {
      const body = data as { message?: string; error?: string };
      message = body.message || body.error || message;
    }

    return NextResponse.json({ error: message }, { status: error.response?.status ?? 500 });
  }

  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'Server error' },
    { status: 500 }
  );
}
