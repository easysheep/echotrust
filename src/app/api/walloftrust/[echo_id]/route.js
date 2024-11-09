import { NextResponse } from "next/server";
import connectToMongo from "../../../../../dbs/mongodb"; // Function to connect to MongoDB
import WallOfTrust from "@/../models/walloftrustCreate"; // Function to
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await connectToMongo(); // Ensure DB connection is established

    const { echo_id } = params;

    // Since echoId is stored as a string in your schema, there's no need for ObjectId validation
    if (!echo_id) {
      return NextResponse.json({ message: "Invalid Echo ID" }, { status: 400 });
    }

    // Fetch WallOfTrust document with populated 'reviews' references
    const wallOfTrustData = await WallOfTrust.findOne({
      echoId: echo_id,
    }).populate("reviews");

    if (!wallOfTrustData) {
      return NextResponse.json(
        { message: "WallOfTrust not found" },
        { status: 404 }
      );
    }

    // Log the full document with populated reviews
    console.log("Full WallOfTrust Data: ", wallOfTrustData);
    console.log("Reviews: ", wallOfTrustData.reviews); // Log reviews

    return NextResponse.json({
      message: "WallOfTrust data found",
      tweetIds: wallOfTrustData.tweetIds,
      youtubeUrls: wallOfTrustData.youtubeUrls,
      instagramUrls: wallOfTrustData.instagramUrls,
      reviews: wallOfTrustData.reviews,
    });
  } catch (error) {
    console.error("Error fetching WallOfTrust data:", error);
    return NextResponse.json(
      { message: "Failed to fetch WallOfTrust data", error },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  // Ensure the DB is connected
  await connectToMongo();

  const { echo_id } = params; // Extract the echo_id from the URL params
  console.log("Received echoId on backend:", echo_id);

  // Validate echoId
  if (!mongoose.Types.ObjectId.isValid(echo_id)) {
    console.error("Invalid Echo ID:", echo_id);
    return NextResponse.json({ error: "Invalid Echo ID" }, { status: 400 });
  }

  // Extract the reviewId and other fields from the request body
  const {
    reviewId,
    tweetIds = [],
    youtubeUrls = [],
    instagramUrls = [],
  } = await req.json();
  console.log("Received reviewId on backend:", reviewId);

  try {
    // Search for an existing WallOfTrust document with the given echoId
    let wallOfTrust = await WallOfTrust.findOne({ echoId: echo_id });
    console.log("Found WallOfTrust:", wallOfTrust);

    if (wallOfTrust) {
      // If found, update the WallOfTrust document by adding the reviewId and keeping other fields intact
      wallOfTrust = await WallOfTrust.findOneAndUpdate(
        { echoId: echo_id }, // Search by echoId
        {
          $addToSet: { reviews: reviewId }, // Add reviewId if not already present
          tweetIds: tweetIds.length ? tweetIds : wallOfTrust.tweetIds, // Update tweetIds if provided
          youtubeUrls: youtubeUrls.length
            ? youtubeUrls
            : wallOfTrust.youtubeUrls, // Update YouTube URLs
          instagramUrls: instagramUrls.length
            ? instagramUrls
            : wallOfTrust.instagramUrls, // Update Instagram URLs
        },
        { new: true } // Return the updated document
      );
      console.log("Updated WallOfTrust:", wallOfTrust);
    } else {
      // If no existing WallOfTrust document, create a new one with the provided fields
      wallOfTrust = new WallOfTrust({
        echoId: echo_id, // Save the custom echoId
        reviews: [reviewId], // Initialize with the provided reviewId
        tweetIds, // Initialize tweetIds
        youtubeUrls, // Initialize YouTube URLs
        instagramUrls, // Initialize Instagram URLs
      });

      // Save the new WallOfTrust document
      await wallOfTrust.save();
      console.log("Created new WallOfTrust:", wallOfTrust);
    }

    // Return the updated or created WallOfTrust document
    return NextResponse.json(wallOfTrust, { status: 200 });
  } catch (error) {
    console.error("Error creating or updating WallOfTrust:", error);
    return NextResponse.json(
      { error: "Failed to create or update WallOfTrust" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { echo_id } = params; // Use `echo_id` from URL params
  const { embedType, embedValue } = await request.json(); // Extract `embedType` and `embedValue` from the request body

  console.log("Received embedType:", embedType); // Log embedType
  console.log("Received embedValue:", embedValue); // Log embedValue
  console.log("Received echo_id:", echo_id); // Log echo_id for debugging

  try {
      await connectToMongo(); // Connect to MongoDB

      // Validate echo_id format
      if (!mongoose.Types.ObjectId.isValid(echo_id)) {
          return NextResponse.json({ message: "Invalid Echo ID" }, { status: 400 });
      }

      // Define the field to update based on embedType
      const fieldToUpdate = {
          tweet: "tweetIds",
          youtube: "youtubeUrls",
          instagram: "instagramUrls",
          review: "reviews" // Assuming `reviews` is the correct field for `review`
      }[embedType];

      if (!fieldToUpdate) {
          console.error("Invalid embed type:", embedType);
          return NextResponse.json({ message: "Invalid embed type" }, { status: 400 });
      }

      // Update the WallOfTrust document by removing the specified embedValue
      const result = await WallOfTrust.findOneAndUpdate(
          { echoId: echo_id }, // Query by echoId field in the document
          { $pull: { [fieldToUpdate]: embedValue } }, // Remove embedValue from the specified field
          { new: true } // Return updated document
      );

      if (!result) {
          console.error("WallOfTrust document not found for echo_id:", echo_id);
          return NextResponse.json({ message: "WallOfTrust document not found" }, { status: 404 });
      }

      return NextResponse.json({ message: "Embed deleted successfully", data: result });
  } catch (error) {
      console.error("Error deleting embed:", error);
      return NextResponse.json({ message: "Failed to delete embed", error }, { status: 500 });
  }
}
