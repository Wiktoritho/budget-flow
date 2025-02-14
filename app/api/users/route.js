'use server';
import { NextResponse } from 'next/server';
import { dbUsersConnection } from "../../utils/db";

export async function GET() {
  try {
    const db = await dbUsersConnection();
    const collection = db.collection("credentials");
    const users = await collection.find({}).toArray();
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
