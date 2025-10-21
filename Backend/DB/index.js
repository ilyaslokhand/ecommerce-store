import mongoose from "mongoose";
import {DB_NAME} from "../Constant.js";


const connectDB = async ()=>{
    try {
    const connectionistance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log( ` Database connected successfully to ${connectionistance.connection.host}`)
    } catch (error) {
    console.log("error in connecting to db", error);
    process.exit(1);
    }
    }

export  default connectDB;

