require("dotenv").config();

const { connectDB } = require("../config/db");
const User = require("../models/User");

async function seed() {
  await connectDB(process.env.MONGO_URI);

  const name = process.env.WARDEN_NAME || "Warden";
  const email = (process.env.WARDEN_EMAIL || "").toLowerCase();
  const password = process.env.WARDEN_PASSWORD || "";

  if (!email || !password) {
    throw new Error("WARDEN_EMAIL and WARDEN_PASSWORD are required to seed");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log("Warden already exists:", existing.email);
    return;
  }

  const user = await User.create({ name, email, password, role: "warden" });
  // eslint-disable-next-line no-console
  console.log("Seeded warden:", user.email);
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

