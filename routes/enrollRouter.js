import { Router } from "express";
import {
  chapterCompleteController,
  checkChapterCompleted,
  checkCourseComplete,
  checkEnroll,
  createEnrollMent,
  getEnrollCourses,
} from "../controllers/enrollController.js";
import { isLogin } from "../middleware/isLogin.js";

const enrollRouter = Router();

enrollRouter.post("/create", isLogin, createEnrollMent);

enrollRouter.get("/check-enroll", isLogin, checkEnroll);

enrollRouter.put("/chapter-complete", isLogin, chapterCompleteController);

enrollRouter.get("/check-complete", isLogin, checkChapterCompleted);

enrollRouter.get("/getAll-enroll-course", isLogin, getEnrollCourses);

enrollRouter.get("/check-courseComplete", isLogin, checkCourseComplete);

export default enrollRouter;
