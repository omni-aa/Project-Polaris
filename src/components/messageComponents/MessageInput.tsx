import { useState, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { Socket } from "socket.io-client";

interface MessageInputProps {
    socket: Socket | null;
    currentChannel: string;
    username: string;
}

export default function MessageInput({ socket, currentChannel, username }: MessageInputProps) {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setTimeout(() => {
                const input = document.querySelector('textarea') as HTMLTextAreaElement;
                input?.focus();
            }, 100);
        }
    };

    const sendMessage = async () => {
        if (!username || !socket) return alert("You must be logged in!");
        if (!message.trim() && !file) return;

        setIsUploading(true);

        let uploadedFileUrl: string | undefined;
        let uploadedFileName: string | undefined;

        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await fetch("http://localhost:3001/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    alert("File upload failed");
                    setIsUploading(false);
                    return;
                }

                const data = await res.json();
                uploadedFileUrl = data.url;
                uploadedFileName = data.originalName;
            } catch {
                alert("Upload error");
                setIsUploading(false);
                return;
            }
        }

        socket.emit("send_message", {
            channel: currentChannel,
            message: message.trim(),
            fileUrl: uploadedFileUrl,
            fileName: uploadedFileName,
        });

        setMessage("");
        setFile(null);
        setIsUploading(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (message.trim() || file) {
                sendMessage();
            }
        }
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="p-4 border-t border-gray-300 bg-white">
            {/* File Preview */}
            {file && (
                <div className="mb-3 flex items-center justify-between bg-gray-50 px-3 py-2 rounded border border-gray-300">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">📷 {file.name}</span>
                    </div>
                    <button
                        onClick={removeFile}
                        className="text-gray-500 hover:text-gray-700 text-sm font-bold"
                        disabled={isUploading}
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="flex gap-3 items-start">
                {/* User Avatar */}
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-1 flex-shrink-0">
                    {username.charAt(0).toUpperCase()}
                </div>

                {/* Message Input Area */}
                <div className="flex-1 relative">
                    <textarea
                        placeholder={file ? "Add a caption..." : `Message r/${currentChannel}`}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-500 text-sm resize-none transition-all duration-200 disabled:opacity-50 min-h-[80px]"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isUploading}
                        rows={3}
                    />

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                                disabled={isUploading}
                                title="Add image"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </button>

                            <button
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                                disabled={isUploading}
                                title="Formatting help"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </button>
                        </div>

                        <button
                            onClick={sendMessage}
                            disabled={(!message.trim() && !file) || isUploading}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-full transition-colors duration-200 disabled:cursor-not-allowed"
                        >
                            {isUploading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Posting...</span>
                                </div>
                            ) : (
                                "Comment"
                            )}
                        </button>
                    </div>
                </div>

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.gif,.png,.jpg,.jpeg,.webp"
                    disabled={isUploading}
                />
            </div>
        </div>
    );
}