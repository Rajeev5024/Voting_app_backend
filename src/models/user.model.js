
import mongoose, {Schema} from "mongoose";
import { type } from "os";

const userSchema = new Schema({
	name:{
		type:String,
		required:true,
	},
	age:{
		type:Number,
		required:true,
	},
	email:{
		type:String,
	},
	mobile:{
		type:Number,
		required:true,
	},
	address:{
		type:String,
		required:true,
	},
	aadharNumber:{
		type:Number,
		required:true,
		unique:true,
	},
	password:{
		type:String,
		required:true,
	},
	role:{
		type:String,
		enum:["voter", "admin"],
		default:"voter",
	},
	isVoted:{
		type:Boolean,
		default:false,
	}
},{timestamps:true})

export const User = mongoose.model("User", userSchema)