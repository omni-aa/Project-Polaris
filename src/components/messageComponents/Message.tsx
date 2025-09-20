interface MessageProps {
    message: {
        id?: number | string;
        user: string;
        message: string;
        fileUrl?: string;
        fileName?: string;
    };
    onImageZoom: (url: string) => void;
}

export default function Message({ message, onImageZoom }: MessageProps) {
    const isImage = (filename: string) =>
        /\.(jpe?g|png|gif|webp)$/i.test(filename);

    return (
        <div className="flex items-start gap-2 md:gap-3 max-w-full md:max-w-3xl">
            <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                {message.user.charAt(0).toUpperCase()}
            </div>

            <div className="bg-[#2F3136] rounded-lg p-2 md:p-3 max-w-[80%] md:max-w-lg w-fit">
                <div className="text-blue-300 font-semibold text-sm select-text">
                    {message.user}
                </div>
                {message.message && (
                    <div className="mt-1 whitespace-pre-wrap select-text text-white">
                        {message.message}
                    </div>
                )}
                {message.fileUrl && message.fileName && (
                    <div className="mt-2">
                        {isImage(message.fileName) ? (
                            <img
                                src={`http://localhost:3001${message.fileUrl}`}
                                alt={message.fileName}
                                className="max-w-[200px] md:max-w-xs rounded-md cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => onImageZoom(`http://localhost:3001${message.fileUrl}`)}
                            />
                        ) : (
                            <a
                                href={`http://localhost:3001${message.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-300 underline text-sm"
                            >
                                📎 {message.fileName}
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}