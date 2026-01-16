import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get all journal entries ordered by date (newest first)
        const entries = await prisma.journalEntry.findMany({
            where: { userId: user.id },
            select: { createdAt: true },
            orderBy: { createdAt: 'desc' }
        });

        if (entries.length === 0) {
            return NextResponse.json({
                streak: 0,
                lastCheckIn: null,
                totalEntries: 0
            });
        }

        // Calculate streak
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if there's an entry today or yesterday to start streak
        const latestEntry = new Date(entries[0].createdAt);
        latestEntry.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((today.getTime() - latestEntry.getTime()) / (1000 * 60 * 60 * 24));

        // If latest entry is more than 1 day ago, streak is broken
        if (daysDiff > 1) {
            return NextResponse.json({
                streak: 0,
                lastCheckIn: entries[0].createdAt,
                totalEntries: entries.length
            });
        }

        // Start counting streak
        const uniqueDays = new Set<string>();
        entries.forEach(entry => {
            const dateStr = new Date(entry.createdAt).toDateString();
            uniqueDays.add(dateStr);
        });

        const sortedDates = Array.from(uniqueDays)
            .map(dateStr => new Date(dateStr))
            .sort((a, b) => b.getTime() - a.getTime());

        // Count consecutive days
        let currentDate = new Date(sortedDates[0]);
        currentDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < sortedDates.length; i++) {
            const entryDate = new Date(sortedDates[i]);
            entryDate.setHours(0, 0, 0, 0);

            const expectedDate = new Date(currentDate);
            expectedDate.setDate(expectedDate.getDate() - i);

            if (entryDate.toDateString() === expectedDate.toDateString()) {
                streak++;
            } else {
                break;
            }
        }

        return NextResponse.json({
            streak,
            lastCheckIn: entries[0].createdAt,
            totalEntries: entries.length
        });

    } catch (error) {
        console.error("Streak calculation error:", error);
        return NextResponse.json(
            { error: "Failed to calculate streak" },
            { status: 500 }
        );
    }
}
