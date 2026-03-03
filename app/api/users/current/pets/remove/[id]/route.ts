import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { api } from '../../../../../api';
import { isAxiosError } from 'axios';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'This pet is not found' }, { status: 404 });
    }

    const response = await api.delete(`/users/current/pets/remove/${params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || 'Failed to remove pet' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
