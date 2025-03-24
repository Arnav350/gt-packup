import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Check for ban messages when component mounts
  useEffect(() => {
    const banMessage = sessionStorage.getItem("banMessage");
    if (banMessage) {
      setError(banMessage);
      sessionStorage.removeItem("banMessage");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return; // Prevent multiple submissions

    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4 py-12 bg-large-gray">
      <div className="w-full max-w-lg min-w-[28rem] bg-white rounded-xl shadow-md p-8 md:p-10">
        <h2 className="text-2xl font-medium text-center mb-8 text-black">Welcome Back!</h2>

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
              placeholder="Enter your password"
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
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border-gray text-center">
          <span className="text-sm text-text-gray">Don't have an account?</span>
          <Link to="/register" className="text-sm ml-1 text-primary font-medium hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
