import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import "./SignIn.css"; // Import the CSS

function SignIn() {
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
    <div className="signin-container">
      <div className="signin-card">
        {/* Header / Logo */}
        <div className="signin-header">
          <h1>Mindwell World</h1>
        </div>

        <h2 className="signin-title">Sign in to your account</h2>

        {/* Email / Password Form */}
        <form onSubmit={handleEmailSignIn} className="signin-form">
          <label className="signin-label">Email address</label>
          <input
            type="email"
            className="signin-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label className="signin-label">Password</label>
          <input
            type="password"
            className="signin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && <div className="signin-error">{error}</div>}

          <button type="submit" className="signin-btn-primary">
            Sign In
          </button>
        </form>

        <div className="signin-extra-links">
          <a href="/forgot-password" className="signin-link">
            Forgot password?
          </a>
        </div>

        <hr className="signin-divider" />

        {/* Social Sign-in Buttons */}
        <button onClick={handleGoogleSignIn} className="signin-btn-social">
          Continue with Google
        </button>

        <button onClick={handleAppleSignIn} className="signin-btn-social signin-btn-apple">
          Continue with Apple
        </button>

        <hr className="signin-divider" />

        <div style={{ textAlign: "center" }}>
          Don’t have an account?{" "}
          <a href="/signup" className="signin-link">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
