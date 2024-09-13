import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import multer from "multer"
const app=express();
const upload=multer();
app.use(cors({
	origin: process.env.CORS_ORIGIN,
	credentials:true,
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
// Use multer to parse form-data
app.use(upload.none());
app.use(cookieParser())

import userRouter from "./routes/user.routes.js"

app.use("/api/v1/users",userRouter)

export {app};