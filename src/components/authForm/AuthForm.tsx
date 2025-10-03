'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoLogoInstagram, IoEye, IoEyeOff } from "react-icons/io5";

interface AuthFormProps {
    onAuthSuccess: (token: string, username: string) => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [tempName, setTempName] = useState("");
    const [tempPassword, setTempPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = async () => {
        if (!tempName.trim() || !tempPassword.trim()) {
            alert("Please enter both username and password");
            return;
        }

        setIsLoading(true);
        const endpoint = isLogin ? "signin" : "signup";

        try {
            const res = await fetch(`http://localhost:3001/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: tempName.trim(),
                    password: tempPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Authentication failed");
                return;
            }

            if (isLogin) {
                onAuthSuccess(data.token, data.username);
                // Navigate to home page after successful login
                router.push("/home");
            } else {
                alert("🎉 Account created successfully! Please sign in with your credentials.");
                setIsLogin(true);
                setTempPassword("");
                setTempName(tempName.trim());
            }
        } catch {
            alert("Network error - please check your connection");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAuth();
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-4 border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                            <IoLogoInstagram className="text-white text-2xl" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                        Pixelgram
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                        {isLogin ? "Sign in to your account" : "Create your account"}
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder="Username"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={tempPassword}
                            onChange={(e) => setTempPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 pr-12"
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                        </button>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleAuth}
                    disabled={isLoading}
                    className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-300 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            {isLogin ? "Signing in..." : "Creating account..."}
                        </div>
                    ) : (
                        isLogin ? "Sign In" : "Sign Up"
                    )}
                </button>

                {/* Toggle Auth Mode */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            disabled={isLoading}
                            className="ml-1 text-purple-600 hover:text-purple-700 font-semibold transition-colors disabled:text-gray-400"
                        >
                            {isLogin ? "Sign Up" : "Sign In"}
                        </button>
                    </p>
                </div>

                {/* Divider */}
                <div className="mt-6 flex items-center">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-3 text-gray-400 text-sm">Or</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* Demo Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-blue-700 text-sm text-center">
                        <strong>Demo Tip:</strong> Use any username and password to test the app
                    </p>
                </div>
            </div>
        </div>
    );
}