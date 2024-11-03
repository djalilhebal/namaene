import { NextRequest, NextResponse } from 'next/server';

import NamaeneAzure from '../NamaeneAzure';
import { getNewCountWith } from '../counter';

const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_MODIFIED = 304;
const HTTP_INTERNAL_SERVER_ERROR = 500;
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

  // Check quota
  const speakCost = NamaeneAzure.countCharacters(options);
  const usedCharacters = await getNewCountWith(speakCost);
  if (usedCharacters > NamaeneAzure.MAX_CHARACTERS_PER_MONTH) {
    return new NextResponse(null, { status: HTTP_SERVICE_UNAVAILABLE });
  }

  try {
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
  } catch (error) {
    console.error(error);
    return new NextResponse(null, { status: HTTP_INTERNAL_SERVER_ERROR });
  }

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
