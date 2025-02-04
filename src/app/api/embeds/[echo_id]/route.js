import connectToMongo from "../../../../../dbs/mongodb"; // MongoDB connection utility
import EchoEmbeds from "@/../models/echoEmbeds"; // Correct path to EchoEmbeds model
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import logger from "../../../../utils/logger";
export async function GET(req, { params }) {
  const { echo_id } = params; // Get echo_id from params
  await connectToMongo();

  try {
    logger.info(`GET /api/embeds/${echo_id} - Fetching embeds`);
    const embeds = await EchoEmbeds.findOne({ echoId: echo_id });

    if (!embeds) {
      logger.warn(`GET /api/embeds/${echo_id} - No embeds found`);
      return new Response(
        JSON.stringify({ success: false, message: "No embeds found." }),
        { status: 404 }
      );
    }

    logger.info(`GET /api/embeds/${echo_id} - Successfully fetched embeds`);
    return new Response(JSON.stringify({ success: true, data: embeds }), {
      status: 200,
    });
  } catch (error) {
    logger.error(`GET /api/embeds/${echo_id} - Error fetching embeds`, {
      error: error.message,
    });
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

// ✅ POST route with logging
export async function POST(req, { params }) {
  const { echo_id } = params; // Get echo_id from params
  await connectToMongo();

  try {
    const { tweetIds, youtubeUrls, instagramUrls } = await req.json(); // Parse JSON from the request
    logger.info(`POST /api/embeds/${echo_id} - Received data`, {
      tweetIds,
      youtubeUrls,
      instagramUrls,
    });

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

    logger.info(
      `POST /api/embeds/${echo_id} - Embeds updated or created successfully`
    );
    return new Response(JSON.stringify({ success: true, data: embeds }), {
      status: 200,
    });
  } catch (error) {
    logger.error(
      `POST /api/embeds/${echo_id} - Error updating or creating embeds`,
      {
        error: error.message,
      }
    );
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

// ✅ DELETE route with logging
export async function DELETE(req, { params }) {
  const { echo_id } = params; // Get echo_id from params, which is the unique echoId field
  await connectToMongo();

  try {
    const { embedId, embedType } = await req.json(); // Parse JSON from the request body
    logger.info(`DELETE /api/embeds/${echo_id} - Received data`, {
      embedId,
      embedType,
    });

    // Check if embedId and embedType are provided in the request
    if (!embedId || !embedType) {
      logger.warn(
        `DELETE /api/embeds/${echo_id} - Missing embedId or embedType`
      );
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
      logger.warn(
        `DELETE /api/embeds/${echo_id} - Invalid embed type: ${embedType}`
      );
      return new NextResponse(
        JSON.stringify({ success: false, message: "Invalid embed type." }),
        { status: 400 }
      );
    }

    logger.info(
      `DELETE /api/embeds/${echo_id} - Attempting to delete ${embedId} from ${embedType}`
    );

    // Find the document by echoId and remove the specific embedId from the specified array
    const updatedEmbeds = await EchoEmbeds.findOneAndUpdate(
      { echoId: echo_id },
      { $pull: { [embedType]: embedId } }, // Remove the embedId from the specified embedType array
      { new: true } // Return the updated document after the pull operation
    );

    if (!updatedEmbeds) {
      logger.warn(
        `DELETE /api/embeds/${echo_id} - No embeds found with the specified echoId`
      );
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "No embeds found with the specified echoId.",
        }),
        { status: 404 }
      );
    }

    logger.info(
      `DELETE /api/embeds/${echo_id} - Successfully deleted embedId: ${embedId}`
    );
    return new NextResponse(
      JSON.stringify({ success: true, data: updatedEmbeds }),
      { status: 200 }
    );
  } catch (error) {
    logger.error(
      `DELETE /api/embeds/${echo_id} - Error occurred while deleting embed`,
      {
        error: error.message,
      }
    );
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}
