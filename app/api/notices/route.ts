// import { isAxiosError } from 'axios';
// import { NextRequest, NextResponse } from 'next/server';
// import { api } from '../api';

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);

//     const response = await api.get('/notices', {
//       params: Object.fromEntries(searchParams),
//     });

//     return NextResponse.json(response.data, { status: response.status });
//   } catch (error) {
//     if (isAxiosError(error)) {
//       if (error.response?.status === 404) {
//         return NextResponse.json({ error: 'Notices service not found' }, { status: 404 });
//       }

//       return NextResponse.json(
//         { error: error.message, response: error.response?.data },
//         { status: error.response?.status ?? 500 }
//       );
//     }

//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { api } from '../api';
import { isAxiosError } from 'axios';
import { FetchPetsResponse, NoticesQueryParams } from '@/types/notices';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const params: NoticesQueryParams = {
      keyword: searchParams.get('keyword') || undefined,

      page: Number(searchParams.get('page') ?? 1),
      limit: Number(searchParams.get('perPage') ?? 6),

      category: (searchParams.get('category') as NoticesQueryParams['category']) || undefined,

      sex: (searchParams.get('sex') as NoticesQueryParams['sex']) || undefined,

      species: (searchParams.get('species') as NoticesQueryParams['species']) || undefined,

      locationId: searchParams.get('locationId') || undefined,

      byPopularity:
        searchParams.get('byPopularity') !== null
          ? searchParams.get('byPopularity') === 'true'
          : undefined,

      byPrice:
        searchParams.get('byPrice') !== null ? searchParams.get('byPrice') === 'true' : undefined,
    };

    const res = await api.get<FetchPetsResponse>('/notices', { params });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 500;

      if (status === 404) {
        return NextResponse.json({ error: 'Notices not found' }, { status: 404 });
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
