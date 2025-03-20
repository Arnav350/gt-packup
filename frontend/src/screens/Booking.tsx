import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const bookingState = location.state as { planName: string; price: string } | null;

  // Services available for selection
  const services = ["PackUp", "Secure Store", "Full Move", "Custom Plan"];

  // State for the selected service and form data
  const [selectedService, setSelectedService] = useState(bookingState?.planName || services[0]);
  const [formData, setFormData] = useState({
    address: "",
    addressDetails: "",
    phone: "",
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
    console.log("Inspection request submitted:", { ...formData, selectedService });

    alert("Inspection request submitted! 🎉");

    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Request Your Inspection</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-border-gray mb-8">
        <h2 className="text-xl font-semibold mb-2">Requested Service: {selectedService}</h2>
        <p className="text-lg text-gray-700">
          We will inspect your dorm or apartment room and provide you with an accurate cost for the requested service.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-border-gray">
        <div className="mb-6">
          <label htmlFor="service" className="block mb-2 font-medium">
            Select Service
          </label>
          <select
            id="service"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="form-input"
            required
          >
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

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

        <button
          type="submit"
          className="w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-all"
        >
          Request Inspection
        </button>
      </form>
    </div>
  );
};

export default Booking;
