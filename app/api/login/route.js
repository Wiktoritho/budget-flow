"use server";
import { NextResponse } from "next/server";
import { dbUsersConnection } from "../../utils/db";

export async function POST(request) {
  try {
    const data = await request.json();
    const db = await dbUsersConnection();
    const collection = db.collection("credentials");
    const existingUser = await collection.findOne({ email: data.email, password: data.password });

    if (!existingUser) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 400 });
    }
    return NextResponse.json({ message: "Login successful!", userId: existingUser._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
