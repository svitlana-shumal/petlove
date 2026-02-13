import { cookies } from 'next/headers';
import { api } from '../../api';
import { NextResponse } from 'next/server';
import { AxiosError } from 'axios';

type ApiError = AxiosError<{ error: string }>;

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const apiRes = await api.post(
      '/users/signout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const res = NextResponse.json(apiRes.data);
    res.cookies.delete('accessToken');

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
