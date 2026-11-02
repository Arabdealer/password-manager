import { useState, useEffect } from "react";
import { Plus, LockKeyhole, Eye, EyeOff, Globe, User, Key, Sparkles, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { encryptPassword } from "../utils/crypto";

const Manager = ({ passwords, setPasswords, encryptionKey }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=";
    let gen = "";
    for (let i = 0; i < 16; i++) {
      gen += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(gen);
    setShowPassword(true);
    toast.success("Generated strong password!");
  };

  const addPassword = async (e) => {
    if (e) e.preventDefault();

    if (!website || !username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!encryptionKey) {
      toast.error("Vault is locked. Please unlock your vault or sign in again.");
      return;
    }

    setLoading(true);
    try {
      const { ciphertext, iv } = await encryptPassword(password, encryptionKey);
      const newPassword = {
        website,
        username,
        ciphertext,
        iv,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPassword),
      });

      if (response.ok) {
        await getPasswords();
        toast.success("Password encrypted and saved!");
        setWebsite("");
        setUsername("");
        setPassword("");
      } else {
        toast.error("Failed to save password");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while encrypting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#070914] text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-9">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-600/10 border border-purple-500/30 mb-4 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <LockKeyhole size={26} className="text-purple-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Add New Credential
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Encrypted directly on your device before being stored securely.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#101426]/90 border border-gray-800/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={addPassword} className="space-y-5">
            {/* Website / App */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Website or Application
              </label>
              <div className="relative">
                <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. github.com or Netflix"
                  className="w-full bg-[#080b1a] border border-gray-800 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 transition text-sm"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. user@example.com"
                  className="w-full bg-[#080b1a] border border-gray-800 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 transition text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition font-medium"
                >
                  <Sparkles size={13} />
                  Auto-generate strong password
                </button>
              </div>

              <div className="relative">
                <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter or generate password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#080b1a] border border-gray-800 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 transition text-sm font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition duration-200 shadow-lg shadow-purple-900/30"
            >
              <Plus size={19} />
              {loading ? "Encrypting & Storing..." : "Save to Vault"}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mt-6">
          <ShieldCheck size={15} className="text-purple-400" />
          <span>Encrypted with zero-knowledge keys before leaving your device</span>
        </div>
      </div>
    </main>
  );
};

export default Manager;
