'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
    id?: number | string;
    channel: string;
    user: string;
    message: string;
    fileUrl?: string;
    fileName?: string;
    timestamp?: string;
}

interface SocketContextType {
    socket: Socket | null;
    currentChannel: string;
    setCurrentChannel: (channel: string) => void;
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    refreshChannel: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children, token }: { children: React.ReactNode; token: string | null }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [currentChannel, setCurrentChannel] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    const refreshChannel = () => {
        if (!socket || !currentChannel) return;

        console.log("🔄 Refreshing channel:", currentChannel);
        socket.emit("join_channel", currentChannel, (response: any) => {
            if (response && response.error) {
                console.error("Error refreshing channel:", response.error);
            } else {
                console.log("✅ Channel refreshed:", currentChannel);
            }
        });
    };

    useEffect(() => {
        if (!token) {
            if (socket) {
                console.log("No token, disconnecting socket");
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        console.log("Creating new socket connection with token...");
        const newSocket = io("http://localhost:3001", {
            auth: { token },
        });

        newSocket.on("connect", () => {
            console.log("✅ Socket connected:", newSocket.id);
            // Auto-join current channel when reconnecting
            if (currentChannel) {
                newSocket.emit("join_channel", currentChannel);
            }
        });

        newSocket.on("disconnect", (reason) => {
            console.log("❌ Socket disconnected:", reason);
        });

        newSocket.on("connect_error", (error) => {
            console.error("🔴 Socket connection error:", error);
        });

        // Handle incoming messages
        const handleNewMessage = (msg: Message) => {
            console.log("📨 New message received:", msg);
            if (msg.channel === currentChannel) {
                setMessages(prev => [...prev, msg]);
            }
        };

        // Handle channel history
        const handleChannelHistory = (history: Message[]) => {
            console.log("📚 Channel history received:", history.length, "messages");
            setMessages(history);
        };

        // Handle join errors
        const handleJoinError = (error: any) => {
            console.error("🚫 Join error:", error);
        };

        newSocket.on("receive_message", handleNewMessage);
        newSocket.on("channel_history", handleChannelHistory);
        newSocket.on("join_error", handleJoinError);

        setSocket(newSocket);

        return () => {
            console.log("🧹 Cleaning up socket...");
            newSocket.off("receive_message", handleNewMessage);
            newSocket.off("channel_history", handleChannelHistory);
            newSocket.off("join_error", handleJoinError);
            newSocket.disconnect();
        };
    }, [token]);

    // Join channel when currentChannel changes
    useEffect(() => {
        if (!socket || !currentChannel) return;

        console.log("🎯 Joining channel:", currentChannel);
        socket.emit("join_channel", currentChannel);
        setMessages([]);

    }, [socket, currentChannel]);

    return (
        <SocketContext.Provider value={{
            socket,
            currentChannel,
            setCurrentChannel,
            messages,
            setMessages,
            refreshChannel
        }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}