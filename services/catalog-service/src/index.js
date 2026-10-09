const express = require("express");

const app = express();
const PORT = process.env.PORT || 3002;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "catalog-service",
    message: "Catalog Service is running",
  });
});

app.listen(PORT, () => {
  console.log(`Catalog Service running on http://localhost:${PORT}`);
});
