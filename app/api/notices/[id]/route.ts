import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { isAxiosError } from 'axios';
import { cookies } from 'next/headers';

type Props = { params: { id: string } };
type ApiErrorResponse = { message?: string; error?: string };

export async function GET(request: NextRequest, { params }: Props) {
  const { id } = params;
  try {
    let token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value || '';
    }
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const apiRes = await api.get(`/notices/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      const data = error.response?.data as ApiErrorResponse | string | undefined;
      let message: string | undefined;
      if (typeof data === 'string') {
        message = data;
      } else if (typeof data === 'object' && data !== null) {
        message = data.message || data.error;
      }

      return NextResponse.json(
        { message: message || 'Unknown error' },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
