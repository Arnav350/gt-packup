import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Component imports
import Home from "./screens/Home";
import Pricing from "./screens/Pricing";
import AboutUs from "./screens/AboutUs";
import Booking from "./screens/Booking";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Profile from "./screens/Profile";
import Admin from "./screens/Admin";
import MobileNav from "./components/MobileNav";

function App() {
  const { isAuthenticated, logout, user, isAdmin } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <div className="flex items-center gap-4">
          <Link to="/profile" className="btn btn-primary w-14 rounded-full text-xl">
            {user?.email.charAt(0).toUpperCase()}
          </Link>
        </div>
      );
    }

    return (
      <div className="flex gap-4">
        <Link to="/login" className="btn btn-secondary">
          Login
        </Link>
        <Link to="/register" className="btn btn-primary">
          Register
        </Link>
      </div>
    );
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <nav className="bg-white border-b border-border-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center">
                <Link to="/" className="flex items-center gap-2">
                  <span className="text-2xl">📦</span>
                  <span className="text-xl font-semibold text-primary">GT PackUp</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <Link to="/" className="nav-link">
                  Home
                </Link>
                <Link to="/pricing" className="nav-link">
                  Pricing
                </Link>
                <Link to="/about" className="nav-link">
                  About Us
                </Link>
                {isAuthenticated && (
                  <Link to="/booking" className="nav-link text-primary font-bold">
                    My Service
                  </Link>
                )}
                {isAuthenticated && isAdmin && (
                  <Link to="/admin" className="nav-link text-red-600 font-bold">
                    Admin
                  </Link>
                )}
                {renderAuthButtons()}
              </div>

              {/* Mobile Hamburger Button */}
              <button className="md:hidden p-2" onClick={() => setIsMobileNavOpen(true)}>
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className="w-full h-0.5 bg-black"></span>
                  <span className="w-full h-0.5 bg-black"></span>
                  <span className="w-full h-0.5 bg-black"></span>
                </div>
              </button>
            </div>
          </div>
        </nav>

        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={logout}
        />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
