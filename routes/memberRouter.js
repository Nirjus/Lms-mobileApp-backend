import { Router } from "express";
import { isLogin } from "../middleware/isLogin.js";
import {
  checkMember,
  createMemberShip,
  getMembershipDetails,
} from "../controllers/memberController.js";

const memberRouter = Router();

memberRouter.get("/check-member", isLogin, checkMember);

memberRouter.post("/create", isLogin, createMemberShip);

memberRouter.get("/get-member", isLogin, getMembershipDetails);

export default memberRouter;
