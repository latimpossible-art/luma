"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, Loader2, Frown, Smile, Meh } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface JournalEntry {
    id: string;
    createdAt: string;
    mood: string;
    scale: number;
    content: string;
    insight: string;
    emotionClassification?: string;
}

export default function HistoryPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
        if (status === "authenticated") {
            fetchHistory();
        }
    }, [status, router]);

    const fetchHistory = async () => {
        try {
            const res = await fetch("/api/history");
            const data = await res.json();
            if (data.entries) {
                setEntries(data.entries);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <Loader2 className="animate-spin size-8 text-blue-500" />
            </div>
        );
    }

    const getMoodIcon = (mood: string) => {
        switch (mood.toLowerCase()) {
            case "happy": return <Smile className="size-5 text-yellow-500" />;
            case "sad": return <Frown className="size-5 text-blue-500" />;
            case "calm": return <Smile className="size-5 text-green-500" />; // simplistic
            default: return <Meh className="size-5 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900 transition-colors p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors">
                        <ChevronLeft className="size-6 text-gray-600 dark:text-gray-400" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Riwayat Jurnal</h1>
                </div>

                {/* Content */}
                {entries.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                        <Calendar className="size-12 mx-auto mb-4 opacity-50" />
                        <p>Belum ada riwayat jurnal.</p>
                        <Link href="/check-in" className="text-blue-500 hover:underline mt-2 inline-block">
                            Mulai Check-in
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {entries.map((entry) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-gray-50 dark:bg-slate-800">
                                            {getMoodIcon(entry.mood)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-100 capitalize">{entry.mood}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(entry.createdAt).toLocaleDateString("id-ID", {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
                                        Intensity: {entry.scale}/10
                                    </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 mb-4 bg-gray-50/50 dark:bg-slate-800/50 p-4 rounded-xl italic border-l-4 border-gray-200 dark:border-slate-700">
                                    "{entry.content}"
                                </p>

                                {entry.insight && (
                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-100/50 dark:border-blue-800/50">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                            <span className="font-semibold text-blue-600 block mb-1">Insight AI:</span>
                                            {entry.insight}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
