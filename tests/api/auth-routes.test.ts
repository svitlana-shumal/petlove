import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { apiMock, cookieGetMock } = vi.hoisted(() => ({
  apiMock: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  cookieGetMock: vi.fn(),
}));

vi.mock('../../app/api/api', () => ({ api: apiMock }));
vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: cookieGetMock })),
}));

import { GET as getCurrent } from '../../app/api/users/current/route';
import { GET as getCurrentFull } from '../../app/api/users/current/full/route';
import { PATCH as editCurrent } from '../../app/api/users/current/edit/route';
import { POST as addPet } from '../../app/api/users/current/pets/add/route';
import { DELETE as removePet } from '../../app/api/users/current/pets/remove/[id]/route';
import { POST as signIn } from '../../app/api/users/signin/route';
import { POST as signUp } from '../../app/api/users/signup/route';
import { POST as signOut } from '../../app/api/users/signout/route';
import { GET as getNotice } from '../../app/api/notices/[id]/route';
import { POST as addFavorite } from '../../app/api/notices/favorites/add/[id]/route';
import { DELETE as removeFavorite } from '../../app/api/notices/favorites/remove/[id]/route';

const token = 'test-access-token';
const jsonRequest = (url: string, method: string, body?: unknown) =>
  new NextRequest(url, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

beforeEach(() => {
  vi.clearAllMocks();
  cookieGetMock.mockImplementation((name: string) =>
    name === 'accessToken' ? { value: token } : undefined
  );
});

describe('sign in and sign up routes', () => {
  it.each([
    ['sign in', signIn, '/users/signin'],
    ['sign up', signUp, '/users/signup'],
  ])('%s stores the token in an HttpOnly cookie and omits it from JSON', async (_label, handler, path) => {
    apiMock.post.mockResolvedValue({
      status: path.endsWith('signup') ? 201 : 200,
      data: { name: 'Test User', email: 'test@example.com', token },
    });

    const response = await handler(
      jsonRequest(`http://localhost/api${path}`, 'POST', { email: 'test@example.com' })
    );
    const body = await response.json();
    const setCookie = response.headers.get('set-cookie');

    expect(response.status).toBe(path.endsWith('signup') ? 201 : 200);
    expect(body).toEqual({ name: 'Test User', email: 'test@example.com' });
    expect(body).not.toHaveProperty('token');
    expect(response.cookies.get('accessToken')?.value).toBe(token);
    expect(setCookie).toContain('HttpOnly');
    expect(setCookie).toContain('SameSite=lax');
    expect(apiMock.post).toHaveBeenCalledWith(path, expect.any(Object));
  });

  it('does not create an authenticated response if backend omits the token', async () => {
    apiMock.post.mockResolvedValue({
      status: 200,
      data: { name: 'Test User', email: 'test@example.com' },
    });

    const response = await signIn(
      jsonRequest('http://localhost/api/users/signin', 'POST', {})
    );

    expect(response.status).toBe(502);
    expect(response.cookies.get('accessToken')).toBeUndefined();
  });

  it('preserves backend status and error message', async () => {
    apiMock.post.mockRejectedValue({
      isAxiosError: true,
      message: 'Request failed',
      response: { status: 401, data: { error: 'Invalid credentials' } },
    });

    const response = await signIn(
      jsonRequest('http://localhost/api/users/signin', 'POST', {})
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: 'Invalid credentials' });
  });
});

describe('authenticated user proxy routes', () => {
  it('gets the current user with a bearer token and strips the token from the response', async () => {
    apiMock.get.mockResolvedValue({
      status: 200,
      data: { _id: 'user-id', name: 'Test User', token },
    });

    const response = await getCurrent();

    expect(apiMock.get).toHaveBeenCalledWith('/users/current', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(await response.json()).toEqual({ _id: 'user-id', name: 'Test User' });
  });

  it('gets the full profile with a bearer token and strips the token from the response', async () => {
    apiMock.get.mockResolvedValue({
      status: 200,
      data: {
        _id: 'user-id',
        noticesViewed: [],
        noticesFavorites: [],
        pets: [],
        token,
      },
    });

    const response = await getCurrentFull();

    expect(apiMock.get).toHaveBeenCalledWith('/users/current/full', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(await response.json()).toEqual({
      _id: 'user-id',
      noticesViewed: [],
      noticesFavorites: [],
      pets: [],
    });
  });

  it('passes the bearer token for profile editing and pet mutations', async () => {
    apiMock.patch.mockResolvedValue({ status: 200, data: { name: 'Updated' } });
    apiMock.post.mockResolvedValue({ status: 200, data: { pets: [] } });
    apiMock.delete.mockResolvedValue({ status: 200, data: { pets: [] } });

    const editRequest = jsonRequest('http://localhost/api/users/current/edit', 'PATCH', {
      name: 'Updated',
    });
    const editResponse = await editCurrent(editRequest);
    const addResponse = await addPet(
      jsonRequest('http://localhost/api/users/current/pets/add', 'POST', { name: 'Rex' })
    );
    const removeResponse = await removePet(new Request('http://localhost/api/users/current/pets/remove/pet-id'), {
      params: Promise.resolve({ id: 'pet-id' }),
    });

    expect(editResponse.status).toBe(200);
    expect(addResponse.status).toBe(200);
    expect(removeResponse.status).toBe(200);
    expect(apiMock.patch).toHaveBeenCalledWith('/users/current/edit', { name: 'Updated' }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(apiMock.post).toHaveBeenCalledWith('/users/current/pets/add', { name: 'Rex' }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(apiMock.delete).toHaveBeenCalledWith('/users/current/pets/remove/pet-id', {
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  it('passes the bearer token for notice detail and favorite mutations', async () => {
    apiMock.get.mockResolvedValue({ status: 200, data: { _id: 'notice-id' } });
    apiMock.post.mockResolvedValue({ status: 200, data: ['notice-id'] });
    apiMock.delete.mockResolvedValue({ status: 200, data: [] });

    const detailResponse = await getNotice(
      new NextRequest('http://localhost/api/notices/notice-id'),
      { params: Promise.resolve({ id: 'notice-id' }) }
    );
    const addResponse = await addFavorite(new Request('http://localhost/api/notices/favorites/add/notice-id'), {
      params: Promise.resolve({ id: 'notice-id' }),
    });
    const removeResponse = await removeFavorite(
      new Request('http://localhost/api/notices/favorites/remove/notice-id'),
      { params: Promise.resolve({ id: 'notice-id' }) }
    );

    expect(detailResponse.status).toBe(200);
    expect(addResponse.status).toBe(200);
    expect(removeResponse.status).toBe(200);
    expect(apiMock.get).toHaveBeenCalledWith('/notices/notice-id', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(apiMock.post).toHaveBeenCalledWith('/notices/favorites/add/notice-id', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(apiMock.delete).toHaveBeenCalledWith('/notices/favorites/remove/notice-id', {
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  it('passes the bearer token to backend signout and removes the cookie', async () => {
    apiMock.post.mockResolvedValue({ status: 200, data: { message: 'Signed out', token } });

    const response = await signOut();

    expect(apiMock.post).toHaveBeenCalledWith('/users/signout', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.cookies.get('accessToken')?.value).toBe('');
    expect(await response.json()).toEqual({ message: 'Signed out' });
  });

  it('returns 401 without calling the backend when an authenticated route has no cookie', async () => {
    cookieGetMock.mockReturnValue(undefined);

    const responses = await Promise.all([
      getCurrent(),
      getCurrentFull(),
      editCurrent(jsonRequest('http://localhost/api/users/current/edit', 'PATCH', {})),
      addPet(jsonRequest('http://localhost/api/users/current/pets/add', 'POST', {})),
      removePet(new Request('http://localhost/api/users/current/pets/remove/pet-id'), {
        params: Promise.resolve({ id: 'pet-id' }),
      }),
      getNotice(new NextRequest('http://localhost/api/notices/notice-id'), {
        params: Promise.resolve({ id: 'notice-id' }),
      }),
      addFavorite(new Request('http://localhost/api/notices/favorites/add/notice-id'), {
        params: Promise.resolve({ id: 'notice-id' }),
      }),
      removeFavorite(new Request('http://localhost/api/notices/favorites/remove/notice-id'), {
        params: Promise.resolve({ id: 'notice-id' }),
      }),
    ]);

    expect(responses.map((response) => response.status)).toEqual(Array(8).fill(401));
    expect(apiMock.get).not.toHaveBeenCalled();
    expect(apiMock.post).not.toHaveBeenCalled();
    expect(apiMock.patch).not.toHaveBeenCalled();
    expect(apiMock.delete).not.toHaveBeenCalled();
  });

  it('clears the cookie even when backend signout fails', async () => {
    apiMock.post.mockRejectedValue({
      isAxiosError: true,
      message: 'Expired session',
      response: { status: 401, data: { error: 'Unauthorized' } },
    });

    const response = await signOut();

    expect(response.status).toBe(401);
    expect(response.cookies.get('accessToken')?.value).toBe('');
    expect(await response.json()).toEqual({ error: 'Unauthorized' });
  });
});
