import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import PinInput from "./pininput";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [suggestedPassword, setSuggestedPassword] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const generatePassword = () => {
        const char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
        let generated = "";
        for (let i = 0; i < 14; i++) {
            generated += char[Math.floor(Math.random() * char.length)];
        }
        return generated;
    };

    const handleRegister = async (e) => {
        if (e) e.preventDefault();

        if (!name || !email || !password || !pin) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!/^\d{6}$/.test(pin)) {
            toast.error("PIN must be exactly 6 digits");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    pin,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Registration failed");
                setLoading(false);
                return;
            }

            toast.success("Account created successfully!");
            navigate("/login");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-73px)] bg-[#070914] text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo & Subtitle */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-700/10 border border-purple-500/30 mb-4 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
                        <LockKeyhole size={26} className="text-purple-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                        Create your vault
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        Zero-knowledge security. Only you can access your data.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-[#101426]/90 border border-gray-800/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl">
                    <form className="space-y-5" onSubmit={handleRegister}>
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Your Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Alex Smith"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#080b1a] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 transition text-sm"
                            />
                        </div>

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
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const gen = generatePassword();
                                        setPassword(gen);
                                        setSuggestedPassword(gen);
                                    }}
                                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
                                >
                                    <Sparkles size={13} />
                                    Generate
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setSuggestedPassword("");
                                    }}
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

                        {/* 6-Digit Vault PIN */}
                        <div className="pt-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 text-center mb-3">
                                6-Digit Vault PIN (For Sensitive Actions)
                            </label>
                            <PinInput
                                value={pin}
                                onChange={setPin}
                                onComplete={() => {}}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition duration-200 shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2"
                        >
                            {loading ? "Creating Vault..." : "Create Free Account"}
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    {/* Footer link */}
                    <div className="text-center mt-6 pt-5 border-t border-gray-800/80">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mt-6">
                    <ShieldCheck size={15} className="text-purple-400" />
                    <span>Protected with Zero-Knowledge encryption</span>
                </div>
            </div>
        </main>
    );
};

export default Register;
