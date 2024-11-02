import { NextResponse } from 'next/server';

import { getCurrentCount } from '../counter';

export const dynamic = 'force-dynamic'; // defaults to force-static

export async function GET() {

  const result = {
    currentCount: await getCurrentCount(),
  };

  return NextResponse.json(result, {
    headers: {
      // Don't cache
      'Cache-Control': 'no-cache, no-store',
    }
  });

}
