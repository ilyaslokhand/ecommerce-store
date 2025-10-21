import User from "../Models/user.model.js";
import asyncHandler from "../Utils/asyncHandler.js"
import apiError from "../Utils/apiError.js";
import apiResponse from "../Utils/apiResponse.js";
import {redis} from "../lib/redis.js";
import jwt from "jsonwebtoken";


const isProd = process.env.NODE_ENV === "production";

const accessCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "None" : "Lax",
  path: "/",
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "None" : "Lax",
  path: "/",
  maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
};


const generateAccessTokenAndRefreshToken = async (userId)=>{
  try {
    const existingUser = await User.findById(userId);
    const accessToken  = existingUser.generateAccessToken(userId);
    const refreshToken = existingUser.generateRefreshToken(userId);
    return {accessToken,refreshToken};
  
  } catch (error) {
    throw new apiError(500, "Something went wrong while generating tokens");
  }
}


const storeRefreshToken = async (userId, refreshToken) => {
  try {
    const ttlSeconds = 10 * 24 * 60 * 60; // 10 days
    await redis.set(`refreshToken:${userId}`, refreshToken, "EX", ttlSeconds);
  } catch (error) {
    console.error("storeRefreshToken error:", error);
    throw new apiError(500, "Something went wrong while storing refresh token");
  }
};


const registerUser = asyncHandler( async (req,res)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        throw new apiError(400, "all fields are required")
    };

    if(password.length<6){
        throw new apiError (400, "password must be atlest 6 characters long")
    };

   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if(!emailRegex.test(email)){
    throw new apiError(400, "Invalid email format");
   };

    const existingUser  = await User.findOne({email});

    if(existingUser){
        throw new apiError(409, "User with this email already exists");
    };
    const user = await User.create({
    name,
    email,
    password,
  });

  const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id);
  await storeRefreshToken(user._id, refreshToken);

  const createdUser = await User.findById(user._id).select('-password');

  res.status(200)
  .cookie("accessToken", accessToken, accessCookieOptions)
  .cookie("refreshToken", refreshToken, refreshCookieOptions)
  .json(new apiResponse(createdUser, 201, "User registered successfully"));
});

const logoutUser = asyncHandler(async(req,res)=>{
const refreshToken = req.cookies.refreshToken;
res.clearCookie("accessToken", accessCookieOptions);
res.clearCookie("refreshToken", refreshCookieOptions);


if(!refreshToken){
  return res.status(200).json(new apiResponse("", 200, "User logged out successfully"));
}

try {
  const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  await redis.del(`refreshToken:${decodedToken.id}`);
} catch (error) {
  console.error("Error during logout:", error);
}

return res.status(200).json(new apiResponse("", 200, "User logged out successfully"));

});

const loginUser = asyncHandler(async(req,res)=>{

const {email,password}= req.body;

if(!email || !password){
  throw new apiError(400, "Email and password are required");
}

const existedUser = await User.findOne({email});

if(!existedUser){
  throw new apiError(401, "invalid email or password")
};

const isPasswordMatched = await existedUser.comparePassword(password);

if(!isPasswordMatched){
throw new apiError(401, "invalid email or password")
};

const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(existedUser._id);
await storeRefreshToken(existedUser._id, refreshToken);

const loggedInUser = await User.findById(existedUser._id).select("-password -refreshToken");

  res.status(200)
  .cookie("accessToken", accessToken, accessCookieOptions)
  .cookie("refreshToken", refreshToken, refreshCookieOptions)
  .json(new apiResponse( loggedInUser,200, "User loggedin successfully"));
});

const refreshToken = asyncHandler(async(req,res)=>{

  const incomingRefreshToken = req.cookies.refreshToken;
  console.log("Incoming Refresh Token:", incomingRefreshToken);
  if(!incomingRefreshToken){
    return res.status(401).json(new apiResponse("", 401, "Refresh token not found"));
  };


  let decodedToken;
  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    return res
      .status(403)
      .json(new apiResponse("", 403, "Invalid or expired refresh token"));
  }

 const storedRefreshToken = await redis.get(`refreshToken:${decodedToken.id}`);

 if (!storedRefreshToken || storedRefreshToken !== incomingRefreshToken) {
    return res
      .status(403)
      .json(new apiResponse("", 403, "Invalid refresh token"));
  }

  const accessToken = jwt.sign(
    {id: decodedToken.id},
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
  );

   res.status(200)
  .cookie("accessToken", accessToken, accessCookieOptions)
  .json(new apiResponse("", 201, "Access token refreshed successfully"));
  
});




export {registerUser,logoutUser,loginUser,refreshToken};