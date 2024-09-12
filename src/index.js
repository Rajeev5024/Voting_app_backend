import dotenv from "dotenv"
import connectDB from "./db/index.db.js";
import { app } from "./app.js";
import { error } from "console";

dotenv.config({
	path:'./env'
})

connectDB()
.then(()=>{
	app.listen(process.env.PORT || 8000, ()=>{
		console.log(`Server is runnugn at PORT: ${process.env.PORT}`)
	})
	app.on("error",(error)=>{
		console.log("ERR while listening on port :", error);
		throw error;
	})
})
.catch((err)=>{
	console.log("mongoDB connection failed: ",err);
})