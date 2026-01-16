"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "id";

const translations = {
    en: {
        // Header & Navigation
        welcome: "Welcome back",
        feeling: "How are you feeling today?",
        notifications: "Notifications",
        new: "New",
        account: "Account",
        signOut: "Sign Out",
        settings: "Settings",
        theme: "Theme",
        language: "Language",
        light: "Light",
        dark: "Dark",
        auto: "Auto",

        // Dashboard
        streak: "On a streak!",
        streakDesc: "days in a row",
        moodGauge: "Mood Gauge",
        rateYourDay: "Rate Your Day",
        insight: "Insights & Tips",
        todayInsight: "Today's Insight",

        // Calendar
        january: "January",
        february: "February",
        march: "March",
        april: "April",
        may: "May",
        june: "June",
        july: "July",
        august: "August",
        september: "September",
        october: "October",
        november: "November",
        december: "December",

        // Actions & Buttons
        dailyCheck: "Daily Self-Check",
        dailyCheckDesc: "Reflect on your day",
        history: "History & Details",
        historyDesc: "View past insights",
        breathing: "Guided Breathing Exercise",
        affirmations: "Positive Affirmations",
        refresh: "Refresh",
        copy: "Copy Text",
        copied: "Copied",
        hide: "Hide",
        showInsight: "Show Insight",
        checkIn: "Check In",
        submit: "Submit",
        cancel: "Cancel",

        // Calendar Details
        noEntry: "No entry",
        notCheckedIn: "Not checked in",
        greatJob: "Great Job!",
        mood: "Mood",
        anxiety: "Anxiety",
        viewDetails: "View Details",

        // Check-in Page
        howAreYou: "How are you feeling?",
        journalPrompt: "Write about your day...",
        voiceJournal: "Voice Journal",
        analyzing: "Analyzing...",

        // Moods
        happy: "Happy",
        calm: "Calm",
        sad: "Sad",
        anxious: "Anxious",
        angry: "Angry",
        excited: "Excited",

        // Notifications
        welcomeNotif: "Welcome to Luma! ✨",
        welcomeMsg: "Start your journey of inner reflection today.",
        checkInNotif: "Daily Check-in 📝",
        checkInMsg: "How are you feeling today? Take a moment to reflect.",
        congratsNotif: "Great job! 🎉",
        congratsMsg: "You've completed your daily check-in. Keep it up!",
    },
    id: {
        // Header & Navigation
        welcome: "Selamat datang kembali",
        feeling: "Bagaimana perasaanmu hari ini?",
        notifications: "Notifikasi",
        new: "Baru",
        account: "Akun",
        signOut: "Keluar",
        settings: "Pengaturan",
        theme: "Tema",
        language: "Bahasa",
        light: "Terang",
        dark: "Gelap",
        auto: "Otomatis",

        // Dashboard
        streak: "Runtutan Bagus!",
        streakDesc: "hari berturut-turut",
        moodGauge: "Pengukur Mood",
        rateYourDay: "Nilai Harimu",
        insight: "Wawasan & Tips",
        todayInsight: "Insight Hari Ini",

        // Calendar
        january: "Januari",
        february: "Februari",
        march: "Maret",
        april: "April",
        may: "Mei",
        june: "Juni",
        july: "Juli",
        august: "Agustus",
        september: "September",
        october: "Oktober",
        november: "November",
        december: "Desember",

        // Actions & Buttons
        dailyCheck: "Cek Diri Harian",
        dailyCheckDesc: "Refleksikan harimu",
        history: "Riwayat & Detail",
        historyDesc: "Lihat insight lalu",
        breathing: "Latihan Pernapasan",
        affirmations: "Afirmasi Positif",
        refresh: "Segarkan",
        copy: "Salin Teks",
        copied: "Disalin",
        hide: "Sembunyikan",
        showInsight: "Lihat Insight",
        checkIn: "Check In",
        submit: "Kirim",
        cancel: "Batal",

        // Calendar Details
        noEntry: "Tidak ada catatan",
        notCheckedIn: "Belum check-in",
        greatJob: "Kerja Bagus!",
        mood: "Mood",
        anxiety: "Kecemasan",
        viewDetails: "Lihat Detail",

        // Check-in Page
        howAreYou: "Bagaimana perasaanmu?",
        journalPrompt: "Tulis tentang harimu...",
        voiceJournal: "Jurnal Suara",
        analyzing: "Menganalisis...",

        // Moods
        happy: "Senang",
        calm: "Tenang",
        sad: "Sedih",
        anxious: "Cemas",
        angry: "Marah",
        excited: "Bersemangat",

        // Notifications
        welcomeNotif: "Selamat datang di Luma! ✨",
        welcomeMsg: "Mulai perjalanan refleksi dirimu hari ini.",
        checkInNotif: "Check-in Harian 📝",
        checkInMsg: "Bagaimana perasaanmu hari ini? Luangkan waktu untuk merefleksikan diri.",
        congratsNotif: "Kerja bagus! 🎉",
        congratsMsg: "Kamu sudah menyelesaikan check-in harian. Pertahankan!",
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    // Persist language
    useEffect(() => {
        const saved = localStorage.getItem("language") as Language;
        if (saved) setLanguage(saved);
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const t = (key: keyof typeof translations.en) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
    return context;
}
