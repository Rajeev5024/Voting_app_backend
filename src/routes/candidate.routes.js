import {Router} from "express"
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { addCandidate, deleteCandidate, updateCandidateProfile, voteCandidate, voteCount } from "../controller/candidate.controller.js";

const router = Router();
router.route("/add-candidate").post(verifyAdmin,addCandidate);
router.route("/update/:candidateId").patch(verifyAdmin,updateCandidateProfile)
router.route("/delete/:candidateId").delete(verifyAdmin, deleteCandidate)
router.route("/vote/:candidateId").post(voteCandidate)
router.route("/result").get(voteCount)
export default router;