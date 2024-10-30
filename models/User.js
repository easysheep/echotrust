// models/User.js
import mongoose,{Schema} from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  image: {
    type: String, // URL or base64-encoded string
    required: true,
  },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
