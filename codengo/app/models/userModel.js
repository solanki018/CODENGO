import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    unique: true
  },
  firstName: { 
    type: String, 
    required: [false]
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true
  },
  isVerified: {
    type: Boolean, 
    default: false
  },
  forgotPasswordToken: {
    type: String, 
    default: null
  },
  forgotPasswordExpiry: {
    type: Date, 
    default: null
  },
    verifytoken: {
    type: String, 
    default: null
  },
    verifytokenExpiry: {
        type: Date, 
        default: null
    },
  password: { 
    type: String, 
    required: [true, 'Password is required']
  }
  
});

const User = mongoose.models.users || mongoose.model('users', userSchema);

export default User;