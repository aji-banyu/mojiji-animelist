const express = require("express");

const app = express();
const PORT = process.env.PORT || 3003;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "tracker-service",
    message: "Tracker Service is running",
  });
});

app.listen(PORT, () => {
  console.log(`Tracker Service running on http://localhost:${PORT}`);
});
