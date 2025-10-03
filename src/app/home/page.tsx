'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import { useSocket } from "@/app/SocketContext";

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

export default function HomePage() {
    const [username, setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    // Use socket context - this might be undefined if not properly wrapped
    const { currentChannel, setCurrentChannel } = useSocket();

    // Check authentication
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("username");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUsername(storedUser);
        } else {
            router.push("/");
        }
    }, [router]);

    // Fetch topics directly without socket
    useEffect(() => {
        if (!token) return;

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
    }, [token]);

    // Fetch channels directly without socket
    useEffect(() => {
        if (!token) return;

        const fetchChannels = async () => {
            try {
                const channelsRes = await fetch("http://localhost:3001/channels");
                const allChannels: Channel[] = await channelsRes.json();
                setChannels(allChannels);
            } catch (err) {
                console.error("Error fetching channels:", err);
            }
        };

        fetchChannels();
    }, [token]);

    const handleLogout = () => {
        setToken(null);
        setUsername(null);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        router.push("/");
    };

    const fetchChannelsByTopic = async (topicId: string): Promise<Channel[]> => {
        try {
            const res = await fetch(`http://localhost:3001/topics/${topicId}/channels`);
            return await res.json();
        } catch (err) {
            console.error("Error fetching channels for topic:", err);
            return [];
        }
    };

    // Safe channel change function that doesn't rely on socket
    const handleChannelChange = (channelName: string) => {
        // If socket context is available, use it
        if (setCurrentChannel) {
            setCurrentChannel(channelName);
        }
        // Navigate to main app where socket is fully functional
        router.push("/");
    };

    if (!username || !token) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white text-gray-900 select-none">
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
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="h-full overflow-y-auto">
                            <Sidebar
                                topics={topics}
                                channels={channels}
                                currentChannel={currentChannel || ""}
                                username={username}
                                onChannelChange={handleChannelChange}
                                onLogout={handleLogout}
                                onClose={() => setIsSidebarOpen(false)}
                                fetchChannelsByTopic={fetchChannelsByTopic}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar
                    topics={topics}
                    channels={channels}
                    currentChannel={currentChannel || ""}
                    username={username}
                    onChannelChange={handleChannelChange}
                    onLogout={handleLogout}
                    fetchChannelsByTopic={fetchChannelsByTopic}
                    isLoading={isLoading}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-gray-100">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded hover:bg-gray-100"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl font-bold text-gray-900">Home</h1>
                            <p className="text-gray-600 mt-1">Welcome to your Reddit clone</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                {username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Welcome Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8 text-center">
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                                r
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Welcome to Reddit, u/{username}!
                            </h2>
                            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                                Explore communities, join conversations, and discover content that matters to you.
                            </p>

                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="text-blue-500 text-2xl mb-3">📚</div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Browse Topics</h3>
                                    <p className="text-gray-600 text-sm">
                                        Explore different topics and find communities that match your interests
                                    </p>
                                </div>

                                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                                    <div className="text-green-500 text-2xl mb-3">💬</div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Join Channels</h3>
                                    <p className="text-gray-600 text-sm">
                                        Participate in channel discussions and connect with like-minded people
                                    </p>
                                </div>

                                <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                                    <div className="text-purple-500 text-2xl mb-3">🚀</div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Create Posts</h3>
                                    <p className="text-gray-600 text-sm">
                                        Share your thoughts, images, and engage with the community
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => router.push("/")}
                                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition-colors duration-200"
                                >
                                    Go to Main App
                                </button>
                                <button
                                    onClick={() => {
                                        if (channels.length > 0) {
                                            handleChannelChange(channels[0].name);
                                        }
                                    }}
                                    className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-full transition-colors duration-200"
                                >
                                    Explore Channels
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-300 text-center">
                                <div className="text-2xl font-bold text-gray-900">{topics.length}</div>
                                <div className="text-gray-600 text-sm">Topics</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-300 text-center">
                                <div className="text-2xl font-bold text-gray-900">{channels.length}</div>
                                <div className="text-gray-600 text-sm">Channels</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-300 text-center">
                                <div className="text-2xl font-bold text-gray-900">1</div>
                                <div className="text-gray-600 text-sm">Online</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-300 text-center">
                                <div className="text-2xl font-bold text-gray-900">0</div>
                                <div className="text-gray-600 text-sm">Posts</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}