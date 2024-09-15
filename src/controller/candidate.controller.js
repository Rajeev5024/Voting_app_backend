import { Candidate } from "../models/candidate.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { ApiResponse } from "../utils/apiResponseHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addCandidate =asyncHandler(async(req,res)=>{
	const {name, party, age }= req.body;
	const existedCandidate = await Candidate.findOne({party});
	if(existedCandidate){
		throw new ApiError(409, "One Candidate is alreday added with the given Party Name")
	}
	const candidate = await Candidate.create({
		name,
		party,
		age,
	})
	const createdCandidate= await Candidate.findById(candidate._id);
	if(!createdCandidate){
		throw new ApiError(500, "Something went wrong while Adding the candidate");
	}
	return res.status(201).json(
		new ApiResponse(200, createdCandidate, "Candidate registered successfully")
	)
})

const updateCandidateProfile = asyncHandler(async(req,res)=>{
	const {name, party, age }= req.body;
	if(!name||!party||!age){
		throw new ApiError(400, " All field are required");
	}
	const candidateId = req.params?.candidateId;
	if(!candidateId){
		throw new ApiError(400, " CandidateId is required to update his data");
	}

	const updatedCandidateData= await Candidate.findByIdAndUpdate(
		candidateId,
		{
			$set:{
				name,
				party,
				age,
			}
		},
		{
			new:true,
		}
	)

	if(!updatedCandidateData){
		throw new ApiError(500, "somthing went wront while updating candidate profile");
	}

	return res
	.status(200)
	.json(new ApiResponse(200, updatedCandidateData,"Candidate profile updated successfully"));

})

const deleteCandidate = asyncHandler(async(req,res)=>{
	const candidateId = req.params?.candidateId;
	if(!candidateId){
		throw new ApiError(400, " CandidateId is required");
	}
	const deletedCandidate= await Candidate.findByIdAndDelete(candidateId);
	if(!deletedCandidate){
		throw new ApiError(404, "Candidate not found");
	}
	return res.status(200).json(new ApiResponse(200,"Candidate deleted successfully"));
})

const voteCandidate = asyncHandler(async (req, res) => {
	const userId = req.user?._id;
	const candidateId = req.params?.candidateId;
	if (!candidateId) {
	  throw new ApiError(400, "Candidate ID is required");
	}
  
	const [user, candidate] = await Promise.all([
	  User.findById(userId),
	  Candidate.findById(candidateId)
	]);
  
	if (!user) {
	  throw new ApiError(404, "User not found");
	}
  
	if (user.role === "admin") {
	  throw new ApiError(403, "Admin not allowed to vote");
	}
  
	if (user.isVoted) {
	  throw new ApiError(400, "User has already voted");
	}
  
	if (!candidate) {
	  throw new ApiError(404, "Candidate not found");
	}
  
	candidate.voteCount++;
	candidate.votes.push({ user: userId });
	user.isVoted = true;
  
	await Promise.all([candidate.save(), user.save()]);
  
	return res.status(200).json(new ApiResponse(200, "Vote recorded successfully"));
  });
 /* 
const voteCandidate= asyncHandler(async(req,res)=>{
	
	1.candidateId is present in candidate or not
	2. check user is admin or not if not then check for 
	3. check voter has voted or not if not voted then only let him vote
	4. update the votes of the candidate that the user has voted 
	5.return res
	
	const userId =req.user?._id;
	const isUserExist = await User.findById(userId)
	if(!isUserExist){
		throw new ApiError(404,"User not found");
	}
	else{
		if(isUserExist.role==="admin"){
			throw new ApiError(403,"Admin not allowed to vote");
		}
		else if(isUserExist.isVoted){
			throw new ApiError(400, "User is already voted");
		}
	}
	const candidateId= req.params?.candidateId;
	const candidate = await Candidate.findById(candidateId);
	if(!candidate){
		throw new ApiError(400,"Candidate is not found");
	}

	candidate.voteCount++;
	candidate.votes.push({user:userId});
	isUserExist.vote=true;
	await candidate.save();
	await isUserExist.save();

	return res.status(200).json(new ApiResponse(200, "Vote recorded successfully"));
})
*/

const voteCount = asyncHandler(async(req,res)=>{
	const candidates = await Candidate.find().sort({voteCount:"desc"});
	if(candidates.length===0){
		throw new ApiError(400, "Theres no candidate has taken part in election");
	}
	const electionResult = candidates.map((data)=>{
		return {
			name:data.name,
			party:data.party,
			total_votes:data.voteCount
		}
	})
	return res.status(200).json(new ApiResponse(200,electionResult, "ElectonResult fetched successfully"));
})

export {addCandidate,updateCandidateProfile,deleteCandidate,voteCandidate, voteCount}