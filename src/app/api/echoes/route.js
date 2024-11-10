import { NextResponse } from "next/server";
import connectToMongo from "../../../../dbs/mongodb"; // Ensure the path is correct
import Echo from "@/../models/echoCreate"; // MongoDB model for storing the form data

export async function POST(req, res) {
  try {
    // Connect to MongoDB
    await connectToMongo();

    // Parse the JSON body of the request
    const body = await req.json();
    const {
      echo_name,
      echo_title,
      echo_details,
      echo_message,
      sender_name,
      attachment,
      echo_logo,
      user,
    } = body; // Destructure the fields

    // Create a new Echo instance with the data
    const newEcho = new Echo({
      echo_name,
      echo_title,
      echo_details,
      echo_message,
      sender_name,
      attachment,
      user,
      echo_logo,
    });

    // Save the new instance to the database
    await newEcho.save();

    // Respond with success
    return NextResponse.json({ message: "User saved successfully!" });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      { message: "Error saving user data", error: error.message },
      { status: 500 }
    );
  }
}
