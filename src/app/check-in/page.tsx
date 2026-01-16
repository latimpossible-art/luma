"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoodWheel } from "@/components/features/MoodWheel";
import { Journal } from "@/components/features/Journal";
import { ScaleQuestion } from "@/components/features/ScaleQuestion";
import { analyzeEntry, AnalysisResult, getEmotionColor, getAnxietyDescription, speakText, stopSpeaking } from "@/lib/ai-service";
import { Sparkles, Heart, AlertTriangle, Lightbulb, ArrowRight, Volume2, VolumeX, ExternalLink, Music, Video, FileText } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function CheckInPage() {
    const { t } = useLanguage();
    const [step, setStep] = useState<"mood" | "scale" | "journal" | "analyzing" | "result">("mood");
    const [selectedMood, setSelectedMood] = useState<string>("");
    const [scaleValue, setScaleValue] = useState<number>(5);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleMoodSelect = (mood: string) => {
        setSelectedMood(mood);
        setStep("scale");
    };

    const handleScaleAnswer = (value: number) => {
        setScaleValue(value);
        setStep("journal");
    };

    const handleJournalComplete = async (entry: string) => {
        setStep("analyzing");
        try {
            const data = await analyzeEntry(selectedMood, scaleValue, entry);
            setResult(data);
            setStep("result");

            // Auto-speak the insight after a short delay
            setTimeout(() => {
                if (data.insightVoice) {
                    handleSpeak(data.insightVoice);
                }
            }, 1000);
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
            setStep("journal");
        }
    };

    const handleSpeak = async (text: string) => {
        if (isSpeaking) {
            stopSpeaking();
            setIsSpeaking(false);
        } else {
            await speakText(
                text,
                "id", // Indonesian language
                () => setIsSpeaking(true),  // onStart
                () => setIsSpeaking(false)  // onEnd
            );
        }
    };

    const getContentIcon = (type: string) => {
        switch (type) {
            case "playlist": return <Music className="size-4" />;
            case "video": return <Video className="size-4" />;
            case "article": return <FileText className="size-4" />;
            default: return <ExternalLink className="size-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-purple-50/50 transition-colors flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden">
            <AnimatePresence mode="wait">
                {step === "mood" ? (
                    <motion.div
                        key="mood-step"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -200 }}
                        className="w-full max-w-lg text-center space-y-12"
                    >
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tight text-foreground">{t('howAreYou')}</h1>
                            <p className="text-muted-foreground text-lg">
                                Take a moment to tune in to yourself.
                            </p>
                        </div>
                        <MoodWheel onMoodSelect={handleMoodSelect} />
                    </motion.div>
                ) : step === "scale" ? (
                    <motion.div
                        key="scale-step"
                        initial={{ opacity: 0, x: 200 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -200 }}
                        className="w-full max-w-xl"
                    >
                        <ScaleQuestion
                            question="How intense is this feeling?"
                            onAnswer={handleScaleAnswer}
                        />
                    </motion.div>
                ) : step === "journal" ? (
                    <motion.div
                        key="journal-step"
                        initial={{ opacity: 0, x: 200 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -200 }}
                        className="w-full max-w-3xl"
                    >
                        <Journal mood={selectedMood} onComplete={handleJournalComplete} />
                    </motion.div>
                ) : step === "analyzing" ? (
                    <motion.div
                        key="analyzing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="relative">
                            <div className="size-20 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
                            <Sparkles className="size-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-2xl font-semibold text-foreground">Reflecting on your thoughts...</p>
                            <p className="text-muted-foreground">Luma is reading your entry with care</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-2xl space-y-6 overflow-y-auto max-h-[90vh] pb-8"
                    >
                        {/* Emotion Badge */}
                        <div className="flex justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="px-6 py-2 rounded-full text-white font-medium text-lg shadow-lg"
                                style={{ backgroundColor: getEmotionColor(result?.emotionClassification || "neutral") }}
                            >
                                {result?.emotionClassification?.charAt(0).toUpperCase()}{result?.emotionClassification?.slice(1)}
                            </motion.div>
                        </div>

                        {/* Insight Card with TTS */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Heart className="size-6 text-primary" />
                                    <h2 className="text-xl font-bold text-foreground">Insight</h2>
                                </div>
                                <button
                                    onClick={() => result?.insightVoice && handleSpeak(result.insightVoice)}
                                    className={`p-2.5 rounded-full transition-all ${isSpeaking
                                        ? "bg-primary text-primary-foreground animate-pulse"
                                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                        }`}
                                    title={isSpeaking ? "Stop speaking" : "Listen to insight"}
                                >
                                    {isSpeaking ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                                </button>
                            </div>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {result?.insight}
                            </p>
                        </motion.div>

                        {/* Content Recommendations */}
                        {result?.contentRecommendations && result.contentRecommendations.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 rounded-3xl p-6 shadow-sm space-y-4"
                            >
                                <div className="flex items-center gap-3">
                                    <Sparkles className="size-5 text-purple-500" />
                                    <h3 className="font-semibold text-purple-700 ">Recommended For You</h3>
                                </div>
                                <div className="space-y-3">
                                    {result.contentRecommendations.map((rec, i) => (
                                        <a
                                            key={i}
                                            href={rec.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-white/80 rounded-xl hover:bg-white hover:shadow-md transition-all group"
                                        >
                                            <div className="p-2 rounded-lg bg-purple-100 text-purple-600 ">
                                                {getContentIcon(rec.type)}
                                            </div>
                                            <span className="flex-1 font-medium text-foreground group-hover:text-purple-600 transition-colors">
                                                {rec.title}
                                            </span>
                                            <ExternalLink className="size-4 text-muted-foreground group-hover:text-purple-600" />
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Anxiety Level Meter */}
                        {result && result.anxietyLevel > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3"
                            >
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="size-5 text-amber-500" />
                                    <h3 className="font-semibold text-foreground">Anxiety Check</h3>
                                    <span className="ml-auto text-sm text-muted-foreground">
                                        {getAnxietyDescription(result.anxietyLevel)} ({result.anxietyLevel}/10)
                                    </span>
                                </div>
                                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${result.anxietyLevel * 10}%` }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                        className="h-full rounded-full"
                                        style={{
                                            background: result.anxietyLevel > 6
                                                ? "linear-gradient(90deg, #FF9500, #FF453A)"
                                                : "linear-gradient(90deg, #30D158, #FFD60A)"
                                        }}
                                    />
                                </div>
                                {result.anxietyIndicators && result.anxietyIndicators.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {result.anxietyIndicators.map((indicator, i) => (
                                            <span key={i} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                                                {indicator}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Suggestions */}
                        {result?.suggestions && result.suggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-3"
                            >
                                <div className="flex items-center gap-3">
                                    <Lightbulb className="size-5 text-amber-400" />
                                    <h3 className="font-semibold text-foreground">Suggestions</h3>
                                </div>
                                <ul className="space-y-2">
                                    {result.suggestions.map((suggestion, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <ArrowRight className="size-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span className="text-muted-foreground text-sm">{suggestion}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}

                        {/* Follow-up Question */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="p-5 bg-primary/10 border border-primary/20 rounded-2xl text-center"
                        >
                            <p className="font-medium text-foreground">{result?.followUp}</p>
                        </motion.div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                            <button
                                onClick={() => {
                                    stopSpeaking();
                                    setIsSpeaking(false);
                                    setStep("mood");
                                    setResult(null);
                                }}
                                className="px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
                            >
                                New Check-in
                            </button>
                            <Link
                                href="/dashboard"
                                className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-center hover:opacity-90 transition-opacity"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
