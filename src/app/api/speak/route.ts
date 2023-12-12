import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

import NamaeneAzure from '../NamaeneAzure';
import { getNewCountWith } from '../quota';

const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_MODIFIED = 304;
const HTTP_SERVICE_UNAVAILABLE = 503;

export async function GET(request: NextRequest) {
  //const _id = request.headers.get('x-vercel-id');

  const options = {
    ipa: request.nextUrl.searchParams.get('ipa') || '',
    voice: request.nextUrl.searchParams.get('voice') || '',
  };

  // Validate
  if (!validateOptions(options)) {
    return new NextResponse(null, { status: HTTP_BAD_REQUEST });
  }

  // - [ ] Generate ETag
  // hash(apiVersion + voice + ipa)

  // Check quota
  // We could do something like "double-checked locking" so we only increment the counter if we aren't above the max.
  // Pro: The counter stops at the last "exceeding" request. Maybe prevents integer overflows? No.
  // Con: That means making an additional call to Redis each time.
  //const usedCharacters = await getCurrentCount();
  const speakCost = NamaeneAzure.countCharacters(options);
  const usedCharacters = await getNewCountWith(speakCost);
  if (usedCharacters > NamaeneAzure.MAX_CHARACTERS_PER_MONTH) {
    return new NextResponse(null, { status: HTTP_SERVICE_UNAVAILABLE });
  }

  const data = await NamaeneAzure.speak(options);
  const contentType = NamaeneAzure.mimeType;

  return new NextResponse(data, {
    headers: {
      'Content-Type': contentType,
      // 1 year
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
    status: 200,
  });

}

/**
 * @returns is valid?
 */
function validateOptions(opts: any) {
  const _ipa = opts.ipa;
  const _voice = opts.voice;

  if (!_ipa || _ipa.length === 0) {
    return false;
  }

  // TODO: Check that the voice actually exists
  if (!_voice || _voice.length === 0) {
    return false;
  }

  return true;
}
