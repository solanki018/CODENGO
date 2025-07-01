import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: false, // Set to false to allow duplicate usernames
  },
  firstName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: {
    type: String,
    default: null,
  },
  forgotPasswordExpiry: {
    type: Date,
    default: null,
  },
  verifytoken: {
    type: String,
    default: null,
  },
  verifytokenExpiry: {
    type: Date,
    default: null,
  },
  profileImage: {
  type: String, // Base64 string or image URL
  default: null,
},

  password: {
    type: String,
    required: [false, 'Password is required'],  
  },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }] // Add this if not present yet
});

const User = mongoose.models.users || mongoose.model('users', userSchema);

export default User;
