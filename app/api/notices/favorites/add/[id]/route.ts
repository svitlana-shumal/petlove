import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../../../api';
import { isAxiosError } from 'axios';

type ApiErrorResponse = { message?: string; error?: string };

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const res = await api.post(`/notices/favorites/add/${params.id}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status || 500;
      const data = error.response?.data as ApiErrorResponse | string | undefined;

      let message: string | undefined;

      if (typeof data === 'string') {
        message = data;
      } else if (typeof data === 'object' && data !== null) {
        message = data.message || data.error;
      }

      return NextResponse.json(
        { message: message || 'Failed to add notice to favorites' },
        { status }
      );
    }

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
