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


export async function DELETE(req, { params }) {
  const { echo_id } = params; // Get echo_id from params, which is the unique echoId field
  await connectToMongo();

  try {
    const { embedId, embedType } = await req.json(); // Parse JSON from the request body

    console.log("Received DELETE request for echoId:", echo_id);
    console.log("Request body parameters - embedId:", embedId, ", embedType:", embedType);

    // Check if embedId and embedType are provided in the request
    if (!embedId || !embedType) {
      console.log("Missing embedId or embedType in the request body.");
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "embedId and embedType are required in the request body.",
        }),
        { status: 400 }
      );
    }

    // Validate that embedType is one of the expected values
    const validTypes = ["tweetIds", "youtubeUrls", "instagramUrls"];
    if (!validTypes.includes(embedType)) {
      console.log("Invalid embed type provided:", embedType);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Invalid embed type." }),
        { status: 400 }
      );
    }

    console.log(`Attempting to delete ${embedId} from ${embedType} array for echoId ${echo_id}`);

    // Find the document by echoId and remove the specific embedId from the specified array
    const updatedEmbeds = await EchoEmbeds.findOneAndUpdate(
      { echoId: echo_id },
      { $pull: { [embedType]: embedId } }, // Remove the embedId from the specified embedType array
      { new: true } // Return the updated document after the pull operation
    );

    if (!updatedEmbeds) {
      console.log("No embeds found with the specified echoId:", echo_id);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "No embeds found with the specified echoId.",
        }),
        { status: 404 }
      );
    }

    console.log("Successfully deleted embedId:", embedId, "from", embedType);
    console.log("Updated document:", updatedEmbeds);

    return new NextResponse(
      JSON.stringify({ success: true, data: updatedEmbeds }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error occurred while deleting embed:", error.message);
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}