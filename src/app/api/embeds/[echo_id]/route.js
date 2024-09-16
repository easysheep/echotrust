import connectToMongo from "../../../../../dbs/mongodb"; // Your MongoDB connection utility
import EchoEmbeds from "@/../models/echoEmbeds"; // Corrected import path (if necessary)
import mongoose from "mongoose";
import { NextResponse } from "next/server"; // Ensures consistent response format

export async function POST(req, { params }) {
  try {
    // Ensure DB connection is established
    await connectToMongo();

    const { echo_id } = params;

    // Validate the echo_id
    if (!mongoose.Types.ObjectId.isValid(echo_id)) {
      return NextResponse.json(
        { message: "Invalid Echo ID" },
        { status: 400 }
      );
    }

    const { tweetIds, youtubeUrls, instagramUrls } = await req.json(); // Fetch data from the request body

    // Find the echo record or create a new one if it doesn't exist
    let echoEmbed = await EchoEmbeds.findOne({ echoId: echo_id });

    if (!echoEmbed) {
      echoEmbed = new EchoEmbeds({
        echoId: echo_id,
        tweetIds: [],
        youtubeUrls: [],
        instagramUrls: []
      });
    }

    // Add new embed data (spread operator ensures appending)
    if (tweetIds && tweetIds.length > 0) {
      echoEmbed.tweetIds = [...echoEmbed.tweetIds, ...tweetIds];
    }
    if (youtubeUrls && youtubeUrls.length > 0) {
      echoEmbed.youtubeUrls = [...echoEmbed.youtubeUrls, ...youtubeUrls];
    }
    if (instagramUrls && instagramUrls.length > 0) {
      echoEmbed.instagramUrls = [...echoEmbed.instagramUrls, ...instagramUrls];
    }

    // Save the updated document in the database
    await echoEmbed.save();

    return NextResponse.json({ success: true, data: echoEmbed });
  } catch (error) {
    console.error("Error saving embed data:", error);
    return NextResponse.json(
      { success: false, message: "Error saving embed data", error },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
