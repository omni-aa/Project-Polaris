'use client'
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSocket } from "@/app/SocketContext";

export default function CreatePost() {
    const router = useRouter();
    const params = useParams();
    const channel = decodeURIComponent(params.channel as string);
    const { socket, currentChannel, setCurrentChannel, refreshChannel } = useSocket();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Ensure we're in the correct channel before posting
    useEffect(() => {
        if (channel && currentChannel !== channel) {
            console.log(`Switching channel from ${currentChannel} to ${channel}`);
            setCurrentChannel(channel);
        }
    }, [channel, currentChannel, setCurrentChannel]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);

        try {
            // Get username from localStorage
            const username = localStorage.getItem("username");

            if (!username) {
                alert("You must be logged in to post");
                setIsSubmitting(false);
                return;
            }

            if (!socket || !socket.connected) {
                alert("Socket not connected. Please refresh and try again.");
                setIsSubmitting(false);
                return;
            }

            // Create the post/message object
            const postData = {
                channel: channel,
                user: username,
                message: content ? `**${title}**\n\n${content}` : title,
                timestamp: new Date().toISOString()
            };

            console.log("Sending post to channel:", channel);
            console.log("Post data:", postData);

            // Send the post through socket with callback
            socket.emit("send_message", postData, (response: any) => {
                console.log("Server response:", response);

                if (response && response.success) {
                    console.log("✅ Post successful, refreshing channel...");

                    // Refresh the channel to get the latest messages
                    setTimeout(() => {
                        refreshChannel();
                    }, 100);

                    // Redirect back to the main page
                    router.push("/");
                } else {
                    alert("Failed to post. Please try again.");
                    setIsSubmitting(false);
                }
            });

        } catch (error) {
            console.error('Failed to create post:', error);
            alert("Failed to create post. Please try again.");
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-300">
                    <h1 className="text-lg font-medium text-gray-900">
                        Create a post in r/{channel}
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Title Input */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500 text-sm transition-all duration-200"
                            maxLength={300}
                            required
                        />
                        <div className="text-xs text-gray-500 mt-1 text-right">
                            {title.length}/300
                        </div>
                    </div>

                    {/* Content Textarea */}
                    <div className="mb-6">
                        <textarea
                            placeholder="Text (optional)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={10}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500 text-sm resize-none transition-all duration-200"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim() || isSubmitting}
                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-full transition-colors duration-200 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Posting...
                                </>
                            ) : (
                                'Post'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}