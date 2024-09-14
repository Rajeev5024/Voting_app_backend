import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req,res,next)=>{
	const token = req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","");
	try {
		if(!token){
			throw new ApiError(401, "Unauthorized request")
		}
		const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
	
		const user =await User.findById(decodedToken._id).select("-password");
		if(!user){
			throw new ApiError(401, "Unauthorized request")
		}
	
		req.user=user;
		next();
	} catch (error) {
		throw new ApiError(401, error?.message || "Invalid access Token")
	}
}) 

export const verifyAdmin = asyncHandler(async(req,res,next)=>{
	const userId= req.user?._id;
	try {
		const isAdmin = await User.findById(userId);
		if(isAdmin.role==='admin'){
			next();
		}
		else{
			throw new ApiError(404,"User has not admin role");
		}
	} catch (error) {
		throw new ApiError(404, error?.message || "Error while verifying admin");
	}
})