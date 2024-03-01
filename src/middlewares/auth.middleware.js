import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
export const verifyJWT = asyncHandler(async (req, res, next) => {
 try {
     const token =
       req.cookies?.accessToken ||
       req.header("Authorization")?.replace("Bearer ", "");
   
     if (!token) {
       throw new ApiError(401, "Unauthorized request");
     }
   
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
   
     const user = await User.findById(decodedToken?._id).select(
       "-password -refreshToken"
     ); // we have given _id in jwt.sign() in user moder
   
     if(!user){
       throw new ApiError(401,"Invalid Access Token");
     }
   
     req.user=user;
     next(); //we write to so that router doesn't get confused to which method to run first //se in the user.routes that verifyJWT , logoutUser is written alongside . this tells to run verifyJWT first
 } catch (error) {
    throw new ApiError(401,error?.message ||"Invalid access Token");
 }
});
