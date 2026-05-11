const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 8080;
const DIST_PATH = path.join(__dirname, "dist");

// Serve static frontend assets
app.use(express.static(DIST_PATH));

// Optional health endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// SPA fallback
app.use((_req, res) => {
  res.sendFile(path.join(DIST_PATH, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Frontend server listening on port ${PORT}`);
});