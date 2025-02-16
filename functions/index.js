const functions = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Mint a Custom Token for Cross-Domain Auth
app.post("/mintCustomToken", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: "Missing idToken" });
    }

    // Verify ID token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    // Mint a custom token
    const customToken = await admin.auth().createCustomToken(uid);

    return res.json({ customToken });
  } catch (err) {
    console.error("Error minting custom token:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Deploy Express as a Firebase Function 
exports.api = functions.onRequest(app);
