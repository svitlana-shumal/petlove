import { NextResponse } from 'next/server';
import { api } from '../../api';
import { isAxiosError } from 'axios';

export async function GET() {
  try {
    const res = await api.get('/notices/species');
    return NextResponse.json(res.data);
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 500;

      if (status === 404) {
        return NextResponse.json({ error: 'Species not found' }, { status: 404 });
      }

      return NextResponse.json(
        {
          error: error.message,
          response: error.response?.data,
        },
        { status }
      );
    }

    return NextResponse.json({ error: 'Failed to load species options' }, { status: 500 });
  }
}
