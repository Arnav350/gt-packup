import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { login, verifyCode } = useAuth();
  const navigate = useNavigate();

  // Check for ban messages when component mounts
  useEffect(() => {
    const banMessage = sessionStorage.getItem("banMessage");
    if (banMessage) {
      setError(banMessage);
      sessionStorage.removeItem("banMessage");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setError("");

    // Basic phone validation
    if (!/^\+?[1-9]\d{1,14}$/.test(phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    try {
      await login(phone);
      setShowVerification(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      await verifyCode(phone, verificationCode);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4 py-12 bg-large-gray">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6 sm:p-8 md:p-10">
        <h2 className="text-2xl font-medium text-center mb-8 text-black">Welcome Back!</h2>

        {error && <div className="bg-light-primary text-error p-3 rounded-lg mb-6 text-sm">{error}</div>}

        {!showVerification ? (
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="phone" className="block mb-2 font-medium text-black">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="form-input"
                required
                disabled={isLoading}
              />
              <span className="text-xs text-text-gray mt-1 block">
                Enter your US phone number (no spaces or dashes)
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg transition-all ${
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"
              }`}
            >
              {isLoading ? "Sending code..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="mb-6">
              <label htmlFor="verificationCode" className="block mb-2 font-medium text-black">
                Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter the 6-digit code"
                className="form-input"
                required
                disabled={isLoading}
              />
              <span className="text-xs text-text-gray mt-1 block">Enter the 6-digit code sent to your phone</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg transition-all ${
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"
              }`}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        )}

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
