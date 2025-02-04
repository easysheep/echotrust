import mongoose, { Schema } from "mongoose";

const echoCreateSchema = new Schema(
  {
    echo_name: {
      type: String,
      required: true,
    },
    echo_title: {
      type: String,
      required: true,
    },
    echo_details: {
      type: String,
      required: true,
    },
    echo_message: {
      type: String,
      required: true,
    },
    sender_name: {
      type: String,
      required: true,
    },
    attachment: {
      type: String, // Can be a file path or URL
    },
    echo_logo: {
      type: String, // URL or base64-encoded string
      required: true,
    },
    user: {
      type: String, // Clerk user ID stored as a string
      required: true,
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const Echo = mongoose.models.Echo || mongoose.model("Echo", echoCreateSchema);
export default Echo;
