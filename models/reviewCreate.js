import mongoose, { Schema } from 'mongoose';

const reviewCreateSchema = new Schema(
  {
    echo: { 
      type: Schema.Types.ObjectId, 
      ref: 'Echo', 
      required: true 
    }, // Reference to the echo being reviewed
    stars: { 
      type: Number, 
      required: true 
    }, // Star rating for the echo
    note: { 
      type: String, 
      required: true 
    }, // Review note or comment
    username: { 
      type: String, 
      required: true 
    }, // Username of the reviewer
    useremail: { 
      type: String, 
      required: true 
    }, // Email of the reviewer
    userimageurl: { 
      type: String, 
      required: true 
    }, // Profile image URL of the reviewer
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model('Review', reviewCreateSchema);
export default Review;
