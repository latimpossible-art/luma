"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Send } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface JournalProps {
    mood?: string;
    onComplete?: (entry: string) => void;
    className?: string;
}

export function Journal({ mood, onComplete, className }: JournalProps) {
    const [entry, setEntry] = useState("");

    // Use the optimized speech recognition hook
    const {
        isListening,
        transcript,
        interimTranscript,
        isSupported,
        startListening,
        stopListening,
    } = useSpeechRecognition({ lang: "id-ID" });

    // Update entry when transcript changes
    useEffect(() => {
        if (transcript) {
            setEntry(prev => prev + transcript);
        }
    }, [transcript]);

    const prompts: Record<string, string> = {
        happy: "Apa yang membuatmu tersenyum hari ini? 😊",
        calm: "Apa yang membuatmu merasa damai saat ini? 🌿",
        neutral: "Bagaimana harimu sejauh ini?",
        sad: "Apa yang ada di pikiranmu? Ceritakan saja... 💙",
        anxious: "Apa yang membuatmu khawatir? Mari kita bahas bersama 🤗",
        angry: "Apa yang membuatmu frustrasi? Ekspresikan di sini 🔥",
        confused: "Apa yang tidak jelas saat ini? Mari kita pikirkan bersama 🤔",
        hopeful: "Apa yang kamu nantikan? ✨",
    };

    const activePrompt = mood && mood in prompts
        ? prompts[mood]
        : "Bagaimana perasaanmu? Tulis dengan bebas...";

    const handleToggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <div className={cn("w-full max-w-2xl mx-auto space-y-6", className)}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    Journal
                </h2>
                <p className="text-xl text-muted-foreground font-light">
                    {activePrompt}
                </p>
            </motion.div>

            <motion.div
                className="relative shadow-sm rounded-3xl bg-card border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <textarea
                    value={entry + (interimTranscript ? " " + interimTranscript : "")}
                    onChange={(e) => setEntry(e.target.value)}
                    placeholder="Ketuk untuk mulai menulis, atau gunakan mikrofon..."
                    className="w-full h-48 p-6 bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-lg leading-relaxed placeholder:text-muted-foreground/50"
                    readOnly={isListening}
                />

                {/* Live transcript indicator */}
                {isListening && (
                    <div className="px-6 pb-3">
                        <div className="flex items-center gap-2 text-primary">
                            <div className="flex gap-1">
                                <span className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="size-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                            <span className="text-sm font-medium">Mendengarkan...</span>
                        </div>
                    </div>
                )}

                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    {/* Voice button */}
                    {isSupported ? (
                        <button
                            onClick={handleToggleListening}
                            className={cn(
                                "p-3 rounded-full transition-all duration-300",
                                isListening
                                    ? "bg-destructive text-destructive-foreground shadow-lg scale-110"
                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            )}
                            title={isListening ? "Berhenti mendengarkan" : "Mulai bicara"}
                        >
                            {isListening ? (
                                <MicOff className="size-5" />
                            ) : (
                                <Mic className="size-5" />
                            )}
                        </button>
                    ) : (
                        <span className="text-xs text-muted-foreground px-2">
                            Suara tidak didukung
                        </span>
                    )}

                    {/* Submit button */}
                    <button
                        onClick={() => {
                            if (isListening) stopListening();
                            onComplete?.(entry);
                        }}
                        disabled={!entry.trim()}
                        className="p-3 rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                        title="Analisis Entri"
                    >
                        <Send className="size-5" />
                    </button>
                </div>
            </motion.div>

            {/* Voice hint */}
            {isSupported && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-sm text-muted-foreground"
                >
                    💡 Tip: Klik mikrofon untuk berbicara dalam Bahasa Indonesia
                </motion.p>
            )}
        </div>
    );
}
