# TODO

- [ ] Add error handling and inform the user.
    * Fails for whatever reason: `/?ipa=%CB%88ra%C9%AA&voice=en-US-BrianNeural`

- [ ] Upgrade to Next 15

- [ ] Add cron job to ensure Vercel KV database is not deleted after 30 days on inactivity.

- [ ] UX: Selecting the voice using a hierarchical dropdown (lang > locale > voice).

- [ ] UX: Warning the user if a character is not supported in the selected language.  
AFAIK, this information is not available from the SDK itself, but both Google Cloud and Azure have pages that list supported phonemes, stress levels, etc.  
See `Ramblings.md`.

- [ ] UX: Add Share button (Web Share API)

---

END.
