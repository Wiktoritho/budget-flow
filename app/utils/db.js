'use server';
import mongoose from "mongoose";

const mongodb_uri = process.env.MONGODB_PASS;

global.mongoose = global.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (global.mongoose.conn) {
    console.log("Using existing database connection");
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    console.log("Creating new database connection");
    
    global.mongoose.promise = mongoose.connect(mongodb_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => mongoose)
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        throw err;
      });
  }

  global.mongoose.conn = await global.mongoose.promise;
  console.log("Database connected successfully");
  
  return global.mongoose.conn;
}