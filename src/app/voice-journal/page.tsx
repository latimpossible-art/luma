"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Loader2, ArrowLeft, Volume2, StopCircle } from "lucide-react";
import Link from "next/link";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { speakText, stopSpeaking } from "@/lib/ai-service";
import { Header } from "@/components/ui/Header";

export default function VoiceJournalPage() {
    const router = useRouter();
    const {
        isListening,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        isSupported
    } = useSpeechRecognition({ lang: "id-ID", continuous: true });

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Auto-start listening on mount
    useEffect(() => {
        startListening();
        return () => stopListening();
    }, [startListening, stopListening]);

    const handleStopAndAnalyze = async () => {
        stopListening();
        if (!transcript && !interimTranscript) return;

        const fullText = transcript + interimTranscript;
        setIsAnalyzing(true);

        try {
            const res = await fetch("/api/analyze-voice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript: fullText }),
            });
            const data = await res.json();
            setAnalysisResult(data);

            // Auto-play TTS
            if (data.insightVoice) {
                setIsPlaying(true);
                await speakText(data.insightVoice, "id"); // Using 'id' for Indonesian voice
                setIsPlaying(false);
            }
        } catch (error) {
            console.error("Analysis failed", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (!isSupported) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <p>Browser does not support Speech Recognition.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900 transition-colors flex flex-col">
            <Header />

            <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full p-6 relative">
                {/* Back Link */}
                <Link href="/dashboard" className="absolute top-6 left-6 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                    <ArrowLeft className="size-6" />
                </Link>

                {!analysisResult ? (
                    // Listening Mode
                    <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                        <div className="text-center space-y-4">
                            <motion.div
                                animate={{ scale: isListening ? [1, 1.1, 1] : 1 }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="relative size-32 rounded-full bg-blue-500/10 flex items-center justify-center"
                            >
                                <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                                <Mic className={`size-12 ${isListening ? "text-blue-600" : "text-slate-400"}`} />
                            </motion.div>
                            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                                {isListening ? "I'm listening..." : "Paused"}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">Ceritakan apa yang kamu rasakan hari ini...</p>
                        </div>

                        {/* Transcript Display */}
                        <div className="w-full max-h-60 overflow-y-auto bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm min-h-[150px] transition-colors">
                            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                                {transcript}
                                <span className="text-slate-400">{interimTranscript}</span>
                                {(!transcript && !interimTranscript) && (
                                    <span className="text-slate-300 italic">Listening for your voice...</span>
                                )}
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-6">
                            {isListening ? (
                                <button
                                    onClick={stopListening}
                                    className="p-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                >
                                    <span className="sr-only">Pause</span>
                                    <div className="size-6 flex items-center justify-center">⏸</div>
                                </button>
                            ) : (
                                <button
                                    onClick={startListening}
                                    className="p-4 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                                >
                                    <Mic className="size-6" />
                                </button>
                            )}

                            <button
                                onClick={handleStopAndAnalyze}
                                disabled={(!transcript && !interimTranscript) || isAnalyzing}
                                className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="size-5 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <StopCircle className="size-5" />
                                        Selesai & Analisa
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    // Result Mode
                    <div className="flex-1 flex flex-col space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="space-y-2 text-center">
                            <span className="text-4xl">{
                                analysisResult.inferredMood === "Happy" ? "😊" :
                                    analysisResult.inferredMood === "Sad" ? "😔" :
                                        analysisResult.inferredMood === "Anxious" ? "😰" : "😐"
                            }</span>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                {analysisResult.inferredMood} ({analysisResult.inferredScale}/10)
                            </h2>
                        </div>

                        {/* Insight Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-800/50 shadow-sm relative overflow-hidden transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <SparklesIcon className="size-24 text-blue-500" />
                            </div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                                Insight AI
                                {isPlaying && <Volume2 className="size-4 animate-pulse" />}
                            </h3>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                                {analysisResult.insight}
                            </p>
                            <button
                                onClick={() => speakText(analysisResult.insightVoice, "id")}
                                className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline"
                            >
                                <Volume2 className="size-4" />
                                Putar Suara (JARVIS)
                            </button>
                        </div>

                        {/* Suggestions */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 px-2">Saran & Masukan</h3>
                            <div className="grid gap-3">
                                {analysisResult.suggestions?.map((s: string, i: number) => (
                                    <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-3">
                                        <div className="mt-1 size-2 rounded-full bg-blue-400 shrink-0" />
                                        <p className="text-slate-600 dark:text-slate-300 text-sm">{s}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center pt-8">
                            <Link
                                href="/dashboard"
                                className="px-8 py-3 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
                            >
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function SparklesIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M9 5h4" />
            <path d="M14 17v4" />
            <path d="M18 19h4" />
        </svg>
    )
}
