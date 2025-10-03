import { useRef, useEffect } from "react";
import Message from "./Message";

interface MessageListProps {
    messages: Array<{
        id?: number | string;
        channel: string;
        user: string;
        message: string;
        fileUrl?: string;
        fileName?: string;
        timestamp?: string;
    }>;
    onImageZoom: (url: string) => void;
}

export default function MessageList({ messages, onImageZoom }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="max-w-4xl mx-auto bg-white min-h-full">
            {messages.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                    No messages yet. Be the first to post in r/{messages[0]?.channel || 'this channel'}!
                </div>
            ) : (
                messages.map((msg) => (
                    <Message key={msg.id} message={msg} onImageZoom={onImageZoom} />
                ))
            )}
            <div ref={messagesEndRef} className="h-px" />
        </div>
    );
}