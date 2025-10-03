'use client'
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function TopicPage() {
    const params = useParams();
    const router = useRouter();
    const topicName = decodeURIComponent(params.topic as string);

    const [username, setUsername] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [topicChannels, setTopicChannels] = useState<Channel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    // Fetch all topics
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

    // Fetch channels for this specific topic
    useEffect(() => {
        if (!token) return;

        const fetchTopicChannels = async () => {
            try {
                // First get all topics to find the matching one
                const topicsRes = await fetch("http://localhost:3001/topics");
                const allTopics: Topic[] = await topicsRes.json();

                const currentTopic = allTopics.find(t =>
                    t.name.toLowerCase() === topicName.toLowerCase()
                );

                if (currentTopic) {
                    const channelsRes = await fetch(`http://localhost:3001/topics/${currentTopic.id}/channels`);
                    const channelsData: Channel[] = await channelsRes.json();
                    setTopicChannels(channelsData);
                }
            } catch (err) {
                console.error("Error fetching topic channels:", err);
            }
        };

        fetchTopicChannels();
    }, [token, topicName]);

    // Fetch all channels
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

    const handleChannelChange = (channelName: string) => {
        if (setCurrentChannel) {
            setCurrentChannel(channelName);
        }
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
                            <h1 className="text-2xl font-bold text-gray-900">Topic: {topicName}</h1>
                            <p className="text-gray-600 mt-1">{topicChannels.length} channels in this topic</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                {username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Topic Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                                Channels in {topicName}
                            </h2>

                            {topicChannels.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {topicChannels.map((channel) => (
                                        <div
                                            key={channel.id}
                                            className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors duration-200"
                                            onClick={() => handleChannelChange(channel.name)}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    r/
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">r/{channel.name}</h3>
                                                    <p className="text-gray-600 text-sm">{channel.member_count} members</p>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                {channel.description}
                                            </p>
                                            <button className="mt-4 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-full transition-colors duration-200">
                                                Join Channel
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-6xl mb-4">📂</div>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No channels found</h3>
                                    <p className="text-gray-500">This topic doesn't have any channels yet.</p>
                                </div>
                            )}

                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => router.push("/")}
                                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full transition-colors duration-200"
                                >
                                    Back to Main App
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}