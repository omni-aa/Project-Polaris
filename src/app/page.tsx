'use client'
import { useEffect, useState } from "react";
import {GiHamburgerMenu} from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import ZoomedImage from "@/components/ui/ZoomedImage";
import MessageList from "@/components/messageComponents/MessageList";
import Sidebar from "@/components/ui/Sidebar";
import AuthForm from "@/components/authForm/AuthForm";
import { useRouter } from "next/navigation";
import { useSocket } from "./SocketContext";

interface Topic {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    channel_count: number;
}

interface Channel {
    id: string;
    topic_id: string;
    name: string;
    description: string;
    member_count: number;
}

export default function Home() {
    const [username, setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Use the socket context
    const { socket, currentChannel, setCurrentChannel, messages } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const onForceLogout = (msg: string) => {
            alert(msg);
            handleLogout();
        };

        socket.on("force_logout", onForceLogout);

        return () => {
            socket.off("force_logout", onForceLogout);
        };
    }, [socket]);

    // Fetch topics when user authenticates
    useEffect(() => {
        if (!token || !username) return;

        setIsLoading(true);
        fetch("http://localhost:3001/topics")
            .then(res => res.json())
            .then((data: Topic[]) => {
                setTopics(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching topics:", err);
                setIsLoading(false);
            });
    }, [token, username]);

    // Fetch all channels and set the first one as default
    useEffect(() => {
        if (!token || !username) return;

        const fetchChannels = async () => {
            try {
                const channelsRes = await fetch("http://localhost:3001/channels");
                const allChannels: Channel[] = await channelsRes.json();
                setChannels(allChannels);

                // Set the first channel as current if none is set
                if (allChannels.length > 0 && !currentChannel) {
                    setCurrentChannel(allChannels[0].name);
                }
            } catch (err) {
                console.error("Error fetching channels:", err);
            }
        };

        fetchChannels();
    }, [token, username, currentChannel, setCurrentChannel]);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [currentChannel]);

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
        if (socket) {
            socket.disconnect();
        }
    };

    // In your page.tsx, add this function
    const handleReply = (messageId: string | number, replyText: string) => {
        if (!socket || !currentChannel) return;

        const replyData = {
            messageId: messageId,
            channel: currentChannel,
            message: replyText,
            timestamp: new Date().toISOString()
        };

        socket.emit("send_reply", replyData, (response: any) => {
            if (response && response.success) {
                console.log("✅ Reply sent successfully!");
                // The reply will be broadcasted to all users via socket
            } else {
                console.error("❌ Failed to send reply:", response?.error);
                alert("Failed to send reply. Please try again.");
            }
        });
    };

    // Function to fetch channels for a specific topic
    const fetchChannelsByTopic = async (topicId: string): Promise<Channel[]> => {
        try {
            const res = await fetch(`http://localhost:3001/topics/${topicId}/channels`);
            return await res.json();
        } catch (err) {
            console.error("Error fetching channels for topic:", err);
            return [];
        }
    };

    const handleAddPost = () => {
        if (currentChannel) {
            router.push(`/r/${encodeURIComponent(currentChannel)}/submit`);
        } else {
            alert("Please select a channel first");
        }
    };

    if (!username || !token) {
        return <AuthForm onAuthSuccess={(token, username) => {
            setToken(token);
            setUsername(username);
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
        }} />;
    }

    if (!currentChannel && channels.length === 0) {
        return (
            <div className="flex h-screen bg-white items-center justify-center">
                <div className="text-gray-500">Loading channels...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white text-gray-900 select-none">
            {/* Mobile header */}
            <header className="md:hidden bg-white border-b border-gray-200 py-2 px-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
                <div className="flex items-center gap-2">
                    <button
                        className="p-1 rounded hover:bg-gray-100 transition-all duration-200"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <GiHamburgerMenu size={18} className="text-gray-600"/>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-orange-500 rounded-sm flex items-center justify-center">
                            <span className="text-white font-bold text-xs">r</span>
                        </div>
                        <h1 className="font-bold text-base">reddit</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {currentChannel ? (
                        <>
                            <span className="text-gray-600 font-medium capitalize text-sm mr-2">
                                r/{currentChannel}
                            </span>
                            <button
                                onClick={handleAddPost}
                                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200"
                                title="Add Post"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </>
                    ) : (
                        <span className="text-gray-400 text-sm">Select a channel</span>
                    )}
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/30 transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center">
                                    <span className="text-white font-bold">r</span>
                                </div>
                                <div>
                                    <h1 className="font-bold text-lg text-gray-900">reddit</h1>
                                    <p className="text-gray-500 text-sm">The front page of the internet</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-1 rounded hover:bg-gray-100 transition-all duration-200"
                            >
                                <IoClose size={20} className="text-gray-600" />
                            </button>
                        </div>
                        <div className="h-full overflow-y-auto">
                            <Sidebar

                                channels={channels}
                                currentChannel={currentChannel}
                                username={username}
                                onChannelChange={setCurrentChannel}
                                onLogout={handleLogout}
                                onClose={() => setIsSidebarOpen(false)}
                                isLoading={isLoading}
                            />
                        </div>
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
                    isLoading={isLoading}
                />
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-white mt-12 md:mt-0 min-h-0">
                <header className="hidden md:flex bg-white border-b border-gray-200 px-6 py-4 font-medium text-lg sticky top-0 z-10 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">r</span>
                        </div>
                        <div>
                            <span className="text-gray-900 capitalize block">
                                {currentChannel ? `r/${currentChannel}` : 'Select a channel'}
                            </span>
                            {currentChannel && (
                                <span className="text-gray-500 text-xs font-normal">
                                    {messages.length} messages • Online
                                </span>
                            )}
                        </div>
                    </div>

                    {currentChannel && (
                        <button
                            onClick={handleAddPost}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-full transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Post
                        </button>
                    )}
                </header>

                <div className="flex-1 overflow-y-auto bg-gray-100">
                    {currentChannel ? (
                        <MessageList
                            onReply={handleReply}
                            messages={messages}
                            onImageZoom={setZoomedImage}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-gray-500 text-center">
                                <div className="text-lg mb-2">Welcome to Reddit</div>
                                <div className="text-sm">Select a channel from the sidebar to start chatting</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {zoomedImage && (
                <ZoomedImage
                    imageUrl={zoomedImage}
                    onClose={() => setZoomedImage(null)}
                />
            )}
        </div>
    );
}