import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getMock } = vi.hoisted(() => ({ getMock: vi.fn() }));

vi.mock('@/app/api/api', () => ({ api: { get: getMock } }));

import { NextRequest } from 'next/server';
import { GET } from '@/app/api/news/route';

describe('GET /api/news', () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  it('maps query and pagination parameters to the backend contract', async () => {
    const data = { page: 2, perPage: 8, totalPages: 3, results: [] };
    getMock.mockResolvedValue({ data, status: 200 });
    const request = new NextRequest(
      'http://localhost/api/news?query=%20cats%20&page=2&perPage=8'
    );

    const response = await GET(request);

    expect(getMock).toHaveBeenCalledWith('/news', {
      params: { keyword: 'cats', page: 2, perPage: 8 },
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(data);
  });
});
