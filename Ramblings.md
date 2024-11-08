# Namaene: Ramblings


## DEV / Facebook post

It's spelled Djalil and pronounced as in [jellicle][jellicle-songs] but without the "ke" sound.
[jellicle-songs]: https://www.youtube.com/watch?v=Zfi9rBDW3s8"'Jellicle Songs for Jellicle Cats' | Cats The Musical - The Shows Must Go On!"

---

Originally titled "The Web Develoer Who Can't Develop Webapps" (a la [The Riddle Solver Who Can't Solve Riddles][len-riddle-solver])
I was going to (jokingly) describes myself as "cheap, overthinking, and practically poor"
but in LinkedIn-speak, I'm cost-cautious, detailed-planning, and resourceful/practical problem-solving.

[len-riddle-solver]: https://www.youtube.com/watch?v=znir_s4Q9BA "【Kagamine Len】 The Riddle Solver who can't solve Riddles ~English Subbed~ 【Vocaloid PV】"


## Questions

### Is INCRBY good enough?

`INCRBY` has built-in handling of non-existent Keys.
This behavior can simplify the initialization process, especially when dealing with a new month.

30K requests per month Vercel KV.
What does "request" mean? Seems like it means command.
A transactions will probably count as more than 1 request.


### What phonemes are supported?

Supported phonemes in TTS can be found in markdown tables
e.g. `articles/ai-services/speech-service/includes/phonetic-sets/text-to-speech/ar-eg.md`.
(See [the file][perma-ar-eg]).
- [ ] But what some other machine-readable format (like JSON or XML)?

[perma-ar-eg]: https://github.com/MicrosoftDocs/azure-docs/blob/9ef7db4bd69ad215a7e7143b62e6785ddacf2b61/articles/ai-services/speech-service/includes/phonetic-sets/text-to-speech/ar-eg.md


## Cache

- [Request: cache property - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Request/cache)
    * "It controls how the request will interact with the browser's HTTP cache."

- [ ] READ: [Hypertext Transfer Protocol (HTTP/1.1): Conditional Requests](https://www.rfc-editor.org/rfc/rfc7232)

### Caching with reverse proxies

It works out of the box with browser cache or reverse proxyies like HAProxy or Varnish.

- [x] [Caching | HAProxy config tutorials](https://www.haproxy.com/documentation/haproxy-configuration-tutorials/network-performance/caching/)
    * Visited 2023-12-13
    * Cache `max-age` diective: "Sets the seconds for an object to stay the cache; It can be overridden with a Cache-Control header."

- [Accelerate Your APIs by Using the HAProxy Cache](https://www.haproxy.com/blog/accelerate-your-apis-by-using-the-haproxy-cache)
    * Visited 2023-12-13
    * KAITO: Pretty much the same content as the Caching tutorial.
    * "In some cases, however, you’ll want the extra features of a shared cache server like Varnish. HAProxy’s caching feature is modest in comparison, but it might be exactly what you need for caching API responses."
    * By the way, caching for a very short period of time is known as _microcaching_.

- [HAProxy version 2.9.0-11 - Configuration Manual](https://docs.haproxy.org/2.9/configuration.html#6.1)
Cache / Limitation subsection includes:
> The cache won't store and won't deliver objects in these cases:
> . . .  
> If the response does not have an explicit expiration time (s-maxage or max-age
> Cache-Control directives or Expires header) or a validator (ETag or Last-Modified
> headers).

[Setup subsection](https://docs.haproxy.org/2.9/configuration.html#6.2.1-max-age):
> `max-age`
>
> The expiration is set as the lowest value between the s-maxage or max-age (in this order) directive in the
> Cache-Control response header and this value.

- [x] KAITO: Test.

---

END.
