import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth, recaptchaVerifier } from "../config/firebase";
import { signInWithPhoneNumber } from "firebase/auth";

const Register: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPricing = location.state?.fromPricing;
  const planInfo = location.state
    ? {
        planName: location.state.planName,
        price: location.state.price,
      }
    : null;

  useEffect(() => {
    // Initialize reCAPTCHA
    recaptchaVerifier.render();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (fromPricing && planInfo) {
        navigate("/booking", { state: planInfo });
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, navigate, fromPricing, planInfo]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formattedPhone = phoneNumber.startsWith("+1") ? phoneNumber : `+1${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      setConfirmationResult(result);
      setShowVerification(true);
    } catch (err: any) {
      setError(err.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await confirmationResult.confirm(verificationCode);
      // Navigation will be handled by the AuthContext's onAuthStateChanged
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4 py-12 bg-large-gray">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6 sm:p-8 md:p-10">
        <h2 className="text-2xl font-medium text-center mb-8 text-black">Create an Account</h2>

        {error && <div className="bg-light-primary text-error p-3 rounded-lg mb-6 text-sm">{error}</div>}

        {!showVerification ? (
          <form onSubmit={handleSendCode}>
            <div className="mb-6">
              <label htmlFor="fullName" className="block mb-2 font-medium text-black">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="phoneNumber" className="block mb-2 font-medium text-black">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter your phone number"
                className="form-input"
                required
                disabled={isLoading}
              />
              <span className="text-xs text-text-gray mt-1 block">Format: 1234567890</span>
            </div>

            <div id="recaptcha-container" className="mb-6"></div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg transition-all ${
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-90"
              }`}
            >
              {isLoading ? "Sending Code..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <div className="mb-6">
              <label htmlFor="verificationCode" className="block mb-2 font-medium text-black">
                Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter the 6-digit code"
                className="form-input"
                required
                disabled={isLoading}
                maxLength={6}
              />
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
