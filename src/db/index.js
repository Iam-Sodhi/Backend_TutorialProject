import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
//Remember to always use async and await when tackling with database. Good Practice
const connectDB=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error('Error connecting MongoDB database: ',error);
        process.exit(1);
    }
}
export default connectDB;