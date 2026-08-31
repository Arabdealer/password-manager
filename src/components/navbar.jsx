import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    LockKeyhole,
    Home,
    Search,
    Vault
} from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = ({ authenticated, setAuthenticated }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();

    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const response = await fetch(
    //                 "http://localhost:3000/auth/me",
    //                 {
    //                     credentials: "include",
    //                 }
    //             );

    //             setAuthenticated(response.ok);
    //         } catch (error) {
    //             console.error("Authentication check failed:", error);
    //             setAuthenticated(false);
    //         }
    //     };

    //     checkAuth();
    // }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/logout",
                {
                    method: "POST",
                    credentials: "include",
                }
            );

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

    return (
        <nav className="bg-[#080b1a] text-white shadow-lg border-b border-purple-900/30">

            <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-400/40 flex items-center justify-center">
                        <LockKeyhole
                            className="text-purple-400"
                            size={22}
                        />
                    </div>

                    <div className="text-2xl font-bold tracking-tight">
                        Sentra
                    </div>
                </Link>

                {/* LOGGED OUT NAVBAR */}

                {!authenticated && (
                    <div className="hidden md:flex items-center gap-4">

                        {/* About */}
                        <a
                            href="/#about"
                            className="px-4 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition duration-200"
                        >
                            About
                        </a>

                        {/* Login */}
                        <Link
                            to="/login"
                            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition duration-200"
                        >
                            Login
                        </Link>

                    </div>
                )}

                {/* LOGGED IN NAVBAR */}

                {authenticated && (
                    <div className="hidden md:flex items-center gap-4">

                        {/* Home */}
                        <Link
                            to="/home"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition duration-200"
                        >
                            <Home size={18} />
                            Home
                        </Link>

                        {/* Vault */}
                        <Link
                            to="/vault"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition duration-200"
                        >
                            <Vault size={18} />
                            Vault
                        </Link>

                        {/* Search */}
                        <div className="flex items-center gap-3 bg-[#111528] border border-gray-700/50 rounded-xl px-4 py-2.5 focus-within:border-purple-500/60 transition duration-200">
                            <Search
                                size={19}
                                className="text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Search vault..."
                                className="bg-transparent outline-none text-sm text-white placeholder-gray-500 w-52"
                            />
                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-purple-600/20 transition duration-200"
                        >
                            Logout
                        </button>

                    </div>
                )}
                {/* MOBILE MENU BUTTON */}
                {authenticated && (
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-gray-300 hover:text-white"
                    >
                        <span className="text-2xl">☰</span>
                    </button>
                )}

            </div>

            {/* MOBILE LOGGED IN MENU */}
            {authenticated && isMenuOpen && (
                <div className="md:hidden px-6 pb-5 space-y-3">

                    {/* Home */}
                    <Link
                        to="/home"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5"
                    >
                        <Home size={19} />
                        Home
                    </Link>

                    {/* Vault */}
                    <Link
                        to="/vault"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5"
                    >
                        <Vault size={19} />
                        Vault
                    </Link>

                    {/* Search */}
                    <div className="flex items-center gap-3 bg-[#111528] border border-gray-700/50 rounded-xl px-4 py-3">
                        <Search
                            size={19}
                            className="text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search vault..."
                            className="bg-transparent outline-none text-sm text-white placeholder-gray-500 w-full"
                        />
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5"
                    >
                        Logout
                    </button>

                </div>
            )}

        </nav>
    );
};

export default Navbar;