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
        <div className="p-4 space-y-4 min-h-full"> {/* Changed padding and height */}
            {messages.map((msg) => (
                <Message key={msg.id} message={msg} onImageZoom={onImageZoom} />
            ))}
            <div ref={messagesEndRef} className="h-px" /> {/* Added height */}
        </div>
    );
}