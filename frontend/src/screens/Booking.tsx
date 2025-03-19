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
      navigate("/home");
    }, 2000);
  };

  return (
    <div className="booking-container">
      <h1>Complete Your Booking</h1>
      <div className="booking-plan-summary">
        <h2>Selected Plan: {bookingState.planName}</h2>
        <p className="booking-price">{bookingState.price}</p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <div className="input-container">
            <input
              type="text"
              id="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="addressDetails">Additional Address Information</label>
          <div className="input-container">
            <input
              type="text"
              id="addressDetails"
              placeholder="Apt number, building, etc."
              value={formData.addressDetails}
              onChange={(e) => setFormData({ ...formData, addressDetails: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <div className="input-container">
            <input
              type="tel"
              id="phone"
              placeholder="(123) 456-7890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="specialInstructions">Special Instructions</label>
          <textarea
            id="specialInstructions"
            placeholder="Any special instructions or requirements"
            value={formData.specialInstructions}
            onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
            className="textarea-input"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default Booking;
