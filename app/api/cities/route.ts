import { NextRequest, NextResponse } from 'next/server';
import { api } from '../api';
import { isAxiosError } from 'axios';
import { CitiesQueryParams, City } from '@/types/notices';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params: CitiesQueryParams = {
      keyword: searchParams.get('keyword') || '',
    };

    const res = await api.get<City[]>('/cities', { params });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 500;

      if (status === 404) {
        return NextResponse.json({ error: 'Cities not found' }, { status: 404 });
      }

      return NextResponse.json(
        {
          error: error.message,
          response: error.response?.data,
        },
        { status }
      );
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
