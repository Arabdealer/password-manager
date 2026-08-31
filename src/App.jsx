import { useState } from "react";
import { Toaster } from "react-hot-toast";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Manager from "./components/manager";
import Vault from "./components/vault";
import Login from "./components/login";
import Landing from "./components/landing";
import ProtectedRoute from "./components/protectedroutes";

function App() {
  const [passwords, setPasswords] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);

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