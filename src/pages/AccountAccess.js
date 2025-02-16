import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import "./AccountAccess.css";

// Function to fetch the custom token from Firebase Function
// https://api-3g5u5d4ixa-uc.a.run.app/mintCustomToken
const fetchCustomToken = async (idToken) => {
  const response = await fetch(
    "https://us-central1-mindwell-world.cloudfunctions.net/api/mintCustomToken",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );

  const data = await response.json();
  return data.customToken;
};

function AccountAccess() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // Store redirect URL from query params (default to "/" if none)
  const [redirectUrl, setRedirectUrl] = useState("/");

  // On mount, parse the ?redirect= param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get("redirect");
    console.log("Debug: redirectParam =", redirectParam); // <-- Add this
    if (redirectParam) {
      setRedirectUrl(redirectParam);
    }
  }, []);

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    setError("");
  };

  /**
   * Helper function: Given a Firebase user object, get custom token,
   * build final redirect URL, and redirect the user.
   */
  const redirectWithCustomToken = async (user) => {
    // 1) Get the standard Firebase ID token
    const idToken = await user.getIdToken(true);

    // 2) Exchange for your custom token
    const customToken = await fetchCustomToken(idToken);

    // 3) Create final URL and add the new query params
    const urlObj = new URL(redirectUrl, window.location.origin);
    urlObj.searchParams.delete("token");
    urlObj.searchParams.delete("uid");
    urlObj.searchParams.append("token", customToken);
    urlObj.searchParams.append("uid", user.uid);

    console.log("Redirecting to:", urlObj.toString());
    window.location.href = urlObj.toString();
  };

  /**
   * Handle Form Submission (Email/Password Sign In or Sign Up)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      // If successful, redirect with custom token
      await redirectWithCustomToken(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Handle Google Sign-In
   */
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await redirectWithCustomToken(result.user);
    } catch (err) {
      console.error("Error during Google Sign-In:", err);
      setError(err.message);
    }
  };

  /**
   * Handle Apple Sign-In (Web popup approach with Firebase)
   */
  const handleAppleSignIn = async () => {
    try {
      // The provider for Apple is "apple.com"
      // Make sure you have Apple provider enabled in your Firebase Console
      const provider = new OAuthProvider("apple.com");
      // You can optionally add scopes here. E.g.: provider.addScope('email');

      const result = await signInWithPopup(auth, provider);
      await redirectWithCustomToken(result.user);
    } catch (err) {
      console.error("Error during Apple Sign-In:", err);
      setError(err.message);
    }
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

        {/* Conditionally show "Forgot password?" link */}
        {!isSignUp && (
          <div className="accountaccess-extra-links">
            <a href="/forgot-password" className="accountaccess-link">
              Forgot password?
            </a>
          </div>
        )}

        <hr className="accountaccess-divider" />

        {/* Social Sign-in Buttons */}
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
              <span
                onClick={toggleMode}
                className="accountaccess-link"
                style={{ cursor: "pointer" }}
              >
                Sign In
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                onClick={toggleMode}
                className="accountaccess-link"
                style={{ cursor: "pointer" }}
              >
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
