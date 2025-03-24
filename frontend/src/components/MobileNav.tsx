import React from "react";
import { Link } from "react-router-dom";
import { User } from "../context/AuthContext";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, isAuthenticated, user, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Navigation Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-4/5 max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-border-gray">
            <span className="text-xl font-semibold text-primary">Menu</span>
            <button onClick={onClose} className="p-2 text-text-gray hover:text-black">
              <span className="text-2xl">×</span>
            </button>
          </div>

          <nav className="flex-1 p-4">
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-lg text-black hover:text-primary transition-colors" onClick={onClose}>
                Home
              </Link>
              <Link to="/pricing" className="text-lg text-black hover:text-primary transition-colors" onClick={onClose}>
                Pricing
              </Link>
              <Link to="/about" className="text-lg text-black hover:text-primary transition-colors" onClick={onClose}>
                About Us
              </Link>

              {isAuthenticated && (
                <Link
                  to="/booking"
                  className="text-lg text-primary font-bold hover:text-primary transition-colors"
                  onClick={onClose}
                >
                  My Service
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <div className="pt-4 border-t border-border-gray">
                    <Link to="/profile" className="w-full btn btn-secondary" onClick={onClose}>
                      Profile
                    </Link>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t border-border-gray">
                  <Link to="/login" className="block w-full btn btn-secondary mb-2" onClick={onClose}>
                    Login
                  </Link>
                  <Link to="/register" className="block w-full btn btn-primary" onClick={onClose}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
