"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseSpeechRecognitionOptions {
    lang?: string;
    continuous?: boolean;
    interimResults?: boolean;
}

interface UseSpeechRecognitionReturn {
    isListening: boolean;
    transcript: string;
    interimTranscript: string;
    isSupported: boolean;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
}

export function useSpeechRecognition(
    options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
    const {
        lang = "id-ID",
        continuous = true,
        interimResults = true,
    } = options;

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [isSupported, setIsSupported] = useState(true);
    const recognitionRef = useRef<any>(null);
    const isManuallyStoppedRef = useRef(false); // Track if user manually stopped

    useEffect(() => {
        if (typeof window === "undefined") return;

        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.lang = lang;

        recognition.onstart = () => {
            setIsListening(true);
            isManuallyStoppedRef.current = false;
        };

        recognition.onend = () => {
            setIsListening(false);
            setInterimTranscript("");

            // Auto-restart if it wasn't manually stopped
            if (continuous && !isManuallyStoppedRef.current) {
                try {
                    recognition.start();
                } catch (e) {
                    console.log("Auto-restart failed, might need user interaction");
                }
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            if (event.error === "no-speech") {
                // Ignore no-speech, let onend handle restart
            }
        };

        recognition.onresult = (event: any) => {
            let finalTranscript = "";
            let interimText = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript + " ";
                } else {
                    interimText += result[0].transcript;
                }
            }

            if (finalTranscript) {
                setTranscript((prev) => prev + finalTranscript);
            }
            setInterimTranscript(interimText);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                isManuallyStoppedRef.current = true;
                recognitionRef.current.stop();
            }
        };
    }, [lang, continuous, interimResults]);

    const startListening = useCallback(() => {
        if (!recognitionRef.current || isListening) return;

        try {
            setTranscript("");
            setInterimTranscript("");
            isManuallyStoppedRef.current = false;
            recognitionRef.current.start();
        } catch (error) {
            console.error("Failed to start speech recognition:", error);
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (!recognitionRef.current) return;

        try {
            isManuallyStoppedRef.current = true;
            recognitionRef.current.stop();
        } catch (error) {
            console.error("Failed to stop speech recognition:", error);
        }
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript("");
        setInterimTranscript("");
    }, []);

    return {
        isListening,
        transcript,
        interimTranscript,
        isSupported,
        startListening,
        stopListening,
        resetTranscript,
    };
}
