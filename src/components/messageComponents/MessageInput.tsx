import { useState, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { Socket } from "socket.io-client";
import {Button} from "@heroui/button";
import { IoSend } from "react-icons/io5";
import { CgAttachment } from "react-icons/cg";


interface MessageInputProps {
    socket: Socket | null;
    currentChannel: string;
    username: string;
}

export default function MessageInput({ socket, currentChannel, username }: MessageInputProps) {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
    };

    const sendMessage = async () => {
        if (!username || !socket) return alert("You must be logged in!");
        if (!message.trim() && !file) return;

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
                    return;
                }

                const data = await res.json();
                uploadedFileUrl = data.url;
                uploadedFileName = data.originalName;
            } catch {
                alert("Upload error");
                return;
            }
        }

        socket.emit("send_message", {
            channel: currentChannel,
            message,
            fileUrl: uploadedFileUrl,
            fileName: uploadedFileName,
        });

        setMessage("");
        setFile(null);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div
            className={`
        p-2 md:p-4 border-t border-[#202225] flex gap-2 items-center bg-[#40444B]
        ${dragOver ? "bg-blue-900/20 border border-blue-600" : " px-5" }
      `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >

            <input
                type="text"
                placeholder="Message"
                className="w-full px-4 py-2 rounded-lg
                bg-[#202225] text-white placeholder-gray-400 shadow-sm
                border border-transparent focus:border-[#5865F2] focus:ring-2 focus:ring-[#5865F2]/50 focus:outline-none
                transition-all duration-200 text-base"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.gif,.png,.jpg,.jpeg,.webp"
            />
            <Button
                onPress={() => fileInputRef.current?.click()}
                title="Upload Image"
                className="flex items-center gap-2 rounded-lg  hover:bg-gray-700
               text-gray-300 hover:text-white tr"
            >
                <h2 className={"text-center flex items-center   py-1 text-xl"}><CgAttachment /></h2>

            </Button>

            <Button
                onPress={sendMessage}
                className="bg-blue-600 px-5 py-2  underline text-center flex items-center md:px-4 md:py-2 rounded hover:bg-blue-700 font-semibold transition text-lg md:text-base"
                disabled={!message.trim() && !file}
            >
                <IoSend  size={20}/>
            </Button>
        </div>
    );
}