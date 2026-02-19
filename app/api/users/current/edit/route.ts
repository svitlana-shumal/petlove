import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../../api';
import { isAxiosError } from 'axios';
import { cookies } from 'next/headers';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = cookies();

    const res = await api.patch('/users/current/edit', body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json({ error: (error as Error).message });
  }
}
