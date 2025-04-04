import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPricing = location.state?.fromPricing;
  const planInfo = location.state
    ? {
        planName: location.state.planName,
        price: location.state.price,
      }
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return; // Prevent multiple submissions

    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!email.endsWith("@gatech.edu")) {
      setError("Please use your @gatech.edu email address");
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password);
      // If user came from pricing, redirect to booking with plan info
      if (fromPricing && planInfo) {
        navigate("/booking", { state: planInfo });
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4 py-12 bg-large-gray">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6 sm:p-8 md:p-10">
        <h2 className="text-2xl font-medium text-center mb-8 text-black">Create an Account</h2>

        {error && <div className="bg-light-primary text-error p-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-medium text-black">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your @gatech.edu email"
              className="form-input"
              required
              disabled={isLoading}
            />
            <span className="text-xs text-text-gray mt-1 block">Must be a @gatech.edu email</span>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 font-medium text-black">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="form-input"
              required
              disabled={isLoading}
            />
            <span className="text-xs text-text-gray mt-1 block">Minimum 6 characters</span>
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 font-medium text-black">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="form-input"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg transition-all ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"
            }`}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border-gray text-center">
          <span className="text-sm text-text-gray">Already have an account?</span>
          <Link to="/login" className="text-sm ml-1 text-primary font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
