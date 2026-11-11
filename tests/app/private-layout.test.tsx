import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiMock, cookieGetMock, redirectMock } = vi.hoisted(() => ({
  apiMock: { get: vi.fn() },
  cookieGetMock: vi.fn(),
  redirectMock: vi.fn(),
}));

vi.mock('@/app/api/api', () => ({ api: apiMock }));
vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: cookieGetMock })),
}));
vi.mock('next/navigation', () => ({
  redirect: redirectMock,
}));

import PrivateLayout from '@/app/(private)/layout';

beforeEach(() => {
  vi.clearAllMocks();
  apiMock.get.mockResolvedValue({ status: 200 });
  redirectMock.mockImplementation((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  });
});

describe('private route layout', () => {
  it('redirects to login when the access-token cookie is missing', async () => {
    cookieGetMock.mockReturnValue(undefined);

    await expect(PrivateLayout({ children: 'private content' })).rejects.toThrow(
      'NEXT_REDIRECT:/login'
    );

    expect(cookieGetMock).toHaveBeenCalledWith('accessToken');
    expect(redirectMock).toHaveBeenCalledWith('/login');
    expect(apiMock.get).not.toHaveBeenCalled();
  });

  it('checks the token with the backend before rendering private content', async () => {
    cookieGetMock.mockReturnValue({ value: 'session-token' });
    const children = 'private content';

    await expect(PrivateLayout({ children })).resolves.toBe(children);
    expect(apiMock.get).toHaveBeenCalledWith('/users/current', {
      headers: { Authorization: 'Bearer session-token' },
    });
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it('redirects to login when the backend rejects the token', async () => {
    cookieGetMock.mockReturnValue({ value: 'revoked-token' });
    apiMock.get.mockRejectedValue({
      isAxiosError: true,
      response: { status: 401 },
    });

    await expect(PrivateLayout({ children: 'private content' })).rejects.toThrow(
      'NEXT_REDIRECT:/login'
    );

    expect(redirectMock).toHaveBeenCalledWith('/login');
  });
});
