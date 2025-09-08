"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeakOptions {
    text: string;
    lang: 'en-US' | 'hi-IN';
}

export const useSpeechSynthesis = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthRef.current = window.speechSynthesis;
        }
    }, []);

    const speak = useCallback(({ text, lang }: SpeakOptions) => {
        if (synthRef.current && !isSpeaking) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            synthRef.current.speak(utterance);
        }
    }, [isSpeaking]);

    const cancel = useCallback(() => {
        if (synthRef.current && isSpeaking) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    }, [isSpeaking]);
    
    useEffect(() => {
        const synth = synthRef.current;
        return () => {
            if (synth) {
                synth.cancel();
            }
        }
    }, []);

    return { isSpeaking, speak, cancel };
};
