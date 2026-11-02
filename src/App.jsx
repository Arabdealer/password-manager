import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Manager from "./components/manager";
import Vault from "./components/vault";
import Login from "./components/login";
import Landing from "./components/landing";
import ProtectedRoute from "./components/protectedroutes";
import Register from "./components/register";
import UnlockModal from "./components/unlockmodal";

function App() {
  const [passwords, setPasswords] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [userSalt, setUserSalt] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setAuthenticated(true);
          if (data.salt) {
            setUserSalt(data.salt);
          }
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <Toaster />

      <Navbar
        authenticated={authenticated}
        setAuthenticated={setAuthenticated}
      />

      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<Landing />} />

        {/* Login */}
        <Route
          path="/login"
          element={
            <Login
              setAuthenticated={setAuthenticated}
              setEncryptionKey={setEncryptionKey}
            />
          }
        />

        {/* Register */}
        <Route path="/register" element={<Register />} />

        {/* Protected Home / Manager */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Manager
                passwords={passwords}
                setPasswords={setPasswords}
                encryptionKey={encryptionKey}
                setEncryptionKey={setEncryptionKey}
              />
            </ProtectedRoute>
          }
        />

        {/* Protected Vault */}
        <Route
          path="/vault"
          element={
            <ProtectedRoute>
              <Vault
                passwords={passwords}
                setPasswords={setPasswords}
                encryptionKey={encryptionKey}
                setEncryptionKey={setEncryptionKey}
              />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Unlock Vault Modal if session is active but encryption key is not loaded */}
      {authenticated && !encryptionKey && (
        <UnlockModal
          userSalt={userSalt}
          setEncryptionKey={setEncryptionKey}
          setAuthenticated={setAuthenticated}
        />
      )}
    </BrowserRouter>
  );
}

export default App;
