// Types for the AI analysis response
export interface ContentRecommendation {
    title: string;
    url: string;
    type: string;
}

export interface AnalysisResult {
    insight: string;
    insightVoice: string;
    emotionClassification: string;
    anxietyLevel: number;
    anxietyIndicators: string[];
    detectedIssues: string[];
    suggestions: string[];
    followUp: string;
    contentRecommendations?: ContentRecommendation[];
}

// Call the backend API to analyze journal entry
export async function analyzeEntry(
    mood: string,
    scale: number,
    entry: string
): Promise<AnalysisResult> {
    const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood, scale, entry }),
    });

    if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
    }

    return response.json();
}

// Helper to get color based on emotion
export function getEmotionColor(emotion: string): string {
    const colors: Record<string, string> = {
        happy: "#FFD60A",
        calm: "#30D158",
        sad: "#5E5CE6",
        anxious: "#FF453A",
        angry: "#FF9500",
        confused: "#BF5AF2",
        hopeful: "#64D2FF",
        neutral: "#8E8E93",
    };
    return colors[emotion] || colors.neutral;
}

// Helper to get anxiety level description
export function getAnxietyDescription(level: number): string {
    if (level <= 2) return "Very Low";
    if (level <= 4) return "Mild";
    if (level <= 6) return "Moderate";
    if (level <= 8) return "Elevated";
    return "High";
}

// Audio player instance for TTS
let currentAudio: HTMLAudioElement | null = null;

// Text-to-Speech using cloud API (natural AI voice)
export async function speakText(
    text: string,
    lang: string = "id",
    onStart?: () => void,
    onEnd?: () => void
): Promise<void> {
    if (typeof window === "undefined") {
        console.warn("Not in browser environment");
        return;
    }

    // Stop any currently playing audio
    stopSpeaking();

    try {
        onStart?.();

        // Call our TTS API
        const response = await fetch("/api/tts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text, lang }),
        });

        if (!response.ok) {
            throw new Error("TTS API failed");
        }

        // Get audio blob
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        // Create and play audio
        currentAudio = new Audio(audioUrl);
        currentAudio.playbackRate = 1.0; // Normal speed

        currentAudio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            currentAudio = null;
            onEnd?.();
        };

        currentAudio.onerror = () => {
            URL.revokeObjectURL(audioUrl);
            currentAudio = null;
            onEnd?.();
            console.error("Audio playback error");
        };

        await currentAudio.play();
    } catch (error) {
        console.error("TTS error:", error);
        onEnd?.();

        // Fallback to Web Speech API if cloud TTS fails
        fallbackSpeak(text, lang, onEnd);
    }
}

// Fallback Web Speech API
function fallbackSpeak(text: string, lang: string, onEnd?: () => void): void {
    if (!window.speechSynthesis) {
        onEnd?.();
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "id" ? "id-ID" : lang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();

    window.speechSynthesis.speak(utterance);
}

// Stop speaking
export function stopSpeaking(): void {
    // Stop audio element
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }

    // Also stop Web Speech API if active
    if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

// Check if currently speaking
export function isSpeaking(): boolean {
    if (currentAudio && !currentAudio.paused) {
        return true;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
        return window.speechSynthesis.speaking;
    }
    return false;
}
