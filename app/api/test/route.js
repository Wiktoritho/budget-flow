"use server";
import { NextResponse } from "next/server";

import { MongoClient } from "mongodb";

const client = new MongoClient('mongodb+srv://wiktorgola95:zCNkn2xi6yiGKPNx@budgetflowcluster.rwjym.mongodb.net/?retryWrites=true&w=majority&appName=BudgetFlowCluster');

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
