import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import "./AccountAccess.css";


// Function to fetch the custom token from Firebase Function
// https://api-3g5u5d4ixa-uc.a.run.app/mintCustomToken
const fetchCustomToken = async (idToken) => {
  const response = await fetch("https://us-central1-mindwell-world.cloudfunctions.net/api/mintCustomToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  const data = await response.json();
  return data.customToken;
};


function AccountAccess() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // We'll store the redirect URL from query params (default to / if none)
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

  // Handle form submission (Sign In or Sign Up)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      let userCredential;
      
      if (isSignUp) {
        // CREATE ACCOUNT
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // SIGN IN
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
  
      // Generate Firebase ID token
      const idToken = await userCredential.user.getIdToken(true);
      console.log("idToken", idToken);

      // Fetch Custom Token from Firebase Function
      const customToken = await fetchCustomToken(idToken);
      console.log("customToken", customToken);

      // Construct the Redirect URL
      const urlObj = new URL(redirectUrl, window.location.origin);
      urlObj.searchParams.delete("token"); // Remove any existing token param
      urlObj.searchParams.append("token", customToken); // Append the new token
  
      // Redirect the user
      console.log("Redirecting to:", urlObj.toString());
      window.location.href = urlObj.toString();
  
    } catch (err) {
      setError(err.message);
    }
  };
  

  // Social sign-ins (same for both modes)
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(true);
  
      // Fetch Custom Token from Firebase Function
      const customToken = await fetchCustomToken(idToken);
  
      // Construct Redirect URL
      const urlObj = new URL(redirectUrl, window.location.origin);
      urlObj.searchParams.delete("token"); // Remove existing token param
      urlObj.searchParams.append("token", customToken); // Append new token
  
      // Redirect
      console.log("Redirecting to:", urlObj.toString());
      window.location.href = urlObj.toString();
  
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
