import { ACCESS_TOKEN_COOKIE, bearerHeaders } from '@/app/api/auth';
import { api } from '@/app/api/api';
import { isAxiosError } from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    await api.get('/users/current', { headers: bearerHeaders(token) });
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      redirect('/login');
    }

    throw error;
  }

  return children;
}
