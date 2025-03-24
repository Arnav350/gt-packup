import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Skeleton from "react-loading-skeleton";

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

const Profile = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState<ActiveService | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveService = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${API_URL}/api/services/active`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setActiveService(response.data.service);
      } catch (err: any) {
        // 404 means no active service, which is okay
        if (err.response?.status !== 404) {
          console.error("Error fetching active service:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveService();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getStatusText = (status: string) => {
    return (
      {
        Created: "Awaiting inspection",
        Checked: "Inspection completed, awaiting confirmation",
        Confirmed: "Service confirmed, awaiting completion",
      }[status] || status
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Your Profile</h1>

      <div className="bg-white p-4 sm:p-8 rounded-xl shadow-md border border-border-gray mb-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-text-gray">Email</p>
              <p className="text-base sm:text-lg font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-text-gray">Account Type</p>
              <p className="text-base sm:text-lg font-medium">Georgia Tech Student</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="border-t border-border-gray pt-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Current Service</h2>
            <Skeleton count={3} height={24} className="mb-2" />
          </div>
        ) : activeService ? (
          <div className="border-t border-border-gray pt-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Current Service</h2>
            <div className="p-3 sm:p-4 bg-light-primary rounded-lg mb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                <div>
                  <p className="font-medium text-primary">{activeService.package}</p>
                  <p className="text-text-gray mt-1">{getStatusText(activeService.status)}</p>
                </div>
                <span className="inline-block px-3 py-1 bg-white text-primary rounded-full text-sm font-medium border border-primary self-start">
                  {activeService.status}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm">
                  <span className="font-medium">Address:</span> {activeService.address}
                  {activeService.address_extra && `, ${activeService.address_extra}`}
                </p>
                <p className="text-sm mt-1">
                  <span className="font-medium">Requested on:</span>{" "}
                  {new Date(activeService.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Link
              to="/booking"
              className="block w-full py-2 px-4 bg-primary text-white text-center font-medium rounded-lg hover:bg-opacity-90 transition-all"
            >
              View Details
            </Link>
          </div>
        ) : (
          <div className="border-t border-border-gray pt-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Current Service</h2>
            <p className="text-text-gray mb-4">You don't have any active service requests.</p>
            <Link
              to="/pricing"
              className="block w-full py-2 px-4 bg-primary text-white text-center font-medium rounded-lg hover:bg-opacity-90 transition-all"
            >
              Request a Service
            </Link>
          </div>
        )}

        <div className="border-t border-border-gray pt-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Account Actions</h2>
          <div className="space-y-4">
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-black border border-border-gray text-white font-medium rounded-lg hover:bg-light-primary transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
