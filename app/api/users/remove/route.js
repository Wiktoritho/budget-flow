"use server";
import { NextResponse } from "next/server";
import { dbUsersConnection } from "../../../utils/db";

export async function POST(request) {
  try {
    const { email, transactionId } = await request.json();

    const db = await dbUsersConnection();
    const collection = db.collection("credentials");

    const existingUser = await collection.findOne({ email });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    const result = await collection.updateOne(
      { email },
      { $pull: { spending: {id: transactionId} } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Failed to remove transaction" }, { status: 500 });
    }

    const updatedUser = await collection.findOne({ email });
    return NextResponse.json({ message: "Transaction removed", data: updatedUser });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
