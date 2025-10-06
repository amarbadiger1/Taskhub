import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        unique: true,
    },
    email: {
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        lowercase: true
    },
    password: {
        type: String, 
        required: true,
        select: false
    },
    profilePicture: {
        type: String,
        default: ""
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    lastlogin: {
        type: Date,
        default: null
    },
    is2FAEnabled: {
        type: Boolean,
        default: false
    },
    twoFAotp: {
        type: String,
        select: false
    },
    twoFAotpExpiry: {
        type: Date,
        select: false
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
