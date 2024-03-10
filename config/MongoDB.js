import mongoose from "mongoose";
import colors from "colors";
import { mongoUri } from "../secret/secret.js";

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri).then(() => {
            console.log(`Database is connected ${mongoose.connection.host}`.bgGreen.bold)
        }).catch((error) => {
            console.log(error)
        })        
    } catch (error) {
        console.log(`MongoDB connection error ${error}`.bgRed.white)
    }
}

export default connectDB