require("dotenv").config();

const createApp = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  const conn = await connectDB(process.env.MONGO_URI);
  // eslint-disable-next-line no-console
  console.log("Connected to MongoDB");

  const app = createApp();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

