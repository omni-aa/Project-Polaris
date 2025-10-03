// components/messageComponents/MessageList.tsx
import { useRef, useEffect, useState } from "react";
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
        replies?: any[];
    }>;
    onImageZoom: (url: string) => void;
    onReply: (messageId: string | number, replyText: string) => void;
}

export default function MessageList({ messages, onImageZoom, onReply }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [previousMessageCount, setPreviousMessageCount] = useState(0);

    // Only auto-scroll when NEW MESSAGES are added, not when replies are added
    useEffect(() => {
        const currentMessageCount = messages.length;

        // If we have MORE messages than before, auto-scroll to bottom
        // This only happens when new posts are created, not when replies are added
        if (currentMessageCount > previousMessageCount) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }

        // Update the previous count for next time
        setPreviousMessageCount(currentMessageCount);
    }, [messages.length]); // Only depend on message count, not the entire messages array

    console.log("📋 MessageList rendering with messages:", messages.length);
    messages.forEach(msg => {
        if (msg.replies && msg.replies.length > 0) {
            console.log(`   💬 Message ${msg.id} has ${msg.replies.length} replies`);
        }
    });

    return (
        <div className="p-4 space-y-4 min-h-full">
            {messages.map((msg) => (
                <Message
                    key={msg.id}
                    message={msg}
                    onImageZoom={onImageZoom}
                    onReply={onReply}
                />
            ))}
            <div ref={messagesEndRef} className="h-px" />
        </div>
    );
}