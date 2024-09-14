import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Echo from "@/../models/echoCreate";
import connectToMongo from "../../../../dbs/mongodb";

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectToMongo();

    // Parse JSON data from the request body
    const data = await request.json();

    // Extract fields from the data
    const {
      echo_name,
      echo_title,
      echo_details,
      echo_message,
      sender_name,
      attachment,
      echo_logo,
      add_questions,
      user, // This should be userId (Clerk's ID)
    } = data;

    // Validate data (basic example)
    if (!user || !echo_name || !echo_title || !echo_details || !echo_message || !sender_name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new document in the Echo collection
    const newEcho = new Echo({
      echo_name,
      echo_title,
      echo_details,
      echo_message,
      sender_name,
      attachment,
      echo_logo,
      add_questions,
      user, // Store Clerk userId
    });

    // Save the document to the database
    await newEcho.save();

    // Respond with success
    return NextResponse.json({
      message: "Echo created successfully",
      echo: newEcho,
    });
  } catch (error) {
    console.error("Error creating Echo:", error);
    return NextResponse.json(
      { message: "Failed to create Echo", error: error.message },
      { status: 500 }
    );
  }
}
