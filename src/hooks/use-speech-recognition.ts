"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognitionOptions {
    onResult: (transcript: string) => void;
    onError: (error: string) => void;
}

export const useSpeechRecognition = ({ onResult, onError }: SpeechRecognitionOptions) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleError = (error: string, message?: string) => {
        let errorMessage = message || 'An unknown error occurred.';
        switch (error) {
            case 'not-allowed':
                errorMessage = 'Microphone access denied. Please enable it in your browser settings.';
                break;
            case 'no-speech':
                errorMessage = 'No speech was detected. Please try again.';
                break;
            case 'audio-capture':
                errorMessage = 'Microphone not available. Please ensure it is connected and enabled.';
                break;
            case 'aborted':
                // This can happen if the user clicks the button too fast. We can choose to ignore it.
                return;
        }
        onError(errorMessage);
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            onError("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                onResult(finalTranscript);
                 if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            }
        };

        recognition.onerror = (event) => {
            handleError(event.error, event.message);
        };

        recognition.onend = () => {
            setIsListening(false);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            recognition.stop();
        };
    }, [onResult, onError]);

    const startListening = useCallback((lang: 'en-US' | 'hi-IN') => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.lang = lang;
            recognitionRef.current.start();
            setIsListening(true);
            timeoutRef.current = setTimeout(() => {
                if(isListening) {
                    stopListening();
                }
            }, 5000); // Stop listening after 5 seconds of silence
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
             if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, [isListening]);

    return {
        isListening,
        startListening,
        stopListening,
    };
};
