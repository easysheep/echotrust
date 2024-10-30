import connectToMongo from "../../../../../dbs/mongodb"; // MongoDB connection utility
import EchoEmbeds from "@/../models/echoEmbeds"; // Correct path to EchoEmbeds model
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { echo_id } = params; // Get echo_id from params
  await connectToMongo();

  try {
    const embeds = await EchoEmbeds.findOne({ echoId: echo_id });
    if (!embeds) {
      return new Response(
        JSON.stringify({ success: false, message: "No embeds found." }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify({ success: true, data: embeds }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  const { echo_id } = params; // Get echo_id from params
  await connectToMongo();

  try {
    const { tweetIds, youtubeUrls, instagramUrls } = await req.json(); // Parse JSON from the request
    const embeds = await EchoEmbeds.findOneAndUpdate(
      { echoId: echo_id },
      {
        $addToSet: {
          tweetIds: { $each: tweetIds || [] },
          youtubeUrls: { $each: youtubeUrls || [] },
          instagramUrls: { $each: instagramUrls || [] },
        },
      },
      { new: true, upsert: true }
    );
    return new Response(JSON.stringify({ success: true, data: embeds }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
