import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import NamaeneAzure from '../NamaeneAzure';

export async function GET(request: NextRequest) {

  const voices = await NamaeneAzure.getVoices();

  return NextResponse.json(voices, {
    headers: {
      // 7 days
      //'Cache-Control': 'public, max-age=604800, immutable',
    }
  });

}
