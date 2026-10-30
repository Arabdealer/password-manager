import { useState ,useEffect } from "react";
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
} from "lucide-react";
import toast from "react-hot-toast";

const Vault = ({ passwords, setPasswords }) => {
    const [search, setSearch] = useState("");
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [copiedId, setCopiedId] = useState(null);

    // Edit states
    const [editingId, setEditingId] = useState(null);
    const [editWebsite, setEditWebsite] = useState("");
    const [editUsername, setEditUsername] = useState("");
    const [editPassword, setEditPassword] = useState("");

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

    const handleVerifyPin = async (e) => {
        if (e) e.preventDefault();
        if (!enteredPin || !/^\d{6}$/.test(enteredPin)) {
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
                body: JSON.stringify({ pin: enteredPin }),
            });

            const data = await response.json();

            if (!response.ok) {
                setPinError(data.message || "Invalid PIN");
                toast.error(data.message || "Invalid PIN");
                setPinLoading(false);
                return;
            }

            toast.success("PIN verified!");
            setPinModalOpen(false);
            setPinLoading(false);

            if (pendingAction) {
                pendingAction(enteredPin);
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
            togglePassword(item._id);
        } else {
            requestPin(() => togglePassword(item._id));
        }
    };

    const handleCopyPassword = (password, id) => {
        requestPin(() => copyPassword(password, id));
    };

    const handleOpenEditModal = (item) => {
        requestPin(() => openEditModal(item));
    };

    const handleDeletePassword = (id) => {
        requestPin((pin) => deletePassword(id, pin));
    };

    // Show / Hide password
    const togglePassword = (id) => {
        setVisiblePasswords((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Copy password
    const copyPassword = async (password, id) => {
        await navigator.clipboard.writeText(password);

        setCopiedId(id);

        toast.success("Password copied!");

        setTimeout(() => {
            setCopiedId(null);
        }, 1500);
    };
    const getPasswords = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/`, {
    credentials: "include",
  });
  const data = await response.json();

  setPasswords(data);
};
useEffect(() => {
  getPasswords();
}, []);

    // Delete password (sends PIN to backend for authorization)
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
            toast.success("Password deleted securely!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete password");
        }
    };

    // Open edit modal
    const openEditModal

        = (item) => {
            setEditingId(item._id);
            setEditWebsite(item.website);
            setEditUsername(item.username);
            setEditPassword(item.password);
        };

    // Save edited password
   const saveEdit = async () => {
  if (!editWebsite || !editUsername || !editPassword) {
    toast.error("Please fill all fields!");
    return;
  }

  const updatedPassword = {
    _id: editingId,
    website: editWebsite,
    username: editUsername,
    password: editPassword,
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

    toast.success("Password updated!");
  }
};
    // Search
    const filteredPasswords = passwords.filter((item) =>
        item.website.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="min-h-[calc(100vh-73px)] bg-[#080b1a] text-white px-6 py-10">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">

                    <div>
                        <div className="flex items-center gap-3 mb-3">

                            <div className="w-11 h-11 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center">
                                <LockKeyhole
                                    size={23}
                                    className="text-purple-400"
                                />
                            </div>

                            <span className="text-sm text-purple-400 font-medium">
                                Password Vault
                            </span>

                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Your Vault
                        </h1>

                        <p className="text-gray-400 mt-2">
                            Manage your saved passwords in one place.
                        </p>
                    </div>

                    {/* Password Count */}
                    <div className="bg-[#111528] border border-gray-800 rounded-xl px-5 py-3">
                        <p className="text-xs text-gray-500">
                            SAVED PASSWORDS
                        </p>

                        <p className="text-xl font-semibold mt-1">
                            {passwords.length}
                        </p>
                    </div>

                </div>

                {/* Search */}
                <div className="mb-7">

                    <div className="flex items-center gap-3 bg-[#111528] border border-gray-800 rounded-xl px-4 py-3.5 focus-within:border-purple-500/60 transition">

                        <Search
                            size={20}
                            className="text-gray-500"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search your passwords..."
                            className="w-full bg-transparent outline-none text-white placeholder-gray-600"
                        />

                    </div>

                </div>

                {/* Password List */}
                <div className="space-y-4">

                    {filteredPasswords.length > 0 ? (
                        filteredPasswords.map((item) => (

                            <div
                                key={item._id}
                                className="group bg-[#111528] border border-gray-800 hover:border-purple-500/40 rounded-2xl p-5 transition duration-200"
                            >

                                <div className="flex flex-col md:flex-row md:items-center gap-5">

                                    {/* Website */}
                                    <div className="flex items-center gap-4 flex-1 min-w-0">

                                        <div className="w-11 h-11 shrink-0 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                                            {item.website.charAt(0).toUpperCase()}
                                        </div>

                                        <div className="min-w-0">

                                            <h2 className="font-semibold text-lg truncate">
                                                {item.website}
                                            </h2>

                                            <p className="text-sm text-gray-500 truncate">
                                                {item.username}
                                            </p>

                                        </div>

                                    </div>

                                    {/* Password */}
                                    <div className="flex items-center gap-3 md:w-64">

                                        <div className="flex-1 bg-[#080b1a] border border-gray-800 rounded-lg px-3 py-2.5 overflow-hidden">

                                            <span className="text-sm font-mono text-gray-300 truncate block">
                                                {visiblePasswords[item._id]
                                                    ? item.password
                                                    : "••••••••••••"}
                                            </span>

                                        </div>

                                        {/* Show / Hide */}
                                        <button
                                            onClick={() => handleTogglePassword(item)}
                                            className="p-2 text-gray-500 hover:text-purple-400 transition"
                                            title={
                                                visiblePasswords[item._id]
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {visiblePasswords[item._id] ? (
                                                <EyeOff size={19} />
                                            ) : (
                                                <Eye size={19} />
                                            )}
                                        </button>

                                        {/* Copy */}
                                        <button
                                            onClick={() =>
                                                handleCopyPassword(item.password, item._id)
                                            }
                                            className="p-2 text-gray-500 hover:text-purple-400 transition"
                                            title="Copy password"
                                        >
                                            {copiedId === item._id ? (
                                                <Check size={19} />
                                            ) : (
                                                <Copy size={19} />
                                            )}
                                        </button>

                                    </div>

                                    {/* Edit / Delete */}
                                    <div className="flex items-center gap-2 md:border-l md:border-gray-800 md:pl-4">

                                        {/* Edit */}
                                        <button
                                            onClick={() => handleOpenEditModal(item)}
                                            className="p-2.5 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 transition"
                                            title="Edit password"
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDeletePassword(item._id)}
                                            className="p-2.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                                            title="Delete password"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))
                    ) : (

                        /* No Results */
                        <div className="text-center py-16 bg-[#111528] border border-gray-800 rounded-2xl">

                            <Search
                                size={32}
                                className="mx-auto text-gray-600 mb-3"
                            />

                            <h2 className="text-lg font-semibold">
                                No passwords found
                            </h2>

                            <p className="text-gray-500 text-sm mt-1">
                                Try searching for a different website.
                            </p>

                        </div>

                    )}

                </div>

            </div>

            {/* Edit Modal */}
            {editingId !== null && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6 z-50">

                    <div className="w-full max-w-lg bg-[#111528] border border-gray-800 rounded-2xl p-6 shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Edit Password
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Update your saved credentials.
                                </p>
                            </div>

                            <button
                                onClick={() => setEditingId(null)}
                                className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* Website */}
                        <div className="mb-4">

                            <label className="block text-sm text-gray-300 mb-2">
                                Website / App
                            </label>

                            <input
                                type="text"
                                value={editWebsite}
                                onChange={(e) => setEditWebsite(e.target.value)}
                                className="w-full bg-[#080b1a] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition"
                            />

                        </div>

                        {/* Username */}
                        <div className="mb-4">

                            <label className="block text-sm text-gray-300 mb-2">
                                Username / Email
                            </label>

                            <input
                                type="text"
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                                className="w-full bg-[#080b1a] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition"
                            />

                        </div>

                        {/* Password */}
                        <div className="mb-6">

                            <label className="block text-sm text-gray-300 mb-2">
                                Password
                            </label>

                            <input
                                type="text"
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                                className="w-full bg-[#080b1a] border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition"
                            />

                        </div>

                        {/* Modal Buttons */}
                        <div className="flex gap-3">

                            <button
                                onClick={() => setEditingId(null)}
                                className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-white/5 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={saveEdit}
                                className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition"
                            >
                                Save Changes
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* PIN Verification Modal */}
            {pinModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center px-4 z-50 animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-[#0f1325] border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                        {/* Decorative top accent gradient */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

                        {/* Modal Header */}
                        <div className="flex items-start justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                    <LockKeyhole size={20} className="text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white tracking-tight">Security Check</h2>
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

                        {/* PIN Form */}
                        <form onSubmit={handleVerifyPin} className="space-y-4">
                            {/* Visual 6-Digit PIN Boxes */}
                            <div className="flex justify-center gap-2 my-2">
                                {[0, 1, 2, 3, 4, 5].map((index) => {
                                    const isFilled = enteredPin.length > index;
                                    const isCurrent = enteredPin.length === index;
                                    return (
                                        <div
                                            key={index}
                                            className={`w-9 h-11 rounded-lg border flex items-center justify-center text-lg font-semibold transition-all duration-200 ${
                                                isFilled
                                                    ? "border-purple-500 bg-purple-500/20 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)] scale-105"
                                                    : isCurrent
                                                    ? "border-purple-500/60 bg-[#080b1a] text-gray-400 ring-2 ring-purple-500/20"
                                                    : "border-gray-800 bg-[#080b1a] text-gray-600"
                                            }`}
                                        >
                                            {isFilled ? "•" : ""}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Standardized Input with matching placeholder font */}
                            <div>
                                <input
                                    type="password"
                                    maxLength={6}
                                    autoFocus
                                    autoComplete="off"
                                    placeholder="Enter 6-digit vault PIN"
                                    value={enteredPin}
                                    onChange={(e) => {
                                        setEnteredPin(e.target.value.replace(/\D/g, ""));
                                        setPinError("");
                                    }}
                                    className="w-full bg-[#080b1a] border border-gray-700/80 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-center font-sans text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                                />

                                <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2 px-1">
                                    <span>Lockout: 3 attempts</span>
                                    <span>{enteredPin.length} / 6 digits</span>
                                </div>

                                {pinError && (
                                    <div className="text-xs text-red-400 mt-2.5 text-center bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-lg">
                                        {pinError}
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPinModalOpen(false);
                                        setEnteredPin("");
                                        setPinError("");
                                        setPendingAction(null);
                                    }}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-white/5 font-medium text-sm transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={pinLoading || enteredPin.length !== 6}
                                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition shadow-lg shadow-purple-900/25"
                                >
                                    {pinLoading ? "Verifying..." : "Authorize"}
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