import mongoose, { Schema } from "mongoose";

// Schema Definition for WallOfTrust
const WallOfTrustSchema = new Schema({
  echoId: {
    type: String,
    required: true, // Reference to the Echo document, stored as a string
  },
  tweetIds: {
    type: [String],
    default: [], // Initialize as an empty array
  },
  youtubeUrls: {
    type: [String],
    default: [], // Initialize as an empty array
  },
  instagramUrls: {
    type: [String],
    default: [], // Initialize as an empty array
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review", // Reference to the Review model
    },
  ],
});

const WallOfTrust =
  mongoose.models.WallOfTrust ||
  mongoose.model("WallOfTrust", WallOfTrustSchema);

export default WallOfTrust;
