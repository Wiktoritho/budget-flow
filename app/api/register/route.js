"use server";
import { NextResponse } from "next/server";
import { dbUsersConnection } from "../../utils/db";

export async function POST(request) {
  try {
    const data = await request.json();
    const db = await dbUsersConnection();
    const collection = db.collection("credentials");
    const existingUser = await collection.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 400 }
      );
    }
    const result = await collection.insertOne({
      email: data.email,
      password: data.password,
      spendingCategories: [
        "Clothes and Shoes",
        "Entertainment",
        "Equipment",
        "Food",
        "Payments",
        "Subscription",
        "Other spending"
      ],
      incomeCategories: [
        "Work salary",
        "Own business",
        "Refunds",
        "Sales",
        "Services",
        "Other income"
      ]
    });
    return NextResponse.json({
      message: "User registered successfully!",
      id: result.insertedId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
