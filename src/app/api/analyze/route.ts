import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Content recommendations database
const CONTENT_RECOMMENDATIONS: Record<string, { title: string; url: string; type: string }[]> = {
    insomnia: [
        { title: "🎵 Relaxing Sleep Music Playlist", url: "https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp", type: "playlist" },
        { title: "🧘 Sleep Meditation (10 min)", url: "https://www.youtube.com/watch?v=aEqlQvczMJQ", type: "video" },
        { title: "📖 Tips for Better Sleep", url: "https://www.sleepfoundation.org/sleep-hygiene", type: "article" },
    ],
    stress: [
        { title: "🎵 Calm & Relaxing Music", url: "https://open.spotify.com/playlist/37i9dQZF1DWXe9gFZP0gtP", type: "playlist" },
        { title: "🧘 5-Minute Stress Relief", url: "https://www.youtube.com/watch?v=inpok4MKVLM", type: "video" },
        { title: "💨 Guided Breathing Exercise", url: "https://www.youtube.com/watch?v=tEmt1Znux58", type: "video" },
    ],
    anxiety: [
        { title: "🎵 Anxiety Relief Playlist", url: "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY", type: "playlist" },
        { title: "🧘 Grounding Techniques", url: "https://www.youtube.com/watch?v=30VMIEmA114", type: "video" },
        { title: "📖 Understanding Anxiety", url: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/anxiety-and-panic-attacks/", type: "article" },
    ],
    sadness: [
        { title: "🎵 Uplifting Music Playlist", url: "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0", type: "playlist" },
        { title: "💪 Mood Boosting Activities", url: "https://www.youtube.com/watch?v=F28MGLlpP90", type: "video" },
    ],
    loneliness: [
        { title: "🎵 Feel-Good Music", url: "https://open.spotify.com/playlist/37i9dQZF1DX9XIFQuFvzM4", type: "playlist" },
        { title: "🤗 Self-Compassion Meditation", url: "https://www.youtube.com/watch?v=QT9OMhuGjrc", type: "video" },
    ],
};

// Enhanced system prompt with content recommendations
// Enhanced system prompt with content recommendations
const SYSTEM_PROMPT = `You are Luma, a compassionate digital companion.
Analyze the user's journal entry.

Your tasks:
1. INFER the user's primary emotion (mood).
2. ESTIMATE the intensity/stress level (1-10) based on the content.
3. Provide a warm, supportive insight. BE CREATIVE and DIVERSE. Avoid repetitive phrases.
4. Detect specific issues (insomnia, stress, anxiety, etc.).
5. Provide actionable suggestions.

Response Style:
- **Rich w/ Emojis**: Use a wide variety of emojis (✨ 🌊 🍃 🪐 🍄 🧡 🎧 🕯️) to make it visually engaging.
- **Adaptive**: If input is short, be curious and encouraging. If long, be deep and reflective.
- **Language**: Indonesian (Casual JARVIS style: "Bro", "Sis", "Gue", "Lu", santai tapi cerdas).

Important guidelines:
- You are NOT a therapist or doctor. Never diagnose.
- If the user expresses severe distress, self-harm, or suicidal thoughts, gently encourage them to speak with a professional.

You MUST respond in valid JSON format with this exact structure:
{
  "insight": "Your reflection here (Indonesian, rich emojis)...",
  "insightVoice": "Spoken version (Indonesian, casual JARVIS style)...",
  "emotionClassification": "One of: happy, calm, sad, anxious, angry, confused, hopeful, neutral",
  "anxietyLevel": 1-10,
  "anxietyIndicators": ["list", "of", "detected", "anxiety", "markers"],
  "detectedIssues": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "followUp": "Follow up question?"
}`;

export interface AnalyzeRequest {
    mood: string;
    scale: number;
    entry: string;
}

export interface ContentRecommendation {
    title: string;
    url: string;
    type: string;
}

export interface AnalyzeResponse {
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

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// ... (existing helper function to parse analysis result or use existing variable)

export async function POST(request: NextRequest) {
    try {
        const body: AnalyzeRequest = await request.json();
        const { mood, scale, entry } = body;

        // Validate input
        if (!entry || entry.trim().length === 0) {
            return NextResponse.json(
                { error: "Journal entry is required" },
                { status: 400 }
            );
        }

        // ... (system prompt and user message construction) ...
        const userMessage = `
User's initial mood selection: ${mood}
User's intensity scale (1-10): ${scale}

Journal entry:
"${entry}"

Please analyze this journal entry and provide your response in the specified JSON format. Remember to detect any specific issues mentioned.`;

        // Call Groq API
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 1024,
            response_format: { type: "json_object" },
        });

        const responseText = completion.choices[0]?.message?.content;

        if (!responseText) {
            throw new Error("Empty response from Groq");
        }

        // Parse the JSON response
        const analysis: AnalyzeResponse = JSON.parse(responseText);

        // Add content recommendations based on detected issues
        const recommendations: ContentRecommendation[] = [];
        if (analysis.detectedIssues && analysis.detectedIssues.length > 0) {
            for (const issue of analysis.detectedIssues) {
                const issueKey = issue.toLowerCase();
                if (CONTENT_RECOMMENDATIONS[issueKey]) {
                    recommendations.push(...CONTENT_RECOMMENDATIONS[issueKey]);
                }
            }
        }

        // Also check emotion classification for recommendations
        if (analysis.emotionClassification === "anxious" && !recommendations.length) {
            recommendations.push(...(CONTENT_RECOMMENDATIONS.anxiety || []));
        }
        if (analysis.emotionClassification === "sad" && !recommendations.length) {
            recommendations.push(...(CONTENT_RECOMMENDATIONS.sadness || []));
        }

        // Limit to 3 recommendations
        analysis.contentRecommendations = recommendations.slice(0, 3);

        // Save to database if user is logged in
        const session = await getServerSession(authOptions);
        console.log("Analyze API Session:", JSON.stringify(session, null, 2));

        if (session?.user?.email) {
            const user = await prisma.user.findUnique({ where: { email: session.user.email } });
            console.log("Analyze API User:", user);

            if (user) {
                try {
                    const savedEntry = await prisma.journalEntry.create({
                        data: {
                            userId: user.id,
                            mood,
                            scale,
                            content: entry,
                            insight: analysis.insight,
                            emotionClassification: analysis.emotionClassification,
                            anxietyLevel: analysis.anxietyLevel,
                            suggestions: JSON.stringify(analysis.suggestions),
                        }
                    });
                    console.log("Journal entry saved:", savedEntry.id);
                } catch (dbError) {
                    console.error("Failed to save journal entry:", dbError);
                }
            } else {
                console.warn("User not found in database despite having session");
            }
        } else {
            console.warn("No valid session found for saving history");
        }

        return NextResponse.json(analysis);
    } catch (error) {
        console.error("Analysis error:", error);

        // Return a graceful fallback response
        return NextResponse.json(
            {
                insight: "I'm having trouble processing your thoughts right now. Please try again in a moment. 🙏",
                insightVoice: "I'm having trouble processing your thoughts right now. Please try again in a moment.",
                emotionClassification: "neutral",
                anxietyLevel: 0,
                anxietyIndicators: [],
                detectedIssues: [],
                suggestions: ["Take a deep breath", "Try again in a moment"],
                followUp: "Would you like to try sharing again?",
                contentRecommendations: [],
                error: "Analysis temporarily unavailable",
            },
            { status: 500 }
        );
    }
}
