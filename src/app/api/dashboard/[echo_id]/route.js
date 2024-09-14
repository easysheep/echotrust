// import Echo from "@/../models/echoCreate";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import connectToMongo from "../../../../../dbs/mongodb";


// export async function GET(request, { params }) {
//   try {
//     const { echo_id } = params; // `echo_id` now refers to MongoDB's `_id`
//     await connectToMongo();

//     if (!mongoose.Types.ObjectId.isValid(echo_id)) {
//       return NextResponse.json(
//         { message: "Invalid Echo ID" },
//         { status: 400 }
//       );
//     }

//     // Find the echo using MongoDB's `_id` field
//     const echo = await Echo.findById(echo_id);

//     if (!echo) {
//       return NextResponse.json({ message: "Echo not found" }, { status: 404 });
//     }

//     // Return the reviews array from the Echo document
//     return NextResponse.json({ message: "Echo found", reviews: echo.reviews });
//   } catch (error) {
//     console.error("Error fetching Echo:", error);
//     return NextResponse.json(
//       { message: "Failed to fetch Echo", error },
//       { status: 500 }
//     );
//   }
// }
import connectToMongo from "../../../../../dbs/mongodb";
import Echo from "@/../models/echoCreate";
import Review from "@/../models/reviewCreate";  // Assuming this is your review model
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await connectToMongo();  // Ensure DB connection is established

    const { echo_id } = params;

    if (!mongoose.Types.ObjectId.isValid(echo_id)) {
      return NextResponse.json(
        { message: "Invalid Echo ID" },
        { status: 400 }
      );
    }

    // Fetch the Echo document
    const echo = await Echo.findById(echo_id);

    if (!echo) {
      return NextResponse.json({ message: "Echo not found" }, { status: 404 });
    }

    // Assuming echo.reviews contains an array of review IDs
    const reviewIds = echo.reviews;

    // Fetch the details of the reviews using their IDs
    const reviews = await Review.find({
      _id: { $in: reviewIds }
    });

    return NextResponse.json({ message: "Reviews found", reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews", error },
      { status: 500 }
    );
  }
}
