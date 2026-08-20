import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect } from 'react';

import Navbar from "./components/Navbar";

import Analyze from "./pages/Analyze";
import Chat from "./pages/Chat";
import Impact from "./pages/Impact";
import Architecture from "./pages/Architecture";

function App() {

  useEffect(() => {
    const resetSession = async () => {
      try {
        await fetch("http://127.0.0.1:8000/reset", {
          method: "POST",
        });

        // Clear all browser-side persisted data
        localStorage.clear();
        sessionStorage.clear();

        // Force the app to start with a clean browser state
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        console.error("Reset error:", error);
      }
    };

    resetSession();
  }, []);

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<Analyze />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/architecture" element={<Architecture />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;