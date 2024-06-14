import { Router } from "express";
import { isLogin } from "../middleware/isLogin.js";
import {
  addAnswer,
  addQuestion,
  getAllQnaOfAChapter,
} from "../controllers/qnaController.js";

const qnaRouter = Router();

qnaRouter.post("/add-question", isLogin, addQuestion);

qnaRouter.put("/add-answer", isLogin, addAnswer);

qnaRouter.get("/getAllQna/:courseId", isLogin, getAllQnaOfAChapter);

export default qnaRouter;
