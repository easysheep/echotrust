import connectToMongo from "../../../../../dbs/mongodb";
import WallOfTrust from "@/../models/walloftrustCreate"; // Assuming this is your review model
import { NextResponse } from "next/server";
import mongoose from "mongoose";



export async function POST(request, { params }) {
  await connectToMongo();
  console.log("Incoming request to /api/embeding/:echo_id"); // Log request initiation

  try {
    const { echo_id } = params;
    const { tweetIds, youtubeUrls, instagramUrls, reviews } =
      await request.json(); // Added reviews to the request

    console.log("Received Echo ID:", echo_id);
    console.log("Received tweetIds:", tweetIds);
    console.log("Received youtubeUrls:", youtubeUrls);
    console.log("Received instagramUrls:", instagramUrls);
    console.log("Received reviews:", reviews); // Log received reviews

    if (!mongoose.Types.ObjectId.isValid(echo_id)) {
      console.error("Invalid Echo ID");
      return NextResponse.json({ message: "Invalid Echo ID" }, { status: 400 });
    }

    // Try to find the existing WallOfTrust document
    let walloftrust = await WallOfTrust.findOne({ echoId: echo_id });

    // If it doesn't exist, create a new one
    if (!walloftrust) {
      walloftrust = new WallOfTrust({
        echoId: echo_id,
        tweetIds: [],
        youtubeUrls: [],
        instagramUrls: [],
        reviews: [], // Initialize reviews as an empty array
      });
      console.log("No existing WallOfTrust found, creating a new one.");
    }

    // Check and update the fields
    if (tweetIds) {
      walloftrust.tweetIds = walloftrust.tweetIds
        ? [...new Set([...walloftrust.tweetIds, ...tweetIds])] // Prevent duplicates
        : tweetIds;
    }
    if (youtubeUrls) {
      walloftrust.youtubeUrls = walloftrust.youtubeUrls
        ? [...new Set([...walloftrust.youtubeUrls, ...youtubeUrls])]
        : youtubeUrls;
    }
    if (instagramUrls) {
      walloftrust.instagramUrls = walloftrust.instagramUrls
        ? [...new Set([...walloftrust.instagramUrls, ...instagramUrls])]
        : instagramUrls;
    }
    if (reviews) {
      walloftrust.reviews = walloftrust.reviews
        ? [...new Set([...walloftrust.reviews, ...reviews])] // Prevent duplicates in reviews
        : reviews;
    }

    // Save the updated or newly created document
    await walloftrust.save();
    console.log("WallOfTrust updated or created successfully");

    return NextResponse.json({
      message: "Embeds updated successfully",
      walloftrust,
    });
  } catch (error) {
    console.error("Error updating embeds:", error);
    return NextResponse.json(
      { message: "Failed to update embeds", error },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  await connectToMongo();
  console.log("Incoming request to /api/embeding/:echo_id DELETE"); // Log request initiation
  const { echo_id } = params;

  if (!mongoose.Types.ObjectId.isValid(echo_id)) {
    console.error("Invalid Echo ID");
    return NextResponse.json({ message: "Invalid Echo ID" }, { status: 400 });
  }

  const walloftrust = await WallOfTrust.findOne({ echoId: echo_id });
  if (!walloftrust) {
    console.error("Wall of Trust not found");
    return NextResponse.json(
      { message: "Wall of Trust not found" },
      { status: 404 }
    );
  }

  const { tweetIds, youtubeUrls, instagramUrls } = await request.json();

  if (tweetIds) {
    walloftrust.tweetIds = walloftrust.tweetIds.filter((id) => id !== tweetIds);
  }

  if (youtubeUrls) {
    walloftrust.youtubeUrls = walloftrust.youtubeUrls.filter(
      (url) => url !== youtubeUrls
    );
  }

  if (instagramUrls) {
    walloftrust.instagramUrls = walloftrust.instagramUrls.filter(
      (url) => url !== instagramUrls
    );
  }

  await walloftrust.save(); // Save changes to the database
  console.log("Updated Wall of Trust:", walloftrust);

  return NextResponse.json(
    { message: "Successfully removed embedding." },
    { status: 200 }
  );
}
