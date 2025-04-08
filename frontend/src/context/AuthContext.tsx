import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

export interface User {
  _id: string;
  phone: string;
  fullName: string;
  isAdmin: boolean;
  isBanned?: boolean;
}

export interface AuthContextType {
  user: User | null;
  register: (phone: string, fullName: string) => Promise<void>;
  verifyCode: (phone: string, code: string, fullName?: string, isRegistration?: boolean) => Promise<void>;
  login: (phone: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  register: async () => {},
  verifyCode: async () => {},
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
  token: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle ban detection and logout
    const handleBanDetection = (error: any) => {
      if (error.response?.status === 403 && error.response?.data?.isBanned) {
        // Store ban message in session storage to display after redirect
        sessionStorage.setItem("banMessage", "Your account has been banned");

        // Force logout the banned user
        logout();

        // Redirect to login page
        window.location.href = "/login";
        return true;
      }
      return false;
    };

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!handleBanDetection(error)) {
          return Promise.reject(error);
        }
        return new Promise(() => {});
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  const register = async (phone: string, fullName: string) => {
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        phone,
        fullName,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  };

  const verifyCode = async (phone: string, code: string, fullName?: string, isRegistration?: boolean) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/verify`, {
        phone,
        code,
        fullName,
        isRegistration,
      });

      const { user, token } = response.data;
      setUser(user);
      setToken(token);

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Verification failed");
    }
  };

  const login = async (phone: string) => {
    try {
      await axios.post(`${API_URL}/api/auth/login`, {
        phone,
      });
    } catch (error: any) {
      // Handle ban errors specifically
      if (error.response?.status === 403 && error.response?.data?.isBanned) {
        throw new Error("Your account has been banned");
      }
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        verifyCode,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        token,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
