import { useState } from "react";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { deriveKey } from "../utils/crypto";

const UnlockModal = ({ userSalt, setEncryptionKey, setAuthenticated }) => {
  const [unlockPassword, setUnlockPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!unlockPassword) {
      toast.error("Please enter your password");
      return;
    }

    if (!userSalt) {
      toast.error("Session information unavailable. Please sign in again.");
      return;
    }

    setLoading(true);
    try {
      const key = await deriveKey(unlockPassword, userSalt);
      setEncryptionKey(key);
      setUnlockPassword("");
      toast.success("Vault unlocked");
    } catch (err) {
      console.error(err);
      toast.error("Unable to unlock vault. Please check your password.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      setAuthenticated(false);
      setEncryptionKey(null);
      setUnlockPassword("");
      toast.success("Signed out successfully");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center px-4 z-50 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#101426] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

        {/* Security Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <LockKeyhole size={28} className="text-purple-400" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Unlock Sentra Vault
          </h2>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            Your encryption session has expired for security. Please enter your password to unlock your saved credentials.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleUnlock} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoFocus
                placeholder="Enter your password"
                value={unlockPassword}
                onChange={(e) => setUnlockPassword(e.target.value)}
                className="w-full bg-[#080b1a] border border-gray-700 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !unlockPassword}
            className="w-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition duration-200 shadow-lg shadow-purple-900/25 flex items-center justify-center gap-2"
          >
            {loading ? "Unlocking..." : "Unlock Vault"}
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-gray-300 transition"
            >
              Sign out of this session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnlockModal;
