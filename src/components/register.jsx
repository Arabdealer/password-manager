import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [suggestedPassword, setSuggestedPassword] = useState("");
    const [pin, setPin] = useState("");

    const navigate = useNavigate();

    // Generate a random password
    const generatePassword = () => {
        const char =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=~`";

        let generatedPassword = "";

        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * char.length);
            generatedPassword += char[randomIndex];
        }

        return generatedPassword;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !pin) {
            toast.error("Please fill in all fields!");
            return;
        }

        if (!/^\d{6}$/.test(pin)) {
            toast.error("PIN must be exactly 6 digits!");
            return;
        }

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
                return;
            }

            toast.success("Account created successfully!");

            navigate("/login");

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <main className="min-h-[calc(100vh-73px)] bg-[#080b1a] text-white flex items-center justify-center px-6 py-12">

            <div className="w-full max-w-md">

                {/* Logo / Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center">
                        <LockKeyhole
                            size={28}
                            className="text-purple-400"
                        />
                    </div>
                </div>

                {/* Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Create your account
                    </h1>

                    <p className="text-gray-400 mt-3 text-sm md:text-base">
                        Create an account to start using your secure Sentra vault.
                    </p>
                </div>

                {/* Register Card */}
                <div className="bg-[#111528] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl">

                    <form
                        className="space-y-6"
                        onSubmit={handleRegister}
                    >

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#080b1a] border border-gray-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#080b1a] border border-gray-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setSuggestedPassword("");
                                    }}
                                    onFocus={() => {
                                        if (!password) {
                                            setSuggestedPassword(generatePassword());
                                        }
                                    }}
                                    className="w-full bg-[#080b1a] border border-gray-700 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>

                            </div>

                            {/* Suggested Password */}
                            {suggestedPassword && (
                                <div className="mt-3 p-3 bg-[#080b1a] border border-purple-500/30 rounded-xl">

                                    <p className="text-xs text-gray-400 mb-1">
                                        Suggested password
                                    </p>

                                    <p className="text-sm text-purple-400 break-all">
                                        {suggestedPassword}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPassword(suggestedPassword);
                                            setSuggestedPassword("");
                                        }}
                                       className="mt-2 text-sm text-white hover:text-gray-300"                       >
                                        Use this password
                                    </button>

                                </div>
                            )}

                        </div>

                        {/* 6-Digit Vault PIN */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="vault-pin" className="block text-sm font-medium text-gray-300">
                                    6-Digit Vault PIN
                                </label>
                                <span className="text-xs text-purple-400 font-mono">
                                    {pin.length}/6 digits
                                </span>
                            </div>

                            {/* Visual 6-Digit PIN Indicators */}
                            <div className="flex justify-center gap-2.5 mb-3">
                                {[0, 1, 2, 3, 4, 5].map((index) => {
                                    const isFilled = pin.length > index;
                                    const isCurrent = pin.length === index;
                                    return (
                                        <div
                                            key={index}
                                            className={`w-10 h-11 rounded-xl border flex items-center justify-center text-lg font-bold transition-all duration-200 ${
                                                isFilled
                                                    ? "border-purple-500 bg-purple-500/20 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.35)] scale-105"
                                                    : isCurrent
                                                    ? "border-purple-500/60 bg-[#080b1a] ring-2 ring-purple-500/20"
                                                    : "border-gray-800 bg-[#080b1a] text-gray-600"
                                            }`}
                                        >
                                            {isFilled ? "•" : ""}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Standardized Input matching email & password style */}
                            <input
                                id="vault-pin"
                                type="password"
                                maxLength={6}
                                autoComplete="off"
                                placeholder="Enter 6-digit PIN (e.g. 123456)"
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                                className="w-full bg-[#080b1a] border border-gray-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 text-center outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition text-sm tracking-wider"
                            />
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold py-3.5 rounded-xl transition duration-200 shadow-lg shadow-purple-900/20"
                        >
                            Create Account
                        </button>

                    </form>

                    {/* Login */}
                    <div className="text-center mt-7">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{" "}

                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-purple-400 hover:text-purple-300 font-medium transition"
                            >
                                Login
                            </button>
                        </p>
                    </div>

                </div>

                {/* Security Note */}
                <p className="text-center text-gray-600 text-xs mt-6">
                    Your account is protected with secure authentication.
                </p>

            </div>

        </main>
    );
};

export default Register;