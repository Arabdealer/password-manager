import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { deriveKey } from "../utils/crypto";

function Login({ setAuthenticated, setEncryptionKey }) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        if (e) e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Invalid credentials");
                setLoading(false);
                return;
            }

            toast.success("Welcome back!");
            setAuthenticated(true);

            if (data.salt) {
                const key = await deriveKey(password, data.salt);
                setEncryptionKey(key);
            }

            navigate("/home");
        } catch (error) {
            console.error(error);
            toast.error("Unable to sign in. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-73px)] bg-[#070914] text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-700/10 border border-purple-500/30 mb-4 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
                        <LockKeyhole size={26} className="text-purple-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                        Welcome to Sentra
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        Enter your credentials to unlock your vault.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-[#101426]/90 border border-gray-800/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl">
                    <form className="space-y-5" onSubmit={handleLogin}>
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#080b1a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 transition text-sm"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#080b1a] border border-gray-800 rounded-xl px-4 py-3 pr-11 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 transition text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 transition"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition duration-200 shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2"
                        >
                            {loading ? "Unlocking..." : "Sign In to Vault"}
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center mt-6 pt-5 border-t border-gray-800/80">
                        <p className="text-gray-400 text-sm">
                            Don't have a vault yet?{" "}
                            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition">
                                Create one free
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mt-6">
                    <ShieldCheck size={15} className="text-purple-400" />
                    <span>Your encryption key never leaves this browser</span>
                </div>
            </div>
        </main>
    );
}

export default Login;
