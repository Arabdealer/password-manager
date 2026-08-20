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
  const response = await fetch("http://localhost:3000/", {
    credentials: "include",
  });
  const data = await response.json();

  setPasswords(data);
};
useEffect(() => {
  getPasswords();
}, []);

    // Delete password
    const deletePassword = async (id) => {
        await fetch("http://localhost:3000/", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id: id }),
        });

        await getPasswords();

        toast.error("Password deleted!");
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

  const response = await fetch("http://localhost:3000/", {
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
                                            onClick={() => togglePassword(item._id)}
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
                                                copyPassword(item.password, item._id)
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
                                            onClick={() => openEditModal(item)}
                                            className="p-2.5 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 transition"
                                            title="Edit password"
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => deletePassword(item._id)}
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

        </main>
    );
};

export default Vault;