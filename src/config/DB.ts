import mongoose, { connect, ConnectOptions } from "mongoose";
import "dotenv/config";
export const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URL || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("DB is Connected!");
  } catch (err) {
    console.log("DB Error");
    process.exit(1);
  }
};
