import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are Luma. Generate a SHORT, uplifting, daily insight/tip for the user.
                    - Language: English (Universal & Clean).
                    - Style: Warm, creative, diverse.
                    - Format: Plain text, max 1 sentence.
                    - Emojis: Include 1-2 relevant emojis.`
                },
                {
                    role: "user",
                    content: "Give me a unique daily insight for today."
                },
            ],
            temperature: 0.9, // High temperature for variety
            max_tokens: 100,
        });

        const insight = completion.choices[0]?.message?.content || "Take a deep breath. You are doing great! 🌿";

        return NextResponse.json({ insight });
    } catch (error) {
        console.error("Daily Insight Error:", error);
        return NextResponse.json({ insight: "Small steps lead to big changes. Keep going! ✨" });
    }
}
