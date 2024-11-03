import { Metadata } from 'next';

import SpeakForm from "./SpeakForm";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: {}
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  const { ipa } = searchParams;
  if (typeof ipa === 'string') {
    return {
      openGraph: {
        images: `/api/og?ipa=${encodeURIComponent(ipa)}`,
      }
    };
  } else {
    return {};
  }
}

export default function Home() {

  return (
    <div className="min-h-screen bg-orange-50 p-4 flex items-center justify-center">
      <div className="mx-auto max-w-lg w-full p-4 bg-white border-none shadow-none">
        <div className="pb-6 text-center">
          <h1 className="text-5xl font-extrabold mb-2">
            <span className="text-orange-500">Namae</span>
            <span className="text-orange-600">ne</span>
          </h1>
          <p className="text-sm text-gray-500">IPA vocalizer. Pronouncing names and stuff.</p>
        </div>
        <div className="space-y-4 pt-2">

          <SpeakForm />

          <div className="pt-6 text-center text-xs text-gray-500">
            <a
              href="/counter-history"
              className="text-orange-600 hover:underline"
            >
              Counter history
            </a>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            By Abdeldjalil Hebal
            {" | "}
            <a
              href="https://github.com/djalilhebal/namaene"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              GitHub
            </a>
            {" | "}
            <a
              href="https://dev.to/djalilhebal/pronouncing-names-and-stuff-using-tts-5a81"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:underline"
            >
              DEV post
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
