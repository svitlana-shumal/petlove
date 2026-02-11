import { NextRequest, NextResponse } from 'next/server';
import { AxiosError } from 'axios';
import { api } from '../../api';

type ApiError = AxiosError<{ error: string }>;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post('/users/signin', body, { withCredentials: true });
    const res = NextResponse.json(apiRes.data);

    if (apiRes.data.token) {
      res.cookies.set('accessToken', apiRes.data.token, {
        httpOnly: true,
        path: '/',
      });
    }
    return res;
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error('Signin error:', err);
    return NextResponse.json(
      { error: err.response?.data?.error || (err as Error).message || 'Server error' },
      { status: err.response?.status || 500 }
    );
  }
}
