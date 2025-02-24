"use server";
import { NextResponse } from "next/server";
import { dbUsersConnection } from "../../../utils/db";

export async function POST(request) {
  try {
    const { email, transactionData, type } = await request.json();

    if (!email || !transactionData || typeof transactionData !== "object") {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const db = await dbUsersConnection();
    const collection = db.collection("credentials");

    const existingUser = await collection.findOne({ email });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

      const updateField = type === "income" ? "income" : "spending";
      
      console.log(transactionData.id);
      

    const existingTransaction = existingUser[updateField]?.find((t) => t.id === transactionData.id);

    if (!existingTransaction) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    const result = await collection.updateOne({ email, [`${updateField}.id`]: transactionData.id }, { $set: { [`${updateField}.$`]: transactionData } });

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "Update failed" }, { status: 500 });
    }

    const updatedUser = await collection.findOne({ email });
    return NextResponse.json({ message: "Data Updated", data: updatedUser });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
