import "./env.js";       // ← must be first: loads dotenv before any other module reads process.env
import app from "./app.js";
import connectDB from "./config/db.js";


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
