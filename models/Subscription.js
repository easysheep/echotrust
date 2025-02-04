// models/Subscription.js
import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    user: {
      type: String, // Clerk user ID stored as a string
      required: true,
      unique: true, // Each user can have only one subscription
    },
    plan: {
      type: String, // free, pro, premium
      enum: ["free", "pro", "premium"],
      required: true,
      default: "free",
    },
    echoLimit: {
      type: Number, // Maximum allowed echoes based on the plan
      required: true,
      default: 10, // Default for free plan
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date, // Optional, can be used for time-limited plans
    },
  },
  { timestamps: true }
);

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
