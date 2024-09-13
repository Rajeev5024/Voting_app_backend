import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { ApiResponse } from "../utils/apiResponseHandler.js";

const registerUser = asyncHandler(async (req,res)=>{

	const { aadharNumber,mobile,address,email,age,username,password } = req.body;

	if([username,aadharNumber,address,mobile,age,password].some((field)=>!field||field.trim()==="")){
		throw new ApiError(400,"all fields are required");
	}

	const existedUser=await User.findOne({aadharNumber})

	if(existedUser){
		throw new ApiError(409, "User with aadharNumber already existed")
	}

	const user = await User.create({
		username:username.toLowerCase(),
		aadharNumber,
		email,
		address,
		age,
		mobile,
		password,
	})

	const createdUser= await User.findById(user._id)?.select("-password -aadharNumber");

	if(!createdUser){
		throw new ApiError(500, "Something went wrong while regestrig the user");
	}

	return res.status(201).json(
		new ApiResponse(200, createdUser, "User registered successfully")
	)

})

export { registerUser }