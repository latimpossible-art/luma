"use client";

import Link from "next/link";
import { ClipboardCheck, BookHeart, Wind, Heart, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

interface QuickActionsProps {
    className?: string;
    showInsightButton?: boolean;
    onShowInsight?: () => void;
}

export function QuickActions({ className, showInsightButton, onShowInsight }: QuickActionsProps) {
    const { t } = useLanguage();

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Main Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <Link href="/check-in">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-4 shadow-lg cursor-pointer"
                    >
                        <ClipboardCheck className="size-6 mb-2" />
                        <h3 className="font-semibold">{t('dailyCheck')}</h3>
                        <p className="text-xs text-blue-100 mt-1">{t('dailyCheckDesc')}</p>
                    </motion.div>
                </Link>

                <Link href="/history">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-4 shadow-lg cursor-pointer"
                    >
                        <BookHeart className="size-6 mb-2" />
                        <h3 className="font-semibold">{t('history')}</h3>
                        <p className="text-xs text-purple-100 mt-1">{t('historyDesc')}</p>
                    </motion.div>
                </Link>
            </div>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap gap-2">
                <Link href="/breathing">
                    <button className="px-4 py-2 bg-white border border-border rounded-full text-sm font-medium hover:bg-secondary/50 :bg-slate-800 transition-colors flex items-center gap-2 text-foreground">
                        <Wind className="size-4 text-blue-500" />
                        {t('breathing')}
                    </button>
                </Link>
                <Link href="/affirmations">
                    <button className="px-4 py-2 bg-white border border-border rounded-full text-sm font-medium hover:bg-secondary/50 transition-colors flex items-center gap-2">
                        <Heart className="size-4 text-pink-500" />
                        {t('affirmations')}
                    </button>
                </Link>

                <AnimatePresence>
                    {showInsightButton && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8, width: 0 }}
                            animate={{ opacity: 1, scale: 1, width: "auto" }}
                            exit={{ opacity: 0, scale: 0.8, width: 0 }}
                            onClick={onShowInsight}
                            className="px-4 py-2 bg-white border border-border rounded-full text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 overflow-hidden whitespace-nowrap"
                        >
                            <span className="text-amber-500 font-bold">✨</span>
                            <span>{t('showInsight')}</span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Voice Button */}
            <div className="fixed bottom-6 right-6 z-40">
                <Link href="/voice-journal">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="size-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl flex items-center justify-center"
                    >
                        <Mic className="size-6" />
                    </motion.button>
                </Link>
            </div>
        </div>
    );
}
