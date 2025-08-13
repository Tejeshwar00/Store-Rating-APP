// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import StoreList from "./pages/StoreList";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", background: "#282c34" }}>
        <Link to="/" style={{ color: "#fff", marginRight: "15px" }}>Stores</Link>
        <Link to="/register" style={{ color: "#fff", marginRight: "15px" }}>Register</Link>
        <Link to="/login" style={{ color: "#fff" }}>Login</Link>
      </nav>

      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<StoreList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
