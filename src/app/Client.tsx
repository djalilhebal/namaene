'use client';

import { useMemo, useRef, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import Select from 'react-select';
import { NaVoiceInfo } from './api/NamaeneAzure';


export default function Client() {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [ipa, setIpa] = useState(() => getUrlState().ipa || "ˈraɪzli");
    const [voice, setVoice] = useState(() => getUrlState().voice || 'en-US-JennyNeural');

    const { data: voices, isLoading: isLoadingVoices } = useSWRImmutable<NaVoiceInfo[]>('/api/voices', (url: string) => fetch(url).then(res => res.json()));
    const { voiceOptions, defaultVoiceOption } = useMemo(() => {
        let voiceOptions: any[] = [];
        let defaultVoiceOption: any = { label: voice, value: voice };

        if (!voices) {
            return { voiceOptions, defaultVoiceOption };
        }

        voiceOptions = voices.map(v => {
            return {
                value: v.name,
                label: `${v.namePretty || v.name} - ${v.localePretty || v.locale}`,
            };
        });
        defaultVoiceOption = voiceOptions.find(x => x.value === voice);

        return { voiceOptions, defaultVoiceOption };
    }, [voices]);

    const canSpeak = ipa.length > 0 && voice;

    function speak() {
        setUrlState({ ipa, voice });

        //const speakUrl = `/api/speak?voice=${voice}&ipa=${encodeURIComponent(ipa)}`;
        const url = new URL('/api/speak', window.location.toString());
        url.searchParams.set('ipa', ipa);
        url.searchParams.set('voice', voice);
        const speakUrl = url.toJSON();
    
        const $audio = audioRef.current!;
        $audio.src = '';
        $audio.addEventListener('canplaythrough', () => $audio.play(), { once: true });
        $audio.src = speakUrl;
    }

    function onVoiceChange(opt: any) {
        setVoice(opt.value);
    }

    return (
        <main>

            <label className='block'>
                IPA
                /
                <input
                    type="text" autoComplete="off" value={ipa} onChange={ev => setIpa(ev.target.value)}
                    className='border-2 border-gray-300 bg-white'
                />
                /
            </label>

            <label className='block'>
                Voice
                <Select placeholder="Select..." onChange={onVoiceChange}
                    options={voiceOptions} defaultValue={defaultVoiceOption} /* defaultInputValue={voice} */
                    isDisabled={isLoadingVoices} isLoading={isLoadingVoices}
                    className='inline-block w-max'
                />
            </label>

            <button
                disabled={!canSpeak} onClick={speak}
                className="focus:outline-black text-white text-sm py-2.5 px-4 border-b-4 border-orange-600 bg-orange-500 hover:bg-orange-400">
                Speak
            </button>

            <div>
                <audio className='mx-auto' controls ref={audioRef} />
            </div>
        </main>
    );
}

function getUrlState() {
    if (typeof window === 'undefined') return {};

    const params = new URLSearchParams(window.location.search);
    return {
        ipa: params.get('ipa'),
        voice: params.get('voice'),
    }

}

function setUrlState({ ipa, voice }: { ipa: string, voice: string }) {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    url.searchParams.set('ipa', ipa);
    url.searchParams.set('voice', voice);

    history.pushState({}, '', url.href);
}
