import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

interface UserData {
  _id: string;
  email: string;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: string;
}

interface ServiceData {
  _id: string;
  user_id: {
    _id: string;
    email: string;
  };
  package: string;
  status: string;
  address: string;
  address_extra?: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

type View = "users" | "services";

const Admin: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>("users");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceData | null>(null);
  const [editFormData, setEditFormData] = useState({
    package: "",
    status: "",
    address: "",
    address_extra: "",
    phone: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (activeView === "users") {
          const response = await axios.get(`${API_URL}/api/admin/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsers(response.data);
        } else {
          const response = await axios.get(`${API_URL}/api/admin/services`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setServices(response.data);
        }

        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.error || `Failed to fetch ${activeView}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [token, activeView]);

  const toggleBanStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await axios.put(
        `${API_URL}/api/admin/users/${userId}/ban`,
        {
          isBanned: !currentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setUsers(
        users.map((user) =>
          user._id === userId
            ? {
                ...user,
                isBanned: !currentStatus,
              }
            : user
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update user ban status");
    }
  };

  const openEditModal = (service: ServiceData) => {
    setCurrentService(service);
    setEditFormData({
      package: service.package,
      status: service.status,
      address: service.address,
      address_extra: service.address_extra || "",
      phone: service.phone,
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setCurrentService(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const updateService = async (serviceId: string) => {
    try {
      await axios.put(`${API_URL}/api/admin/services/${serviceId}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      setServices(
        services.map((service) =>
          service._id === serviceId
            ? {
                ...service,
                ...editFormData,
              }
            : service
        )
      );

      closeEditModal();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update service");
    }
  };

  const deleteService = async (serviceId: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`${API_URL}/api/admin/services/${serviceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update local state
        setServices(services.filter((service) => service._id !== serviceId));
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to delete service");
      }
    }
  };

  const renderUsersTable = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map((user) => (
          <tr key={user._id} className={user.isBanned ? "bg-red-50" : ""}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {user.isAdmin ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Admin
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  User
                </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {user.isBanned ? (
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Banned
                  </span>
                </div>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              {!user.isAdmin && (
                <button
                  onClick={() => toggleBanStatus(user._id, user.isBanned)}
                  className={`text-sm ${
                    user.isBanned ? "text-green-600 hover:text-green-900" : "text-red-600 hover:text-red-900"
                  }`}
                >
                  {user.isBanned ? "Unban User" : "Ban User"}
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderServicesTable = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {services.map((service) => (
          <tr key={service._id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.user_id?.email}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.package}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                ${service.status === "Created" ? "bg-blue-100 text-blue-800" : ""}
                ${service.status === "Checked" ? "bg-yellow-100 text-yellow-800" : ""}
                ${service.status === "Confirmed" ? "bg-purple-100 text-purple-800" : ""}
                ${service.status === "Completed" ? "bg-green-100 text-green-800" : ""}
              `}
              >
                {service.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {service.address}
              {service.address_extra && <div className="text-xs text-gray-400">{service.address_extra}</div>}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.phone}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(service.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button onClick={() => openEditModal(service)} className="text-indigo-600 hover:text-indigo-900 mr-2">
                Edit
              </button>
              <button onClick={() => deleteService(service._id)} className="text-red-600 hover:text-red-900">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeView === "users"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveView("users")}
          >
            Users
          </button>
          <button
            className={`ml-8 py-2 px-4 border-b-2 font-medium text-sm ${
              activeView === "services"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveView("services")}
          >
            Services
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold">{activeView === "users" ? "User Management" : "Service Management"}</h2>
        </div>
        {loading ? (
          <div className="text-center mt-8">Loading...</div>
        ) : (
          <div className="overflow-x-auto">{activeView === "users" ? renderUsersTable() : renderServicesTable()}</div>
        )}
      </div>

      {/* Edit Service Modal */}
      {editModalOpen && currentService && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Service</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Package</label>
                <select
                  name="package"
                  value={editFormData.package}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="PackUp">PackUp</option>
                  <option value="Secure Store">Secure Store</option>
                  <option value="Full Move">Full Move</option>
                  <option value="Custom Plan">Custom Plan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="Created">Created</option>
                  <option value="Checked">Checked</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={editFormData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address Extra</label>
                <input
                  type="text"
                  name="address_extra"
                  value={editFormData.address_extra}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => updateService(currentService._id)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
