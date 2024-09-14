import { Candidate } from "../models/candidate.model.js";
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

export {addCandidate,updateCandidateProfile,deleteCandidate}