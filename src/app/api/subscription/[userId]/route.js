import Subscription from "@/../models/Subscription"; // Correct path to your Subscription model
import { NextResponse } from "next/server";
import logger from "../../../../utils/logger";

export async function POST(req) {
  try {
    logger.info('Subscription Update - Started');
    // Parse JSON from the request
    const { userId, plan } = await req.json();

    // Map plans to echo limits
    const echoLimits = {
      free: 10,
      pro: 50,
      premium: 10000,
    };

    const echoLimit = echoLimits[plan];
    if (echoLimit === undefined) {
      logger.warn('Invalid plan specified');
      return NextResponse.json(
        { message: "Invalid plan specified" },
        { status: 400 }
      );
    }

    // Update or create the subscription in the database
    let subscription = await Subscription.findOne({ user: userId });

    if (subscription) {
      // Update existing subscription
      logger.info(`Updating subscription for userId: ${userId}`);
      subscription.plan = plan;
      subscription.echoLimit = echoLimit;
      await subscription.save();
    } else {
      // Create a new subscription
      logger.info(`Creating new subscription for userId: ${userId}`);
      subscription = await Subscription.create({
        user: userId,
        plan,
        echoLimit,
      });
    }

    logger.info('Subscription updated successfully');
    // Return success response
    return NextResponse.json({
      message: "Subscription updated successfully",
      subscription,
    });
  } catch (error) {
    logger.error(`Error updating subscription: ${error.message}`);
    // Return error response
    return NextResponse.json(
      { message: "Failed to update subscription", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    logger.info('Fetching Subscription - Started');
    // Extract the userId from the URL path params
    const { userId } = params;

    if (!userId) {
      logger.warn('User ID is missing');
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the subscription by userId
    const subscription = await Subscription.findOne({ user: userId });

    if (!subscription) {
      logger.warn(`Subscription not found for userId: ${userId}`);
      return NextResponse.json(
        { message: "Subscription not found for this user" },
        { status: 404 }
      );
    }

    logger.info(`Subscription found for userId: ${userId}`);
    // Return subscription details
    return NextResponse.json({
      plan: subscription.plan,
      echoLimit: subscription.echoLimit,
    });
  } catch (error) {
    logger.error(`Error fetching subscription: ${error.message}`);
    return NextResponse.json(
      { message: "Failed to fetch subscription", error: error.message },
      { status: 500 }
    );
  }
}
