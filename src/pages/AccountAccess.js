import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import "./AccountAccess.css";

function AccountAccess() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // We'll store the redirect URL from query params (default to / if none)
  const [redirectUrl, setRedirectUrl] = useState("/");

  // Toggle between Sign In and Sign Up modes
  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    setError("");
  };

  // Handle form submission (Sign In or Sign Up)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        // CREATE ACCOUNT
        await createUserWithEmailAndPassword(auth, email, password);
        // TODO: Redirect or handle success (e.g., navigate to dashboard)
      } else {
        // SIGN IN
        await signInWithEmailAndPassword(auth, email, password);
        // TODO: Redirect or handle success
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Social sign-ins (same for both modes)
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // TODO: Redirect or handle success
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
          <h1>{isSignUp ? "Create An Account" : "Sign In"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="accountaccess-form">
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
            {isSignUp ? "Create" : "Sign In"}
          </button>
        </form>

        {/* You could hide this link if in Sign Up mode, or keep it */}
        {!isSignUp && (
          <div className="accountaccess-extra-links">
            <a href="/forgot-password" className="accountaccess-link">
              Forgot password?
            </a>
          </div>
        )}

        <hr className="accountaccess-divider" />

        {/* Social Sign-in Buttons (same for both modes) */}
        <button onClick={handleGoogleSignIn} className="accountaccess-btn-social">
          Continue with Google
        </button>

        <button
          onClick={handleAppleSignIn}
          className="accountaccess-btn-social accountaccess-btn-apple"
        >
          Continue with Apple
        </button>

        <hr className="accountaccess-divider" />

        <div style={{ textAlign: "center" }}>
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <span onClick={toggleMode} className="accountaccess-link" style={{ cursor: "pointer" }}>
                Sign In
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span onClick={toggleMode} className="accountaccess-link" style={{ cursor: "pointer" }}>
                Sign Up
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountAccess;
