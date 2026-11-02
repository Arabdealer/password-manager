import { useState, useEffect } from "react";
import {
    Search,
    Eye,
    EyeOff,
    Copy,
    Pencil,
    Trash2,
    LockKeyhole,
    Check,
    X,
    ShieldAlert,
    ExternalLink,
    KeyRound
} from "lucide-react";
import toast from "react-hot-toast";
import { decryptPassword, encryptPassword } from "../utils/crypto";
import PinInput from "./pininput";

const Vault = ({ passwords, setPasswords, encryptionKey }) => {
    const [search, setSearch] = useState("");
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [copiedId, setCopiedId] = useState(null);

    // Edit states
    const [editingId, setEditingId] = useState(null);
    const [editWebsite, setEditWebsite] = useState("");
    const [editUsername, setEditUsername] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [editPin, setEditPin] = useState("");
    const [saveLoading, setSaveLoading] = useState(false);

    // PIN verification states
    const [pinModalOpen, setPinModalOpen] = useState(false);
    const [enteredPin, setEnteredPin] = useState("");
    const [pendingAction, setPendingAction] = useState(null);
    const [pinLoading, setPinLoading] = useState(false);
    const [pinError, setPinError] = useState("");

    const requestPin = (action) => {
        setEnteredPin("");
        setPinError("");
        setPendingAction(() => action);
        setPinModalOpen(true);
    };

    // Helper: Safely unlock a saved password
    const decryptItem = async (item) => {
        if (!encryptionKey) {
            toast.error("Vault is locked. Please sign in again to unlock your passwords.");
            return null;
        }
        if (!item.ciphertext || !item.iv) {
            toast.error("Unable to load this password.");
            return null;
        }
        try {
            return await decryptPassword(item.ciphertext, item.iv, encryptionKey);
        } catch (err) {
            console.error("Unlock error:", err);
            toast.error("Could not unlock password. Please try again.");
            return null;
        }
    };

    const handleVerifyPin = async (pinValue) => {
        const pinToTest = pinValue || enteredPin;
        if (!pinToTest || !/^\d{6}$/.test(pinToTest)) {
            setPinError("Please enter a valid 6-digit PIN");
            return;
        }

        setPinLoading(true);
        setPinError("");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/verify-pin`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pin: pinToTest }),
            });

            const data = await response.json();

            if (!response.ok) {
                setPinError(data.message || "Invalid PIN");
                toast.error(data.message || "Invalid PIN");
                setPinLoading(false);
                return;
            }

            toast.success("PIN verified");
            setPinModalOpen(false);
            setPinLoading(false);

            if (pendingAction) {
                pendingAction(pinToTest);
                setPendingAction(null);
            }
        } catch (err) {
            console.error(err);
            setPinError("Failed to verify PIN. Please try again.");
            toast.error("Failed to verify PIN.");
            setPinLoading(false);
        }
    };

    const handleTogglePassword = (item) => {
        if (visiblePasswords[item._id]) {
            setVisiblePasswords((prev) => {
                const updated = { ...prev };
                delete updated[item._id];
                return updated;
            });
        } else {
            requestPin(async () => {
                const unlocked = await decryptItem(item);
                if (unlocked !== null) {
                    setVisiblePasswords((prev) => ({
                        ...prev,
                        [item._id]: unlocked,
                    }));
                }
            });
        }
    };

    const handleCopyPassword = (item) => {
        requestPin(async () => {
            const unlocked = await decryptItem(item);
            if (unlocked !== null) {
                await navigator.clipboard.writeText(unlocked);
                setCopiedId(item._id);
                toast.success("Password copied!");
                setTimeout(() => {
                    setCopiedId(null);
                }, 2000);
            }
        });
    };

    const handleOpenEditModal = (item) => {
        requestPin(async (pin) => {
            const unlocked = await decryptItem(item);
            if (unlocked !== null) {
                setEditPin(pin);
                setEditingId(item._id);
                setEditWebsite(item.website);
                setEditUsername(item.username);
                setEditPassword(unlocked);
            }
        });
    };

    const handleDeletePassword = (id) => {
        requestPin((pin) => deletePassword(id, pin));
    };

    const getPasswords = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/`, {
                credentials: "include",
            });
            const data = await response.json();
            setPasswords(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getPasswords();
    }, []);

    const deletePassword = async (id, pin) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ _id: id, pin }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to delete password");
                return;
            }

            await getPasswords();
            toast.success("Credential deleted securely");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete password");
        }
    };

    const saveEdit = async () => {
        if (!editWebsite || !editUsername || !editPassword) {
            toast.error("Please fill all fields!");
            return;
        }

        if (!encryptionKey) {
            toast.error("Vault is locked. Please sign in again to unlock your passwords.");
            return;
        }

        setSaveLoading(true);
        try {
            const { ciphertext, iv } = await encryptPassword(editPassword, encryptionKey);

            const updatedPassword = {
                _id: editingId,
                website: editWebsite,
                username: editUsername,
                ciphertext,
                iv,
                pin: editPin,
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPassword),
            });

            const result = await response.json();

            if (result.success) {
                await getPasswords();
                setEditingId(null);
                setVisiblePasswords((prev) => {
                    const updated = { ...prev };
                    delete updated[editingId];
                    return updated;
                });
                toast.success("Password updated!");
            } else {
                toast.error(result.message || "Failed to update password");
            }
        } catch (err) {
            console.error("Save edit error:", err);
            toast.error("Could not update password. Please try again.");
        } finally {
            setSaveLoading(false);
        }
    };

    const filteredPasswords = passwords.filter((item) =>
        item.website?.toLowerCase().includes(search.toLowerCase()) ||
        item.username?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="min-h-[calc(100vh-73px)] bg-[#070914] text-white px-6 py-10 relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-20 right-1/4 w-[500px] h-[300px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
                            <KeyRound size={15} />
                            Zero-Knowledge Vault
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                            Your Saved Credentials
                        </h1>
                        <p className="text-gray-400 mt-1 text-sm">
                            Encrypted and accessible only with your authorized master keys.
                        </p>
                    </div>

                    <div className="bg-[#101426]/90 border border-gray-800 rounded-xl px-5 py-2.5 flex items-center gap-3">
                        <span className="text-xs text-gray-400 uppercase font-semibold">Total Passwords:</span>
                        <span className="text-xl font-bold text-purple-400">{passwords.length}</span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 bg-[#101426]/90 border border-gray-800 rounded-xl px-4 py-3 focus-within:border-purple-500/60 focus-within:ring-2 focus-within:ring-purple-500/15 transition">
                        <Search size={18} className="text-gray-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by website, app, or email..."
                            className="w-full bg-transparent outline-none text-white placeholder-gray-600 text-sm"
                        />
                    </div>
                </div>

                {/* Credentials List */}
                <div className="space-y-3.5">
                    {filteredPasswords.length > 0 ? (
                        filteredPasswords.map((item) => (
                            <div
                                key={item._id}
                                className="group bg-[#101426]/80 border border-gray-800/80 hover:border-purple-500/40 rounded-xl p-4 md:p-5 transition duration-200 backdrop-blur-sm"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    {/* Website initial pill and name */}
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-600/10 border border-purple-500/25 flex items-center justify-center text-purple-300 font-bold text-base shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                                            {item.website ? item.website.charAt(0).toUpperCase() : "?"}
                                        </div>
                                        <div className="min-w-0">
                                            <h2 className="font-semibold text-base text-white truncate">
                                                {item.website}
                                            </h2>
                                            <p className="text-xs text-gray-400 truncate">
                                                {item.username}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions & Password Field */}
                                    <div className="flex items-center gap-3 justify-between md:justify-end">
                                        {/* Password Display Box */}
                                        <div className="bg-[#070914] border border-gray-800/90 rounded-lg px-3.5 py-2 font-mono text-sm text-gray-300 w-44 md:w-52 truncate select-none">
                                            {visiblePasswords[item._id]
                                                ? visiblePasswords[item._id]
                                                : "••••••••••••"}
                                        </div>

                                        {/* Reveal Toggle */}
                                        <button
                                            onClick={() => handleTogglePassword(item)}
                                            className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition"
                                            title={visiblePasswords[item._id] ? "Hide password" : "Show password"}
                                        >
                                            {visiblePasswords[item._id] ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>

                                        {/* Copy */}
                                        <button
                                            onClick={() => handleCopyPassword(item)}
                                            className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition"
                                            title="Copy password"
                                        >
                                            {copiedId === item._id ? (
                                                <Check size={18} className="text-green-400" />
                                            ) : (
                                                <Copy size={18} />
                                            )}
                                        </button>

                                        <div className="h-5 w-px bg-gray-800 mx-1 hidden sm:block" />

                                        {/* Edit */}
                                        <button
                                            onClick={() => handleOpenEditModal(item)}
                                            className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition"
                                            title="Edit password"
                                        >
                                            <Pencil size={17} />
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDeletePassword(item._id)}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                            title="Delete credential"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-[#101426]/50 border border-gray-800 rounded-2xl">
                            <LockKeyhole size={32} className="mx-auto text-gray-600 mb-3" />
                            <h2 className="text-base font-semibold text-white">No saved passwords found</h2>
                            <p className="text-gray-500 text-xs mt-1">
                                {search ? "Try searching for a different keyword" : "Start by adding your first password in 'Save Password'"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editingId !== null && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center px-4 z-50 animate-in fade-in duration-200">
                    <div className="w-full max-w-lg bg-[#101426] border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-lg font-bold text-white">Edit Credential</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Password will be re-encrypted upon saving</p>
                            </div>
                            <button
                                onClick={() => setEditingId(null)}
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                                    Website / App
                                </label>
                                <input
                                    type="text"
                                    value={editWebsite}
                                    onChange={(e) => setEditWebsite(e.target.value)}
                                    className="w-full bg-[#080b1a] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                                    Username / Email
                                </label>
                                <input
                                    type="text"
                                    value={editUsername}
                                    onChange={(e) => setEditUsername(e.target.value)}
                                    className="w-full bg-[#080b1a] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="text"
                                    value={editPassword}
                                    onChange={(e) => setEditPassword(e.target.value)}
                                    className="w-full bg-[#080b1a] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 text-sm font-mono"
                                />
                            </div>

                            <div className="flex gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingId(null)}
                                    className="flex-1 py-3 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={saveEdit}
                                    disabled={saveLoading}
                                    className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-sm transition shadow-lg shadow-purple-900/30"
                                >
                                    {saveLoading ? "Encrypting..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Clean 6-Box PIN Modal (No extra input box) */}
            {pinModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center px-4 z-50 animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-[#101426] border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                    <LockKeyhole size={20} className="text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-white tracking-tight">Security Check</h2>
                                    <p className="text-xs text-gray-400">Vault authorization required</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setPinModalOpen(false);
                                    setEnteredPin("");
                                    setPinError("");
                                    setPendingAction(null);
                                }}
                                className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Interactive 6-Box PIN Input */}
                        <form onSubmit={(e) => { e.preventDefault(); handleVerifyPin(); }} className="space-y-4 pt-2">
                            <PinInput
                                value={enteredPin}
                                onChange={(val) => {
                                    setEnteredPin(val);
                                    setPinError("");
                                }}
                                onComplete={(val) => handleVerifyPin(val)}
                                error={!!pinError}
                                autoFocus={true}
                            />

                            {pinError && (
                                <div className="text-xs text-red-400 text-center bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-lg">
                                    {pinError}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPinModalOpen(false);
                                        setEnteredPin("");
                                        setPinError("");
                                        setPendingAction(null);
                                    }}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={pinLoading || enteredPin.length !== 6}
                                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition shadow-lg shadow-purple-900/30"
                                >
                                    {pinLoading ? "Checking..." : "Authorize"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Vault;
