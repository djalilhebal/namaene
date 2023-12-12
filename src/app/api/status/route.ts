import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getCurrentCount } from '../quota';

export const dynamic = 'force-dynamic'; // defaults to force-static

export async function GET(request: NextRequest) {

  const result = {
    currentCount: await getCurrentCount(),
  }

  return NextResponse.json(result, {
    headers: {
      // Don't cache
      //'Cache-Control': 'no-store',
    }
  });

}
