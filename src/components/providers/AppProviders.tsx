"use client";

import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/LanguageContext";
import { SessionProvider } from "@/components/providers/SessionProvider";
// Assuming SessionProvider is already wrapping things, we can combine/compose them or 
// keep SessionProvider in layout and just return Theme/Lang here. 
// For cleanliness, let's keep this focused on Theme/Lang, and we'll wrap inside SessionProvider in layout.

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false}>
            <LanguageProvider>
                {children}
            </LanguageProvider>
        </ThemeProvider>
    );
}
