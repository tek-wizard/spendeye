import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/connectDB.js";
import userRouter from "./routes/user.route.js";
import expenseRouter from "./routes/expense.route.js";
import ledgerRouter from "./routes/ledger.route.js";
import authRouter from "./routes/auth.route.js"; 

const app = express();
const port = process.env.PORT || 5000; 

connectDB();

const allowedOrigins = [
    process.env.FRONTEND_URL_BASE, // deployed frontend URL, or localhost in dev
    "http://localhost:5173" // Always allow local dev
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or direct API calls)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


// Routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/ledger", ledgerRouter);

// Basic route for the root URL, useful for health checks or API info
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Spendy Backend API is running!",
        version: "1.0.0"
    });
});


app.listen(port, () => {
    console.log(`Backend server listening on port: ${port}`);
    console.log(`CORS allowed origin(s): ${allowedOrigins.join(', ')}`);
});