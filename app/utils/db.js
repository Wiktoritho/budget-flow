"use server";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_PASS);

async function connectToDatabase() {
  try {
    await client.connect();
  } catch (error) {
    console.log(error);
  }
}

connectToDatabase();

export async function dbUsersConnection() {
  const db = client.db("users");
  return db;
}

export async function closeConnection() {
  try {
    await client.close();
  } catch (error) {
    console.error(error);
  }
}
