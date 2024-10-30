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
    const wallOfTrustData = await WallOfTrust.findOne({ echoId: echo_id }).populate("reviews");

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

// export async function POST(req, { params }) {
//   // Ensure the DB is connected
//   await connectToMongo();
//   const { echo_id } = params;
//   console.log("Received echoId on backend:", echo_id);

//   if (!mongoose.Types.ObjectId.isValid(echo_id)) {
//     console.error("Invalid Echo ID:", echo_id);
//     return NextResponse.json({ error: "Invalid Echo ID" }, { status: 400 });
//   }

//   const { reviewId } = await req.json();
//   console.log("Received reviewId on backend:", reviewId);

//   try {
//     // Ensure the echoId is valid
//     if (!mongoose.Types.ObjectId.isValid(echo_id)) {
//       return NextResponse.json({ error: "Invalid Echo ID" }, { status: 400 });
//     }

//     // Check if a WallOfTrust with this echoId exists
//     let wallOfTrust = await WallOfTrust.findOne({ echo_id });

//     if (wallOfTrust) {
//       // If found, update the existing WallOfTrust document by adding the reviewId
//       wallOfTrust = await WallOfTrust.findOneAndUpdate(
//         { echo_id },
//         { $addToSet: { reviews: reviewId } }, // Prevent duplicates
//         { new: true } // Return the updated document
//       );
//     } else {
//       // If not found, create a new WallOfTrust document with the echoId and reviewId
//       wallOfTrust = new WallOfTrust({
//         echoId: echo_id, // Changed to echoId
//         reviews: [reviewId], // Initialize with the provided reviewId
//         embeds: [], // Initialize embeds as empty (or set it based on your needs)
//       });

//       // Save the newly created document
//       await wallOfTrust.save();
//     }

//     // Return the updated or created WallOfTrust document
//     return NextResponse.json(wallOfTrust, { status: 200 });
//   } catch (error) {
//     console.error("Error creating or updating WallOfTrust:", error);
//     return NextResponse.json(
//       { error: "Failed to create or update WallOfTrust" },
//       { status: 500 }
//     );
//   }
// }

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
  const { reviewId, tweetIds = [], youtubeUrls = [], instagramUrls = [] } = await req.json();
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
          youtubeUrls: youtubeUrls.length ? youtubeUrls : wallOfTrust.youtubeUrls, // Update YouTube URLs
          instagramUrls: instagramUrls.length ? instagramUrls : wallOfTrust.instagramUrls, // Update Instagram URLs
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
