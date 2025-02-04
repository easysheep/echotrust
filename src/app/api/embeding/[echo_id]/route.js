import connectToMongo from "../../../../../dbs/mongodb";
import WallOfTrust from "@/../models/walloftrustCreate"; // Assuming this is your review model
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import logger from "../../../../utils/logger";
export async function POST(request, { params }) {
  await connectToMongo();
  const { echo_id } = params;

  try {
    const { tweetIds, youtubeUrls, instagramUrls, reviews } =
      await request.json();
    logger.info(`POST /embeding/${echo_id} - Received data`, {
      echo_id,
      tweetIds,
      youtubeUrls,
      instagramUrls,
      reviews,
    });

    if (!mongoose.Types.ObjectId.isValid(echo_id)) {
      logger.warn(`POST /embeding/${echo_id} - Invalid Echo ID`);
      return NextResponse.json({ message: "Invalid Echo ID" }, { status: 400 });
    }

    let walloftrust = await WallOfTrust.findOne({ echoId: echo_id });

    if (!walloftrust) {
      walloftrust = new WallOfTrust({
        echoId: echo_id,
        tweetIds: [],
        youtubeUrls: [],
        instagramUrls: [],
        reviews: [],
      });
      logger.info(`POST /embeding/${echo_id} - Created new WallOfTrust`);
    }

    // Update fields while avoiding duplicates
    if (tweetIds)
      walloftrust.tweetIds = [
        ...new Set([...walloftrust.tweetIds, ...tweetIds]),
      ];
    if (youtubeUrls)
      walloftrust.youtubeUrls = [
        ...new Set([...walloftrust.youtubeUrls, ...youtubeUrls]),
      ];
    if (instagramUrls)
      walloftrust.instagramUrls = [
        ...new Set([...walloftrust.instagramUrls, ...instagramUrls]),
      ];
    if (reviews)
      walloftrust.reviews = [...new Set([...walloftrust.reviews, ...reviews])];

    await walloftrust.save();
    logger.info(`POST /embeding/${echo_id} - Embeds updated successfully`);

    return NextResponse.json({
      message: "Embeds updated successfully",
      walloftrust,
    });
  } catch (error) {
    logger.error(`POST /embeding/${echo_id} - Error updating embeds`, {
      error: error.message,
    });
    return NextResponse.json(
      { message: "Failed to update embeds" },
      { status: 500 }
    );
  }
}


export async function DELETE(request, { params }) {
  await connectToMongo();
  const { echo_id } = params;

  try {
    if (!mongoose.Types.ObjectId.isValid(echo_id)) {
      logger.warn(`DELETE /embeding/${echo_id} - Invalid Echo ID`);
      return NextResponse.json({ message: "Invalid Echo ID" }, { status: 400 });
    }

    const walloftrust = await WallOfTrust.findOne({ echoId: echo_id });
    if (!walloftrust) {
      logger.warn(`DELETE /embeding/${echo_id} - Wall of Trust not found`);
      return NextResponse.json(
        { message: "Wall of Trust not found" },
        { status: 404 }
      );
    }

    const { tweetIds, youtubeUrls, instagramUrls } = await request.json();

    if (tweetIds)
      walloftrust.tweetIds = walloftrust.tweetIds.filter(
        (id) => id !== tweetIds
      );
    if (youtubeUrls)
      walloftrust.youtubeUrls = walloftrust.youtubeUrls.filter(
        (url) => url !== youtubeUrls
      );
    if (instagramUrls)
      walloftrust.instagramUrls = walloftrust.instagramUrls.filter(
        (url) => url !== instagramUrls
      );

    await walloftrust.save();
    logger.info(`DELETE /embeding/${echo_id} - Successfully removed embedding`);

    return NextResponse.json(
      { message: "Successfully removed embedding." },
      { status: 200 }
    );
  } catch (error) {
    logger.error(`DELETE /embeding/${echo_id} - Error removing embedding`, {
      error: error.message,
    });
    return NextResponse.json(
      { message: "Failed to remove embedding" },
      { status: 500 }
    );
  }
}
