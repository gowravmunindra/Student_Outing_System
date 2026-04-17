const mongoose = require("mongoose");

async function connectDB(mongoUri) {
  if (!mongoUri) {
    throw new Error("MONGO_URI is required");
  }

  mongoose.set("strictQuery", true);
  const conn = await mongoose.connect(mongoUri);
  return conn;
}

module.exports = { connectDB };

