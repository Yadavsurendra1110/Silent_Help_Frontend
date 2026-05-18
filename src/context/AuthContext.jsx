// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        // Email domain validation removed - any Google account allowed
        /*
        const allowedDomain = import.meta.env.VITE_COLLEGE_EMAIL_DOMAIN;
        const emailDomain = fbUser.email?.split("@")[1]?.toLowerCase();
        if (allowedDomain && emailDomain !== allowedDomain.toLowerCase()) {
          await signOut(auth);
          setFirebaseUser(null);
          setCurrentUser(null);
          setLoading(false);
          return;
        }
        */

        try {
          const idToken = await fbUser.getIdToken();
          const res = await api.get("/users/me", {
            headers: { Authorization: `Bearer ${idToken}` }
          });
          setCurrentUser(res.data.user);
        } catch (err) {
          console.error("Auth sync failed:", err);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async (role) => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const res = await api.post("/auth/verify", { idToken, role });
      setCurrentUser(res.data.user);
      return res.data.user;
    } catch (err) {
      console.error("Login failed:", err);
      const msg = err?.response?.data?.message || err.message || "Login failed";
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setFirebaseUser(null);
  };

  const refreshUser = async () => {
    if (!firebaseUser) return;
    try {
      const res = await api.get("/users/me");
      setCurrentUser(res.data.user);
    } catch (err) {
      console.error("Refresh user failed:", err);
    }
  };

  const value = {
    firebaseUser,
    currentUser,
    loading,
    authError,
    loginWithGoogle,
    logout,
    refreshUser,
    isAdmin: currentUser?.role === "admin",
    isProfileComplete: currentUser?.isProfileComplete ?? false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export default AuthContext;

