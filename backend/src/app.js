const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const studentIdRoutes = require("./routes/studentIdRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();
  const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        // Allow non-browser clients (no Origin header)
        if (!origin) return callback(null, true);

        // Allow explicit origins from env (comma-separated)
        if (allowedOrigins.includes(origin)) return callback(null, true);

        // Allow Vite localhost dev ports like 5173, 5174, etc.
        if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
        if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return callback(null, true);

        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/api/health", (req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRoutes);
  app.use("/api/requests", requestRoutes);
  app.use("/api/student-id", studentIdRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;

