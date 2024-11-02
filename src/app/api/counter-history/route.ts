import { NextResponse } from 'next/server';

import { getCounterHistory } from '../counter';

export const dynamic = 'force-dynamic'; // defaults to force-static

export async function GET() {

  const result = await getCounterHistory();

  return NextResponse.json(result, {
    headers: {
      // Don't cache
      'Cache-Control': 'no-cache, no-store',
    }
  });

}
