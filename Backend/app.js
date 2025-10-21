import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" });

const app = express();


const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({
  origin: allowedOrigin, // Specify karna ki kaunse origin se requests allow karni hain.
  credentials:true, // Browser ko allow karna ki wo cookies/tokens ko request ke saath bheje ya response me receive kare.
}))


app.use(express.json({limit:"100kb"})); // Body size limit set karna to prevent large payloads.
app.use(express.urlencoded({extended:true, limit:"100kb"})); // URL-encoded data ke liye body parser
app.use(express.static("public")) // Static files serve karna from "public" directory
app.use(cookieParser()); // Cookies ko parse karna


import Authroute from "./Routes/Auth.route.js"

app.use('/api/auth', Authroute);


export default app;