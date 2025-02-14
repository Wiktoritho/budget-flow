"use server";
import { NextResponse } from "next/server";

import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_PASS);

export async function GET() {
  try {
    await client.connect();
    const db = client.db("users");
    const collection = db.collection("credentials");
    const users = await collection.find({}).toArray();
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
