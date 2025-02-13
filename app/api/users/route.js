import { connectToDatabase } from "../../utils/db";
import users from "../../models/User"
import { NextResponse } from "next/server";

export async function GET(req, res) {    
    await connectToDatabase();
    const userss = await users.find({});
    return NextResponse.json(userss);
}

export async function POST(req, res) {
  await connectToDatabase();
  const newUser = await users.create(req.body);
  return NextResponse.json(newUser, { status: 201 });
}