import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { getMock } = vi.hoisted(() => ({ getMock: vi.fn() }));

vi.mock('../../app/api/api', () => ({ api: { get: getMock } }));

import { GET } from '../../app/api/notices/route';

describe('GET /api/notices', () => {
  beforeEach(() => {
    getMock.mockReset();
    getMock.mockResolvedValue({
      status: 200,
      data: { page: 2, perPage: 6, totalPages: 4, results: [] },
    });
  });

  it.each([
    ['popular', 'isPopularitySort'],
    ['unpopular', 'isUnpopularSort'],
    ['cheap', 'isPriceSortAsc'],
    ['expensive', 'isPriceSortDesc'],
  ] as const)('maps %s sorting and filters to the backend contract', async (sort, sortFlag) => {
    const request = new NextRequest(
      `http://localhost/api/notices?keyword=cat&page=2&limit=8&category=Sell&sex=female&species=cat&locationId=city-id&sort=${sort}`
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(getMock).toHaveBeenCalledWith(
      '/notices',
      expect.objectContaining({
        params: expect.objectContaining({
          keyword: 'cat',
          page: 2,
          limit: 8,
          category: 'Sell',
          sex: 'female',
          species: 'cat',
          locationId: 'city-id',
          [sortFlag]: true,
        }),
      })
    );
    expect(getMock.mock.calls[0][1].params).not.toHaveProperty('sort');
  });
});
