import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Reuse content recommendations (could be moved to shared lib)
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

const SYSTEM_PROMPT = `You are Luma, a compassionate digital companion.
Analyze the user's spoken voice transcript.

Your tasks:
1. INFER the user's primary emotion (mood). Even if the input is very short (e.g., "I'm tired"), infer the underlying feeling.
2. ESTIMATE the intensity/stress level (1-10).
3. Provide a warm, supportive insight. BE CREATIVE and DIVERSE. Avoid repetitive phrases.
4. Detect specific issues (insomnia, stress, anxiety, etc.).
5. Provide actionable suggestions.

Response Style:
- **Rich w/ Emojis**: Use a wide variety of emojis (✨ 🌊 🍃 🪐 🍄 🧡 🎧 🕯️) to make it visually engaging.
- **Adaptive**: If input is short, be curious and encouraging. If long, be deep and reflective.
- **Language**: Indonesian (Casual JARVIS style: "Bro", "Sis", "Gue", "Lu", santai tapi cerdas).

You MUST respond in valid JSON:
{
  "insight": "Your reflection here...",
  "insightVoice": "Spoken version (Indonesian, casual JARVIS style)...",
  "inferredMood": "One of: Happy, Calm, Sad, Anxious, Angry, Confused, Hopeful, Neutral",
  "inferredScale": 1-10,
  "emotionClassification": "simple emotion key (e.g. anxious)",
  "detectedIssues": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "followUp": "Follow up question?"
}`;

export async function POST(req: NextRequest) {
    try {
        const { transcript } = await req.json();

        if (!transcript) {
            return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
        }

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `Here is the user's spoken transcript:\n"${transcript}"` },
            ],
            temperature: 0.7,
            max_tokens: 1024,
            response_format: { type: "json_object" },
        });

        const responseText = completion.choices[0]?.message?.content;
        if (!responseText) throw new Error("Empty AI response");

        const analysis = JSON.parse(responseText);

        // Add content recommendations
        const recommendations: any[] = [];
        if (analysis.detectedIssues) {
            for (const issue of analysis.detectedIssues) {
                const key = issue.toLowerCase();
                if (CONTENT_RECOMMENDATIONS[key]) {
                    recommendations.push(...CONTENT_RECOMMENDATIONS[key]);
                }
            }
        }
        // Fallbacks
        if (analysis.emotionClassification === "anxious" && !recommendations.length) recommendations.push(...(CONTENT_RECOMMENDATIONS.anxiety || []));
        if (analysis.emotionClassification === "sad" && !recommendations.length) recommendations.push(...(CONTENT_RECOMMENDATIONS.sadness || []));

        analysis.contentRecommendations = recommendations.slice(0, 3);

        // Save to DB
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
            const user = await prisma.user.findUnique({ where: { email: session.user.email } });
            if (user) {
                await prisma.journalEntry.create({
                    data: {
                        userId: user.id,
                        mood: analysis.inferredMood,
                        scale: analysis.inferredScale,
                        content: transcript,
                        insight: analysis.insight,
                        emotionClassification: analysis.emotionClassification,
                        anxietyLevel: analysis.inferredScale, // Reuse scale as anxiety level proxy or separate
                        suggestions: JSON.stringify(analysis.suggestions),
                    }
                });
            }
        }

        return NextResponse.json(analysis);

    } catch (error) {
        console.error("Voice Analysis Error:", error);
        return NextResponse.json({ error: "Failed to analyze voice" }, { status: 500 });
    }
}
