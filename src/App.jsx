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

function App() {
  const [passwords, setPasswords] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/me", {
          credentials: "include",
        });

        setAuthenticated(response.ok);
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
            <Login setAuthenticated={setAuthenticated} />
          }
        />
        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Home / Manager */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Manager
                passwords={passwords}
                setPasswords={setPasswords}
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
              />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;