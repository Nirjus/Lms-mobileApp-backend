import { Router } from "express";
import {
  getUser,
  getUsersByPoint,
  logout,
  updatePassword,
  userLogin,
  userRegister,
  userUpdate,
} from "../controllers/userController.js";
import { isLogin } from "../middleware/isLogin.js";
import { singleUpload } from "../middleware/multer.js";

const userRouter = Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/logout", logout);

userRouter.get("/me", isLogin, getUser);
userRouter.put("/update", isLogin, singleUpload, userUpdate);
userRouter.put("/update-password", isLogin, updatePassword);

userRouter.get("/getUsers/bypoint", isLogin, getUsersByPoint);

export default userRouter;
