import { NextResponse } from 'next/server';
import { api } from '../../api';

export async function GET() {
  try {
    const apiRes = await api.post('/users/current', { withCredentials: true });
    return NextResponse.json(apiRes.data);
  } catch {
    return NextResponse.json(null, { status: 401 });
  }
}
