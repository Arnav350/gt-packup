import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { register, verifyCode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPricing = location.state?.fromPricing;
  const planInfo = location.state
    ? {
        planName: location.state.planName,
        price: location.state.price,
      }
    : null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setError("");

    // Basic phone validation
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    setIsLoading(true);

    try {
      await register(`+1${phone}`, fullName);
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
      await verifyCode(`+1${phone}`, verificationCode, fullName, true);
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

        {!showVerification ? (
          <form onSubmit={handleRegister}>
            <div className="mb-6">
              <label htmlFor="fullName" className="block mb-2 font-medium text-black">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block mb-2 font-medium text-black">
                Phone Number
              </label>
              <div className="bg-border-gray flex items-center rounded-lg">
                <span className="mx-2">+1</span>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="1234567890"
                  className="form-input flex-1"
                  required
                  disabled={isLoading}
                />
              </div>
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
