import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const API_URL = process.env.REACT_APP_API_URL || "";

interface ActiveService {
  _id: string;
  package: string;
  status: string;
  address: string;
  address_extra?: string;
  phone: string;
  createdAt: string;
}

const ServiceDetailsSkeleton = () => (
  <div className="max-w-3xl mx-auto px-4 py-12">
    <Skeleton width={180} height={40} className="mb-8" />

    <div className="bg-white p-6 rounded-xl shadow-sm border border-border-gray mb-8">
      <div className="mb-4">
        <Skeleton width={120} height={24} className="rounded-full" />
      </div>

      <Skeleton width={240} height={28} className="mb-5" />

      <div className="mt-6 space-y-5">
        <Skeleton count={1} height={20} />
        <Skeleton count={1} height={20} />
        <Skeleton count={1} height={20} />
        <Skeleton count={1} height={20} />
        <Skeleton count={1} height={20} />
      </div>

      <div className="mt-8">
        <Skeleton count={1} height={20} width="90%" className="mb-6" />
        <Skeleton height={45} className="rounded-lg" />
      </div>
    </div>
  </div>
);

const BookingFormSkeleton = () => (
  <div className="max-w-3xl mx-auto px-4 py-12">
    <Skeleton width={220} height={40} className="mb-8" />

    <div className="bg-white p-6 rounded-xl shadow-sm border border-border-gray mb-8">
      <Skeleton width={260} height={28} className="mb-3" />
      <Skeleton count={1} height={20} width="90%" />
    </div>

    <div className="bg-white p-6 rounded-xl shadow-sm border border-border-gray">
      <div className="mb-6">
        <Skeleton width={120} height={20} className="mb-3" />
        <Skeleton height={40} className="rounded-md" />
      </div>

      <div className="mb-6">
        <Skeleton width={120} height={20} className="mb-3" />
        <Skeleton height={40} className="rounded-md" />
      </div>

      <div className="mb-6">
        <Skeleton width={220} height={20} className="mb-3" />
        <Skeleton height={40} className="rounded-md" />
      </div>

      <div className="mb-6">
        <Skeleton width={120} height={20} className="mb-3" />
        <Skeleton height={40} className="rounded-md" />
      </div>

      <Skeleton height={50} className="rounded-lg" />
    </div>
  </div>
);

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [activeService, setActiveService] = useState<ActiveService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [loadingView, setLoadingView] = useState<"service" | "form">(bookingState ? "form" : "service");

  // Check if user has an active service
  useEffect(() => {
    const checkActiveService = async () => {
      if (!user || !token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/services/active`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setActiveService(response.data.service);
        setLoadingView("service");
      } catch (err: any) {
        // If the error is 404, it means no active service was found, which is fine
        if (err.response?.status !== 404) {
          console.error("Error checking active service:", err);
        } else if (bookingState) {
          // If we have booking state and no active service, we'll show the form
          setLoadingView("form");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkActiveService();
  }, [user, token, navigate, bookingState]);

  // If no booking state and no active service, redirect to pricing
  useEffect(() => {
    if (!isLoading && !activeService && !bookingState) {
      navigate("/pricing");
    }
  }, [activeService, bookingState, navigate, isLoading]);

  const handleCancel = async () => {
    if (!activeService) return;

    setIsCancelling(true);
    try {
      await axios.delete(`${API_URL}/api/services/${activeService._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setActiveService(null);
      alert("Service cancelled successfully");
      navigate("/");
    } catch (err: any) {
      console.error("Error cancelling service:", err);
      alert("Failed to cancel service: " + (err.response?.data?.error || "Unknown error"));
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/services`,
        {
          package: selectedService,
          address: formData.address,
          address_extra: formData.addressDetails,
          phone: formData.phone,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Service created:", response.data);
      setActiveService(response.data.service);
      alert("Inspection request submitted! 🎉");
    } catch (err: any) {
      console.error("Error submitting service request:", err);
      // If the user already has an active service, show it
      if (err.response?.data?.activeService) {
        setActiveService(err.response.data.activeService);
      } else {
        setError(err.response?.data?.error || "Failed to submit your request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return loadingView === "service" ? <ServiceDetailsSkeleton /> : <BookingFormSkeleton />;
  }

  // If user already has an active service, display it
  if (activeService) {
    const statusText = {
      Created: "Awaiting inspection",
      Checked: "Inspection completed, awaiting confirmation",
      Confirmed: "Service confirmed, awaiting completion",
    }[activeService.status];

    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Current Service Request</h1>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-border-gray mb-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-light-primary text-primary rounded-full text-sm font-medium">
              {statusText}
            </span>
          </div>

          <h2 className="text-xl font-semibold mb-2">Service: {activeService.package}</h2>

          <div className="mt-6 space-y-3 text-gray-700">
            <p>
              <span className="font-medium">Status:</span> {statusText}
            </p>
            <p>
              <span className="font-medium">Address:</span> {activeService.address}
            </p>
            {activeService.address_extra && (
              <p>
                <span className="font-medium">Additional Details:</span> {activeService.address_extra}
              </p>
            )}
            <p>
              <span className="font-medium">Contact:</span> {activeService.phone}
            </p>
            <p>
              <span className="font-medium">Requested on:</span>{" "}
              {new Date(activeService.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-8">
            <p className="mb-4 text-lg">Please check your messages on your phone/email for updates from our team.</p>

            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-all"
            >
              {isCancelling ? "Cancelling..." : "Cancel Service Request"}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        {error && <div className="mb-6 p-3 bg-light-primary text-error rounded-lg">{error}</div>}

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
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Request Inspection"}
        </button>
      </form>
    </div>
  );
};

export default Booking;
