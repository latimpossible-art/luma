"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, Sparkles } from "lucide-react";
import { Header } from "@/components/ui/Header";
import { analyzeEntry, AnalysisResult, getEmotionColor, getAnxietyDescription } from "@/lib/ai-service";

// Guided prompts for the journal
const guidedPrompts = [
    "What's been on your mind?",
    "Describe a moment that stood out today...",
    "How are you feeling right now?",
];

const quickSuggestions = [
    "Gratitude Reflection",
    "Coping with Stress",
    "A Personal Challenge",
    "Best part of your day",
];

export default function JournalPage() {
    const [activeTab, setActiveTab] = useState<"journal" | "selfcheck">("journal");
    const [entry, setEntry] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const handlePromptClick = (prompt: string) => {
        setEntry(prev => prev + (prev ? " " : "") + prompt);
    };

    const handleSuggestionClick = (suggestion: string) => {
        const promptMap: Record<string, string> = {
            "Gratitude Reflection": "Today I'm grateful for...",
            "Coping with Stress": "I've been feeling stressed about...",
            "A Personal Challenge": "A challenge I'm facing is...",
            "Best part of your day": "The best part of my day was...",
        };
        setEntry(promptMap[suggestion] || suggestion);
    };

    const handleAnalyze = async () => {
        if (!entry.trim()) return;

        setIsAnalyzing(true);
        try {
            const data = await analyzeEntry("neutral", 5, entry);
            setResult(data);
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const resetJournal = () => {
        setEntry("");
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-purple-50/50">
            <Header />

            <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
                {/* Tabs */}
                <div className="flex bg-secondary/50 rounded-full p-1">
                    <button
                        onClick={() => setActiveTab("journal")}
                        className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === "journal"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Emotion Journal
                    </button>
                    <button
                        onClick={() => setActiveTab("selfcheck")}
                        className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === "selfcheck"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Daily Self-Check
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-5"
                        >
                            {/* Greeting */}
                            <div className="text-center">
                                <h1 className="text-xl font-semibold">
                                    Hi Sarah, What's on your mind today?
                                </h1>
                            </div>

                            {/* Guided Prompts */}
                            <div className="space-y-2">
                                {guidedPrompts.map((prompt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePromptClick(prompt)}
                                        className="w-full text-left px-4 py-3 bg-white border border-border rounded-xl text-muted-foreground hover:border-primary hover:text-foreground transition-all"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>

                            {/* Text Area */}
                            <div className="relative bg-white rounded-2xl border border-border shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
                                <textarea
                                    value={entry}
                                    onChange={(e) => setEntry(e.target.value)}
                                    placeholder="Start sharing your thoughts..."
                                    className="w-full h-32 p-4 bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-base"
                                />
                                <div className="absolute bottom-3 right-3">
                                    <button
                                        onClick={() => setIsListening(!isListening)}
                                        className={`p-2.5 rounded-full transition-all ${isListening
                                                ? "bg-destructive text-destructive-foreground animate-pulse"
                                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                            }`}
                                    >
                                        {isListening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Get Insight Button */}
                            <button
                                onClick={handleAnalyze}
                                disabled={!entry.trim() || isAnalyzing}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="size-5" />
                                        Get Insight
                                    </>
                                )}
                            </button>

                            {/* Quick Suggestions */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-muted-foreground">Quick Suggestions</h3>
                                <div className="flex flex-wrap gap-2">
                                    {quickSuggestions.map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="px-3 py-1.5 bg-white border border-border rounded-full text-sm hover:border-primary transition-colors"
                                        >
                                            • {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-5"
                        >
                            {/* Emotion Badge */}
                            <div className="flex justify-center">
                                <div
                                    className="px-6 py-2 rounded-full text-white font-medium shadow-lg"
                                    style={{ backgroundColor: getEmotionColor(result.emotionClassification) }}
                                >
                                    {result.emotionClassification.charAt(0).toUpperCase() + result.emotionClassification.slice(1)}
                                </div>
                            </div>

                            {/* Insight */}
                            <div className="bg-white rounded-2xl p-5 border border-border space-y-3">
                                <h2 className="font-semibold text-lg">Insight</h2>
                                <p className="text-muted-foreground">{result.insight}</p>
                            </div>

                            {/* Suggestions */}
                            {result.suggestions && result.suggestions.length > 0 && (
                                <div className="bg-white rounded-2xl p-5 border border-border space-y-3">
                                    <h3 className="font-semibold">Suggestions</h3>
                                    <ul className="space-y-2">
                                        {result.suggestions.map((s, i) => (
                                            <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                                <span className="text-primary">•</span>
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Follow-up */}
                            <div className="bg-primary/10 rounded-2xl p-5 text-center">
                                <p className="font-medium">{result.followUp}</p>
                            </div>

                            {/* Actions */}
                            <button
                                onClick={resetJournal}
                                className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
                            >
                                Write Another Entry
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
