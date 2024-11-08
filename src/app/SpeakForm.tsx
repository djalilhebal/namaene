'use client';

import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { Loader2, Volume2, Pause } from 'lucide-react';
import useSWRImmutable from 'swr/immutable';
import Select from 'react-select';

export default function SpeakForm() {
  // HACK:
  const [mounted, setMounted] = useState(false);

  const [buttonState, setButtonState] = useState<'ready' | 'loading' | 'playing'>('ready');
  const [ipa, setIpa] = useState(() => getUrlState().ipa || "ˈraɪzli");
  const [voice, setVoice] = useState(() => getUrlState().voice || 'en-US-JennyNeural');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: voices, isLoading: isLoadingVoices } = useSWRImmutable<NaVoiceInfo[]>('/api/voices', (url: string) => fetch(url).then(res => res.json()));
  const { voiceOptions, defaultVoiceOption } = useMemo(() => {
    let voiceOptions: { value: string; label: string }[] = [];
    let defaultVoiceOption = { label: voice, value: voice };

    if (voices) {
      voiceOptions = voices.map((voice) => ({
        value: voice.name,
        label: `${voice.namePretty || voice.name} - ${voice.localePretty || voice.locale}`,
      }));
      defaultVoiceOption = voiceOptions.find((opt) => opt.value === voice) || defaultVoiceOption;
    }

    return { voiceOptions, defaultVoiceOption };
  }, [voices, voice]);

  const handleSpeak = useCallback(() => {
    setButtonState('loading');
    setUrlState({ ipa, voice });

    const url = new URL('/api/speak', window.location.toString());
    url.searchParams.set('ipa', ipa);
    url.searchParams.set('voice', voice);
    const speakUrl = url.toString();

    const $audio = audioRef.current!;
    $audio.src = '';

    $audio.addEventListener('canplaythrough', () => {
      $audio.play();
      setButtonState('playing');
    }, { once: true });

    $audio.onerror = () => setButtonState('ready');

    $audio.onended = () => setButtonState('ready');

    $audio.src = speakUrl;
  }, [ipa, voice]);

  const getButtonText = () => {
    switch (buttonState) {
      case 'loading':
        return 'Loading...';
      case 'playing':
        return 'Playing';
      default:
        return 'Speak';
    }
  }

  const getButtonIcon = () => {
    switch (buttonState) {
      case 'loading':
        return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
      case 'playing':
        return <Pause className="mr-2 h-4 w-4" />;
      default:
        return <Volume2 className="mr-2 h-4 w-4" />;
    }
  }

  if (!mounted) {
    return null; // Prevent rendering on the server
  }

  return (<>
    <div className="space-y-2">
      <label htmlFor="ipa" className="block text-sm font-medium text-gray-700">IPA Transcription</label>
      <input
        id="ipa"
        type="text"
        placeholder="Enter IPA text (e.g. ˈraɪzli)"
        value={ipa}
        onChange={(e) => setIpa(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 font-mono"
      />
    </div>
    <div className="space-y-2">
      <label htmlFor="voice" className="block text-sm font-medium text-gray-700">Voice</label>
      <Select
        id="voice"
        options={voiceOptions}
        value={defaultVoiceOption}
        onChange={(selectedOption) => setVoice(selectedOption?.value || '')}
        isLoading={isLoadingVoices}
        isDisabled={isLoadingVoices}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
    <button
      className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 ease-in-out flex items-center justify-center
              ${buttonState === 'ready' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              ${buttonState === 'loading' ? 'bg-orange-300 cursor-wait' : ''}
              ${buttonState === 'playing' ? 'bg-orange-600' : ''}
              disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={handleSpeak}
      disabled={buttonState !== 'ready' || !ipa || !voice}
    >
      {getButtonIcon()}
      {getButtonText()}
    </button>
    <audio className="hidden" controls ref={audioRef} />
  </>);
}

interface NaVoiceInfo {
  name: string;
  namePretty?: string;
  locale: string;
  localePretty?: string;
}

function getUrlState() {
  if (typeof window === 'undefined') {
    return {};
  }

  const params = new URLSearchParams(window.location.search);

  return {
    ipa: params.get('ipa'),
    voice: params.get('voice'),
  }
}

function setUrlState({ ipa, voice }: { ipa: string, voice: string }) {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set('ipa', ipa);
  url.searchParams.set('voice', voice);

  history.pushState({}, '', url.href);
}

