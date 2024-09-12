import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
	name:{
		type:String,
		required:true,
		lowercase:true,
		trim:true,
	},
	age:{
		type:Number,
		required:true,
	},
	email:{
		type:String,
		trim:true,
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

userSchema.pre("save", async function (next) {
	if(!this.isModified)return next();
	this.password=bcrypt.hash(this.password,10)
	next();
})
userSchema.methods.isPasswordCorrect= async function (password) {
	return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken=function(){
	jwt.sign(
		{
		_id:this._id,
		name:this.name,
		mobile:this.mobile,
		aadharNumber:this.aadharNumber
	},
	process.env.ACCESS_TOKEN_SECRET,
	{
		expiresIn:process.env.ACCESS_TOKEN_EXPIRY
	}
)
}

export const User = mongoose.model("User", userSchema)