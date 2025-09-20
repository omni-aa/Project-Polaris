import {Avatar, Divider} from "@heroui/react";


interface SidebarProps {
    channels: string[];
    currentChannel: string;
    username: string;
    onChannelChange: (channel: string) => void;
    onLogout: () => void;
}

export default function Sidebar({
                                    channels,
                                    currentChannel,
                                    username,
                                    onChannelChange,
                                    onLogout,
                                }: SidebarProps) {
    return (
        <aside className="w-60 h-full bg-[#1e1f22] text-[#dbdee1] flex flex-col" >

            <header className={"text-2xl font-bold flex flex-col justify-center items-center bg-blue-700 text-white py-3 px-5"}>PROXIMUS CHAT</header>
            {/* Channels section */}
            <div className="flex-1 overflow-y-auto p-2 py-7">
                <div className="mb-2">
                    <div className="text-xs font-semibold text-[#949ba4] uppercase px-2 mb-1 ">
                        Text Channels
                    </div>
                    <Divider className="my-4" />
                    <ul className="space-y-1">
                        {channels.map((channel) => (
                            <li key={channel}>

                                <button
                                    onClick={() => onChannelChange(channel)}
                                    className={`w-full flex items-center px-2 py-1 rounded text-left ${
                                        currentChannel === channel
                                            ? 'bg-[#40444b] text-white'
                                            : 'text-[#96989d] hover:bg-[#3a3d44] hover:text-white'
                                    }`}
                                >
                                    <span className="text-lg mr-1">#</span>
                                    <span>{channel}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* User profile footer */}
            <div className="p-2 bg-[#232428] border-t border-[#2b2d31] ">
                <div className="flex items-center justify-between p-1 rounded hover:bg-[#3a3d44] transition-colors ">
                    <div className="flex items-center overflow-hidden ">
                        <div className="relative ">

                            <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white font-medium mr-2">
                                <Avatar size="md" name={username.charAt(0).toUpperCase()}
                                className="w-8 h-8 rounded-full"
                                        isBordered color="danger"

                                />

                            </div>

                        </div>

                        <div className="overflow-hidden">
                            <div className="text-sm font-semibold text-white truncate">{username}</div>

                            <div className="text-xs text-[#b5bac1] truncate">Online</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button
                            className="text-[#b5bac1] hover:text-white p-1 rounded hover:bg-[#3a3d44] transition-colors"
                            title="Mute"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M6.7 11H5C5 12.19 5.34 13.3 5.9 14.28L7.13 13.05C6.86 12.43 6.7 11.74 6.7 11Z"/>
                                <path fill="currentColor" d="M9.01 11.085C9.015 11.1125 9.02 11.14 9.02 11.17L15 5.18V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 11.03 9.005 11.0575 9.01 11.085Z"/>
                                <path fill="currentColor" d="M11.7237 16.0927L10.9632 16.8531L10.2533 17.5688C10.4978 17.633 10.747 17.6839 11 17.72V22H13V17.72C16.28 17.23 19 14.41 19 11H17.3C17.3 13.58 15.33 15.7 12.83 16.1L11.7237 16.0927Z"/>
                                <path fill="currentColor" d="M21 4.27L19.73 3L3 19.73L4.27 21L8.46 16.82L9.69 15.58L11.35 13.92L14.99 10.28L17.74 7.53L21 4.27Z"/>
                            </svg>
                        </button>
                        <button
                            className="text-[#b5bac1] hover:text-white p-1 rounded hover:bg-[#3a3d44] transition-colors"
                            title="Deafen"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12 2.00305C6.486 2.00305 2 6.48805 2 12.0031V20.0031C2 21.1071 2.895 22.0031 4 22.0031H6C7.104 22.0031 8 21.1071 8 20.0031V17.0031C8 15.8991 7.104 15.0031 6 15.0031H4V12.0031C4 7.59105 7.589 4.00305 12 4.00305C16.411 4.00305 20 7.59105 20 12.0031V15.0031H18C16.896 15.0031 16 15.8991 16 17.0031V20.0031C16 21.1071 16.896 22.0031 18 22.0031H20C21.104 22.0031 22 21.1071 22 20.0031V12.0031C22 6.48805 17.514 2.00305 12 2.00305Z"/>
                            </svg>
                        </button>
                        <button
                            onClick={onLogout}
                            className="text-[#b5bac1] hover:text-white p-1 rounded hover:bg-[#3a3d44] transition-colors"
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
            </div>
        </aside>
    );
}