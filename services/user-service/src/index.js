
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3001;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "user-service",
    message: "User Service is running",
  });
});

app.listen(PORT, () => {
  console.log(`User Service running on http://localhost:${PORT}`);
});