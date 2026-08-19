import { useState } from "react";
import {Toaster} from "react-hot-toast";


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Manager from "./components/manager";
import Vault from "./components/vault";



function App() {
  const [passwords, setPasswords] = useState([]);
  return (
    <BrowserRouter>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<Manager 
        passwords={passwords}
        setPasswords={setPasswords}
          />} />
        <Route path="/vault" element={<Vault 
        passwords={passwords}
        setPasswords={setPasswords}
          />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;