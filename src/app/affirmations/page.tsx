"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Heart, Share2 } from "lucide-react";
import { Header } from "@/components/ui/Header";

const AFFIRMATIONS = [
    "I am worthy of love and happiness.",
    "I believe in myself and my abilities.",
    "Every day is a fresh start.",
    "I am in charge of my own happiness.",
    "I am enough just as I am.",
    "I choose hope over fear.",
    "I possess the qualities needed to be extremely successful.",
    "My potential to succeed is infinite.",
    "I forgive myself and set myself free.",
    "I accept myself properly.",
    "I am calmer and more peaceful with every breath I take.",
    "My challenges are helping me grow.",
    "I am surrounded by love and support.",
    "I have the power to create change.",
    "I am grateful for all that I have.",
];

const GRADIENTS = [
    "from-pink-500 to-rose-500",
    "from-purple-500 to-indigo-500",
    "from-blue-400 to-cyan-300",
    "from-teal-400 to-emerald-400",
    "from-orange-400 to-amber-400",
];

export default function AffirmationsPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gradientIndex, setGradientIndex] = useState(0);

    const handleNext = () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
        } while (newIndex === currentIndex);

        setCurrentIndex(newIndex);
        setGradientIndex((prev) => (prev + 1) % GRADIENTS.length);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-pink-50/30 transition-colors flex flex-col">
            <Header />

            <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
                <Link href="/dashboard" className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 :text-slate-300 transition-colors">
                    <ArrowLeft className="size-6" />
                </Link>

                <div className="w-full max-w-md space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-slate-800 ">Daily Affirmations</h1>
                        <p className="text-slate-500 ">Positive thoughts to brighten your day.</p>
                    </div>

                    {/* Card Container */}
                    <div className="relative h-[400px] w-full perspective-1000">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                                transition={{ duration: 0.4 }}
                                className={`w-full h-full rounded-[2rem] shadow-2xl bg-gradient-to-br ${GRADIENTS[gradientIndex]} p-8 flex flex-col items-center justify-center text-center relative overflow-hidden`}
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 p-8 opacity-20">
                                    <Heart className="size-32 text-white" />
                                </div>
                                <div className="absolute bottom-0 left-0 p-8 opacity-20">
                                    <Heart className="size-24 text-white rotate-12" />
                                </div>

                                <div className="relative z-10 space-y-6">
                                    <Heart className="size-8 text-white/80 mx-auto" />
                                    <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed font-serif">
                                        "{AFFIRMATIONS[currentIndex]}"
                                    </h2>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-8 py-4 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-slate-800 font-medium border border-slate-100"
                        >
                            <RefreshCw className="size-5" />
                            New Affirmation
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
