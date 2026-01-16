"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

interface DayRateSliderProps {
    value?: number;
    onChange?: (value: number) => void;
    className?: string;
}

export function DayRateSlider({ value: initialValue = 6, onChange, className }: DayRateSliderProps) {
    const { t } = useLanguage();
    const [value, setValue] = useState(initialValue);

    const handleChange = (newValue: number) => {
        setValue(newValue);
        onChange?.(newValue);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">{t('rateYourDay')}</span>
                <span className="text-sm text-muted-foreground">10</span>
            </div>

            {/* Slider Track */}
            <div className="relative">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleChange(num)}
                            className={`
                                relative flex-1 h-10 rounded-lg transition-all duration-200
                                ${num <= value
                                    ? "bg-gradient-to-r from-blue-400 to-blue-500"
                                    : "bg-secondary dark:bg-slate-800"
                                }
                                ${num === value ? "ring-2 ring-primary dark:ring-blue-400 ring-offset-2 dark:ring-offset-slate-900" : ""}
                                hover:scale-105
                            `}
                        >
                            {num === value && (
                                <motion.div
                                    layoutId="selectedDay"
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <span className="text-white font-bold text-sm">{num}</span>
                                </motion.div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Labels */}
                <div className="flex justify-between mt-2 px-1">
                    <span className="text-xs text-muted-foreground">1</span>
                    <span className="text-xs text-muted-foreground">5</span>
                    <span className="text-xs text-muted-foreground">10</span>
                </div>
            </div>
        </div>
    );
}
