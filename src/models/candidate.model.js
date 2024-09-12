import mongoose, {Schema} from "mongoose";

const candidateSchema = new Schema({
	name:{
		type:String,
		required:true,
		lowercase:true,
		trim:true,
	}, 
	party:{
		type:String,
		required:true,
		unique:true,
	},
	age:{
		type:Number,
		required:true,
	},
	votes:[
		{
			user:{
				type:Schema.Types.ObjectId,
				ref:"User",
				required:true,
			},
			votedAt:{
				type:Date,
				default:Date.now(),
			}
		}
	],
	voteCount:{
		type:Number,
		default:0,
	}
},{timestamps:true})

export const Candidate = mongoose.model("Candidate", candidateSchema)