require("dotenv").config();

const { connectDB } = require("../config/db");
const User = require("../models/User");

// ─── Demo warden credentials (shown publicly on the login page) ───────────────
const DEMO_WARDEN = {
  name: "Demo Warden",
  email: "warden@demo.com",
  password: "Demo@1234",
};
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  await connectDB(process.env.MONGO_URI);

  const existing = await User.findOne({ email: DEMO_WARDEN.email });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log("✅  Demo warden already exists:", existing.email);
    process.exit(0);
    return;
  }

  const user = await User.create({ ...DEMO_WARDEN, role: "warden" });
  // eslint-disable-next-line no-console
  console.log("✅  Demo warden seeded:", user.email);
  process.exit(0);
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});

