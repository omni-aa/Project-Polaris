// components/ui/Sidebar.tsx
import {Avatar} from "@heroui/react";
import { useState } from "react";
import { IoChevronDown, IoChevronForward, IoClose } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import {ModeToggle} from "@/components/ui/dark-mode-toggle";

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
    isMobileOpen?: boolean;
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
                                    isLoading,
                                    isMobileOpen = false
                                }: SidebarProps) {

    const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
    const [topicChannels, setTopicChannels] = useState<Record<string, Channel[]>>({});

    const router = useRouter();

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
            <aside className="w-full md:w-80 h-full bg-white dark:bg-[#1A1A1B] text-gray-900 dark:text-[#D7DADC] flex flex-col border-r border-gray-200 dark:border-[#343536] overflow-y-auto">
                <div className="flex-1 p-4 flex items-center justify-center">
                    <div className="text-gray-500 dark:text-[#818384]">Loading topics...</div>
                </div>
            </aside>
        );
    }

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                w-full md:w-80 h-full
                bg-white dark:bg-[#1A1A1B] 
                text-gray-900 dark:text-[#D7DADC] 
                flex flex-col 
                border-r border-gray-200 dark:border-[#343536] 
                overflow-y-auto
                transform transition-transform duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Mobile Header with Close Button */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#343536]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center">
                            <span className="text-white font-bold">r</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-gray-900 dark:text-white">reddit</h1>
                            <p className="text-gray-500 dark:text-[#818384] text-xs">The front page of the internet</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#272729] rounded-lg transition-colors"
                    >
                        <IoClose className="w-6 h-6" />
                    </button>
                </div>

                {/* Desktop Reddit Header */}
                <div className="hidden md:block p-4 border-b border-gray-200 dark:border-[#343536]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center">
                            <span className="text-white font-bold">r</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-gray-900 dark:text-white">reddit</h1>
                            <p className="text-gray-500 dark:text-[#818384] text-xs">The front page of the internet</p>
                        </div>
                    </div>
                </div>

                {/* Main Navigation Content */}
                <div className="flex-1 p-4 md:p-4">
                    {/* Navigation Links */}
                    <div className="space-y-1 mb-6">
                        <Link
                            href="/home"
                            onClick={() => onClose?.()}
                            className="w-full flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg md:rounded-md hover:bg-gray-100 dark:hover:bg-[#272729] text-gray-700 dark:text-[#D7DADC] font-medium text-sm transition-colors duration-200"
                        >
                            <span className="text-gray-500 dark:text-[#818384] text-base md:text-sm">🏠</span>
                            <span className="text-base md:text-sm">Home</span>
                        </Link>
                        <Link
                            href="/"
                            onClick={() => onClose?.()}
                            className="w-full flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg md:rounded-md hover:bg-gray-100 dark:hover:bg-[#272729] text-gray-700 dark:text-[#D7DADC] font-medium text-sm transition-colors duration-200"
                        >
                            <span className="text-gray-500 dark:text-[#818384] text-base md:text-sm">🔥</span>
                            <span className="text-base md:text-sm">Popular</span>
                        </Link>
                        <button className="w-full flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg md:rounded-md hover:bg-gray-100 dark:hover:bg-[#272729] text-gray-700 dark:text-[#D7DADC] font-medium text-sm transition-colors duration-200">
                            <span className="text-gray-500 dark:text-[#818384] text-base md:text-sm">🎯</span>
                            <span className="text-base md:text-sm">All</span>
                        </button>
                    </div>

                    {/* TOPICS Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xs font-semibold text-gray-500 dark:text-[#818384] uppercase tracking-wide">
                                TOPICS
                            </h2>
                            <span className="text-xs bg-gray-100 dark:bg-[#272729] text-gray-500 dark:text-[#818384] px-2 py-1 rounded-full">
                                {topics.length}
                            </span>
                        </div>

                        <div className="space-y-1">
                            {topics.map((topic) => (
                                <div key={topic.id} className="space-y-1">
                                    {/* Topic Header - Now a Link */}
                                    <Link
                                        href={`/t/${encodeURIComponent(topic.name)}`}
                                        onClick={() => onClose?.()}
                                        className="w-full flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg md:rounded-md text-left transition-all duration-150 hover:bg-gray-100 dark:hover:bg-[#272729] group"
                                    >
                                        <div className="w-7 h-7 md:w-6 md:h-6 rounded-full flex items-center justify-center text-white text-sm md:text-xs font-bold"
                                             style={{ backgroundColor: topic.color }}>
                                            {topic.icon}
                                        </div>
                                        <div className="flex-1 flex items-center justify-between">
                                            <span className="font-medium text-base md:text-sm text-gray-900 dark:text-[#D7DADC]">{topic.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500 dark:text-[#818384] bg-gray-100 dark:bg-[#272729] px-2 py-1 rounded-full">
                                                    {topic.channel_count}
                                                </span>
                                                <IoChevronForward className="text-gray-400 dark:text-[#818384] text-base md:text-sm" />
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Channels under this topic */}
                                    {isTopicExpanded(topic.id) && (
                                        <div className="ml-6 md:ml-6 space-y-1 border-l-2 border-gray-200 dark:border-[#343536] pl-2 md:pl-2">
                                            {topicChannels[topic.id] ? (
                                                topicChannels[topic.id].map((channel) => (
                                                    <Link
                                                        key={channel.id}
                                                        href={`/r/${encodeURIComponent(channel.name)}`}
                                                        onClick={() => {
                                                            handleChannelChange(channel.name);
                                                            onClose?.();
                                                        }}
                                                        className={`w-full flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg md:rounded-md text-left transition-all duration-150 group ${
                                                            currentChannel === channel.name
                                                                ? 'bg-blue-50 dark:bg-[#1E3A5F] text-blue-600 dark:text-white border border-blue-200 dark:border-[#3B82F6]'
                                                                : 'text-gray-700 dark:text-[#D7DADC] hover:bg-gray-100 dark:hover:bg-[#272729]'
                                                        }`}
                                                    >
                                                        <div className={`w-5 h-5 md:w-4 md:h-4 rounded-full bg-gray-400 dark:bg-[#818384] flex items-center justify-center text-white text-sm md:text-xs ${
                                                            currentChannel === channel.name ? 'bg-blue-500 dark:bg-[#3B82F6]' : ''
                                                        }`}>
                                                            r
                                                        </div>
                                                        <span className="font-medium text-base md:text-sm">r/{channel.name}</span>
                                                        {currentChannel === channel.name && (
                                                            <div className="ml-auto w-2 h-2 bg-blue-500 dark:bg-[#3B82F6] rounded-full"></div>
                                                        )}
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-gray-500 dark:text-[#818384] text-sm">Loading channels...</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* POPULAR TOPICS Section */}
                    <div className="mb-6">
                        <h2 className="text-xs font-semibold text-gray-500 dark:text-[#818384] uppercase tracking-wide mb-3">
                            POPULAR TOPICS
                        </h2>
                        <div className="space-y-1">
                            {popularTopics.slice(0, 5).map((topic) => (
                                <Link
                                    key={topic}
                                    href={`/t/${encodeURIComponent(topic)}`}
                                    onClick={() => onClose?.()}
                                    className="w-full flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg md:rounded-md text-gray-700 dark:text-[#D7DADC] hover:bg-gray-100 dark:hover:bg-[#272729] text-base md:text-sm transition-colors duration-200"
                                >
                                    <span className="w-2 h-2 bg-gray-400 dark:bg-[#818384] rounded-full"></span>
                                    <span>{topic}</span>
                                </Link>
                            ))}
                            <button className="w-full flex items-center gap-3 px-3 py-3 md:py-2 rounded-lg md:rounded-md text-gray-500 dark:text-[#818384] hover:bg-gray-100 dark:hover:bg-[#272729] text-base md:text-sm font-medium transition-colors duration-200">
                                <span className="text-lg">⊕</span>
                                <span>See more</span>
                            </button>
                        </div>
                    </div>

                    {/* RESOURCES Section */}
                    <div className="mb-6">
                        <h2 className="text-xs font-semibold text-gray-500 dark:text-[#818384] uppercase tracking-wide mb-3">
                            RESOURCES
                        </h2>
                        <div className="space-y-1">
                            {resources.map((resource) => (
                                <button
                                    key={resource}
                                    className="w-full text-left px-3 py-3 md:py-2 rounded-lg md:rounded-md text-gray-600 dark:text-[#D7DADC] hover:bg-gray-100 dark:hover:bg-[#272729] text-base md:text-sm transition-colors duration-200"
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
                                className="w-full text-left px-3 py-2 md:py-1 text-gray-500 dark:text-[#818384] hover:text-gray-700 dark:hover:text-[#FFFFFF] text-sm md:text-xs transition-colors duration-200"
                            >
                                {policy}
                            </button>
                        ))}
                    </div>
                </div>

                {/* User Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-[#343536] bg-gray-50 dark:bg-[#1A1A1B]">
                    {/* User Info */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-8 md:h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-base md:text-sm font-bold">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-base md:text-sm font-medium text-gray-900 dark:text-white truncate">
                                    u/{username}
                                </div>
                                <div className="text-sm md:text-xs text-gray-500 dark:text-[#818384]">
                                    1 karma
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            {/* Theme Toggle */}
                            <ModeToggle />
                            <button
                                className="p-2 md:p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#272729] rounded-lg md:rounded transition-all duration-200"
                                title="Settings"
                            >
                                <svg className="w-5 h-5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                            <button
                                onClick={onLogout}
                                className="p-2 md:p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg md:rounded transition-all duration-200"
                                title="Logout"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                            className="w-full flex items-center justify-center gap-3 p-4 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 border border-red-200 dark:border-red-800 text-base font-medium"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            <span>Log Out</span>
                        </button>
                    </div>

                    {/* Policies & Copyright */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#343536]">
                        <div className="grid grid-cols-2 gap-2 md:gap-1 text-sm md:text-xs text-gray-500 dark:text-[#818384]">
                            {["Help", "Reddit Coins", "Reddit Premium", "Topics", "About"].map((item) => (
                                <button key={item} className="text-left hover:text-gray-700 dark:hover:text-[#FFFFFF] transition-colors duration-200 py-1">
                                    {item}
                                </button>
                            ))}
                        </div>
                        <div className="text-sm md:text-xs text-gray-500 dark:text-[#818384] mt-4">
                            © 2025 Reddit, Inc. All rights reserved.
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}