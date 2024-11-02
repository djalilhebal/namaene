# Pronouncing names and stuff
#Vercel #NextJS #Azure #TextToSpeech

I'm Abdeldjalil. Go ahead, try saying my name. You probably don't know how to pronounce it, and that's fine.

Let's consider the diverse world of names out there.
Some are straightforward like Alice, while others might need a bit of explaining, like "Djalil, but the 'D' is silent".
And then there are those complex ones like Wriothesley. Wikipedia might tell you it's pronounced `/ˈraɪəθsli/` (RYE-thes-lee), Genshin Impact might suggest `/ˈraɪzli/` (RYZE-lee), but others just call him `/ˈraɪ.oʊ/` (RAI-oh).
[Wrio is super omega cool][wrio-official], don't you agree? [Just look at him!][wrio-fan]

[wrio-wikipedia]: https://en.wikipedia.org/wiki/Wriothesley
[wrio-genshin]: https://genshin-impact.fandom.com/wiki/Wriothesley "Genshin Impact Wiki"
[wrio-official]: https://www.youtube.com/watch?v=kdQOis0VRoo "Character Demo - Wriothesley: Art of Improvisation"
[wrio-fan]: https://www.youtube.com/watch?v=dq3Vd3LZTUM "Wriothesley fan edit by Kawaimi Wolf"

Let's refocus—

I'm the kind of person who loves diving into new concepts and words. Even when I'm offline, I rely on dictionaries (physical or some Wiktionary-based app) as my go-to resource to learn new terms, and this habit propelled me into learning IPA transcription to pronounce them properly.
Look at me, trying to romanticize a simple project that helps people pronounce names and stuff.

Let's just get into it.

<!--
<details>
<summary>Honestly?</summary>
-->
{% details Honestly? %}
Why make this thing?

To showcase that I can use cloud-y stuff like AWS or Google Cloud.

Ended up using Vercel and Azure because I ain't paying no money for this thing, but I want it to work "forever".

I even resorted to using Next.js when a simple page would do.

The things we do for recognition. :p
{% enddetails %}
<!--
</details>
-->


## Naming it

This is the most important step—coming up with a name that captures the project's essence.

The goal was to make an _IPA vocalizer_ with a focus on pronouncing names:
A name's pronunciation, vocalization, or sound = Name + Sound = _Namae_ (Japanese for "name") + _Ne_ (Japanese for "sound") = **_Namaene_**.

The name also draws parallels to Vocaloid, a singing voice synthesizer, and specifically characters like Miku **Hatsune** (First + Sound) and Len **Kagamine** (Mirror + Sound).

Perfect. Now, we just need to make it.


## Building it

The premise is simple: Tell the TTS engine to read the IPA text and return the audio file to the user.


### Synthesizing

Speech Synthesis Markup Language (SSML) is an XML-based markup language that lets you adjust text-to-speech output attributes such as pitch, pronunciation, speaking rate, and more.

The `<phoneme>` tag accepts pronunciation transcription in IPA:
```xml
  <phoneme alphabet="ipa" ph="ˈraɪzli">Wriothesley</phoneme>
```

Since we are specifying the word's pronunciation, we do not need to include it:
```xml
  <phoneme alphabet="ipa" ph="ˈraɪzli"></phoneme>
```

We can go further. Since the XML element contains no children, we can use a self-closing tag:
```xml
  <phoneme alphabet="ipa" ph="ˈraɪzli" />
```

Let's imagine we've written a `generateSsml(ipa)`.

Next, we will call some TTS engine or service to speak the SSML.

Return the audio data ("speech production") with appropriate headers (mainly `Content-Type`), and let the client (e.g. browser) deal with it.

## Choosing a TTS service

### Requirements

This is what we are looking for:

- Buzzwordy enough. It should be something listable on a LinkedIn Skills section (serverless, distributed, frameworks, blockchain, and can I fit WordPress somewhere?).

- **Free**. We are not willing to pay anything.

- **Forever**. It should work "forever".

- **IPA** support, probably via **SSML**.


### Options

- Amazon Web Service (AWS)
    * SSML? Yes.
        + [Generating Speech from SSML Documents | Amazon Polly](https://docs.aws.amazon.com/polly/latest/dg/ssml.html)
    * Free? Not really. Only "12 months free", **not** "free forever".

- Microsoft Azure
    * SSML? Yes.
        + [Pronunciation with Speech Synthesis Markup Language (SSML) - Speech service - Azure AI services | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-pronunciation)

    * Free? Yes, but is it enough?
        + Text to Speech / 0.5 million characters free per month.
        [Speech Services Pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/)

- Google Cloud
    * SSML? Yes.
    * Free? Yes, enough.
        + Free per month / Standard voices / 0 to 4 million characters (https://cloud.google.com/text-to-speech/pricing)
        + Also, "new customers get $300 in free credits to spend on Text-to-Speech." (https://cloud.google.com/text-to-speech/)

In short, AWS seems cool and I like its voices (even since they were called Ivona), but I needed something that's more future-proof.

Both Microsoft and Google are fine, but having 4M characters per month seems more appealing than 0.5M.
[Checking Google Cloud's TTS samples][google-tts-sample], I even liked their SDK (all request config in one object + you can just `await` the response).
[google-tts-sample]: https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/73de2e8035eab700cdb61334456c1fec683187e3/texttospeech/synthesize.js#L42

So, Google Cloud it is... Or not.

For some reason, my credit card got declined, so I resorted to using Microsoft's services since I already had an account.

So, for now, Azure it is.

### Using the service

In a perfect world, there would be a simple `async function speakSsml(options)` that resolves to the audio data as a `Blob` or an `ArrayBuffer`.
Google Cloud SDK does something similar to what we want:
```js
const textToSpeech = require('@google-cloud/text-to-speech');

async function synthesizeSsml(ssml) {
  const client = new textToSpeech.TextToSpeechClient();

  const request = {
    input: {ssml: ssml},
    voice: {languageCode: 'en-US', ssmlGender: 'FEMALE'},
    audioConfig: {audioEncoding: 'MP3'},
  };

  const [response] = await client.synthesizeSpeech(request);
  // Do something with the audio data: response.audioContent
}
```

While in Azure's SDK, we need to wrap the call in a `Promise`:
```js
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

async function synthesizeSsml(ssmlText) {
    const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Ogg24Khz16BitMonoOpus;
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    return await new Promise((resolve, reject) => {
        synthesizer.speakSsmlAsync(ssmlText,
            function (response) {
                if (response.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    resolve(response.audioData);
                } else {
                    reject(response.errorDetails);
                }
            },
            function (err) {
                reject(err);
            });

    });
}
```

Decent.

Now, let's imagine that the backend framework we will be using uses Fetch API interfaces, namely [`Request`][mdn-request] and [`Response`][mdn-response].
That would be awesome since `Response` accepts a body of type `ArrayBuffer`, which is convenient for our use case.

[mdn-request]: https://developer.mozilla.org/en-US/docs/Web/API/Request
[mdn-response]: https://developer.mozilla.org/en-US/docs/Web/API/Response

A handler for `GET /api/speak/?ipa={ipa}` can be written like:
```js
async function GET(request) {
  const {searchParams} = new URL(request.url);
  const ipa = searchParams.get('ipa');

  const ssml = generateSsml(ipa);
  const data = await speakSsml(ssml);
  const contentType = 'audio/ogg';

  return new Response(data, {
      headers: {
        'Content-Type': contentType,
        status: 200,
    });
}
```

We added a `Content-Type` header to help clients handle the response correctly.

Its value is set to `audio/ogg` because that's what we configured the SDK to return. By default, it uses some `wav` format, but you can change it to a few other formats like `mp3` or `ogg`. Both of the mentioned alternatives use less space (they are compressed) and offer good quality. From my testing, `ogg` seems a bit better in terms of quality and size. But it ultimately does not matter whichever you pick.


## Caching

Speaking of headers and optimization, to improve the user experience (latency) and in order not to exceed our quota, we can tell the client it should cache the result forever.

Let's add a [Cache-Control][mdn-cache-control] header to the response.
The following says: Anyone (`public`) can cache it; it stays fresh for 1 year (`31536000` seconds); no need to revalidate since it won't change (`immutable`) while it's fresh".
```diff
+    'Cache-Control': 'public, max-age=31536000, immutable',
```

[mdn-cache-control]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control


## Handling quota

Caching doesn't solve our issue. We _must_ not exceed the quota.

For all providers I checked (meaning Azure and Google Cloud), _you_ need to ensure you don't go above the free monthly quota!

Their Monitoring and Billing APIs are not good enough: We can (and probably will) be notified to pause our usage **after** we exceed the quota. We ain't paying nothing, not a single cent.
(For example, see [Google's guide about stopping billing][google-billing-stop]: "There is a delay between incurring costs and receiving budget notifications.")

[google-billing-stop]: https://cloud.google.com/billing/docs/how-to/notify#cap_disable_billing_to_stop_usage

We need to implement our own quota tracker.

### What to count

Calculating the cost of each call differs from provider to provider, and even from service to service.

**Tags**: Some SSML elements (e.g. `speak` and `mark`) are omitted.

**Whitespace** is usually counted.

But what about the **characters**?

Azure specifically counts each Chinese character as 2 chars. Google Cloud says it counts each Japanese character as 1 character.
But what does that even mean?

Consider: The Japanese word for love is 愛, pronounced _Ai_, as in _Ai Kotoba_ (_Love Words_ feat. Hatsune Miku).
How many characters are there?
- JavaScript encodes strings in UTF-16. The word's `length` is 1.
- Azure says Chinese characters (and other multi-code ones) count as 2, so the word's cost is 2.
- Google Cloud says each Japanese character is considered one character. Only hiragana and katakana? Does that include kanji ("Chinese characters")? Does 愛 count as 1 character?
- 愛 is a multi-byte character. Specifically, it is encoded in 3 bytes.

What about emojis if the user decides to send them for whatever reason?

The safest bet is to use the SSML text's length in bytes as character count, as Google Cloud docs suggest ("\[...] the number of characters will be equal to or less than the number of bytes represented by the text.").

We could optimize this, but, for now, let's play it safe.

Using [`TextEncoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/encode):
```js
function countCharacters(ssmlText) {
    const textEncoder = new TextEncoder();
    // returns Uint8Array
    const encoded = textEncoder.encode(ssmlText);
    return encoded.length;
}
```

### Where to keep track of the count

One thing is certain: We cannot\* be sure how requests are going to be handled.
<small>* Or should nor or do not want to bother with.</small>

Namaene may be deployed on some distributed, horizontally scalable platform. Or it might be running locally: Node executes requests concurrently.
Or both. You know, production vs dev.

In short, we need a way to keep track of the counter between isolated processes. Think: Transactions or similar atomic operations.

Redis sounds like a good solution.

Whena request arrives, `generateSsml`, `countCharacters(/* in the */ ssmlText)`, then increment the counter like:
```
INCRBY totalCount requestCount
```

### Resetting the counter

The monthly quota resets... every... month.

We need to reset our counter.
There are multiple options to do it, including:
1. A `cron` job.
2. Redis transactions.
3. Redis functions or scripts.
4. Do not reset anything.

The last option is appealing because it seems simple and overcomes some limitations:

**`INCRBY` is <abbr title="overpowered">op</abbr>.**

`INCRBY` has built-in handling of non-existent Keys.
This behavior can simplify the initialization process, especially when dealing with a new month.

It deals with overflows. The command will fail if its execution would cause an overflow.

All of this means we do not need to `GET` the current value and then increment it (a la _double-checked locking_).

Spoiler for the next section: Vercel KV (free/Hobby) also has a quota of 30k requests per month. What does "request" mean?... Let's not get into that.
At any rate, the fewer commands we use, the better.

Just use a different key each month (e.g. "counter:yyyy-mm"):
```js
function getCurrentCountKey() {
    // "The timezone is always UTC" - toISOString on MDN
    const nowIso = new Date().toISOString();
    const yearMonth = nowIso.substring(0, 'yyyy-mm'.length);
    const counterKey = `counter:${yearMonth}`;

    return counterKey;
}
```

`INCRBY counter:2023-12 500` increments the counter by 500 and then returns the new value.
Next month, the counter key will automatically change to `counter:2024-01`. `INCRBY` will not find this key, so it will be set to 0 before incrementing.

Having decided on this ~~lazy~~ practical approach, we can think of it as an opportunity to implement another important feature: Maintaining a historical record of monthly usage/counts.

To get a list of all counter keys (then iterate over them):
```
KEYS counter:*
```

A better approach might be to use hash commands: [`HINCRBY`](https://redis.io/commands/hincrby/) and [`HGETALL`](https://redis.io/commands/hgetall/).
This is not of high priority.

### Deploying

Having already tried Netlify (in 2020) and Vercel (recently), I decided to use Vercel mostly because I like their website's design—

I mean the UX and DX (docs, APIs, and all). Plus, they provide or are behind some of the technologies we ~~wanted to~~ use:
- Serverless Redis
- Serverless functions (e.g. the `/api/speak` handler)
- Next.js (it uses [Fetch API-based classes][next-functions])

[next-functions]: https://nextjs.org/docs/pages/api-reference/functions/next-server "Functions: NextRequest and NextResponse | Next.js"

This is a rough sketch of what we ended up with:

`GET /api/speak?voice={voice}&ipa={ipa}`

![System arch overview](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0kq3yfk8pajp3wwf4v7g.png)


## Conclusion

This was a simplified overview of the project and some of the technical decisions I had to make.

It is far from perfect, but... I'm learning.

Feel free to explore the [**project's repo**](https://github.com/djalilhebal/namaene) or [**try it live**](https://namaene.vercel.app/).

Thanks for reading.

— Djalil (PS: The D is silent.)

_その名前をさあ、言ってごらん このぼくの名前を！_
