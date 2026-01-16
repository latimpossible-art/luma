"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

interface MoodGaugeProps {
    value?: number; // 0-100, where 0 is left (stressed) and 100 is right (happy)
    className?: string;
}

export function MoodGauge({ value = 50, className }: MoodGaugeProps) {
    const { t } = useLanguage();
    // Convert value to angle (-90 to 90 degrees)
    const angle = -90 + (value / 100) * 180;

    const moods = [
        { label: t('happy'), color: "#4CAF50", position: "left-2 bottom-8" },
        { label: t('calm'), color: "#8BC34A", position: "left-12 top-8" },
        { label: t('anxious'), color: "#FFC107", position: "left-1/2 -translate-x-1/2 -top-2" },
        { label: t('sad'), color: "#2196F3", position: "right-12 top-8" },
        { label: t('excited'), color: "#9C27B0", position: "right-2 bottom-8" },
    ];

    return (
        <div className={`relative ${className}`}>
            {/* Semi-circle gauge */}
            <div className="relative w-64 h-32 mx-auto">
                {/* Background gradient arc */}
                <svg viewBox="0 0 200 100" className="w-full h-full">
                    <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4CAF50" />
                            <stop offset="25%" stopColor="#8BC34A" />
                            <stop offset="50%" stopColor="#FFC107" />
                            <stop offset="75%" stopColor="#2196F3" />
                            <stop offset="100%" stopColor="#9C27B0" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 10 100 A 90 90 0 0 1 190 100"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="20"
                        strokeLinecap="round"
                    />
                </svg>

                {/* Needle */}
                <motion.div
                    className="absolute bottom-0 left-1/2 origin-bottom"
                    style={{
                        width: 4,
                        height: 70,
                        marginLeft: -2,
                    }}
                    animate={{ rotate: angle }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                >
                    <div className="w-full h-full bg-foreground rounded-full shadow-lg" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 size-6 rounded-full bg-white dark:bg-slate-900 border-4 border-foreground shadow-md" />
                </motion.div>
            </div>

            {/* Mood labels */}
            <div className="relative h-8 mt-4">
                {moods.map((mood, i) => (
                    <span
                        key={mood.label}
                        className={`absolute text-xs font-medium ${mood.position}`}
                        style={{ color: mood.color }}
                    >
                        {mood.label}
                    </span>
                ))}
            </div>
        </div>
    );
}
