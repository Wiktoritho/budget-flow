"use server";
import { NextResponse } from "next/server";
import { dbUsersConnection } from "../../../utils/db";

export async function POST(request) {
  try {
    const { email, transactionData, type, newName, newEmail } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const db = await dbUsersConnection();
    const collection = db.collection("credentials");
    const existingUser = await collection.findOne({ email });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    let updateFields = {};

    if (newName) {
      updateFields.name = newName;
    }

    if (newEmail && newEmail !== email) {
      const emailExists = await collection.findOne({ email: newEmail });
      if (emailExists) {
        return NextResponse.json({ message: "New email already in use" }, { status: 400 });
      }
      updateFields.email = newEmail;
    }

    if (transactionData && typeof transactionData === "object") {
      const updateField = type === "income" ? "income" : "spending";
      updateFields.$push = { [updateField]: transactionData };
    }

    if (Object.keys(updateFields).length > 0) {
      const result = await collection.updateOne({ email }, { $set: updateFields });

      if (result.modifiedCount === 0) {
        return NextResponse.json({ message: "Update failed" }, { status: 500 });
      }
    }

    const updatedUser = await collection.findOne({ email: newEmail || email });

    return NextResponse.json({ message: "Data Updated", data: updatedUser });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
