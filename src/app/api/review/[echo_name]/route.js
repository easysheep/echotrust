import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Echo from "@/../models/echoCreate"; // Adjust the path as necessary
import Review from "@/../models/reviewCreate";
import connectToMongo from "../../../../../dbs/mongodb";

export async function GET(request, { params }) {
  try {
    await connectToMongo();
    const { echo_name } = params;
    if (!echo_name) {
      return NextResponse.json(
        { message: "Echo name is required" },
        { status: 400 }
      );
    }
    const echo = await Echo.findOne({ echo_name });
    if (!echo) {
      return NextResponse.json({ message: "Echo not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Echo found", echo });
  } catch (error) {
    console.error("Error fetching Echo:", error);
    return NextResponse.json(
      { message: "Failed to fetch Echo", error },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    await connectToMongo();
    const { stars, note, username, useremail, userimageurl } = await req.json();

    // Validate input fields
    if (!stars || !note || !username || !useremail || !userimageurl) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    // Find the echo by echo_name in the database
    const echo = await Echo.findOne({ echo_name: params.echo_name });

    if (!echo) {
      return new Response(
        JSON.stringify({ error: "Echo not found" }),
        { status: 404 }
      );
    }

    // Create a new review
    const newReview = new Review({
      stars,
      note,
      echo: echo._id,  // Reference the echo by its ID
      createdAt: new Date(),
      username,       // Save username
      useremail,      // Save user email
      userimageurl,   // Save user image URL
    });

    // Save the review in the database
    const savedReview = await newReview.save();

    // Add the review ID to the reviews array in the Echo document
    echo.reviews.push(savedReview._id);

    // Save the updated Echo document
    await echo.save();

    return new Response(
      JSON.stringify({ message: "Review added successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding review:", error);
    return new Response(JSON.stringify({ error: "Failed to add review" }), {
      status: 500,
    });
  }
}
