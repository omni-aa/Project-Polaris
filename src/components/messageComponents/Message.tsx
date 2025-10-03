// components/messageComponents/Message.tsx
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

    // Check if message has a title (starts with ** and ends with **)
    const hasTitle = message.message.startsWith('**') && message.message.includes('**\n\n');
    let title = '';
    let content = message.message;

    if (hasTitle) {
        const parts = message.message.split('**\n\n');
        title = parts[0].replace('**', '').replace('**', '');
        content = parts.slice(1).join('**\n\n');
    }

    const handleImageClick = (url: string) => {
        onImageZoom(url);
    };

    // Generate consistent color based on username
    const getUserColor = (username: string) => {
        const colors = [
            'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
            'bg-pink-500', 'bg-orange-500', 'bg-teal-500', 'bg-indigo-500'
        ];
        const index = username.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className="flex items-start gap-3 px-4 py-3 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
            {/* Reddit-style Voting */}
            <div className="flex flex-col items-center gap-1 py-1">
                <button className="text-gray-400 hover:text-orange-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                </button>
                <span className="text-xs font-medium text-gray-500">1</span>
                <button className="text-gray-400 hover:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <div className={`w-6 h-6 ${getUserColor(message.user)} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                        {message.user.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-gray-900">
                        u/{message.user}
                    </span>
                    <span className="text-xs text-gray-500">• 2h ago</span>
                </div>

                {/* Post Title */}
                {hasTitle && title && (
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {title}
                    </h3>
                )}

                {/* Post Content */}
                {content && (
                    <div className="text-gray-800 text-sm leading-relaxed mb-2 whitespace-pre-wrap">
                        {content}
                    </div>
                )}

                {message.fileUrl && message.fileName && (
                    <div className="mt-2">
                        {isImage(message.fileName) ? (
                            <div className="relative">
                                <img
                                    src={`http://localhost:3001${message.fileUrl}`}
                                    alt={message.fileName}
                                    className="max-w-sm rounded-md cursor-pointer border border-gray-300 hover:opacity-95 transition-opacity"
                                    onClick={() => handleImageClick(`http://localhost:3001${message.fileUrl}`)}
                                    onError={(e) => {
                                        console.error("Image failed to load:", `http://localhost:3001${message.fileUrl}`);
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        ) : (
                            <a
                                href={`http://localhost:3001${message.fileUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors duration-200 border border-gray-300"
                            >
                                <span className="text-sm">📎</span>
                                <span className="text-gray-700 text-xs font-medium">{message.fileName}</span>
                            </a>
                        )}
                    </div>
                )}

                {/* Reddit-style Actions */}
                <div className="flex items-center gap-4 mt-2">
                    <button className="text-gray-500 hover:text-gray-700 text-xs font-medium flex items-center gap-1 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Reply
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 text-xs font-medium flex items-center gap-1 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 text-xs font-medium flex items-center gap-1 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                        Report
                    </button>
                </div>
            </div>
        </div>
    );
}