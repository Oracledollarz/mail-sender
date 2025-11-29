import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./lib/context/SocketContext";
import HomePage from "./pages/HomePage";
import "./App.css";

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="min-h-screen bg-white py-8 px-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
