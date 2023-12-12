# Azure TTS

- [Why Azure storage account has two keys? - Stack Overflow](https://stackoverflow.com/a/46832620)
    * KAITO: I also wondered about this, and this answer makes a lot of sense.
    * TLDR: Regenerating keys without service interruption. Interesting.

---

- [x] [Text to speech quickstart - Speech service - Azure AI services | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/get-started-text-to-speech?tabs=windows%2Cterminal&pivots=programming-language-javascript)

---

- [Billable characters / Text to speech overview - Speech service - Azure AI services | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech#billable-characters)
    * TLDR: Just count every byte.
    Or maybe length.

- [Speech Synthesis Markup Language (SSML) document structure and events - Speech service - Azure AI services | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-structure)
    * TLDR: You gotta specify both `<speak>` and `<voice>`. You can't just use `<phoneme>` as root.

- [Language support - Speech service - Azure AI services | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts)
    * Lists Arabic.
    
- [Speech phonetic alphabets - Speech service - Azure AI services | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-ssml-phonetic-sets)
    * Lists "3a" for `ar-EG`.
    * [ ] What about other `ar` locales?
    * [ ] Does that mean it supports Arabic characters in `<phoneme>`?

- [x] SKIM: Pronunciation with Speech Synthesis Markup Language (SSML) - Speech service - Azure AI services | Microsoft Learn
https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-pronunciation

---

FIN.
