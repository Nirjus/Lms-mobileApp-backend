import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(morgan("dev"))


app.use(cors())
// API Routes  
app.get("/",(req, res) => {
    res.status(200).send("API is running")
})

app.use("/api/v1/user", userRouter);



// client error
app.use((req, res, next) => {
    next(new Error("Route not found"))
})

// server error

const errorResponse = (res, {statusCode = 500, message = "Internal server error"}) => {
    return res.status(statusCode).json({
       success: false,
       message: message,
    });
}

app.use((error, req, res, next) => {
    return errorResponse(res, {
        statusCode:error.status,
       message:error.message,
    })
})

export default app