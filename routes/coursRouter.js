import { Router } from "express";
import { isLogin } from "../middleware/isLogin.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { singleUpload } from "../middleware/multer.js";
import {
  addChapter,
  createAnswer,
  createCourse,
  createQuestion,
  createReview,
  editChapter,
  editCourse,
  getAllCourse,
  getCourse,
  getFreeCourses,
  getTopCourses,
} from "../controllers/courseController.js";

const courseRouter = Router();

// ========================= Admin Routes ======================
courseRouter.post("/create", isLogin, isAdmin, singleUpload, createCourse);

courseRouter.put(
  "/add-chapter/:id",
  isLogin,
  isAdmin,
  singleUpload,
  addChapter
);

courseRouter.put(
  "/edit-course/:id",
  isLogin,
  isAdmin,
  singleUpload,
  editCourse
);

courseRouter.put(
  "/edit-chapter/:id",
  isLogin,
  isAdmin,
  singleUpload,
  editChapter
);
// ========================= User Routes =====================
courseRouter.put("/add-review/:id", isLogin, createReview);

courseRouter.get("/getCourse/:id", getCourse);

courseRouter.put("/add-question/:id", isLogin, createQuestion);

courseRouter.put("/add-answer/:id", isLogin, createAnswer);

courseRouter.get("/getAll-courses", getAllCourse);

courseRouter.get("/getTop-courses", getTopCourses);

courseRouter.get("/get-Free-courses", getFreeCourses);

export default courseRouter;
