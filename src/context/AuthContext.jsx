// context/AuthContext.jsx
// Provides Firebase auth state + current user profile from our backend
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
    const [firebaseUser, setFirebaseUser] = useState(null);   // Firebase user object
    const [currentUser, setCurrentUser] = useState(null);   // Our DB user object
    const [loading, setLoading] = useState(true);   // initial auth check
    const [authError, setAuthError] = useState(null);

    // ─── Listen to Firebase auth state ────────────────────────────────────────
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            setFirebaseUser(fbUser);

            if (fbUser) {
                try {
                    const idToken = await fbUser.getIdToken();
                    // Sync / register the user with our backend
                    const res = await api.post("/auth/verify", { idToken });
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

    // ─── Google sign-in helper ─────────────────────────────────────────────────
    const loginWithGoogle = async (intendedRole) => {
        setAuthError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            const res = await api.post("/auth/verify", { idToken, intendedRole });
            setCurrentUser(res.data.user);
            return res.data.user;
        } catch (err) {
            const msg = err?.response?.data?.message || err.message || "Login failed";
            setAuthError(msg);
            throw new Error(msg);
        }
    };

    // ─── Sign out ──────────────────────────────────────────────────────────────
    const logout = async () => {
        await signOut(auth);
        setCurrentUser(null);
        setFirebaseUser(null);
    };

    // ─── Refresh user profile from backend ───────────────────────────────────
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
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}

export default AuthContext;
