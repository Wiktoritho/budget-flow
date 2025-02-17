'use server';
import { NextResponse } from 'next/server';
import { dbUsersConnection } from "../../utils/db";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    
    const db = await dbUsersConnection();
    const collection = db.collection("credentials");
    let users
    if (email) {
      users = await collection.find({ email }).toArray();
    } else {
      users = await collection.find({}).toArray();
    }
    
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
