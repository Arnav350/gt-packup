import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  type: "login" | "signup";
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ type: initialType, onClose, onSuccess }) => {
  const [type, setType] = useState(initialType);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.endsWith("@gatech.edu")) {
      alert("Please enter a valid Georgia Tech email address (@gatech.edu).");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    login(email);
    onClose();
    onSuccess?.();
  };

  const toggleType = () => {
    setType(type === "login" ? "signup" : "login");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>{type === "login" ? "Welcome Back!" : "Create Account"}</h2>
        <p className="modal-subtitle">
          {type === "login" ? "Sign in to manage your storage" : "Join GT PackUp to start storing"}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                placeholder="your.email@gatech.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            {type === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {type === "login" ? "Don't have an account?" : "Already have an account?"}
            <button onClick={toggleType} className="switch-btn">
              {type === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
