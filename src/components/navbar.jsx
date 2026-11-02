import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LockKeyhole, KeyRound, Vault as VaultIcon, LogOut, Menu, X, Info } from "lucide-react";

const Navbar = ({ authenticated, setAuthenticated }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
                method: "POST",
                credentials: "include",
            });

            const data = await response.json();
            if (data.success) {
                setAuthenticated(false);
                setIsMenuOpen(false);
                navigate("/login");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-40 bg-[#0d1124] border-b border-purple-500/20 text-white shadow-lg shadow-black/20">
            <div className="max-w-7xl mx-auto px-6 md:px-10 h-18 flex items-center justify-between">
                {/* Brand Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3 group"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <div className="w-10 h-10 rounded-xl bg-purple-600/25 border border-purple-500/40 flex items-center justify-center group-hover:border-purple-400 transition shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                        <LockKeyhole className="text-purple-400 group-hover:scale-110 transition duration-200" size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-300 transition">
                            Sentra
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav Items */}
                {authenticated ? (
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            to="/home"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition duration-200 ${
                                isActive("/home")
                                    ? "bg-purple-600/25 text-purple-200 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                                    : "text-gray-300 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <KeyRound size={16} />
                            Save Password
                        </Link>

                        <Link
                            to="/vault"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition duration-200 ${
                                isActive("/vault")
                                    ? "bg-purple-600/25 text-purple-200 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                                    : "text-gray-300 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <VaultIcon size={16} />
                            Your Vault
                        </Link>

                        <div className="h-5 w-px bg-gray-700 mx-2" />

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition duration-200"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div className="hidden md:flex items-center gap-4">
                        <a
                            href="/#about"
                            className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 transition flex items-center gap-1.5"
                        >
                            <Info size={15} />
                            About
                        </a>
                        <Link
                            to="/login"
                            className="text-sm text-gray-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition font-medium"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-purple-900/30 transition"
                        >
                            Create Vault
                        </Link>
                    </div>
                )}

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-gray-400 hover:text-white"
                >
                    {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-purple-500/20 px-6 py-5 bg-[#0d1124] space-y-3">
                    {authenticated ? (
                        <>
                            <Link
                                to="/home"
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                                    isActive("/home") ? "bg-purple-600/25 text-purple-200" : "text-gray-300"
                                }`}
                            >
                                Save Password
                            </Link>
                            <Link
                                to="/vault"
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                                    isActive("/vault") ? "bg-purple-600/25 text-purple-200" : "text-gray-300"
                                }`}
                            >
                                Your Vault
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-400"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <div className="space-y-3 pt-2">
                            <a
                                href="/#about"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-300"
                            >
                                About Sentra
                            </a>
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="block w-full text-center px-4 py-3 rounded-xl text-sm font-medium border border-gray-700 text-white"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setIsMenuOpen(false)}
                                className="block w-full text-center px-4 py-3 rounded-xl text-sm font-medium bg-purple-600 text-white"
                            >
                                Create Free Vault
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
