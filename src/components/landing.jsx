import { LockKeyhole, ShieldCheck, KeyRound, ArrowRight, Sparkles, CheckCircle2, Shield, Eye, Lock, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <main className="min-h-[calc(100vh-73px)] bg-[#070914] text-white relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute top-[65%] right-10 w-[450px] h-[300px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Column */}
                    <div>
                        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/25 text-purple-300 px-3.5 py-1.5 rounded-full text-xs font-medium mb-6">
                            <Sparkles size={14} className="text-purple-400" />
                            Zero-Knowledge Password Security
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                            Your passwords.
                            <br />
                            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-white bg-clip-text text-transparent">
                                Encrypted by you.
                            </span>
                        </h1>

                        <p className="text-gray-400 text-base md:text-lg mt-5 max-w-xl leading-relaxed">
                            Sentra protects your credentials with client-side zero-knowledge encryption. Your passwords are scrambled on your own device before ever touching the cloud—even we can never see them.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-6 py-3.5 rounded-xl font-semibold transition duration-200 shadow-lg shadow-purple-900/30 text-sm"
                            >
                                Get Started Free
                                <ArrowRight size={17} />
                            </Link>

                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 bg-[#101426] hover:bg-[#151a33] border border-gray-800 px-6 py-3.5 rounded-xl font-semibold transition duration-200 text-sm text-gray-300 hover:text-white"
                            >
                                Open Existing Vault
                            </Link>
                        </div>

                        {/* Feature Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-10 pt-8 border-t border-gray-800/80">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
                                <span>Zero-Knowledge</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
                                <span>6-Digit PIN Gate</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <CheckCircle2 size={16} className="text-purple-400 shrink-0" />
                                <span>In-Memory Keys</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Vault Preview Mock */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-md bg-[#101426]/90 border border-gray-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative">
                            {/* Window Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-800/80 mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                                        <LockKeyhole size={18} className="text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-white">Sentra Vault</p>
                                        <p className="text-[11px] text-gray-400">Encrypted Storage</p>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Protected
                                </span>
                            </div>

                            {/* Mock Vault Items */}
                            <div className="space-y-3">
                                {[
                                    { name: "Google", email: "alex@gmail.com", char: "G" },
                                    { name: "GitHub", email: "alex@github.com", char: "GH" },
                                    { name: "Netflix", email: "family@netflix.com", char: "N" },
                                ].map((service, i) => (
                                    <div
                                        key={i}
                                        className="bg-[#070914] border border-gray-800/80 rounded-xl p-3.5 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-600/15 border border-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-300">
                                                {service.char}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{service.name}</p>
                                                <p className="text-[11px] text-gray-500">{service.email}</p>
                                            </div>
                                        </div>
                                        <span className="font-mono text-xs text-gray-500 bg-[#101426] px-2.5 py-1 rounded border border-gray-800">
                                            ••••••••••••
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-800/60 text-center">
                                <p className="text-[11px] text-gray-500">
                                    Protected by your password + 6-digit PIN
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expanded About & How it Works Section for natural scrolling */}
            <section id="about" className="max-w-7xl mx-auto px-6 md:px-10 py-20 border-t border-gray-800/80 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs uppercase font-semibold text-purple-400 tracking-wider">
                        Why Sentra?
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
                        Security Designed for Peace of Mind
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base mt-3 leading-relaxed">
                        Traditional databases store your passwords in reversible or centralized formats. Sentra inverts that model: all scrambling happens in your browser before anything ever touches the database.
                    </p>
                </div>

                {/* 3 Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-[#101426]/90 border border-gray-800 rounded-2xl p-7 hover:border-purple-500/40 transition duration-200">
                        <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center mb-5 text-purple-400">
                            <Lock size={22} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Zero-Knowledge Storage</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your password is converted into unreadable scrambled ciphertext before transmission. Even database administrators can only see encrypted noise.
                        </p>
                    </div>

                    <div className="bg-[#101426]/90 border border-gray-800 rounded-2xl p-7 hover:border-purple-500/40 transition duration-200">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center mb-5 text-indigo-400">
                            <Shield size={22} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">6-Digit Vault PIN</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Viewing, copying, editing, or deleting a saved credential requires your secondary 6-digit PIN with automatic 3-attempt lockout protection.
                        </p>
                    </div>

                    <div className="bg-[#101426]/90 border border-gray-800 rounded-2xl p-7 hover:border-purple-500/40 transition duration-200">
                        <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center mb-5 text-purple-400">
                            <Zap size={22} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">In-Memory Key Life</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Keys are never saved to localStorage or disk. If you close or reload the tab, the key vanishes from memory, keeping you protected on shared devices.
                        </p>
                    </div>
                </div>

                {/* Interactive Steps Section */}
                <div className="bg-gradient-to-br from-[#101426] to-[#0c0f20] border border-gray-800 rounded-3xl p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div>
                            <span className="text-4xl font-extrabold text-purple-500/40 font-mono">01</span>
                            <h4 className="text-lg font-bold text-white mt-2 mb-2">Create Your Account</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Sign up with your email and choose a strong password and 6-digit PIN. Your unique cryptographic salt is generated automatically.
                            </p>
                        </div>

                        <div>
                            <span className="text-4xl font-extrabold text-purple-500/40 font-mono">02</span>
                            <h4 className="text-lg font-bold text-white mt-2 mb-2">Save Credentials Safely</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Add websites, logins, and passwords. Sentra encrypts each password in memory before saving it to your secure vault.
                            </p>
                        </div>

                        <div>
                            <span className="text-4xl font-extrabold text-purple-500/40 font-mono">03</span>
                            <h4 className="text-lg font-bold text-white mt-2 mb-2">Unlock When Needed</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Decrypt credentials on demand with your 6-digit PIN. Copy to clipboard or edit safely anytime from any modern browser.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-20 pt-8 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
                    <p>© {new Date().getFullYear()} Sentra Password Manager. Built with zero-knowledge security.</p>
                    <div className="flex gap-6">
                        <Link to="/login" className="hover:text-purple-400 transition">Sign In</Link>
                        <Link to="/register" className="hover:text-purple-400 transition">Create Vault</Link>
                    </div>
                </footer>
            </section>
        </main>
    );
};

export default Landing;
