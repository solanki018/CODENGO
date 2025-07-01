// ✅ FILE: app/models/userModel.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: false,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: false,
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
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: '',
  },
  about: {
    type: String,
    default: '',
  },
  techStack: {
    type: String,
    default: '',
  },
  rooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;