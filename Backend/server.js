import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser";
import cors from "cors";

import dotenv from "dotenv"
dotenv.config()

import connectDB from "./config/connectDB.js"
import userRouter from "./routes/user.route.js"
import expenseRouter from "./routes/expense.route.js"
import ledgerRouter from "./routes/ledger.route.js"

const app=express()
const port=process.env.PORT

connectDB()

app.use(cors({
    origin: "http://localhost:5175",
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());


//Routes
app.use("/api/users",userRouter)
app.use("/api/expense",expenseRouter)
app.use("/api/ledger",ledgerRouter)

app.listen(port,()=>{
    console.log("Listening on port:",port)
})