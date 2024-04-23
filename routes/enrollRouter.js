import { Router } from "express";
import {
  checkEnroll,
  createEnrollMent,
} from "../controllers/enrollController.js";
import { isLogin } from "../middleware/isLogin.js";

const enrollRouter = Router();

enrollRouter.post("/create", isLogin, createEnrollMent);

enrollRouter.get("/check-enroll", isLogin, checkEnroll);

export default enrollRouter;
