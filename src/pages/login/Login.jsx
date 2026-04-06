import React from "react";
import "./Login.css";

function Login() {
  return (
    <div className="container">
      <div className="card">

        {/* LEFT SIDE */}
        <div className="left">
          <h1>Silent Help</h1>
          <p>Speak Freely. Stay Anonymous 🔒</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="right">
          <h2>Welcome Back</h2>
          <p>Use your college email</p>

          <button className="btn">
            Continue with Google
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;