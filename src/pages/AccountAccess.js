import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import "./AccountAccess.css"; // Import the CSS

function AccountAccess() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // TODO: Redirect or handle successful login
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // TODO: Redirect or handle successful login
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAppleSignIn = () => {
    // Placeholder for Apple sign-in logic
    alert("Apple sign-in clicked! Implement Apple Auth here.");
  };

  return (
    <div className="accountaccess-container">
      <div className="accountaccess-card">
        {/* Header / Logo */}
        <div className="accountaccess-header">
          <h1>Sign In</h1>
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleEmailSignIn} className="accountaccess-form">
          <label className="accountaccess-label">Email address</label>
          <input
            type="email"
            className="accountaccess-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label className="accountaccess-label">Password</label>
          <input
            type="password"
            className="accountaccess-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && <div className="accountaccess-error">{error}</div>}

          <button type="submit" className="accountaccess-btn-primary">
            Sign In
          </button>
        </form>

        <div className="accountaccess-extra-links">
          <a href="/forgot-password" className="accountaccess-link">
            Forgot password?
          </a>
        </div>

        <hr className="accountaccess-divider" />

        {/* Social Sign-in Buttons */}
        <button onClick={handleGoogleSignIn} className="accountaccess-btn-social">
          Continue with Google
        </button>

        <button onClick={handleAppleSignIn} className="accountaccess-btn-social accountaccess-btn-apple">
          Continue with Apple
        </button>

        <hr className="accountaccess-divider" />

        <div style={{ textAlign: "center" }}>
          Don’t have an account?{" "}
          <a href="/signup" className="accountaccess-link">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default AccountAccess;
