import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../../../api';
import { isAxiosError } from 'axios';

type Props = { params: { id: string } };

type ApiErrorResponse = { message?: string; error?: string };

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = params;
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const res = await api.delete(`/notices/favorites/remove/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const favorites: string[] = res.data;

    return NextResponse.json(favorites, { status: res.status });
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
        { message: message || 'Failed to remove notice from favorites' },
        { status }
      );
    }

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
