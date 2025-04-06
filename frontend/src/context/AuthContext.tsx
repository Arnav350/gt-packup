import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../config/firebase";
import { onAuthStateChanged, User as FirebaseUser, signOut } from "firebase/auth";

const API_URL = process.env.REACT_APP_API_URL || "";

export interface User {
  _id: string;
  phoneNumber: string;
  fullName: string;
  isAdmin: boolean;
  isBanned?: boolean;
}

export interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (phoneNumber: string) => Promise<void>;
  register: (fullName: string, phoneNumber: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
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
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
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
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Get the user data from our backend
          const response = await axios.get(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${await firebaseUser.getIdToken()}`,
            },
          });

          const { user } = response.data;
          setUser(user);

          // Store user in localStorage
          localStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
          localStorage.removeItem("user");
        }
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (phoneNumber: string) => {
    try {
      // The actual login is handled by Firebase in the Login component
      // This function is just a placeholder to maintain the interface
      // The real authentication happens through Firebase phone auth
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  };

  const register = async (fullName: string, phoneNumber: string) => {
    try {
      // The actual registration is handled by Firebase in the Register component
      // This function is just a placeholder to maintain the interface
      // The real authentication happens through Firebase phone auth
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        login,
        register,
        logout,
        isAuthenticated: !!firebaseUser,
        isAdmin: user?.isAdmin || false,
        token: firebaseUser ? firebaseUser.uid : null,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
