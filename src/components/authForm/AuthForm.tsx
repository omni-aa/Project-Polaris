import { useState } from "react";


interface AuthFormProps {
    onAuthSuccess: (token: string, username: string) => void;
}

export default function AuthForm({ onAuthSuccess }: AuthFormProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [tempName, setTempName] = useState("");
    const [tempPassword, setTempPassword] = useState("");

    const handleAuth = async () => {
        if (!tempName.trim() || !tempPassword.trim()) {
            alert("Enter username and password");
            return;
        }

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
                alert(data.error || "Auth failed");
                return;
            }

            if (isLogin) {
                onAuthSuccess(data.token, data.username);
            } else {
                alert("Signup successful! Please login now.");
                setIsLogin(true);
                setTempPassword("");
            }
        } catch {
            alert("Network error");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-[#36393F] text-white">
            <div className="bg-[#2F3136] p-6 rounded-md shadow-lg w-full max-w-xs mx-4">
                <h1 className="text-xl md:text-2xl mb-4 font-semibold text-center">
                    {isLogin ? "Sign In" : "Sign Up"}
                </h1>
                <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Username"
                    className="w-full p-2 rounded bg-[#202225] focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-sm md:text-base"
                />
                <input
                    type="password"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-2 rounded bg-[#202225] focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 text-sm md:text-base"
                />
                <button
                    onClick={handleAuth}
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition text-sm md:text-base"
                >
                    {isLogin ? "Login" : "Sign Up"}
                </button>
                <p
                    className="mt-4 text-center text-xs md:text-sm text-gray-400 cursor-pointer select-text"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin
                        ? "Don't have an account? Sign Up"
                        : "Already have an account? Login"}
                </p>
            </div>
        </div>
    );
}