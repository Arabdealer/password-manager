import { LockKeyhole, ShieldCheck, KeyRound, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <main className="min-h-[calc(100vh-73px)] bg-[#080b1a] text-white">

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

                    {/* Left Side */}
                    <div>

                        <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-full text-sm mb-6">
                            <LockKeyhole size={16} />
                            Secure Password Manager
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                            Your passwords.
                            <br />
                            <span className="text-purple-400">
                                One secure place.
                            </span>
                        </h1>

                        <p className="text-gray-400 text-lg mt-6 max-w-xl leading-relaxed">
                            Keep your passwords organized, accessible, and protected.
                            Sentra gives you one secure place to manage all your
                            credentials without having to remember them all.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8">

                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 px-6 py-3.5 rounded-xl font-semibold transition duration-200 shadow-lg shadow-purple-900/20"
                            >
                                Get Started
                                <ArrowRight size={19} />
                            </Link>


                        </div>

                    </div>


                    {/* Right Side - Product Preview */}
                    <div className="flex justify-center">

                        <div className="w-full max-w-md">

                            <div className="bg-[#111528] border border-gray-800 rounded-3xl p-6 shadow-2xl">

                                {/* Fake Browser/Header */}
                                <div className="flex items-center justify-between mb-6">

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center">
                                            <LockKeyhole
                                                size={20}
                                                className="text-purple-400"
                                            />
                                        </div>

                                        <div>
                                            <p className="font-semibold">
                                                Sentra
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Your secure vault
                                            </p>
                                        </div>

                                    </div>

                                    <ShieldCheck
                                        size={22}
                                        className="text-purple-400"
                                    />

                                </div>


                                {/* Password Item */}
                                <div className="bg-[#080b1a] border border-gray-800 rounded-xl p-4 mb-3">

                                    <div className="flex justify-between items-center">

                                        <div>
                                            <p className="font-medium">
                                                Google
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">
                                                user@gmail.com
                                            </p>
                                        </div>

                                        <div className="text-gray-500">
                                            ••••••••••
                                        </div>

                                    </div>

                                </div>


                                {/* Password Item */}
                                <div className="bg-[#080b1a] border border-gray-800 rounded-xl p-4 mb-3">

                                    <div className="flex justify-between items-center">

                                        <div>
                                            <p className="font-medium">
                                                GitHub
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">
                                                developer
                                            </p>
                                        </div>

                                        <div className="text-gray-500">
                                            ••••••••••
                                        </div>

                                    </div>

                                </div>


                                {/* Generator Preview */}
                                <div className="border border-purple-500/20 bg-purple-600/5 rounded-xl p-4 mt-4">

                                    <div className="flex items-center gap-3">

                                        <KeyRound
                                            size={20}
                                            className="text-purple-400"
                                        />

                                        <div>

                                            <p className="text-sm font-medium">
                                                Strong passwords
                                            </p>

                                            <p className="text-xs text-gray-500 mt-1">
                                                Generate secure passwords instantly
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* What is a Password Manager */}
            <section
                id="about"
                className="border-t border-gray-800/60">

                <div className="max-w-5xl mx-auto px-6 py-20 text-center">

                    <p className="text-purple-400 text-sm font-semibold uppercase tracking-wider">
                        Password Management
                    </p>

                    <h2 className="text-3xl md:text-4xl font-bold mt-3">
                        What is a password manager?
                    </h2>

                    <p className="text-gray-400 mt-5 max-w-3xl mx-auto leading-relaxed">
                        A password manager is a secure tool that stores your login
                        credentials in one place. Instead of remembering dozens of
                        different passwords, you only need to remember one account
                        password to access your vault.
                    </p>

                </div>

            </section>


            {/* Why Sentra */}
            <section className="max-w-6xl mx-auto px-6 md:px-10 py-20">

                <div className="text-center mb-12">

                    <p className="text-purple-400 text-sm font-semibold uppercase tracking-wider">
                        Why Sentra?
                    </p>

                    <h2 className="text-3xl md:text-4xl font-bold mt-3">
                        Security without the headache.
                    </h2>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card 1 */}
                    <div className="bg-[#111528] border border-gray-800 rounded-2xl p-6">

                        <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center mb-5">

                            <ShieldCheck
                                size={24}
                                className="text-purple-400"
                            />

                        </div>

                        <h3 className="text-xl font-semibold">
                            Stay secure
                        </h3>

                        <p className="text-gray-400 mt-3 leading-relaxed">
                            Keep your credentials organized and protected instead of
                            storing passwords in notes or reusing the same password
                            everywhere.
                        </p>

                    </div>


                    {/* Card 2 */}
                    <div className="bg-[#111528] border border-gray-800 rounded-2xl p-6">

                        <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center mb-5">

                            <LockKeyhole
                                size={24}
                                className="text-purple-400"
                            />

                        </div>

                        <h3 className="text-xl font-semibold">
                            One secure vault
                        </h3>

                        <p className="text-gray-400 mt-3 leading-relaxed">
                            Keep all your important credentials together in one
                            organized place that's easy to access.
                        </p>

                    </div>


                    {/* Card 3 */}
                    <div className="bg-[#111528] border border-gray-800 rounded-2xl p-6">

                        <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center mb-5">

                            <KeyRound
                                size={24}
                                className="text-purple-400"
                            />

                        </div>

                        <h3 className="text-xl font-semibold">
                            Strong passwords
                        </h3>

                        <p className="text-gray-400 mt-3 leading-relaxed">
                            Create stronger and more unique passwords instead of
                            relying on passwords that are easy to guess.
                        </p>

                    </div>

                </div>

            </section>


            {/* Final CTA */}
            <section className="border-t border-gray-800/60">

                <div className="max-w-4xl mx-auto px-6 py-20 text-center">

                    <LockKeyhole
                        size={30}
                        className="text-purple-400 mx-auto"
                    />

                    <h2 className="text-3xl md:text-4xl font-bold mt-5">
                        Ready to secure your passwords?
                    </h2>

                    <p className="text-gray-400 mt-4">
                        Start managing your credentials with Sentra.
                    </p>

                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 mt-7 bg-purple-600 hover:bg-purple-500 px-6 py-3.5 rounded-xl font-semibold transition duration-200"
                    >
                        Get Started
                        <ArrowRight size={19} />
                    </Link>

                </div>

            </section>

        </main>
    );
};

export default Landing;