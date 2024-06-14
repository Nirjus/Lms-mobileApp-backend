import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import userRouter from "./routes/userRoutes.js";
import courseRouter from "./routes/coursRouter.js";
import categoryRoutes from "./routes/categoryRouter.js";
import enrollRouter from "./routes/enrollRouter.js";
import memberRouter from "./routes/memberRouter.js";
import { subscriptionRouter } from "./routes/subscriptionRouter.js";
import qnaRouter from "./routes/qnaRouter.js";

const app = express();

app.use(helmet());
app.use(mongoSanitize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(cors());

// API Routes
app.get("/", (req, res) => {
  res.status(200).send("API is running");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/qna", qnaRouter);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/enroll", enrollRouter);
app.use("/api/v1/member", memberRouter);
app.use("/api/v1/subscription", subscriptionRouter);

// server erro

app.use((error, req, res, next) => {
  return res.status(500).send({
    success: false,
    message: error.message,
  });
});

export default app;
