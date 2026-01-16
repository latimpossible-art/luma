"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScaleQuestionProps {
    question: string;
    onAnswer: (value: number) => void;
    className?: string;
}

export function ScaleQuestion({ question, onAnswer, className }: ScaleQuestionProps) {
    const [value, setValue] = useState(5);

    return (
        <div className={cn("w-full max-w-xl mx-auto space-y-8 text-center", className)}>
            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-semibold"
            >
                {question}
            </motion.h3>

            <div className="relative h-16 bg-secondary/50 rounded-full flex items-center px-4 cursor-pointer group">
                {/* Track */}
                <div className="absolute inset-x-4 h-1 bg-muted/30 rounded-full" />

                {/* Input - using native range but styling it away or custom logic? 
            Let's use a native range for accessibility but overlay custom visuals */}
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
                />

                {/* Thumb Visual */}
                <motion.div
                    className="absolute top-1/2 rounded-full shadow-lg bg-white border border-border flex items-center justify-center z-10 pointer-events-none"
                    style={{
                        left: `calc(${((value - 1) / 9) * 100}% - 1.5rem)`,
                        width: "3rem",
                        height: "3rem",
                        y: "-50%"
                    }}
                    animate={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="text-foreground font-bold">{value}</span>
                </motion.div>
            </div>

            <div className="flex justify-between text-sm text-muted-foreground px-4">
                <span>Not at all</span>
                <span>Very much</span>
            </div>

            <button
                onClick={() => onAnswer(value)}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-md hover:bg-primary/90 transition-colors"
            >
                Next
            </button>
        </div>
    );
}
