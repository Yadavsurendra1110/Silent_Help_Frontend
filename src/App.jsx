import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/login/Login";
import CompleteProfile from "./pages/CompleteProfile/CompleteProfile";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import Chat from "./pages/Chat/Chat";
import PostDetail from "./pages/PostDetail/PostDetail";
import Feed from "./components/Feed/Feed";
import Layout from "./components/Layout/Layout";

// ─── Route guards ──────────────────────────────────────────────────────────

// Redirect logged-in users away from /login
function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return <div className="flex-center" style={{ height: "100vh" }}><div className="spinner" /></div>;
  return currentUser ? <Navigate to="/" replace /> : children;
}

// Require auth for all protected routes
function PrivateRoute({ children }) {
  const { currentUser, loading, isProfileComplete } = useAuth();
  if (loading) return <div className="flex-center" style={{ height: "100vh" }}><div className="spinner" /></div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!isProfileComplete) return <Navigate to="/complete-profile" replace />;
  return children;
}

// Must be logged in but profile not yet complete
function ProfileSetupRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return <div className="flex-center" style={{ height: "100vh" }}><div className="spinner" /></div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

// ─── App shell with Layout ─────────────────────────────────────────────────
function AppWithLayout({ children }) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      {/* Profile setup (auth required, profile not yet done) */}
      <Route
        path="/complete-profile"
        element={<ProfileSetupRoute><CompleteProfile /></ProfileSetupRoute>}
      />

      {/* Protected routes (auth + profile required) */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppWithLayout>
              <Feed />
            </AppWithLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/post/:id"
        element={
          <PrivateRoute>
            <AppWithLayout>
              <PostDetail />
            </AppWithLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <AppWithLayout>
              <Profile />
            </AppWithLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <PrivateRoute>
            <AppWithLayout>
              <Profile />
            </AppWithLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <AppWithLayout>
              <Settings />
            </AppWithLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <AppWithLayout>
              <Chat />
            </AppWithLayout>
          </PrivateRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
