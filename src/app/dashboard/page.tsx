"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/ui/Header";
import { MoodGauge } from "@/components/dashboard/MoodGauge";
import { DayRateSlider } from "@/components/dashboard/DayRateSlider";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { QuickActions } from "@/components/dashboard/QuickActions";

import { useSession } from "next-auth/react";
import { useLanguage } from "@/lib/LanguageContext";

import { StreakCalendar } from "@/components/dashboard/StreakCalendar";

export default function DashboardPage() {
    const { data: session } = useSession();
    const { t } = useLanguage();
    const [userName, setUserName] = useState("Friend");
    const [moodValue, setMoodValue] = useState(65); // 0-100
    const [dayRating, setDayRating] = useState(6);
    const [todayInsight, setTodayInsight] = useState(
        "Take a moment to breathe and relax. You're doing great!"
    );
    const [isInsightVisible, setIsInsightVisible] = useState(true);
    const [hasCheckedIn, setHasCheckedIn] = useState(false); // Mock state

    useEffect(() => {
        if (session?.user?.name) {
            setUserName(session.user.name);
        }
    }, [session]);

    const fetchInsight = async () => {
        try {
            const res = await fetch("/api/daily-insight");
            const data = await res.json();
            if (data.insight) {
                setTodayInsight(data.insight);
            }
        } catch (error) {
            console.error("Failed to fetch daily insight", error);
        }
    };

    // Fetch Daily Insight on mount
    useEffect(() => {
        fetchInsight();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-purple-50/50 dark:from-slate-950 dark:to-slate-900 transition-colors">
            <Header userName={userName} hasCheckedIn={hasCheckedIn} />

            <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                        {t('welcome')}, {userName}!
                    </h1>
                    <p className="text-muted-foreground text-lg">{t('feeling')}</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Interactive */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Mood Gauge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-border dark:border-slate-800 transition-colors"
                        >
                            <MoodGauge value={moodValue} />
                        </motion.div>

                        {/* Day Rating Slider */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-border"
                        >
                            <DayRateSlider value={dayRating} onChange={setDayRating} />
                        </motion.div>

                        {/* Insight Card */}
                        <AnimatePresence>
                            {isInsightVisible && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <InsightCard
                                        insight={todayInsight}
                                        onRefresh={fetchInsight}
                                        isVisible={isInsightVisible}
                                        onHide={() => setIsInsightVisible(false)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column - Stats & Quick Actions */}
                    <div className="space-y-6">
                        {/* Streak Calendar */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <StreakCalendar />
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <QuickActions
                                className="sticky top-24"
                                showInsightButton={!isInsightVisible}
                                onShowInsight={() => setIsInsightVisible(true)}
                            />
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
