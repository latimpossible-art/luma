"use client";

import { useState } from "react";
import { motion, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import { Smile, Frown, Meh, CloudRain, Sun } from "lucide-react";

interface MoodWheelProps {
    onMoodSelect?: (mood: string) => void;
    className?: string;
}

const moods = [
    { id: "happy", label: "Happy", icon: Sun, color: "bg-amber-400" },
    { id: "calm", label: "Calm", icon: Smile, color: "bg-blue-400" },
    { id: "neutral", label: "Neutral", icon: Meh, color: "bg-gray-400" },
    { id: "sad", label: "Sad", icon: CloudRain, color: "bg-indigo-400" },
    { id: "anxious", label: "Anxious", icon: Frown, color: "bg-rose-400" },
];

export function MoodWheel({ onMoodSelect, className }: MoodWheelProps) {
    const [rotation, setRotation] = useState(0);
    const [activeMood, setActiveMood] = useState(moods[0]);

    const handlePan = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        // Simple rotation logic based on drag
        const newRotation = rotation + info.delta.x / 2;
        setRotation(newRotation);

        // Calculate active mood based on rotation (simplified)
        // In a real wheel, we'd map degrees to index
        const index = Math.abs(Math.floor(newRotation / 72)) % moods.length;
        setActiveMood(moods[index]);
    };

    return (
        <div className={cn("relative flex flex-col items-center justify-center gap-8", className)}>
            <motion.div
                className="relative size-64 rounded-full border-4 border-muted/20 bg-background shadow-xl flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
                style={{ rotate: rotation }}
                onPan={handlePan}
                whileTap={{ scale: 0.98 }}
            >
                {/* Wheel Segments - Visual only for now */}
                {moods.map((mood, i) => {
                    const angle = (360 / moods.length) * i;
                    return (
                        <div
                            key={mood.id}
                            className="absolute top-0 left-1/2 h-1/2 w-1 origin-bottom bg-transparent flex flex-col items-center pt-4 -translate-x-1/2"
                            style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
                        >
                            <mood.icon className="size-6 text-foreground/50 rotate-180" style={{ transform: `rotate(-${angle}deg)` }} />
                        </div>
                    );
                })}

                {/* Center Knob */}
                <div className="absolute inset-0 m-auto size-20 rounded-full bg-background shadow-inner flex items-center justify-center z-10">
                    <div className={cn("size-3 rounded-full transition-colors duration-300", activeMood.color)} />
                </div>
            </motion.div>

            <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold transition-all duration-300">
                    {activeMood.label}
                </h3>
                <p className="text-muted-foreground text-sm">
                    Drag wheel to select
                </p>
            </div>

            <button
                onClick={() => onMoodSelect?.(activeMood.id)}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium shadow-lg hover:translate-y-0.5 transition-all"
            >
                Confirm Mood
            </button>
        </div>
    );
}
