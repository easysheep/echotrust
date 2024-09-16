import mongoose from "mongoose";

const EchoEmbedsSchema = new mongoose.Schema({
  echoId: { type: String, required: true }, // Reference to echo
  tweetIds: [String], // Array of tweet IDs
  youtubeUrls: [String], // Array of YouTube embed URLs
  instagramUrls: [String], // Array of Instagram embed URLs
});

const EchoEmbeds = mongoose.models.EchoEmbeds || mongoose.model("EchoEmbeds", EchoEmbedsSchema);
export default EchoEmbeds;