import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
        const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

        // Validate parameters
        if (month < 1 || month > 12 || year < 1900 || year > 2100) {
            return NextResponse.json({ error: "Invalid month or year" }, { status: 400 });
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Calculate date range for the month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        // Fetch all journal entries for this month
        const entries = await prisma.journalEntry.findMany({
            where: {
                userId: user.id,
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                id: true,
                createdAt: true,
                mood: true,
                anxietyLevel: true,
                content: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Group entries by day
        const calendarData: Record<number, any> = {};

        entries.forEach(entry => {
            const day = entry.createdAt.getDate();

            if (!calendarData[day]) {
                calendarData[day] = {
                    date: day,
                    hasEntry: true,
                    entries: []
                };
            }

            calendarData[day].entries.push({
                id: entry.id,
                time: entry.createdAt.toISOString(),
                mood: entry.mood || "Unknown",
                anxietyLevel: entry.anxietyLevel || 0,
                preview: entry.content?.substring(0, 100) || ""
            });
        });

        return NextResponse.json({
            month,
            year,
            data: calendarData
        });

    } catch (error) {
        console.error("Calendar data error:", error);
        return NextResponse.json(
            { error: "Failed to fetch calendar data" },
            { status: 500 }
        );
    }
}
