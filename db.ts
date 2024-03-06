import mongoose from "mongoose";

export default async function db() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
