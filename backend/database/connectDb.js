import mongoose, { connect } from "mongoose";

const connectDb = async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/ecommerce`)
        console.log("MongoDB connection successfull")
    } catch (error) {
        console.log("MongoDB connection failed", error)
    }
}

export default connectDb