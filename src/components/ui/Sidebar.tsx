import {Avatar} from "@heroui/react";
import { useState } from "react";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";

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

interface SidebarProps {
    topics: Topic[];
    channels: Channel[];
    currentChannel: string;
    username: string;
    onChannelChange: (channel: string) => void;
    onLogout: () => void;
    onClose?: () => void;
    fetchChannelsByTopic: (topicId: string) => Promise<Channel[]>;
    isLoading: boolean;
}

export default function Sidebar({
                                    topics,
                                    channels,
                                    currentChannel,
                                    username,
                                    onChannelChange,
                                    onLogout,
                                    onClose,
                                    fetchChannelsByTopic,
                                    isLoading
                                }: SidebarProps) {

    const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
    const [topicChannels, setTopicChannels] = useState<Record<string, Channel[]>>({});

    const handleChannelChange = (channel: string) => {
        onChannelChange(channel);
        if (onClose) {
            onClose();
        }
    };

    const toggleTopic = async (topic: Topic) => {
        const newExpandedTopics = new Set(expandedTopics);

        if (expandedTopics.has(topic.id)) {
            newExpandedTopics.delete(topic.id);
        } else {
            newExpandedTopics.add(topic.id);
            // Fetch channels if not already loaded
            if (!topicChannels[topic.id]) {
                try {
                    const channels = await fetchChannelsByTopic(topic.id);
                    setTopicChannels(prev => ({
                        ...prev,
                        [topic.id]: channels
                    }));
                } catch (err) {
                    console.error("Error loading channels:", err);
                }
            }
        }

        setExpandedTopics(newExpandedTopics);
    };

    const isTopicExpanded = (topicId: string) => expandedTopics.has(topicId);

    // Mock data for other sections
    const popularTopics = [
        "Internet Culture", "Games", "Technology", "Movies & TV",
        "Music", "Sports", "Science", "Art", "Food", "Travel"
    ];

    const resources = [
        "About Reddit", "Help Center", "Blog", "Careers", "Press"
    ];

    const policies = [
        "Content Policy", "Privacy Policy", "User Agreement"
    ];

    if (isLoading) {
        return (
            <aside className="w-80 h-full bg-white text-gray-900 flex flex-col border-r border-gray-200 overflow-y-auto">
                <div className="flex-1 p-4 flex items-center justify-center">
                    <div className="text-gray-500">Loading topics...</div>
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-80 h-full bg-white text-gray-900 flex flex-col border-r border-gray-200 overflow-y-auto">
            {/* Reddit Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center">
                        <span className="text-white font-bold">r</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-gray-900">reddit</h1>
                        <p className="text-gray-500 text-xs">The front page of the internet</p>
                    </div>
                </div>
            </div>

            {/* Main Navigation Content */}
            <div className="flex-1 p-4">
                {/* Navigation Links */}
                <div className="space-y-1 mb-6">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium text-sm">
                        <span className="text-gray-500">🏠</span>
                        <span>Home</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium text-sm">
                        <span className="text-gray-500">🔥</span>
                        <span>Popular</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium text-sm">
                        <span className="text-gray-500">🎯</span>
                        <span>All</span>
                    </button>
                </div>

                {/* TOPICS Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            TOPICS
                        </h2>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                            {topics.length}
                        </span>
                    </div>

                    <div className="space-y-1">
                        {topics.map((topic) => (
                            <div key={topic.id} className="space-y-1">
                                {/* Topic Header */}
                                <button
                                    onClick={() => toggleTopic(topic)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-all duration-150 hover:bg-gray-100 group"
                                >
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                         style={{ backgroundColor: topic.color }}>
                                        {topic.icon}
                                    </div>
                                    <div className="flex-1 flex items-center justify-between">
                                        <span className="font-medium text-sm">{topic.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                {topic.channel_count}
                                            </span>
                                            {isTopicExpanded(topic.id) ? (
                                                <IoChevronDown className="text-gray-400 text-sm" />
                                            ) : (
                                                <IoChevronForward className="text-gray-400 text-sm" />
                                            )}
                                        </div>
                                    </div>
                                </button>

                                {/* Channels under this topic */}
                                {isTopicExpanded(topic.id) && (
                                    <div className="ml-6 space-y-1 border-l-2 border-gray-200 pl-2">
                                        {topicChannels[topic.id] ? (
                                            topicChannels[topic.id].map((channel) => (
                                                <button
                                                    key={channel.id}
                                                    onClick={() => handleChannelChange(channel.name)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-all duration-150 group ${
                                                        currentChannel === channel.name
                                                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs ${
                                                        currentChannel === channel.name ? 'bg-blue-500' : ''
                                                    }`}>
                                                        #
                                                    </div>
                                                    <span className="font-medium text-sm">r/{channel.name}</span>
                                                    {currentChannel === channel.name && (
                                                        <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    )}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-3 py-2 text-gray-500 text-sm">Loading channels...</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>



                {/* POPULAR TOPICS Section */}
                <div className="mb-6">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        POPULAR TOPICS
                    </h2>
                    <div className="space-y-1">
                        {popularTopics.slice(0, 5).map((topic) => (
                            <button
                                key={topic}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
                            >
                                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                <span>{topic}</span>
                            </button>
                        ))}
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-500 hover:bg-gray-100 text-sm font-medium">
                            <span className="text-lg">⊕</span>
                            <span>See more</span>
                        </button>
                    </div>
                </div>

                {/* RESOURCES Section */}
                <div className="mb-6">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        RESOURCES
                    </h2>
                    <div className="space-y-1">
                        {resources.map((resource) => (
                            <button
                                key={resource}
                                className="w-full text-left px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 text-sm"
                            >
                                {resource}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Policies Section */}
                <div className="space-y-1">
                    {policies.map((policy) => (
                        <button
                            key={policy}
                            className="w-full text-left px-3 py-1 text-gray-500 hover:text-gray-700 text-xs"
                        >
                            {policy}
                        </button>
                    ))}
                </div>
            </div>

            {/* User Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                {/* User Info */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                                u/{username}
                            </div>
                            <div className="text-xs text-gray-500">
                                1 karma
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-all duration-200"
                            title="Settings"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                        <button
                            onClick={onLogout}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all duration-200"
                            title="Logout"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Logout Button */}
                <div className="md:hidden">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 border border-red-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span className="font-medium">Log Out</span>
                    </button>
                </div>

                {/* Policies & Copyright */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                        {["Help", "Reddit Coins", "Reddit Premium", "Topics", "About"].map((item) => (
                            <button key={item} className="text-left hover:text-gray-700 transition-colors">
                                {item}
                            </button>
                        ))}
                    </div>
                    <div className="text-xs text-gray-500 mt-4">
                        © 2025 Reddit, Inc. All rights reserved.
                    </div>
                </div>
            </div>
        </aside>
    );
}