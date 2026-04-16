import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    profilePic:{
        type: String,
        default: "",
    },
    profilePicPublicId: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    token: {
        type: String,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isLoggedIn: {
        type: Boolean,
        default: false,
    },
    otp: {
        type:String,
        default: null,
    },
    otpExpiry: {
        type: Date,
        default: null,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    zipCode: {
        type: String,
    },
    phoneNo: {
        type: String,
        validate: {
            validator: function (value) {
                if (!value) return true; // allow empty

                const phone = parsePhoneNumberFromString(value, "IN"); // default India
                return phone && phone.isValid();
            },
            message: "Invalid phone number",
        },
    },

}, {timestamps: true})

export const User = mongoose.model("User", userSchema)