import app from "./app.ts";
import { PORT } from "./utils/config.ts";
import { connectToDatabase } from "./utils/db.ts";

const connectToDB = async () => {
  try {
    await connectToDatabase();
    // eslint-disable-next-line no-console
    console.log("Connected to database");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error connecting to database:", error);
  }
};

connectToDB();
app.listen(PORT);
// eslint-disable-next-line no-console
console.log(`Server is running on port ${PORT}`);