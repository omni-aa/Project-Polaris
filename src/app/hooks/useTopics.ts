// hooks/useTopics.ts
'use client'

import { useState, useEffect } from 'react';

export interface Topic {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    post_count: number;
    channel_count: number;
}

export function useTopics() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTopics = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/topics', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch topics: ${response.status}`);
            }

            const data = await response.json();
            setTopics(data);
        } catch (err) {
            console.error('Error in useTopics:', err);
            setError(err instanceof Error ? err.message : 'An error occurred while fetching topics');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const refetch = async () => {
        await fetchTopics();
    };

    return {
        topics,
        isLoading,
        error,
        refetch
    };
}