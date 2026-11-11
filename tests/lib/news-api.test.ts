import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchNews } from '@/lib/clientApi';

describe('fetchNews', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends the search query and pagination parameters to the news proxy', async () => {
    const newsResponse = { page: 2, perPage: 6, totalPages: 4, results: [] };
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(newsResponse), { status: 200 })
    );

    await expect(fetchNews('  cats  ', 2)).resolves.toEqual(newsResponse);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/news?page=2&perPage=6&query=cats',
      { cache: 'no-store' }
    );
  });

  it('rejects when the news proxy returns an error', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: 'News service unavailable' }), { status: 503 })
    );

    await expect(fetchNews()).rejects.toThrow('News service unavailable');
  });
});
