import connectToMongo from "../../../../../dbs/mongodb";
import WallOfTrust from "@/../models/walloftrustCreate"; // Assuming this is your review model
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request, { params }) {
  await connectToMongo();
  console.log("Incoming request to /api/embeding/:echo_id"); // Log request initiation
  try {
    const { echo_id } = params;
    const { tweetIds, youtubeUrls, instagramUrls } = await request.json();

    console.log("Received Echo ID:", echo_id);
    console.log("Received tweetIds:", tweetIds);
    console.log("Received youtubeUrls:", youtubeUrls);
    console.log("Received instagramUrls:", instagramUrls);

    if (!mongoose.Types.ObjectId.isValid(echo_id)) {
      console.error("Invalid Echo ID");
      return NextResponse.json({ message: "Invalid Echo ID" }, { status: 400 });
    }

    const walloftrust = await WallOfTrust.findOne({ echoId: echo_id }); // Change this line
    if (!walloftrust) {
      console.error("WallOfTrust not found");
      return NextResponse.json(
        { message: "WallOfTrust not found" },
        { status: 404 }
      );
    }

    // Check and update the fields
    if (tweetIds) {
      walloftrust.tweetIds = walloftrust.tweetIds
        ? [...walloftrust.tweetIds, ...tweetIds]
        : tweetIds;
    }
    if (youtubeUrls) {
      walloftrust.youtubeUrls = walloftrust.youtubeUrls
        ? [...walloftrust.youtubeUrls, ...youtubeUrls]
        : youtubeUrls;
    }
    if (instagramUrls) {
      walloftrust.instagramUrls = walloftrust.instagramUrls
        ? [...walloftrust.instagramUrls, ...instagramUrls]
        : instagramUrls;
    }

    // Save the updated document
    await walloftrust.save();
    console.log("WallOfTrust updated successfully");

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
