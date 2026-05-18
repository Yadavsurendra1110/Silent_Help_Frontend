import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { MdSchool, MdAdminPanelSettings } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./Login.css";

function Login() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (role) => {
    setLoading(true);
    try {
      const user = await loginWithGoogle(role);
      console.log(18, user)
      if (!user.isProfileComplete) {
        navigate("/complete-profile", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left — Branding */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-logo">
            <span className="logo-icon">🔒</span>
          </div>
          <h1 className="login-app-name">Silent Help</h1>
          <p className="login-tagline">
            Speak freely, stay anonymous.<br />
            A safe space for every student.
          </p>
        </div>
        <ul className="login-features">
          <li><span>✦</span> Post your problems anonymously</li>
          <li><span>✦</span> Get responses from the administration</li>
          <li><span>✦</span> Your identity is never revealed</li>
          <li><span>✦</span> Verified with your college email</li>
        </ul>
      </div>

      {/* Right — Auth */}
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">Welcome to Silent Help</h2>
          <p className="login-subtitle">
            Sign in with your <strong>official college Google account</strong>
          </p>

          <div className="login-roles">
            <button
              className="login-role-btn"
              onClick={() => handleLogin("student")}
              disabled={loading}
            >
              <MdSchool className="role-icon" />
              <div className="role-info">
                <span className="role-title">Student Login</span>
                <span className="role-desc">I am a college student</span>
              </div>
              <FcGoogle className="google-icon" />
            </button>

            <button
              className="login-role-btn admin"
              onClick={() => handleLogin("admin")}
              disabled={loading}
            >
              <MdAdminPanelSettings className="role-icon" />
              <div className="role-info">
                <span className="role-title">College Head Login</span>
                <span className="role-desc">I am a faculty / administrator</span>
              </div>
              <FcGoogle className="google-icon" />
            </button>
          </div>

          {loading && (
            <div className="login-loading">
              <div className="spinner"></div>
              <span>Signing you in…</span>
            </div>
          )}

          <p className="login-note">
            Only college-issued email accounts are permitted.
            Your identity is protected within the platform.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
