import { NextRequest, NextResponse } from "next/server";

// JARVIS-style TTS using Google Translate TTS with British English
// For a true JARVIS voice, consider upgrading to ElevenLabs "Daniel" or "Matthew" voice

export async function POST(request: NextRequest) {
    try {
        const { text, lang = "id" } = await request.json();

        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                { error: "Text is required" },
                { status: 400 }
            );
        }

        // Use Indonesian as default language
        // Map en-GB to en-uk for Google TTS British accent
        let ttsLang = lang;
        if (lang === "en-GB" || lang === "en-gb") {
            ttsLang = "en-uk";
        }

        // Split text into chunks (Google TTS has a limit of ~200 characters)
        const chunks = splitTextIntoChunks(text, 200);
        const audioBuffers: ArrayBuffer[] = [];

        for (const chunk of chunks) {
            const encodedText = encodeURIComponent(chunk);
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsLang}&client=tw-ob&q=${encodedText}`;

            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            });

            if (!response.ok) {
                throw new Error(`TTS request failed: ${response.statusText}`);
            }

            const buffer = await response.arrayBuffer();
            audioBuffers.push(buffer);
        }

        // Combine all audio buffers
        const totalLength = audioBuffers.reduce((acc, buf) => acc + buf.byteLength, 0);
        const combinedBuffer = new Uint8Array(totalLength);
        let offset = 0;
        for (const buffer of audioBuffers) {
            combinedBuffer.set(new Uint8Array(buffer), offset);
            offset += buffer.byteLength;
        }

        return new NextResponse(combinedBuffer, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Length": totalLength.toString(),
            },
        });
    } catch (error) {
        console.error("TTS error:", error);
        return NextResponse.json(
            { error: "Text-to-speech failed" },
            { status: 500 }
        );
    }
}

function splitTextIntoChunks(text: string, maxLength: number): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = "";

    for (const sentence of sentences) {
        if (currentChunk.length + sentence.length <= maxLength) {
            currentChunk += sentence;
        } else {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = sentence;
        }
    }

    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
}
