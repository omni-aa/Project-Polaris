// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import {Metadata} from "next";
import {ThemeProvider} from "next-themes";
import ClientLayout from './ClientLayout';

// Type your metadata object
export const metadata: Metadata = {
    title: 'My Next.js PWA',
    description: 'A progressive web app built with Next.js',
    manifest: '/manifest.json',
    themeColor: '#000000',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'My Next.js PWA',
    },
}

// Define the props type for the component
interface LayoutProps {
    children: ReactNode; // Type the children prop
}

export default function RootLayout({ children }: LayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ClientLayout>
                {children}
            </ClientLayout>
        </ThemeProvider>
        </body>
        </html>
    )
}