"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ChevronLeft, ChevronRight, PartyPopper, Frown, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

interface CalendarData {
    [day: number]: {
        hasEntry: boolean;
        entries: Array<{
            id: string;
            time: string;
            mood: string;
            anxietyLevel: number;
            preview: string;
        }>;
    };
}

export function StreakCalendar({ className }: { className?: string }) {
    const { t, language } = useLanguage();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [streak, setStreak] = useState(0);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [calendarData, setCalendarData] = useState<CalendarData>({});
    const [loading, setLoading] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);

    const monthNames = language === 'id'
        ? ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
        : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Fetch streak on mount
    useEffect(() => {
        fetchStreak();
    }, []);

    // Fetch calendar data when month/year changes
    useEffect(() => {
        fetchCalendarData();
    }, [currentDate]);

    const fetchStreak = async () => {
        try {
            const res = await fetch('/api/streak');
            const data = await res.json();
            if (data.streak !== undefined) {
                setStreak(data.streak);
            }
        } catch (error) {
            console.error('Failed to fetch streak:', error);
        }
    };

    const fetchCalendarData = async () => {
        setLoading(true);
        try {
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            const res = await fetch(`/api/calendar-data?month=${month}&year=${year}`);
            const data = await res.json();
            setCalendarData(data.data || {});
        } catch (error) {
            console.error('Failed to fetch calendar data:', error);
        } finally {
            setLoading(false);
        }
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDay(null);
    };

    const nextMonth = () => {
        const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        const now = new Date();
        if (next <= now) {
            setCurrentDate(next);
            setSelectedDay(null);
        }
    };

    const changeYear = (year: number) => {
        setCurrentDate(new Date(year, currentDate.getMonth(), 1));
        setShowYearPicker(false);
    };

    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const firstDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    ).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    const handleDayClick = (day: number) => {
        if (selectedDay === day) {
            setSelectedDay(null);
        } else {
            setSelectedDay(day);
        }
    };

    const today = new Date();
    const currentYear = currentDate.getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

    return (
        <div className={`bg-white rounded-3xl p-6 shadow-sm border border-border relative transition-colors ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-orange-100 rounded-full">
                        <Flame className="size-5 text-orange-500 fill-orange-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm text-foreground">{t('streak')}</h3>
                        <p className="text-xs text-muted-foreground">{streak} {t('streakDesc')}</p>
                    </div>
                </div>
            </div>

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm text-foreground">
                        {monthNames[currentDate.getMonth()]}
                    </h4>
                    <div className="relative">
                        <button
                            onClick={() => setShowYearPicker(!showYearPicker)}
                            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                            {currentDate.getFullYear()}
                            <CalendarIcon className="size-3" />
                        </button>

                        {showYearPicker && (
                            <div className="absolute top-full mt-1 left-0 bg-white rounded-lg shadow-lg border border-border p-2 z-50">
                                {years.map(year => (
                                    <button
                                        key={year}
                                        onClick={() => changeYear(year)}
                                        className={`block w-full text-left px-3 py-1.5 rounded text-sm hover:bg-slate-100 :bg-slate-700 ${year === currentYear ? 'bg-blue-100 text-blue-600' : 'text-foreground'
                                            }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={prevMonth}
                        className="p-1 hover:bg-slate-100 :bg-slate-800 rounded-full transition-colors"
                    >
                        <ChevronLeft className="size-4 text-slate-400" />
                    </button>
                    <button
                        onClick={nextMonth}
                        disabled={new Date() < new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)}
                        className="p-1 hover:bg-slate-100 :bg-slate-800 rounded-full transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                        <ChevronRight className="size-4 text-slate-400" />
                    </button>
                </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <div key={i} className="text-[10px] font-medium text-muted-foreground py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 relative z-10">
                {blanks.map((blank) => (
                    <div key={`blank-${blank}`} className="aspect-square" />
                ))}
                {days.map((day) => {
                    const isToday =
                        day === today.getDate() &&
                        currentDate.getMonth() === today.getMonth() &&
                        currentDate.getFullYear() === today.getFullYear();
                    const hasEntry = calendarData[day]?.hasEntry;
                    const isSelected = selectedDay === day;

                    return (
                        <div
                            key={day}
                            className="aspect-square flex items-center justify-center relative"
                        >
                            <button
                                onClick={() => handleDayClick(day)}
                                className={`
                                    size-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 relative z-10
                                    ${isToday
                                        ? "bg-blue-600 text-white shadow-md font-medium"
                                        : hasEntry
                                            ? "bg-green-100 text-green-700 font-medium"
                                            : "text-slate-600 hover:bg-slate-50 :bg-slate-800"
                                    }
                                    ${isSelected ? "ring-2 ring-offset-2 ring-blue-400 scale-110" : ""}
                                `}
                            >
                                {day}
                                {hasEntry && !isToday && (
                                    <div className="absolute -bottom-0.5 size-1 bg-green-500 rounded-full" />
                                )}
                            </button>

                            {/* Detail Popover */}
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-40 bg-white rounded-xl shadow-xl border border-border p-3 text-center"
                                        style={{ pointerEvents: 'auto' }}
                                    >
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 bg-white border-b border-r border-border rotate-45" />

                                        {isToday && !hasEntry ? (
                                            <div className="space-y-2">
                                                <p className="text-xs font-medium text-slate-700 ">{t('notCheckedIn')}</p>
                                                <Link href="/check-in">
                                                    <button className="text-[10px] bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 w-full transition-colors">
                                                        {t('checkIn')}
                                                    </button>
                                                </Link>
                                            </div>
                                        ) : hasEntry ? (
                                            <div className="space-y-1">
                                                <div className="flex justify-center">
                                                    <PartyPopper className="size-4 text-purple-500" />
                                                </div>
                                                <p className="text-xs font-medium text-slate-700 ">{t('greatJob')}</p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {t('mood')}: {calendarData[day].entries[0]?.mood || "Unknown"}
                                                </p>
                                                {calendarData[day].entries.length > 1 && (
                                                    <p className="text-[9px] text-blue-600 ">
                                                        +{calendarData[day].entries.length - 1} more
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <div className="flex justify-center">
                                                    <Frown className="size-4 text-slate-400" />
                                                </div>
                                                <p className="text-xs text-muted-foreground">{t('noEntry')}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {/* Overlay to close selection */}
            {selectedDay && (
                <div
                    className="absolute inset-0 z-0 rounded-3xl"
                    onClick={() => setSelectedDay(null)}
                />
            )}

            {loading && (
                <div className="absolute inset-0 bg-white/50 rounded-3xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
            )}
        </div>
    );
}
