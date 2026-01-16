"use client";

import { useState } from "react";
import { Sparkles, MoreHorizontal, RefreshCw, Copy, Check, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

interface InsightCardProps {
    insight: string;
    onRefresh?: () => void;
    isVisible?: boolean;
    onHide?: () => void;
    className?: string;
}

export function InsightCard({ insight, onRefresh, isVisible = true, onHide, className }: InsightCardProps) {
    const { t } = useLanguage();
    const [showMenu, setShowMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(insight);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setShowMenu(false);
    };

    const handleRefresh = () => {
        if (onRefresh) onRefresh();
        setShowMenu(false);
    };

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-2xl p-5 shadow-sm border border-border relative transition-colors ${className}`}
        >
            <div className="flex items-center justify-between mb-3 relative">
                <div className="flex items-center gap-2">
                    <Sparkles className="size-5 text-amber-500" />
                    <h3 className="font-semibold text-foreground">{t('insight')}</h3>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-slate-100 :bg-slate-800 transition-colors"
                    >
                        <MoreHorizontal className="size-5" />
                    </button>

                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 top-8 z-20 w-40 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden"
                            >
                                <button
                                    onClick={handleRefresh}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 :bg-slate-700 flex items-center gap-2"
                                >
                                    <RefreshCw className="size-4" />
                                    {t('refresh')}
                                </button>
                                <button
                                    onClick={handleCopy}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                >
                                    {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                                    {copied ? t('copied') : t('copy')}
                                </button>
                                <div className="h-px bg-slate-100 my-1" />
                                <button
                                    onClick={() => {
                                        if (onHide) onHide();
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 :bg-red-900/30 flex items-center gap-2"
                                >
                                    <EyeOff className="size-4" />
                                    {t('hide')}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">{t('todayInsight')}: </span>
                {insight}
            </p>

            {showMenu && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                />
            )}
        </motion.div>
    );
}
