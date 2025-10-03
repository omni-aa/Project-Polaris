// app/ClientLayout.tsx
'use client'
import { useEffect, useState } from "react";
import { SocketProvider } from './SocketContext';

interface ClientLayoutProps {
    children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // This runs only on client side
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
    }, []);

    return (
        <SocketProvider token={token}>
            {children}
        </SocketProvider>
    );
}