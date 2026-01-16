"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play, Pause, X } from "lucide-react";
import { Header } from "@/components/ui/Header";

const BREATHING_PHASES = [
    { name: "Inhale", duration: 4000, scale: 1.5, text: "Breathe In..." },
    { name: "Hold", duration: 4000, scale: 1.5, text: "Hold..." },
    { name: "Exhale", duration: 4000, scale: 1, text: "Breathe Out..." },
    { name: "Hold", duration: 4000, scale: 1, text: "Hold..." },
];

export default function BreathingPage() {
    const [isActive, setIsActive] = useState(false);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0); // For total session time if needed, currently just looping

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive) {
            const currentPhase = BREATHING_PHASES[phaseIndex];

            interval = setTimeout(() => {
                setPhaseIndex((prev) => (prev + 1) % BREATHING_PHASES.length);
            }, currentPhase.duration);
        }

        return () => clearTimeout(interval);
    }, [isActive, phaseIndex]);

    const currentPhase = BREATHING_PHASES[phaseIndex];

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50/30 transition-colors flex flex-col overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] size-[500px] rounded-full bg-blue-200/30 blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] size-[500px] rounded-full bg-purple-200/30 blur-[100px]" />
            </div>

            <div className="z-10 relative flex-1 flex flex-col">
                <Header />

                <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
                    <Link href="/dashboard" className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 :text-slate-300 transition-colors">
                        <ArrowLeft className="size-6" />
                    </Link>

                    <div className="text-center space-y-12 w-full max-w-md">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-slate-800 ">Relax & Breathe</h1>
                            <p className="text-slate-500 ">Box breathing technique for calmness.</p>
                        </div>

                        {/* Breathing Circle */}
                        <div className="relative h-80 flex items-center justify-center">
                            {/* Outer Rings */}
                            <motion.div
                                animate={{
                                    scale: isActive ? currentPhase.scale : 1,
                                    opacity: isActive ? 0.3 : 0.1
                                }}
                                transition={{ duration: currentPhase.duration / 1000, ease: "easeInOut" }}
                                className="absolute size-64 rounded-full bg-blue-300 "
                            />
                            <motion.div
                                animate={{
                                    scale: isActive ? currentPhase.scale * 0.8 : 1,
                                    opacity: isActive ? 0.4 : 0.1
                                }}
                                transition={{ duration: currentPhase.duration / 1000, ease: "easeInOut" }}
                                className="absolute size-48 rounded-full bg-blue-400 "
                            />

                            {/* Central Circle */}
                            <motion.div
                                animate={{ scale: isActive ? currentPhase.scale * 0.6 : 1 }}
                                transition={{ duration: currentPhase.duration / 1000, ease: "easeInOut" }}
                                className="relative z-10 size-32 rounded-full bg-white shadow-xl flex items-center justify-center"
                            >
                                <span className={`text-xl font-medium ${isActive ? "text-blue-600 " : "text-slate-400 "}`}>
                                    {isActive ? currentPhase.text : "Ready?"}
                                </span>
                            </motion.div>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center">
                            <button
                                onClick={() => setIsActive(!isActive)}
                                className={`px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 ${isActive
                                    ? "bg-white text-slate-700 hover:bg-slate-50 :bg-slate-700"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                            >
                                {isActive ? (
                                    <>
                                        <Pause className="size-5" /> Pause
                                    </>
                                ) : (
                                    <>
                                        <Play className="size-5" /> Start Breathing
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
