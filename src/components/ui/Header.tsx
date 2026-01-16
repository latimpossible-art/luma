"use client";

import Link from "next/link";
import { Sparkles, Bell, User, CheckCircle2, Clock, Settings, Languages } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

import { useLanguage } from "@/lib/LanguageContext";

interface HeaderProps {
    userName?: string;
    hasCheckedIn?: boolean;
}

export function Header({ userName = "User", hasCheckedIn = false }: HeaderProps) {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);


    const { language, setLanguage, t } = useLanguage();

    // Click outside to close Settings
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false);
            }
        };

        if (showSettings) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSettings]);

    // Click outside to close Notifications
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    // Click outside to close Profile Menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };

        if (showProfileMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileMenu]);

    // Dynamic notifications based on state
    const notifications = [
        {
            id: 1,
            title: "Welcome to Luma! ✨",
            message: "Start your journey of inner reflection today.",
            read: true,
            icon: <Sparkles className="size-4 text-purple-500" />,
            bgColor: "bg-purple-100 dark:bg-purple-900/30"
        },
        ...(hasCheckedIn
            ? [{
                id: 2,
                title: "Great job! 🎉",
                message: "You've completed your daily check-in. Keep it up!",
                read: false,
                icon: <CheckCircle2 className="size-4 text-green-500" />,
                bgColor: "bg-green-100 dark:bg-green-900/30"
            }]
            : [{
                id: 3,
                title: "Daily Check-in 📝",
                message: "How are you feeling properly? Take a moment to reflect.",
                read: false,
                icon: <Clock className="size-4 text-blue-500" />,
                bgColor: "bg-blue-100 dark:bg-blue-900/30"
            }]
        )
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-border dark:border-slate-800 transition-colors">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                        <Sparkles className="size-4 text-white" />
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Luma
                    </span>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Settings - New Feature */}
                    <div className="relative" ref={settingsRef}>
                        <button
                            onClick={() => {
                                setShowSettings(!showSettings);
                                setShowNotifications(false);
                                setShowProfileMenu(false);
                            }}
                            className="p-2 rounded-full hover:bg-secondary dark:hover:bg-slate-800 transition-colors"
                        >
                            <Settings className="size-5 text-muted-foreground" />
                        </button>

                        {showSettings && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-border dark:border-slate-800 overflow-hidden z-50">
                                <div className="p-3 border-b border-border dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                                    <h3 className="font-semibold text-sm text-foreground">{t('settings')}</h3>
                                </div>
                                <div className="p-2 space-y-1">
                                    {/* Language Toggle */}
                                    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-secondary/50 transition-colors">
                                        <div className="flex items-center gap-2 text-sm text-foreground">
                                            <Languages className="size-4 text-blue-500" />
                                            {t('language')}
                                        </div>
                                        <button
                                            onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
                                            className="ml-auto text-xs font-medium bg-slate-100 px-2 py-1 rounded-lg border border-border min-w-[60px] text-center"
                                        >
                                            {language === 'en' ? 'EN' : 'ID'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notifications */}
                    <div className="relative" ref={notificationsRef}>
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowProfileMenu(false);
                                setShowSettings(false);
                            }}
                            className="p-2 rounded-full hover:bg-secondary dark:hover:bg-slate-800 transition-colors relative"
                        >
                            <Bell className="size-5 text-muted-foreground" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full animate-pulse" />
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-border dark:border-slate-800 overflow-hidden z-50">
                                <div className="p-3 border-b border-border dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                                    <h3 className="font-semibold text-sm text-foreground">{t('notifications')}</h3>
                                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                                        {unreadCount} {t('new')}
                                    </span>
                                </div>
                                <div className="p-2 max-h-72 overflow-y-auto space-y-1">
                                    {notifications.map((note) => (
                                        <div key={note.id} className="p-3 hover:bg-secondary/50 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors flex gap-3 items-start">
                                            <div className={`p-2 rounded-full shrink-0 ${note.bgColor}`}>
                                                {note.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm text-foreground font-medium leading-none mb-1">{note.title}</p>
                                                <p className="text-xs text-muted-foreground leading-snug">{note.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => {
                                setShowProfileMenu(!showProfileMenu);
                                setShowNotifications(false);
                                setShowSettings(false);
                            }}
                            className="p-2 rounded-full hover:bg-secondary dark:hover:bg-slate-800 transition-colors"
                        >
                            <User className="size-5 text-muted-foreground" />
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-border dark:border-slate-800 overflow-hidden z-50">
                                <div className="p-3 border-b border-border dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
                                    <p className="font-medium text-sm truncate text-foreground">{userName}</p>
                                    <p className="text-xs text-muted-foreground">{t('account')}</p>
                                </div>
                                <div className="p-1">
                                    <Link
                                        href="/history"
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-secondary/50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors"
                                        onClick={() => setShowProfileMenu(false)}
                                    >
                                        History
                                    </Link>
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/login" })}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 rounded-xl transition-colors text-left"
                                    >
                                        {t('signOut')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
