'use client'
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import {GiHamburgerMenu} from "react-icons/gi";
import ZoomedImage from "@/components/ui/ZoomedImage";
import MessageInput from "@/components/messageComponents/MessageInput";
import MessageList from "@/components/messageComponents/MessageList";
import Sidebar from "@/components/ui/Sidebar";
import AuthForm from "@/components/authForm/AuthForm";



interface Message {
    id?: number | string;
    channel: string;
    user: string;
    message: string;
    fileUrl?: string;
    fileName?: string;
    timestamp?: string;
}



export default function App() {
    const [username, setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [currentChannel, setCurrentChannel] = useState("general");
    const [messages, setMessages] = useState<Message[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [channels, setChannels] = useState<string[]>([]);


    useEffect(() => {
        if (!socket) return;

        const onForceLogout = (msg: string) => {
            alert(msg);
            setToken(null);
            setUsername(null);
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            socket.disconnect();
        };

        socket.on("force_logout", onForceLogout);

        return () => {
            socket.off("force_logout", onForceLogout);
        };
    }, [socket]);


    useEffect(() => {
        fetch("http://localhost:3001/channels")
            .then(res => res.json())
            .then(data => setChannels(data))
            .catch(err => console.error("Error fetching channels:", err));
    }, []);

    // Connect socket with token after login/signup
    useEffect(() => {
        if (!token) return;

        const newSocket = io("http://localhost:3001", {
            auth: { token },
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
            setSocket(null);
        };
    }, [token]);

    // Join channel and listen for messages
    useEffect(() => {
        if (!socket || !username) return;

        socket.emit("join_channel", currentChannel);
        setMessages([]);

        const onHistory = (history: Message[]) => setMessages(history);
        const onNewMessage = (msg: Message) => {
            if (msg.channel === currentChannel) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on("channel_history", onHistory);
        socket.on("receive_message", onNewMessage);

        return () => {
            socket.off("channel_history", onHistory);
            socket.off("receive_message", onNewMessage);
        };
    }, [socket, currentChannel, username]);

    // Close sidebar when channel changes on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [currentChannel]);

    // Load saved login on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("username");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUsername(storedUser);
        }
    }, []);

    const handleLogout = () => {
        setToken(null);
        setUsername(null);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        socket?.disconnect();
    };

    if (!username || !token) {
        return <AuthForm onAuthSuccess={(token, username) => {
            setToken(token);
            setUsername(username);
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
        }} />;
    }

    return (
        <div className="flex flex-col md:flex-row h-screen bg-[#36393F] text-white select-none">
            {/* Mobile header */}
            <header className="md:hidden bg-[#292B2F] py- px-5 flex items-center justify-between fixed  left-0 right-0 py-2">
                <h1 className="font-semibold text-2xl"># {currentChannel}</h1>
                <button
                    className="p-1 rounded hover:bg-[#40444B]"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <GiHamburgerMenu size={30}/>
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <div
                        className="fixed left-0 top-0 bottom-0  bg-[#1e1f22] shadow-lg transform transition-transform  "
                        onClick={e => e.stopPropagation()}
                    >

                        <Sidebar
                            channels={channels}
                            currentChannel={currentChannel}
                            username={username}
                            onChannelChange={setCurrentChannel}
                            onLogout={handleLogout}
                        />
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div className="hidden md:flex">
                <Sidebar
                    channels={channels}
                    currentChannel={currentChannel}
                    username={username}
                    onChannelChange={setCurrentChannel}
                    onLogout={handleLogout}
                />
            </div>

            {/* Chat area */}

            <div className="flex-1 flex flex-col bg-[#36393F] mt-14 md:mt-0 min-h-0">
                <header className="hidden md:block bg-[#292B2F] p-4 font-semibold border-b border-[#202225] sticky top-0 z-10">
                    # {currentChannel}

                </header>

                <div className="flex-1 overflow-y-auto">
                    <MessageList
                        messages={messages}
                        onImageZoom={setZoomedImage}
                    />
                </div>

                <div className="sticky bottom-0 z-10">
                    <MessageInput
                        socket={socket}
                        currentChannel={currentChannel}
                        username={username}
                    />
                </div>
            </div>

            {zoomedImage && (
                <ZoomedImage imageUrl={zoomedImage} onClose={() => setZoomedImage(null)} />
            )}
        </div>
    );
}

