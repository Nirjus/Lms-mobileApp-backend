import { Router } from "express";
import { getUser, logout, userLogin, userRegister } from "../controllers/userController.js";
import { isLogin } from "../middleware/isLogin.js";

const userRouter = Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/logout", logout);

userRouter.get("/me", isLogin, getUser);


export default userRouter;