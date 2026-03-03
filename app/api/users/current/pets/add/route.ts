import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../../../api';
import { isAxiosError } from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await api.post('/users/current/pets/add', body);

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || 'Failed to add pet' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
