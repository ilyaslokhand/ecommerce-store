import User from "../Models/user.model.js";
import apiError from "../Utils/apiError.js";
import asyncHandler from "../Utils/asyncHandler.js";
import jwt from "jsonwebtoken";


const protectedRoute = asyncHandler( async (req,res,next)=>{
    
  const accessToken = req.cookies?.accessToken || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if(!accessToken){
        throw new apiError(401, "Access denied. No token provided.");
    };

    let decodedToken;
    try {
      decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const existedUser = await User.findById(decodedToken.id).select("-password");
      if(!existedUser){
        throw new apiError(401, "User no longer exists.");
      }
      req.user = existedUser;
      next();
    } catch (error) {
        throw new apiError(401, "Invalid or expired token")
    }

})

export default protectedRoute;


export const adminRoute = asyncHandler(async(req,res,next)=>{
    const existedUser = req.user;

    if(!existedUser){
        throw new apiError(401, "User no longer exists.");
    }

    if(existedUser.role == 'admin'){
       return next();
    }
    throw new apiError(403, "Access denied. Admins only.");
})