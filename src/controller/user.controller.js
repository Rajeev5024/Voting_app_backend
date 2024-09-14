import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { ApiResponse } from "../utils/apiResponseHandler.js";

const generateAccessToken=async(userId)=>{
	try {
		const user=await User.findById(userId);
		if (!user) {
			throw new ApiError(404, "User not found"); // Handle case where user isn't found
		  }
		const accessToken = user.generateAccessToken();
		return {accessToken};
	} catch (error) {
		throw new ApiError(500,"Something went wrong whlile generating access and refresh token");
	}
}

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

const loginUser =asyncHandler(async(req,res,next)=>{
	/*
	1.ask data from the frontend
	2.verify if the enterd data is correct or not (username or email )
	3.generate tokens(access and refresh) for the user if the data enetred is correct
	4.return res(success)//send cookie
	{
	1.req body ->data
	2.username or email
	2.find the user 
	2password check
	3access and refresh token
	4send cookie}
	*/

	const {aadharNumber,password}=req.body;
	if(!password||!aadharNumber){
		throw new ApiError(400,"enter required details");
	}
	const user = await User.findOne({aadharNumber})
	if(!user){
		throw new ApiError(404,"User not found!!")
	}
	const isValidPassword =await user.isPasswordCorrect(password);

	if(!isValidPassword){
		throw new ApiError(401, "Invalid user credentials");
	}
	
	const {accessToken} =await generateAccessToken(user._id);

	const loggedinUser = await User.findById(user._id).select("-password -aadharNumber");

	const options={
		httpOnly:true,
		secure:true,
	}

	return res
	.status(200)
	.cookie("accessToken",accessToken,options)
	.json(
		new ApiResponse(
			200,
			{
				user:loggedinUser,accessToken,
			},
			"User loggedin successfully"
		)
	)

})

const getProfile =asyncHandler(async(req,res)=>{
		const user= req.user;
		const userData =await User.findById(user._id).select("-password");

		return res
		.status(200)
		.json(
			new ApiResponse(200,userData, "current user fetched successfully")
		)
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
	const {oldPassword, newPassword} =req.body;
	const user = await User.findById(req.user?._id);
	const isPasswordCorrect= await user.isPasswordCorrect(oldPassword);
	if(!isPasswordCorrect){
		throw new ApiError(400, "Invalid old password");
	}
	user.password=newPassword;
	await user.save({validateBeforeSave:false});

	return res
	.status(200)
	.json(
		new ApiResponse(200,{}, "Password changed successfully")
	)
})

const logoutUser = asyncHandler(async(req,res)=>{
	
	const options={
		httpOnly:true,
		secure:true,
	}

	return res
	.status(200)
	.clearCookie("accessToken",options)
	.json(new ApiResponse(200,{},"Logged Out Successfully"))
})


export { registerUser, loginUser, getProfile, changeCurrentPassword, logoutUser}