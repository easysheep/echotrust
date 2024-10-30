import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});

// Check if the Image model already exists before compiling it
const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);

export default Image;
