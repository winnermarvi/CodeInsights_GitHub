import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Analyze from "./pages/Analyze";
import Chat from "./pages/Chat";
import Impact from "./pages/Impact";
import Architecture from "./pages/Architecture";

function App() {
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