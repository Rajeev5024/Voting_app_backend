import {Router} from "express"
import { changeCurrentPassword, getProfile, loginUser, registerUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/profile").get(verifyJWT,getProfile)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
export default router;