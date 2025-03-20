import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const bookingState = location.state as { planName: string; price: string } | null;

  const [formData, setFormData] = useState({
    address: "",
    addressDetails: "",
    phone: "",
    specialInstructions: "",
  });

  React.useEffect(() => {
    if (!user || !bookingState) {
      navigate("/pricing");
    }
  }, [user, bookingState, navigate]);

  if (!bookingState) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking submitted:", { ...formData, plan: bookingState });

    alert("Booking confirmed! 🎉");

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-border-gray mb-8">
        <h2 className="text-xl font-semibold mb-2">Selected Plan: {bookingState.planName}</h2>
        <p className="text-2xl font-bold text-primary">{bookingState.price}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-border-gray">
        <div className="mb-6">
          <label htmlFor="address" className="block mb-2 font-medium">
            Address
          </label>
          <input
            type="text"
            id="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="form-input"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="addressDetails" className="block mb-2 font-medium">
            Additional Address Information
          </label>
          <input
            type="text"
            id="addressDetails"
            placeholder="Apt number, building, etc."
            value={formData.addressDetails}
            onChange={(e) => setFormData({ ...formData, addressDetails: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="phone" className="block mb-2 font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            placeholder="(123) 456-7890"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="form-input"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="specialInstructions" className="block mb-2 font-medium">
            Special Instructions
          </label>
          <textarea
            id="specialInstructions"
            placeholder="Any special instructions or requirements"
            value={formData.specialInstructions}
            onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
            className="w-full min-h-[120px] p-3 border border-border-gray rounded-lg resize-y focus:outline-none focus:border-primary focus:bg-light-primary"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-all"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default Booking;
