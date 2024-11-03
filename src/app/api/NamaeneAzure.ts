import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import type { SpeechSynthesizer } from 'microsoft-cognitiveservices-speech-sdk';

interface SpeakOptions {
  ipa: string,

  voice: string, // e.g. 'en-US-JennyNeural'

  lang?: string, // e.g. 'en-US'. 'string' is also accepted for some reason.
}

/**
 * Namaene VoiceInfo.
 */
export interface NaVoiceInfo {

  /**
   * e.g. "en-US-JennyNeural".
   */
  name: string,

  /**
   * e.g. "Jenny".
   */
  namePretty?: string,

  /**
   * e.g. "en-US".
   */
  locale: string,

  /**
   * e.g. "English (United States)".
   */
  localePretty?: string,

  /**
   * Supported IPA symbols (phonemes).
   * YAGNI, I know, I know...
   */
  ipa?: string[],

}


/**
 * Namaene implementation using
 * Azure Cognitive Services - Speech
 */
export default class NamaeneAzure {

  /**
   * 0.5M characters per month.
   */
  public static readonly MAX_CHARACTERS_PER_MONTH = 500000;

  public static readonly mimeType = 'audio/ogg';

  public static async getVoices() {
    //@ts-ignore
    const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
    let synthesizer = new sdk.SpeechSynthesizer(speechConfig/*, audioConfig*/);

    const voicesResult = await synthesizer.getVoicesAsync();
    const voices: Array<NaVoiceInfo> = voicesResult.voices.map(privVoice => {
      return {
        name: privVoice.shortName,
        namePretty: privVoice.displayName,
        locale: privVoice.locale,
        localePretty: privVoice.localeName,
      };
    });
    return voices;
  }

  /**
   * Get audio
   * 
   * @remarks
   * - Why ArrayBuffer?
   *   Supported by `Response` (and `NextResponse` extends it)
   *      + See https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
   * 
   * @returns audio output
   */
  public static async speak(input: SpeakOptions): Promise<ArrayBuffer> {
    const ssmlText = NamaeneAzure.generateSsml(input);

    // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
    //@ts-ignore
    const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
    speechConfig.speechSynthesisVoiceName = 'en-US-JennyNeural';
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Ogg24Khz16BitMonoOpus;
    let synthesizer: SpeechSynthesizer | null = new sdk.SpeechSynthesizer(speechConfig);

    return await new Promise<ArrayBuffer>((resolve, reject) => {
      if (!synthesizer) {
        reject('synthesizer is null');
        return;
      }
      synthesizer.speakSsmlAsync(ssmlText,
        function (response) {
          if (response.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            if (response.audioData.byteLength === 0) {
              reject('audioData is empty');
            } else {
              resolve(response.audioData);
            }
          } else {
            reject(response.errorDetails);
          }
          synthesizer?.close();
          synthesizer = null;
        },
        function (err) {
          reject(err);
          console.trace("err - " + err);
          synthesizer?.close();
          synthesizer = null;
        });

    });
  }

  public static generateSsml(input: SpeakOptions) {
    const { ipa, voice } = input;
    // <phoneme ph="${ipa}" alphabet="ipa"></phoneme>
    // <phoneme ph="${ipa}" alphabet="ipa"/>
    // TODO: Should set `lang` to a valid lang code? Does it change anything?
    const ssmlText =
      `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="string">
<voice name="${voice}">
<phoneme ph="${ipa}" alphabet="ipa"/>
</voice>
</speak>`;

    return ssmlText;
  }

  /**
   * How many characters will be used?
   * 
   * It may not be accurate, but it will always return a larger count than what's actually counted by the service provider.
   * Good enough.
   */
  public static countCharacters(input: SpeakOptions) {
    const ssmlText = NamaeneAzure.generateSsml(input);
    return calculateByteSize(ssmlText);
  }

}

function calculateByteSize(str: string) {
  const textEncoder = new TextEncoder();
  const encoded = textEncoder.encode(str);
  return encoded.length;
}
