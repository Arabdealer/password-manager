import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = ({ setAuthenticated }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all fields!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Login failed");
                return;
            }

            toast.success("Login successful!");
            setAuthenticated(true);
            navigate("/home");
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
                        Welcome back
                    </h1>

                    <p className="text-gray-400 mt-3 text-sm md:text-base">
                        Login to access your secure Sentra vault.
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-[#111528] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl">

                    <form className="space-y-6" onSubmit={handleLogin}>

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
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}

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
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold py-3.5 rounded-xl transition duration-200 shadow-lg shadow-purple-900/20"
                        >
                            Login
                        </button>

                    </form>

                    {/* Register */}
                    <div className="text-center mt-7">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                className="text-purple-400 hover:text-purple-300 font-medium transition"
                            >
                                Create one
                            </button>
                        </p>
                    </div>

                </div>

                {/* Small Security Note */}
                <p className="text-center text-gray-600 text-xs mt-6">
                    Your credentials are protected with secure authentication.
                </p>

            </div>

        </main>
    );
};

export default Login;