import { Plus, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Manager = ({ passwords, setPasswords }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
   const getPasswords = async () => {
      const response = await fetch("http://localhost:3000/");
      const data = await response.json();

      setPasswords(data);
    };
    useEffect(() => {
      getPasswords();
    }, []);

  const addPassword = async () => {
    console.log("Adding password:", { website, username, password });
    if (!website || !username || !password) {
      toast.error("Please fill in all fields !");
      return;
    }
    const newPassword = {
      website,
      username,
      password,
    };
    const response = await fetch("http://localhost:3000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPassword),
    });
    await getPasswords();
    toast.success("Password added !");
  };


  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#080b1a] text-white flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-3xl">

        {/* Heading */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center">
              <LockKeyhole
                size={28}
                className="text-purple-400"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Save a new password
          </h1>

          <p className="text-gray-400 mt-3 text-sm md:text-base">
            Keep your passwords organized and accessible in one place.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#111528] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl">

          {/* Website / App */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Website / App
            </label>

            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Enter website or app name"
              className="w-full bg-[#080b1a] border border-gray-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition"
            />
          </div>

          {/* Username + Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Username / Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username / Email
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username or email"
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
                  placeholder="Enter password"
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

          </div>

          {/* Add Password Button */}
          <button
            type="button"

            onClick={addPassword}
            className="mt-7 w-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition duration-200 shadow-lg shadow-purple-900/20"
          >
            <Plus size={20} />
            Add Password
          </button>

        </div>

      </div>

    </main>
  );
};

export default Manager;