// app/api/topics/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const topics = [

            {
                id: "2",
                name: "Gaming",
                description: "Video games, esports, and gaming culture",
                icon: "🎮",
                color: "#10B981",
                post_count: 892,
                channel_count: 12
            },
            {
                id: "8",
                name: "Food & Cooking",
                description: "Recipes, cooking techniques, and food culture",
                icon: "🍳",
                color: "#F97316",
                post_count: 543,
                channel_count: 5
            }
        ];

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100));

        return NextResponse.json(topics);
    } catch (error) {
        console.error('Error fetching topics:', error);
        return NextResponse.json(
            { error: "Failed to fetch topics" },
            { status: 500 }
        );
    }
}