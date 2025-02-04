import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Echo from "@/../models/echoCreate"; // Adjust the path as necessary
import Review from "@/../models/reviewCreate";
import connectToMongo from "../../../../../dbs/mongodb";
import logger from "../../../../utils/logger";

export async function GET(request, { params }) {
  try {
    logger.info('Fetching Echo - Started');
    await connectToMongo();
    const { echo_name } = params;
    if (!echo_name) {
      logger.warn('Echo name is missing');
      return NextResponse.json(
        { message: "Echo name is required" },
        { status: 400 }
      );
    }

    logger.info(`Fetching Echo with echo_name: ${echo_name}`);
    const echo = await Echo.findOne({ echo_name });
    if (!echo) {
      logger.warn(`Echo not found for echo_name: ${echo_name}`);
      return NextResponse.json({ message: "Echo not found" }, { status: 404 });
    }

    logger.info(`Echo found: ${JSON.stringify(echo)}`);
    return NextResponse.json({ message: "Echo found", echo });
  } catch (error) {
    logger.error(`Error fetching Echo: ${error.message}`);
    return NextResponse.json(
      { message: "Failed to fetch Echo", error },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    logger.info('Adding Review - Started');
    await connectToMongo();
    const { stars, note, username, useremail, userimageurl } = await req.json();

    // Validate input fields
    if (!stars || !note || !username || !useremail || !userimageurl) {
      logger.warn('Validation failed - Missing fields');
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    logger.info(`Received review for echo_name: ${params.echo_name}`);
    // Find the echo by echo_name in the database
    const echo = await Echo.findOne({ echo_name: params.echo_name });

    if (!echo) {
      logger.warn(`Echo not found for echo_name: ${params.echo_name}`);
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

    logger.info('Saving new review');
    // Save the review in the database
    const savedReview = await newReview.save();

    // Add the review ID to the reviews array in the Echo document
    echo.reviews.push(savedReview._id);

    // Save the updated Echo document
    await echo.save();
    logger.info('Review added successfully');

    return new Response(
      JSON.stringify({ message: "Review added successfully" }),
      { status: 201 }
    );
  } catch (error) {
    logger.error(`Error adding review: ${error.message}`);
    return new Response(JSON.stringify({ error: "Failed to add review" }), {
      status: 500,
    });
  }
}
